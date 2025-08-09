import mongoose from 'mongoose';

const playlistSchema = mongoose.Schema({
    name: {
        type: String,
        minlength: [2, "Playlist Name must have atleast 2 characters"],
        maxlength: [30, "Playlist Name cannot have more than 20 characters"],
        required: true
    },
    privacy: {
        type: String,
        enum: ["public", "private", "unlisted"],
        default: "private"
    },
    videos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    }],
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel"
    },
    owner : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    isCollabration: {
        type: Boolean,
        default: false
    },
    savedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Channel"
        }
    ]
},
{
    timestamps: true,
    toObject:{
        virtuals: true
    },
    toJSON:{
        virtuals: true
    },
})

const Playlist = mongoose.model("Playlist", playlistSchema);

export default Playlist;