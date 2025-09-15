import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema(
    {
        // General Information
        firstname: {
            type: String,
            required: true,
            minlength: [2, "User's Firstname must have atleast 2 characters"],
            maxlength: [20, "User's Firstname cannot have more than 20 characters"]
        },
        lastname: {
            type: String,
            required: true,
            minlength: [2, "User's Firstname must have atleast 2 characters"],
            maxlength: [20, "User's Firstname cannot have more than 20 characters"]
        },
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            minlength: [2, "User's Firstname must have atleast 2 characters"],
            maxlength: [24, "User's Firstname cannot have more than 24 characters"],
        },
        DOB: {
            type: Date,
            required: true,
            validate: {
                validator: function(val){
                    return val < new Date()
                },
                message: "Date of Birth should be less than Current Date"
            }
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: validator.isEmail,
                message: "Please Enter a Valid Email."
            }
        },
        password: {
            type: String,
            required: true,
        },
        confirmPassword: {
            type: String,
            required: true,
            select: false,
            validate: {
                validator: function(value){
                    return value == this.password
                },
                message: "Password and Confirm Password must be same"
            }
        },
        profileImage: {
            type: String,
            required: true
        },
        channel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Channel"
        },
        coverImage: {
            type: String,
        },
        description: {
            type: String,
            required: false,
            unique: false,
        },
        passwordChangedAt: {
            type: Date,
        },
        isEmailVarified: {
            type: Boolean,
            default: false
        },

        // Channel Information
        channelSubscribed: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Channel"
            }
        ],
        watchHistory: [{
            video: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Video"
            },
            watchedAt: {
                type: Date,
                default: Date.now()
            }
        }],
        playlists: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Playlist"
            }
        ],
        likedVideos: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        savedVideos: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        likedComments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment"
            }
        ],

        //Based on Action
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user"
        },
        isVerified: {
            type: Boolean,
            default: true,
        },
        isBanned: {
            type: Boolean,
            default: false,
        },
        isPremiumMember: {
            type: Boolean,
            default: false,
        }
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

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    // Hash password
    this.password = await bcrypt.hash(this.password, 12);

    this.confirmPassword = undefined;

    next();
});

userSchema.methods.checkPassword = async function(pswd){
    return await bcrypt.compare(pswd, this.password);
}

userSchema.methods.isPasswordChanged = async function(tokenTime){
    if(this.passwordChangedAt){
        const passwordChangedTime = Math.floor(this.passwordChangedAt.getTime() / 1000);
        return tokenTime < passwordChangedTime
    }
    return false;
}

const User = mongoose.model('User', userSchema);

export default User;