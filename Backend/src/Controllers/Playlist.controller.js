import asyncHandler from '../Utils/asyncHandler.js';
import CustomError from '../Utils/CustomError.js';
import Playlist from '../Models/playlist.model.js';
import User from '../Models/user.model.js'
import Video from '../Models/videos.model.js';
import Channel from '../Models/channel.model.js';
import UploadOnCloudinary from '../Utils/Cloudinary.js'


const createPlaylist = asyncHandler( async(req, res, next) => {

    const currentUserId = req.user._id;

    if(!currentUserId){
        return next( new CustomError("User Id cannot be empty.", 400));
    }

    const userExist = await User.exists({_id: currentUserId});

    if(!userExist){
        return next( new CustomError("User does not exist", 400));
    }

    const user = await User.findById(currentUserId).populate("channel");

    const playlistData = {
        ...req.body,
        channel: user.channel._id,
        owner: user._id,
        savedBy: [user.channel._id]
    };

    const playlist = await Playlist.create(playlistData);

    await Promise.all([
        User.findByIdAndUpdate(currentUserId, {$addToSet: {playlists: playlist._id}}),
        Channel.findByIdAndUpdate(user.channel._id, {$addToSet: {playlist: playlist._id}}, {new: true})
    ]);

    await playlist.populate("channel");

    res.status(200).json({
        status:"Success",
        message: "Playlist created Successfully",
        playlist
    });
});

const loadPlaylists = asyncHandler( async(req, res, next) => {

    const currentUserId = req.user._id;

    if(!currentUserId){
        return next( new CustomError("User Id cannot be empty.", 400));
    }

    const userExist = await User.exists({_id: currentUserId});

    if(!userExist){
        return next( new CustomError("User does not exist", 400));
    }

    const user = await User.findById(currentUserId).populate("channel");

    const playlists = await Playlist.find({channel: user.channel._id}).populate("videos").populate("channel");

    if(playlists.length === 0){
        return res.status(200).json({
            status: "Not Found",
            message: "No playlist found"
        })
    }

    res.status(200).json({
        status: "Success",
        playlists
    });
});

const addVideoToPlaylist = asyncHandler( async(req, res, next) => {

    const videoId = req.params.videoId;
    const playlistId = req.params.playlistId;

    if(!videoId){
        return next( new CustomError("Video Id cannot be empty.", 400));
    }

    if(!playlistId){
        return next( new CustomError("Playlist Id cannot be empty.", 400));
    }

    const [videoExist, playlistExist] = await Promise.all([
        Video.exists({_id: videoId}),
        Playlist.exists({_id: playlistId})
    ])

    if(!videoExist){
        return next( new CustomError("Video does not exist", 400));
    }

    if(!playlistExist){
        return next( new CustomError("Playlist does not exist", 400));
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistId, { $addToSet: {videos: videoId}}, {new: true});

    res.status(200).json({
        status: "Success",
        message: "Video successfully added to playlist",
        updatedPlaylist
    })

});

const loadVideosInPlaylist = asyncHandler( async(req, res, next) => {

    const playlistId = req.params.playlistId;
    const currentUserId = req.user._id

    if(!playlistId){
        return next( new CustomError("Playlist Id cannot be empty.", 400));
    }

    if(!currentUserId){
        return next( new CustomError("User Id cannot be empty.", 400));
    }

    const [playlistExist, userExist] = await Promise.all([
        Playlist.exists({_id: playlistId}),
        User.exists({_id: currentUserId})
    ])

    if(!playlistExist){
        return next( new CustomError("Playlist not exists", 400));
    }

    if(!userExist){
        return next( new CustomError("User not exists", 400));
    }

    const user = await User.findById(currentUserId)

    const playlist = await Playlist.findById(playlistId).populate({
        path: "videos",
        populate:{
            path: "channel",
            model: "Channel"
        }
    });

    const isSaved = user.playlists.includes(playlist._id);

    res.status(200).json({
        status: "Success",
        playlist,
        isSaved
    });
    
});

