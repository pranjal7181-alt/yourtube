import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

export const sendSubscriptionEmail = async (
  email,
  name,
  plan,
  amount,
  paymentId
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "YourTube Subscription Confirmation",
    html: `
      <h2>Hello ${name},</h2>

      <p>Your subscription has been activated successfully.</p>

      <table border="1" cellpadding="8" cellspacing="0">
        <tr>
          <th>Plan</th>
          <td>${plan}</td>
        </tr>

        <tr>
          <th>Amount</th>
          <td>₹${amount}</td>
        </tr>

        <tr>
          <th>Transaction ID</th>
          <td>${paymentId}</td>
        </tr>

        <tr>
          <th>Date</th>
          <td>${new Date().toLocaleString()}</td>
        </tr>
      </table>

      <br>

      <p>Thank you for choosing <b>YourTube</b>.</p>
    `,
  };

  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log(
    "EMAIL_PASS:",
    process.env.EMAIL_PASS ? "Loaded" : "Missing"
  );

  await transporter.sendMail(mailOptions);
};