import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const sendOTP = (email, OTP) => {

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

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
    });
}

export default sendOTP;