import asyncHandler from '../Utils/asyncHandler.js';
import User from '../Models/user.model.js';
import CustomError from '../Utils/CustomError.js';
import UploadOnCloudinary from '../Utils/Cloudinary.js';
import jwt from 'jsonwebtoken';
import OTP from '../Models/OTP.model.js';
import GenerateOTP from '../Utils/OTP.Genarator.js';
import sendOTP from '../Utils/Email.js';


const options = {
    maxAge: parseInt(process.env.EXPIRES_IN),
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? "None" : "Lax",
    secure: process.env.NODE_ENV === 'production'
};

if(process.env.NODE_ENV === 'production'){
    options.secure = true;
}

const GenerateAccessToken = async(id) => {
    return jwt.sign({id}, process.env.JWT_SECRET_STRING, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

const addUser = asyncHandler(async(req, res, next) => {

    // Checking the Feild if whether they are not empty.
    const {firstname, username , DOB, email, password, confirmPassword, isEmailVarified} = req.body;
    
    const field = {firstname, username , DOB, email, password, confirmPassword}

    const emptyFields = Object.keys(field).find(keys => field[keys].trim() === '');  

    if(emptyFields){
        return next(new CustomError(`${emptyFields} is Empty. Please fill the ${emptyFields} field.`, 400));
    }

    // Checking if User already Exist with the entered username or email
    const alreadyCreatedUser = await User.findOne({ $or: [{username}, {email}]})

    if(alreadyCreatedUser){
        return next(new CustomError(`User already exist with ${username} or ${email}`));
    }

    // Uploading images to Cloudinary 
    const profileImageLocalPath = req.files?.profileImage[0]?.path;

    let coverImageLocalPath;

    if(req.files && req.files?.coverImage){
        coverImageLocalPath = req.files?.coverImage[0]?.path;
    }

    if(!profileImageLocalPath){
        return next(new CustomError("You need to have a profile Image", 400));
    }

    console.log(req.body);
    
    if(!isEmailVarified){
        return next( new CustomError("Email not Varified", 400));
    }

    const profileImagePath = await UploadOnCloudinary(profileImageLocalPath);
    const coverImagePath = await UploadOnCloudinary(coverImageLocalPath);

    if(!profileImagePath){
        return next(new CustomError("There was an error while uploading Profile Image.", 500));
    }

    if(coverImageLocalPath && !coverImagePath){
        return next(new CustomError("There was an error while uploading Cover Image.", 500));
    }

    req.body.profileImage = profileImagePath?.url;
    req.body.coverImage = coverImagePath?.url;

    //Creating a new User on above info
    const user = await User.create(req.body);

    if(!user){
        return next(new CustomError("There was an error while Signing in. Please try again later", 500));
    }

    const AccessToken = await GenerateAccessToken(user._id);

    res.cookie('jwt', AccessToken, options);

    res.status(200).json({
        status: "Success",
        user
    });

});

const generateOTP = asyncHandler( async(req, res, next) => {

    const { email } = req.body;

    if(!email){
        return next( new CustomError("Email address not found"));
    }

    const userExist = await User.exists({email: email});

    if(userExist){
        return next( new CustomError("Email already used", 400));
    }

    const otp = GenerateOTP();

    req.body.OTP = otp;

    await OTP.create(req.body);

    sendOTP(email, otp);

    res.status(200).json({
        status: "Success",
        message: "OTP send successfully"
    });
});

const login = asyncHandler(async(req, res, next) => {

    // Checking whether the data is not empty
    const {email, password} = req.body;

    const fields = {email, password};

    const emptyFields = Object.keys(fields).find((key) => fields[key].trim() === "");

    if(emptyFields){
        return next(new CustomError(`Please enter a ${emptyFields}. It cannot be empty`, 400));
    }

    // Finding the User
    const user = await User.findOne({email}).select("+password").populate("channel");

    if(!user){
        return next(new CustomError(`No User with this username or password`));
    }

    // Checking the Password
    const isPasswordCorrect = await user.checkPassword(password);

    if(!isPasswordCorrect){
        return next(new CustomError("Incorrect Password. Please try again", 401));
    }

    // Checking whether the user is Banned
    const isBanned = user.isBanned;

    if(isBanned){
        return next(new CustomError("User has been Banned for voileting platform guidelines and regulations.", 403));
    }

    // Generating the Token
    const AccessToken = await GenerateAccessToken(user._id);

    // Sending the Response
    res.status(200).cookie('jwt', AccessToken, options).json({
        Status: "Success",
        user,
    });
});

const currentlyLoggedUser = (req, res, next) => {
    const loggedUser = req.user;

    if(!loggedUser){
        return next(new CustomError("No Logged In User Found", 404));
    }

    res.status(200).json({
        status: "Success",
        loggedUser
    });
}

const logout = (req, res, next) => {
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: false,
        sameSite: "Strict",
      });
      res.status(200).json("Successfully Logged Out")
}


export { addUser, login, logout, currentlyLoggedUser, generateOTP }
