import mongoose from 'mongoose';

const commentSchema = mongoose.Schema({
    text:{
        type: String,
        minlength: [1, "Your comment should contain at least 1 character"],
        required: true
    },
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    likedBy:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    dislikedBy:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    ishearted:{
        type: Boolean,
        default: false
    },
    repliedComment: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    videoTimestamps: [{
        type: Number,
    }],
    repliedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},
{
    timestamps: true,
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
})

commentSchema.virtual('likeCount').get(function(){
    return this.likedBy.length;
});

commentSchema.virtual('dislikeCount').get(function(){
    return this.dislikedBy.length;
});

commentSchema.virtual('repliedCommentCount').get(function(){
    return this.repliedComment.length;
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;