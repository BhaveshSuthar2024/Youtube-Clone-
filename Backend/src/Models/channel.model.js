import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    discription:{
        type: String,
        required: true
    },
    channelHandle:{
        type: String,
        required: true
    },
    coverImage:{
        type: String,
        required: true
    },
    channelLogo:{
        type: String,
    },
    tags: [{
        type: String,
        required: true
    }],
    country:{
        type: String,
        required: true
    },
    language: {
        type: String,
        default: "en"
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    subscribers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    videos:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    }],
    shorts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Short"
    }],
    playlist:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Playlist"
    }],
    Post:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],
    live:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Live"
    }],
    isVarified:{
        type: Boolean,
        default: false
    },
    isMonetized:{
        type: Boolean,
        default: false
    },
    isAdsEnabled:{
        type: Boolean,
        default: false
    },
    isBanned:{
        type: Boolean,
        default: false
    },
    themeColor: {
        type: String
    },
    totalWatchTime: {
        type: Number,
        default: 0
    },
    subscriberCount: {
        type: Number,
        default: 0
    },
    privacy:{
        type: String,
        enum: ["public", "private"],
        dafault: "public"
    }
},
{
    timestamps:true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
}
);

const Channel = mongoose.model("Channel", channelSchema);

export default Channel