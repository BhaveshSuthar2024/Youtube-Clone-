import Video from '../Models/videos.model.js';
import CustomError from '../Utils/CustomError.js';
import asyncHandler from '../Utils/asyncHandler.js';
import UploadOnCloudinary from '../Utils/Cloudinary.js'
import { v2 as cloudinary } from 'cloudinary';
import Channel from '../Models/channel.model.js';
import User from '../Models/user.model.js'


const uploadVideos = asyncHandler(async(req, res, next) => {

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

    console.log("VideoPath :-", videoPath.url);
    console.log("ThumbnailPath :-", thumbnailPath.url);

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

    res.status(200).json({
        status: "Success",
        video
    });

});

const getAllVideoes = asyncHandler(async(req, res, next) => {
    const videos = await Video.find({isBanned: {$ne: true}, privacy: {$eq: 'public'}}).sort({createdAt: -1}).populate("channel");

    if(!videos){
        return next(new CustomError("Unable to load Videos", 400));
    }

    res.status(200).json({
        status: "Success",
        videos
    })

});

const getVideoById = asyncHandler(async (req, res, next) => {

    const videoID = req.params.id;
    const userId = req.user._id;

    if(!videoID){
        return next(new CustomError("Video ID cannot be empty", 400));
    }

    if(!userId){
        return next(new CustomError("User ID cannot be empty", 400));
    }

    const video = await Video.findById(videoID).populate("channel");
    const user = await User.findById(userId);

    if(!video){
        return next(new CustomError("No Video found at this route", 404));
    }

    if(!user){
        return next(new CustomError("No User found at this route", 404));
    }

    const isVideoSaved = user.savedVideos.includes(video._id);

    if(video.isBanned){
        return next(new CustomError("The Video has been banned for voileting platform guidelines", 404));
    }

    const isVideoLiked = video.likedBy.includes(req.user._id);
    const isVideoDisliked = video.disLikedBy.includes(req.user._id);

    console.log(video.uploader);
    
    res.status(200).json({
        status: "Success",
        video,
        isVideoLiked,
        isVideoDisliked,
        isVideoSaved
    });
});

const deleteVideo = asyncHandler( async(req, res, next) => {

    const videoId = req.params.id;

    const video = await Video.findById(videoId).populate("channel");

    if (!video) {
        return next(new CustomError("Video not found", 404));
    }

    const currentlyLoggedUser = req.user._id;
    const videoOwner = video.channel.owner;
    let authorized = false;

    if(videoOwner.equals(currentlyLoggedUser) || req.user.role === "admin"){
        authorized = true;
    }

    if(!authorized){
        return next(new CustomError("You are not authorized to delete this video", 403));
    }

    if(video.videoPublicKey){
        await cloudinary.uploader.destroy(video.videoPublicKey, { resource_type: "video" });
    }

    if(video.thumbnailPublicKey){
        await cloudinary.uploader.destroy(video.thumbnailPublicKey, { resource_type: "image" });
    }

    const deletedVideo = await Video.findByIdAndDelete(videoId);

    if(!deletedVideo){
        return next(new CustomError("There was an error deleting the Video. Please try Again", 500));
    }

    res.status(200).json({
        status: "Success",
        deletedVideo
    });
});

const likeHandler = asyncHandler( async(req, res, next) => {

    const currentUserId = req.user._id;
    const videoId = req.params.videoId;
    let isVideoLiked = false;
    let isVideoDisliked = false;

    if(!currentUserId){
        return next(new CustomError("Current User Id cannot be empty", 400));
    }

    if(!videoId){
        return next(new CustomError("Video Id not found", 400));
    }

    const [userExist, videoExist] = await Promise.all([
        User.exists({ _id: currentUserId}),
        Video.exists({ _id: videoId})
    ]);

    if(!userExist){
        return next(new CustomError("User not found", 404));
    }

    if(!videoExist){
        return next(new CustomError("Video not found", 404));
    }

    const video = await Video.findById(videoId).populate("channel");
    const user = await User.findById(currentUserId);

    if(user._id.equals(video.channel.owner._id)){
        return next(new CustomError("You cannot like your own Video.", 400))
    }

    const wasDisliked = video.disLikedBy.includes(user._id)

    if(video.likedBy.includes(user._id) || user.likedVideos.includes(user._id)){
        await Promise.all([
            Video.findByIdAndUpdate(video._id, {
                $pull: {likedBy: user._id}
            }, {new: true}), 

            User.findByIdAndUpdate(user._id, {
                $pull: {likedVideos: video._id}
            }, {new: true})

        ]);

        isVideoLiked = false;
    }
    else{
        await Promise.all([
            Video.findByIdAndUpdate(video._id, {
                $pull: {disLikedBy: user._id},
                $addToSet: {likedBy: user._id}
            }, {new: true}), 

            User.findByIdAndUpdate(user._id, {
                $addToSet: {likedVideos: video._id}
            }, {new: true})
        ]);

        isVideoLiked = true
        isVideoDisliked = false
    }
    
    res.status(200).json({
        status: "Success",
        message: isVideoLiked? "Video liked Successfully.":"Like Removed",
        isVideoLiked,
        isVideoDisliked,
        wasDisliked
    });

});

const dislikeHandler = asyncHandler( async(req, res, next) => {

    const currentUserId = req.user._id;
    const videoId = req.params.videoId;
    let isVideoLiked = false;
    let isVideoDisliked = false;

    if(!currentUserId){
        return next(new CustomError("Current User Id cannot be empty", 400));
    }

    if(!videoId){
        return next(new CustomError("Video Id not found", 400));
    }

    const [userExist, videoExist] = await Promise.all([
        User.exists({ _id: currentUserId}),
        Video.exists({ _id: videoId})
    ]);

    if(!userExist){
        return next(new CustomError("User not found", 404));
    }

    if(!videoExist){
        return next(new CustomError("Video not found", 404));
    }

    const video = await Video.findById(videoId).populate("channel");
    const user = await User.findById(currentUserId);

    if(user._id.equals(video.channel.owner._id)){
        return next(new CustomError("You cannot dislike your own Video.", 400))
    }

    const wasLiked = video.likedBy.includes(user._id);

    if(video.disLikedBy.includes(user._id)){

        await Video.findByIdAndUpdate(video._id, {
            $pull: {disLikedBy: user._id}
        }, {new: true}); 

        isVideoDisliked = false;
    }
    else{
        await Video.findByIdAndUpdate(video._id, {
            $pull: {likedBy: user._id},
            $addToSet: {disLikedBy: user._id}
        }, {new: true});

        isVideoDisliked = true;
        isVideoLiked = false
    }
    
    res.status(200).json({
        status: "Success",
        message: isVideoDisliked? "Video Disliked Successfully.":"Dislike Removed",
        isVideoDisliked,
        isVideoLiked,
        wasLiked
    });
    
});

// const viewsHandler = asyncHandler( async(req, res, next) => {

//     const currentUserId = req.user._id;
//     const videoId = req.body.videoId;

//     if(!currentUserId){
//         return next( new CustomError("Current User Id does not found", 404));
//     }

//     if(!videoId){
//         return next( new CustomError("Video Id does not found", 404));
//     }

//     const [userExist, videoExist] = await Promise.all([
//         User.exists({_id: currentUserId}),
//         Video.exists({_id: videoId})
//     ]);

//     if(!userExist){
//         return next( new CustomError("No user with this Id found", 404));
//     }

//     if(!videoExist){
//         return next( new CustomError("No user with this Id found", 404));
//     }

// });



export { uploadVideos, getAllVideoes, getVideoById, deleteVideo, likeHandler, dislikeHandler };