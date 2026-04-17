const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({ from: process.env.EMAIL_FROM, to, subject, html });
};

const emailTemplates = {
  verification: (token) => `
    <h2>Verify your email</h2>
    <p>Click <a href="${process.env.CLIENT_URL}/verify-email?token=${token}">here</a> to verify your account.</p>`,
  orderConfirmation: (order) => `
    <h2>Order Confirmed #${order._id}</h2>
    <p>Total: $${order.totalPrice.toFixed(2)}</p>
    <p>Thank you for shopping with TechGadget Store!</p>`,
  passwordReset: (token) => `
    <h2>Reset your password</h2>
    <p>Click <a href="${process.env.CLIENT_URL}/reset-password?token=${token}">here</a> to reset your password. Expires in 1 hour.</p>`,
};

module.exports = { sendEmail, emailTemplates };
