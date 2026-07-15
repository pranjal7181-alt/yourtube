import nodemailer from "nodemailer";

const sendOtpEmail = async (email, name, otp) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error(
      "EMAIL_USER or EMAIL_PASS environment variable is missing"
    );
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"YourTube Security" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "YourTube Login Verification OTP",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>YourTube Login Verification</h2>

        <p>Hello ${name || "User"},</p>

        <p>Your OTP for login verification is:</p>

        <h1 style="letter-spacing: 6px;">${otp}</h1>

        <p>This OTP will expire in 5 minutes.</p>

        <p>If you did not attempt to sign in, please ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);

  console.log(`OTP email sent to ${email}`);
};

export default sendOtpEmail;