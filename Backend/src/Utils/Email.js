
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Email credentials are missing.');
}

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 60000,
});

const sendOTP = async (email, OTP) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error('Email delivery is not configured.');
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

        console.log('Email accepted by SMTP server:', info.messageId);
        return info;
    } catch (error) {
        console.error('Email sending failed:', {
            code: error.code,
            command: error.command,
            responseCode: error.responseCode,
            message: error.message,
        });

        throw error;
    }
};

export default sendOTP;
