import asyncHandler from '../Utils/asyncHandler.js';
import Channel from '../Models/channel.model.js';
import CustomError from '../Utils/CustomError.js';
import UploadOnCloudinary from '../Utils/Cloudinary.js';
import User from '../Models/user.model.js';


const createChannel = asyncHandler( async(req, res, next) => {

    const {name, discription, country, language} = req.body;

    const fields = {name, discription, country, language};
    
    console.log(fields);

    const emptyFields = Object.keys(fields).find((keys) => fields[keys].trim() == "");

    if(emptyFields){
        return next(new CustomError(`${emptyFields} is empty. Please fill it before Submitting`, 403));
    }

    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!coverImageLocalPath){
        return next(new CustomError("Please select a Cover Image", 403));
    }

    const coverImage = await UploadOnCloudinary(coverImageLocalPath);

    if(!coverImage){
        return next(new CustomError("There was an error uploading Cover Immage. Please try again later", 403));
    }

    const YoutubeChannelHandler = (name) => {
        let randomString = ""

        const randomCharGenerator = () => {
            const charString = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:'?/`~"
            while(randomString.length < 4){
                randomString += charString[Math.floor(Math.random()*charString.length)]
            }
        };

        randomCharGenerator();
        return name + "-" + randomString ;
    }

    req.body.channelHandle = YoutubeChannelHandler(name);
    req.body.owner = req.user._id;
    req.body.coverImage = coverImage.url;

    const channel = await Channel.create(req.body)

    if(!channel){
        return next(new CustomError("There was an error while creating the channel. Please try again.", 500));
    }

    const user = await User.findByIdAndUpdate(req.user._id, {channel: channel._id});

    await Channel.findByIdAndUpdate(channel._id, {channelLogo: user.profileImage});

    const UserChannel = await Channel.findById(channel._id).populate("owner");

    res.status(200).json({
        status: "Success",
        UserChannel
    });

});

const getChannelById = asyncHandler(async(req, res, next) => {

    const { id, page } = req.params;

    let content = "channelLogo name discription channelHandle coverImage subscriberCount";

    if(page && page == "videos"){
        content += " videos ";
    }

    if(page && page == "playlists"){
        content += " playlist";
    }

    if(!id){
        return next(new CustomError("Could not found the Channel Id", 404));
    }

    const channel = await Channel.findById(id).populate(page==="videos"?"videos":page==="playlists"?{
        path: "playlist",
        populate: [{
            path: "videos",
            model: "Video"
        },
         {
            path: "channel",
            model: "Channel"
        }]
    }:"").select(content);

    if(!channel){
        return next(new CustomError("No channel Found", 404));
    }

    res.status(200).json({
        status: "Success",
        channel
    })

});

const subscribeHandler = asyncHandler( async(req, res, next) => {

    const currentUserId = req.user._id;
    const channelId = req.params.channelId;

    console.log("Channel ID : ", channelId);
    

    const user = await User.findById(currentUserId);
    const channel = await Channel.findById(channelId);

    if(!user){
        return next(new CustomError("User not found", 400));
    }

    if(!channel){
        return next(new CustomError("Channel not found", 400));
    }

    if(channel.owner._id.equals(user._id)){
        return next(new CustomError("You cannot Subscribe your own Channel", 400));
    }

    if(user.channelSubscribed.includes(channel._id)){
        return next(new CustomError("You have already Subscribed this Channel", 400));
    }

    channel.subscribers.push(user._id);
    user.channelSubscribed.push(channel._id);
    await channel.save();
    await user.save();

    res.status(200).json({
        status: "Success",
        message: "Channel Successfully Subscribed",
        isSubscribed: true
    });  

});

const unSubscribeHandler = asyncHandler(async(req, res, next) => {

    const channelId = req.params.channelId;
    const currentUserId = req.user._id;

    const channel = await Channel.findById(channelId);
    const user = await User.findById(currentUserId);

    if(!user){
        return next(new CustomError("User not found", 400));
    }

    if(!channel){
        return next(new CustomError("Channel not found", 400));
    }
    
    if(!user.channelSubscribed.includes(channel._id)){
        return next(new CustomError("You cannot Unsubscribe a Channel, which you dont have Subscribed", 400));
    }

    channel.subscribers.pull(user._id);
    user.channelSubscribed.pull(channel._id);
    await user.save();
    await channel.save()

    res.status(200).json({
        status: "Success",
        message: "Channel Successfully Subscribed",
        isSubscribed: true
    });  

});


export { createChannel, getChannelById, subscribeHandler, unSubscribeHandler }