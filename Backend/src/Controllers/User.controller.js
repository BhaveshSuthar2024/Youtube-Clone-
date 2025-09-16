import asyncHandler from '../Utils/asyncHandler.js'
import User from '../Models/user.model.js'
import CustomError from '../Utils/CustomError.js'
import Video from '../Models/videos.model.js'


const getUserProfile = asyncHandler( async(req, res, next) => {

    const userId = req.user._id;

    if(!userId){
        return next( new CustomError("No Logged In User Id Found", 400));
    }

    const userExist = await User.exists({_id: userId});

    if(!userExist){
        return next( new CustomError("Logged In User do not exist", 404));
    }

    const user = await User.findById(userId)
    .populate({
        path: "likedVideos",
        populate: {
            path: "channel",
            model: "Channel"
        }
    })
    .populate({
        path: "watchHistory",
        populate: {
            path: "video",
            model: "Video",
            populate: {
                path: "channel",
                model: "Channel",
            }
        }
    }).populate({
        path: "savedVideos",
        populate: {
            path: "channel",
            model: "Channel"
        }
    })
    .populate({
        path: "playlists",
        populate: [{
            path: "channel",
            model: "Channel"
        },
        {
            path: "videos",
            model: "Video",
            select: "thumbnailUrl title _id"
        },
    ]
        
    })

    res.status(200).json({
        status: "Success",
        user
    });
});

const videolistHandler = asyncHandler( async(req, res, next) => {

    const page = req.params.pageId;
    const currentUserId = req.user._id

    if(!page){
        return next( new CustomError("Page not found.", 400));
    }

    if(!currentUserId){
        return next( new CustomError("Current user id not found.", 404));
    }   

    const userExist = await User.exists({_id: currentUserId});

    if(!userExist){
        return next( new CustomError("User does not Exist", 404));
    }

    const validPages = ['likedVideos', 'watchLater'];

    if (!validPages.includes(page)) {
        return next(new CustomError("Invalid page type requested.", 400));
    }

    const fieldsToPopulate = {
        likedVideos: 'likedVideos',
        watchLater: 'savedVideos',
    }[page]; 

    const user = await User.findById(currentUserId).populate({
        path: fieldsToPopulate,
        populate: {
            path: "channel",
            model: "Channel"
        }
    });

    res.status(200).json({
        status: "Success",
        user
    });

});

const watchHistoryHandler = asyncHandler( async(req, res, next) => {

    const currentUserId = req.user._id;
    const videoId = req.params.videoId;
    const isVideoEligible = req.body.videoEligibility

    if(!currentUserId){
        return next(new CustomError("Current user Id not found", 400));
    }

    if(!videoId){
        return next(new CustomError("Video Id not found", 400));
    }

    const [userExist, videoExist] = await Promise.all([

        User.exists({_id: currentUserId}),
        Video.exists({_id: videoId})
    ]);

    if(!userExist){
        return next(new CustomError("User not found", 404));
    }

    if(!videoExist){
        return next(new CustomError("Video not found", 404));
    }

    const video = await Video.findById(videoId).lean();
    const user = await User.findById(currentUserId);

    if(video.isBanned){
        return next(new CustomError("The Video has been banned for voileting platform guidelines", 404));
    }

    if (!isVideoEligible) {
        return res.status(200).json({
            status: "Skipped",
            message: "Video not added to watch history due to low watch time or skipped"
        });
    }

    user.watchHistory = user.watchHistory.filter(doc => doc.video.toString() !== video._id.toString());
    user.watchHistory.unshift({video: video._id, watchedAt: new Date()});
    user.watchHistory = user.watchHistory.slice(0, 100);
    await user.save();


    res.status(200).json({
        status: "Success",
        message: "Video Updated to watch history"
    });
});

const getUserWatchHistory = asyncHandler( async(req, res, next) => {

    const currentUserId = req.user._id;

    if(!currentUserId){
        return next( new CustomError("Current User Id does not found", 404));
    }

    const userExist = await User.exists({_id: currentUserId});

    if(!userExist){
        return next( new CustomError("No user with this Id found", 404));
    }

    const user = await User.findById(currentUserId).populate({
        path: "watchHistory",
        populate: {
            path: "video",
            model: "Video",
            populate: {
                path: "channel",
                model: "Channel",
                select: "name"
            }
        }
    });

    res.status(200).json({
        status: "Success",
        message: "User Watch History",
        user
    });


});

const removeVideofromHistory = asyncHandler( async(req, res, next) => {

    const currentUserId = req.user._id;
    const videoObj = req.body;

    if(!currentUserId){
        return next( new CustomError("Current User Id does not found", 404));
    }

    if(!videoObj){
        return next( new CustomError("Video Id does not found", 404));
    }

    console.log(videoObj);

    const userExist = await User.exists({_id: currentUserId});

    if(!userExist){
        return next( new CustomError("No user with this Id found", 404));
    }

    const user = await User.findById(currentUserId);

    user.watchHistory = user.watchHistory.filter(doc => doc.video._id.toString() !== videoObj.video._id.toString());
    await user.save();

    res.status(200).json({
        status: "Success",
        message: "Video removed from History"
    });

});

const saveVideoHandler = asyncHandler( async(req, res, next) => {

    const userId = req.user._id;
    const videoId = req.params.videoId;

    if(!userId){
        return next( new CustomError("User Id cannot be empty", 400));
    }

    if(!videoId){
        return next( new CustomError("Video Id cannot be empty", 400));
    }

    const [userExist, videoExist] = await Promise.all([
        User.exists({_id: userId}),
        Video.exists({_id: videoId})
    ]);

    if(!userExist){
        return next( new CustomError("No user with this Id found", 404))
    }

    if(!videoExist){
        return next( new CustomError("No user with this Id found", 404))
    }

    const video = await Video.findById(videoId);
    const user = await User.findById(userId);

    let isVideoSaved = false;

    if(user.savedVideos.includes(video._id)){
        await User.findByIdAndUpdate(userId, {
            $pull: {savedVideos: video._id}
        }, {new: true});
    }else{
        await User.findByIdAndUpdate(userId, {
            $addToSet: {savedVideos: video._id}
        }, {new: true});
        isVideoSaved = true
    }

    res.status(200).json({
        status: "Success",
        message: isVideoSaved?"Video Saved Successfully":"Video Successfully Unsaved",
        user, 
        isVideoSaved
    });
});


export { getUserProfile, videolistHandler, watchHistoryHandler, getUserWatchHistory, removeVideofromHistory, saveVideoHandler };
