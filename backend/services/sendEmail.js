import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  // Gmail example - replace with your email service
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD, // Use app-specific password
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"Navippon" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

// 5. ENVIRONMENT VARIABLES
// Add to your .env file:
/*
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
*/