const saveAPlaylist = asyncHandler(async (req, res, next) => {
    const currentUserId = req.user._id;
    const playlistId = req.params.playlistId;

    if (!currentUserId) {
        return next(new CustomError("User ID cannot be empty.", 400));
    }

    if (!playlistId) {
        return next(new CustomError("Playlist ID cannot be empty.", 400));
    }

    const [userExist, playlistExist] = await Promise.all([
        User.exists({ _id: currentUserId }),
        Playlist.exists({ _id: playlistId })
    ]);

    if (!userExist) {
        return next(new CustomError("User does not exist", 400));
    }

    if (!playlistExist) {
        return next(new CustomError("Playlist does not exist", 400));
    }

    const user = await User.findById(currentUserId);
    const channel = await Channel.findById(user.channel);
    const playlist = await Playlist.findById(playlistId);

    let isSaved;

    const alreadySavedByUser = user.playlists.includes(playlistId);
    const alreadySavedByChannel = channel.playlist.includes(playlistId);
    const isOwnPlaylist = playlist.channel.equals(channel._id);

    if (alreadySavedByUser && alreadySavedByChannel) {
        if (isOwnPlaylist) {
            return next(new CustomError("You cannot remove your own playlist.", 403));
        } else {
            user.playlists.pull(playlistId);
            channel.playlist.pull(playlistId);
            playlist.savedBy.pull(channel._id);
            isSaved = false;
        }
    } else {
        user.playlists.addToSet(playlistId);
        channel.playlist.addToSet(playlistId);
        playlist.savedBy.addToSet(channel._id); 
        isSaved = true;
    }

    await Promise.all([
        user.save(),
        channel.save(),
        playlist.save()
    ]);

    res.status(200).json({
        status: "Success",
        message: isSaved ? "Playlist saved successfully." : "Playlist removed from saved.",
        isSaved
    });
});

const deletePlaylist = asyncHandler(async (req, res, next) => {

    const currentUserId = req.user._id;
    const playlistId = req.params.playlistId;

    if (!currentUserId) {
        return next(new CustomError("User ID cannot be empty.", 400));
    }

    if (!playlistId) {
        return next(new CustomError("Playlist ID cannot be empty.", 400));
    }

    const [user, playlist] = await Promise.all([
        User.findById(currentUserId),
        Playlist.findById(playlistId)
    ]);

    if (!user) {
        return next(new CustomError("User not found.", 404));
    }

    if (!playlist) {
        return next(new CustomError("Playlist not found.", 404));
    }

    const channel = await Channel.findById(user.channel);

    if (!playlist.channel.equals(channel._id)) {
        return next(new CustomError("You are not authorized to delete this playlist.", 403));
    }

    user.playlists.pull(playlistId);
    channel.playlist.pull(playlistId);

    await Promise.all([user.save(), channel.save()]);

    if (playlist.savedBy.length > 0) {
        const savedChannelIds = playlist.savedBy;

        await Channel.updateMany(
            { _id: { $in: savedChannelIds } },
            { $pull: { playlist: playlistId } }
        );

        await User.updateMany(
            { playlists: playlistId },
            { $pull: { playlists: playlistId } }
        );
    }

    await Playlist.findByIdAndDelete(playlistId);

    res.status(200).json({
        status: "Success",
        message: "Playlist deleted successfully from all saved users and channels."
    });
});

