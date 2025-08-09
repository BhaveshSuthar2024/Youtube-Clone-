import asyncHandler from './asyncHandler.js';
import CustomError from './CustomError.js';
import OTP from '../Models/OTP.model.js';

const validateOTP = asyncHandler( async(req, res, next) => {

    const { email, otp } = req.body

    if(!email){
        return next( new CustomError("Please enter Email"));
    }

    if(!otp){
        return next( new CustomError("Please enter OTP"));
    }

    const findOTP = await OTP.findOne({email: email});

    if(!findOTP){
        return next( new CustomError("No OTP generated.", 400));
    }

    const isOTPCorrect = await findOTP.checkOTP(otp);

    if(!isOTPCorrect){
        return next( new CustomError("Invalid OTP or Timeup, Please try again", 400));
    }

    await OTP.deleteOne({ _id: findOTP._id });

    res.status(200).json({
        status: "Success",
        message: "Email varified Successfully",
        isEmailVarified: true
    });
});


export default validateOTP;