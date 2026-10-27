import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOTP = async (email, OTP) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("Email delivery is not configured.");
  }

  const { data, error } = await resend.emails.send({
    from: "YouTube Clone <onboarding@resend.dev>",
    to: email,
    subject: "Your OTP for YouTube",
    html: `
            <h2>Your OTP is: ${OTP}</h2>
            <p>This OTP is valid for 5 minutes.</p>
            <small>If you did not request this, ignore it.</small>
        `,
  });

  if (error) {
    console.error("Email sending failed:", error);
    throw new Error(error.message);
  }

  console.log("Email sent:", data.id);
  return data;
};

export default sendOTP;
