import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            minlength: [3, "Video title must be atleast 3 letters long"],
            maxlength: [100, "Video title must be less than 100 letters"],
            required: true
        },
        description: {
            type: String,
            maxlength: [1000, "Video title must be less than 1000 letters"],
        },
        videoUrl: {
            type: String,
            required: true
        },
        thumbnailUrl: {
            type: String,
            required: true
        },
        duration: {
            type: Number,
        },
        views: { 
            type: Number,
            default: 0
        },
        thumbnailPublicKey: {
            type: "String",
            required: true
        },
        videoPublicKey: {
            type: "String",
            required: true
        },
        tags: [
            {
                type: String,
                lowercase: true
            }
        ],
        category: {
            type: String,
        },
        privacy: {
            type: String,
            enum: ["public", "private", "unlisted"]
        },
        createdAt: {
            type: Date,
            default: Date.now()
        },
        isAdult: {
            type: Boolean,
            default: false
        },
        isSensitive: {
            type: Boolean,
            default: false
        },
        isBanned: {
            type: Boolean,
            default: false
        },
        reportReceived: {
            type: Number,
            default: 0,
        },

        channel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Channel",
            required: true
        },
        likedBy: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
        disLikedBy: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
        comments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        }]
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true
        },
        toObject: {
            virtuals: true
        }
    }
)

videoSchema.virtual("likeCount").get(function(){
    return this.likedBy?.length
});

videoSchema.virtual("dislikeCount").get(function(){
    return this.disLikedBy?.length
});

const Video = mongoose.model('Video', videoSchema);

export default Video;