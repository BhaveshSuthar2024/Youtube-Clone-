import Video from '../Models/videos.model.js';
import CustomError from '../Utils/CustomError.js';
import asyncHandler from '../Utils/asyncHandler.js';
import Comment from '../Models/comment.model.js';
import User from '../Models/user.model.js';


const createComment = asyncHandler( async(req, res, next) => {
    
    const videoId = req.params.videoId;
    const currentUserId = req.user._id

    if(!videoId){
        return next(new CustomError("Video Id cannot be empty", 400));
    }

    if(!currentUserId){
        return next(new CustomError("No currently logged in user found", 400));
    }

    const video = await Video.findById(videoId);
    const user = await User.findById(currentUserId);

    req.body.owner = user._id;
    req.body.video = video._id;

    const comment = await Comment.create(req.body);

    video.comments.push(comment._id);

    await video.save();

    res.status(200).json({
        status: "Success",
        message: "Comment created Successfully.",
        comment
    });

});

const loadComments = asyncHandler( async(req, res, next) => {

    const videoId = req.params.videoId;
    const userId = req.user._id
    

    if(!videoId){
        return next( new CustomError("VideoId cannot be empty", 400));
    }

    if(!userId){
        return next( new CustomError("UserId cannot be empty", 400));
    }

    const [videoExist, userExist] = await Promise.all([
        await Video.exists({_id: videoId}),
        await User.exists({_id: userId})
    ])
    
    if(!videoExist){
        return next( new CustomError("No Video found with the given Id", 400));
    }

    if(!userExist){
        return next( new CustomError("No User found with the given Id", 400));
    }

    const comments = await Comment.find({video: videoId}).populate("owner").populate("repliedComment").sort({ createdAt: -1 });


    const formattedComments = comments.map(comment => {
        const isLiked = comment.likedBy.includes(userId);
        const isDisliked = comment.dislikedBy.includes(userId);

        return {
            _id: comment._id,
            text: comment.text,
            owner: comment.owner,
            likeCount: comment.likedBy.length,
            dislikeCount: comment.dislikedBy.length,
            isLiked,
            isDisliked,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
            repliedComment: comment.repliedComment,
            repliedCommentCount: comment.repliedCommentCount,
            repliedTo: comment.repliedTo,
            videoTimestamps: comment.videoTimestamps,
            ishearted: comment.ishearted,
        };
    });

    if(formattedComments.length === 0){
        return next(new CustomError("No Comments Found", 404));
    }

    res.status(200).json({
        status: "Success",
        message: "Comments Loaded",
        totalComments: formattedComments.length,
        formattedComments
    });
});

const deleteComment = asyncHandler( async(req, res, next) => {

    const currentUserId = req.user._id;
    const commentId = req.params.commentId;

    if(!currentUserId){
        return next(new CustomError("Current User Id not found", 400));
    }

    if(!commentId){
        return next(new CustomError("Comment Id not found", 400));
    }

    const commentExist = await Comment.exists({_id: commentId});

    if(!commentExist){
        return next(new CustomError("Comment not found", 400));
    }

    const comment = await Comment.findById(commentId).populate("owner");

    if(!(comment.owner._id.equals(currentUserId))){
        return next(new CustomError("You are not authorized to perform this task", 400));
    }

    const deletedComment = await Comment.findByIdAndDelete(comment._id);

    res.status(200).json({
        status: "Success",
        message: "Comment deleted Successfully.",
        deletedComment
    });
});

const editComment = asyncHandler( async(req, res, next) => {

    const { text } = req.body;

    const commentId = req.params.commentId;
    const currentUserId = req.user._id;

    if(!currentUserId){
        return next(new CustomError("Current User Id not found", 400));
    }

    if(!commentId){
        return next(new CustomError("Comment Id not found", 400));
    }

    const commentExist = await Comment.exists({_id: commentId});

    if(!commentExist){
        return next(new CustomError("Comment not found", 400));
    }

    const comment = await Comment.findById(commentId).populate("owner");

    if(!(comment.owner._id.equals(currentUserId))){
        return next(new CustomError("You are not authorized to perform this task", 400));
    }

    const updatedComment = await Comment.findByIdAndUpdate(comment._id, { $set :{text: text}}, {new: true, runValidators: true});

    res.status(200).json({
        status: "Success",
        message: "Comment Successfully Updated",
        updatedComment
    })



});

