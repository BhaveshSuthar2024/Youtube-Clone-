import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const sendOTP = async (email, OTP) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error('Email delivery is not configured. Set EMAIL_USER and EMAIL_PASS.');
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP for Youtube',
        html: `<h2>Your OTP is: ${OTP}</h2><p>This OTP is valid for 5 minutes.</p><small>If you did not request this, ignore it.</small>`,
    };

    return transporter.sendMail(mailOptions);
}

export default sendOTP;