const uploadVideoInPlaylist = asyncHandler( async(req, res, next) => {

    const playlistId = req.params.playlistId;

    if(!playlistId){
        return next( new CustomError("Playlist Id cannot be empty.", 400));
    }

    const playlistExist = await Playlist.exists({_id: playlistId});

    if(!playlistExist){
        return next( new CustomError("Playlist not found", 400));
    }

    // Collecting data from uploader and checking if theyare empty
    const {title, description, privacy} = req.body

    const fields = {title, description, privacy};

    const emptyFields = Object.keys(fields).find(key => fields[key]?.trim() === '');

    if(emptyFields){
        return next(new CustomError(`Please enter a ${emptyFields}. It cannot be empty`, 400));
    }
    

    // Uploading thumbnail and Video to cloudinary
    const videoLocalPath = req.files?.videoUrl[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnailUrl[0]?.path;

    if(!videoLocalPath){
        return next(new CustomError("You must select a Video", 400));
    }

    if(!thumbnailLocalPath){
        return next(new CustomError("You must select a Thumbnail", 400));
    }

    const videoPath = await UploadOnCloudinary(videoLocalPath);
    const thumbnailPath = await UploadOnCloudinary(thumbnailLocalPath);

    if (!videoPath?.url || !thumbnailPath?.url) {
        return next(new CustomError("Error uploading files to Cloudinary", 500));
    }

    // Creating a new video in the database
    req.body.videoUrl = videoPath.url;
    req.body.thumbnailUrl = thumbnailPath.url;
    req.body.duration = videoPath.duration;
    req.body.channel = req.user.channel._id;
    req.body.thumbnailPublicKey = thumbnailPath.public_id;
    req.body.videoPublicKey = videoPath.public_id;

    console.log("REQ BODY :- ", req.body);
    
    const video = await Video.create(req.body);

    if(!video){
        return next(new CustomError("There was an error uploading video. Please try again."))
    }

    await Channel.findByIdAndUpdate(video.channel._id, {
        $push: {videos: video._id}
    });

    await Playlist.findByIdAndUpdate(playlistId, {
        $addToSet: {videos: video._id}
    });

    res.status(200).json({
        status: "Success",
        video
    });
});

const saveVideoToNewPlaylist = asyncHandler( async(req, res, next) => {

    const videoId = req.params.videoId;
    const currentUserId = req.user._id;

    if(!videoId){
        return next( new CustomError("Video Id cannot be empty.", 400));
    }

    if(!currentUserId){
        return next( new CustomError("User Id cannot be empty.", 400));
    }

    const [userExist, videoExist] = await Promise.all([
        User.exists({_id: currentUserId}), 
        Video.exists({_id: videoId})
    ]);

    if(!videoExist){
        return next( new CustomError("Video does not exist", 400));
    }

    if(!userExist){
        return next( new CustomError("User does not exist", 400));
    }

    const user = await User.findById(currentUserId).populate("channel");

    const playlistData = {
        ...req.body,
        channel: user.channel._id,
        owner: user._id,
        savedBy: [user.channel._id],
        videos: [videoId]
    };

    const playlist = await Playlist.create(playlistData);

    await Promise.all([
        User.findByIdAndUpdate(currentUserId, {$addToSet: {playlists: playlist._id}}),
        Channel.findByIdAndUpdate(user.channel._id, {$addToSet: {playlist: playlist._id}}, {new: true})
    ]);

    res.status(200).json({
        status:"Success",
        message: "Playlist created Successfully",
        playlist
    });
});

const removeVideoFromPlaylist = asyncHandler( async(req, res, next) => {

    const videoId = req.params.videoId;
    const playlistId = req.params.playlistId;
    const currentUserId = req.user._id;

    if(!videoId){
        return next( new CustomError("Video Id cannot be empty.", 400));
    }

    if(!playlistId){
        return next( new CustomError("Playlist Id cannot be empty.", 400));
    }

    if(!currentUserId){
        return next( new CustomError("User Id cannot be empty.", 400));
    }

    const [videoExist, playlistExist, userExist] = await Promise.all([
        Video.exists({_id: videoId}),
        Playlist.exists({_id: playlistId}),
        User.exists({_id: currentUserId})
    ])

    if(!videoExist){
        return next( new CustomError("Video does not exist", 400));
    }

    if(!playlistExist){
        return next( new CustomError("Playlist does not exist", 400));
    }

    if(!userExist){
        return next( new CustomError("User does not exist", 400));
    }

    const playlist = await Playlist.findById(playlistId);

    const isAuthorized = playlist.owner.equals(currentUserId);

    if(!isAuthorized){
        return next( new CustomError("You are not authorized to remove the Video"));
    }

    if(!playlist.videos.includes(videoId)){
        res.status(404).json({
            status: "Not Found",
            message: "Video not found in Playlist."
        })
    }else{
        playlist.videos.pull(videoId);
        await playlist.save();

        const updatedPlaylist = await Playlist.findById(playlist._id).populate("videos").populate("channel");

        res.status(200).json({
            status: "Success",
            message: "Successfully removed video from Playlist",
            updatedPlaylist
        })
    }

})

export { createPlaylist, loadPlaylists, addVideoToPlaylist, loadVideosInPlaylist, saveAPlaylist, deletePlaylist, uploadVideoInPlaylist, saveVideoToNewPlaylist, removeVideoFromPlaylist }