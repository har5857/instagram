import nodemailer from 'nodemailer';
import env from '../config/env.js';

const transporter = nodemailer.createTransport({
    service: env.email.service,
    auth: {
        user: env.email.user,
        pass: env.email.pass,
    },
});

export const sendResetEmail = async (email, resetToken) => {
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    const mailOptions = {
        from: env.email.user,
        to: email,
        subject: 'Password Reset Request',
        html: `Click this <a href="${resetUrl}">link</a> to reset your password.`,
    };

    await transporter.sendMail(mailOptions);
};
