import dotenv from 'dotenv';

dotenv.config();

const sendOTP = async (email, OTP) => {

    console.log('Brevo key prefix:', process.env.BREVO_API_KEY?.slice(0, 10), 'length:', process.env.BREVO_API_KEY?.length);
    
    if (!process.env.BREVO_API_KEY || !process.env.BREVO_SENDER_EMAIL) {
        throw new Error('Email delivery is not configured.');
    }

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'api-key': process.env.BREVO_API_KEY,
        },
        body: JSON.stringify({
            sender: {
                name: 'YouTube Clone',
                email: process.env.BREVO_SENDER_EMAIL,
            },
            to: [{ email }],
            subject: 'Your OTP for YouTube',
            htmlContent: `
                <h2>Your OTP is: ${OTP}</h2>
                <p>This OTP is valid for 5 minutes.</p>
                <small>If you did not request this, ignore it.</small>
            `,
        }),
        signal: AbortSignal.timeout(15000),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        console.error('Email sending failed:', response.status, data);
        throw new Error(data.message || 'Failed to send email.');
    }

    console.log('Email sent:', data.messageId);
    return data;
};

export default sendOTP;