const likeHandler = asyncHandler( async(req, res, next) => {

    const currentUserId = req.user._id;
    const commentId = req.params.commentId;
    let isCommentLiked = false;
    let isCommentDisliked = false;

    if(!currentUserId){
        return next(new CustomError("Current User Id cannot be empty", 400));
    }

    if(!commentId){
        return next(new CustomError("Comment Id not found", 400));
    }

    console.log(commentId);
    
    const comment = await Comment.findById(commentId);
    const user = await User.findById(currentUserId);

    if(!user){
        return next(new CustomError("User not found", 404));
    }

    if(!comment){
        return next(new CustomError("Comment not found", 404));
    }

    const wasDisliked = comment.dislikedBy.includes(user._id);

    if(comment.likedBy.includes(user._id) || user.likedComments.includes(comment._id)){
        await Promise.all([

            Comment.findByIdAndUpdate(comment._id, {
                $pull: {likedBy: user._id}
            }, {new: true}), 

            User.findByIdAndUpdate(user._id, {
                $pull: {likedComments: comment._id}
            }, {new: true})

        ]);

        isCommentLiked = false;
    }
    else{
        await Promise.all([
            Comment.findByIdAndUpdate(comment._id, {
                $pull: {dislikedBy: user._id},
                $addToSet: {likedBy: user._id}
            }, {new: true}),

            User.findByIdAndUpdate(user._id, {
                $addToSet: {likedComments: comment._id}
            }, {new: true})
        ]);

        isCommentLiked = true
        isCommentDisliked = false
    }
    
    res.status(200).json({
        status: "Success",
        message: isCommentLiked? "Comment liked Successfully.":"Like Removed",
        isCommentLiked,
        isCommentDisliked,
        wasDisliked,
    });

});

const dislikeHandler = asyncHandler( async(req, res, next) => {

    const currentUserId = req.user._id;
    const commentId = req.params.commentId;
    let isCommentLiked = false;
    let isCommentDisliked = false;

    if(!currentUserId){
        return next(new CustomError("Current User Id cannot be empty", 400));
    }

    if(!commentId){
        return next(new CustomError("Comment Id not found", 400));
    }

    const [userExist, commentExist] = await Promise.all([
        User.exists({ _id: currentUserId}),
        Comment.exists({ _id: commentId})
    ]);

    if(!userExist){
        return next(new CustomError("User not found", 404));
    }

    if(!commentExist){
        return next(new CustomError("Comment not found", 404));
    }

    const comment = await Comment.findById(commentId);
    const user = await User.findById(currentUserId);

    const wasLiked = comment.likedBy.includes(user._id);

    if(comment.dislikedBy.includes(user._id)){

        await Comment.findByIdAndUpdate(comment._id, {
            $pull: {dislikedBy: user._id}
        }, {new: true}); 

        isCommentDisliked = false;
    }
    else{
        await Comment.findByIdAndUpdate(comment._id, {
            $pull: {likedBy: user._id},
            $addToSet: {dislikedBy: user._id}
        }, {new: true});

        isCommentDisliked = true;
        isCommentLiked = false;
    }
    
    res.status(200).json({
        status: "Success",
        message: isCommentDisliked? "Comment Disliked Successfully.":"Dislike Removed",
        isCommentDisliked,
        isCommentLiked,
        wasLiked
    });
    
});

const replyComment = asyncHandler( async(req, res, next) => {

    const commentId = req.params.commentId;
    const currentUserId = req.user._id;

    if(!commentId){
        return next( new CustomError("Comment Id cannot be Empty", 400));
    }

    if(!currentUserId){
        return next( new CustomError("User Id cannot be Empty", 400));
    }

    const [commentExist, userExist] = await Promise.all([
        Comment.exists({_id: commentId}),
        User.exists({_id: currentUserId})
    ]);

    if(!commentExist){
        return next( new CustomError("No comment found", 404));
    }

    if(!userExist){
        return next( new CustomError("No user found", 404));
    }

    const user = await User.findById(currentUserId).lean();
    const comment = await Comment.findById(commentId)
    
    req.body.owner = user._id;
    req.body.repliedTo = comment._id;

    const repliedComment = await Comment.create(req.body);

    comment.repliedComment.push(repliedComment._id);
    await comment.save();
    
    res.status(200).json({
        status: "Success",
        repliedComment
    })

});

const loadRepliedComments = asyncHandler( async(req, res, next) => {

    const commentId = req.params.commentId;
    const userId = req.user._id

    if(!commentId){
        return next( new CustomError("Comment Id cannot be Empty", 400));
    }

    if(!userId){
        return next( new CustomError("User Id cannot be Empty", 400));
    }

    const [commentExist, userExist] = await Promise.all([
        Comment.exists({_id: commentId}),
        User.exists({_id: userId})
    ]);

    if(!commentExist){
        return next( new CustomError("No comment found", 404));
    }

    if(!userExist){
        return next( new CustomError("No user found", 404));
    }

    const comments = await Comment.find({repliedTo: commentId}).populate("owner");
    
    if(comments.length === 0){
        res.status(200).json({
            status: "Not Found",
            message: "No replied comments found"
        });
    }

    const formattedComments = comments.map(comment => {
        const isLiked = comment.likedBy.includes(userId);
        const isDisliked = comment.dislikedBy.includes(userId);

        return {
            _id: comment._id,
            text: comment.text,
            owner: comment.owner,
            likeCount: comment.likedBy.length,
            dislikeCount: comment.dislikedBy.length,
            isLiked,
            isDisliked,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
            repliedComment: comment.repliedComment,
            repliedTo: comment.repliedTo,
            videoTimestamps: comment.videoTimestamps,
            ishearted: comment.ishearted,
        };
    });

    res.status(200).json({
        status: "Success",
        formattedComments,
        totalComments: comments.length
    });
});


export { createComment, loadComments, deleteComment, editComment, likeHandler, dislikeHandler, replyComment, loadRepliedComments }