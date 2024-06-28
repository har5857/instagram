import nodemailer from 'nodemailer';
import ejs from 'ejs';
import env from '../config/env.js';

const transporter = nodemailer.createTransport({
    service: env.email.service,
    auth: {
        user: env.email.user,
        pass: env.email.pass,
    },
});

const resetPasswordTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Password Reset Request</title>
</head>
<body>
    <p>Hello <%= user.name %>,</p>
    <p>We received a request to reset your password. Click the link below to reset your password:</p>
    <a href="<%= resetUrl %>">Reset Password</a>
    <p>If you did not request a password reset, please ignore this email.</p>
    <p>Best regards,<br>Your App Team</p>
</body>
</html>
`;

//send mail
export const sendResetEmail = async (email, resetToken, user) => {
    try {
        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
        const emailTemplate = await ejs.render(resetPasswordTemplate, { user, resetUrl });
        const mailOptions = {
            from: env.email.user,
            to: email,
            subject: 'Password Reset Request',
            html: emailTemplate,
        };

        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent to:', email);
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw new Error('Error sending password reset email');
    }
};
