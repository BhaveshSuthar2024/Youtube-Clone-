
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendOTP = async (email, OTP) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error(
            'Email delivery is not configured. Check EMAIL_USER and EMAIL_PASS.'
        );
    }

    try {
        const info = await transporter.sendMail({
            from: `"YouTube Clone" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Your OTP for YouTube',
            html: `
                <h2>Your OTP is: ${OTP}</h2>
                <p>This OTP is valid for 5 minutes.</p>
                <small>If you did not request this, ignore it.</small>
            `,
        });

        console.log('Email sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('Nodemailer error:', {
            code: error.code,
            command: error.command,
            responseCode: error.responseCode,
            response: error.response,
            message: error.message,
        });

        throw error;
    }
};

export default sendOTP;
