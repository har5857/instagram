import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';
import env from '../config/env.js';
import cron from'node-cron';
import otpGenerator from 'otp-generator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
    service: env.email.service,
    auth: {
        user: env.email.user,
        pass: env.email.pass,
    },
});

// Send mail
export const sendResetEmail = async (email, resetToken, user) => {
    try {
        const resetUrl = `http://localhost:5555/reset-password/${resetToken}`;
        const templatePath = path.resolve(__dirname, '../views/resetpassword.html');
        const emailTemplate = await ejs.renderFile(templatePath, { user, resetUrl });
        
        const mailOptions = {
            from: env.email.user,
            to: email,
            subject: 'Password Reset Request',
            html: emailTemplate,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return console.log(error);
            }
            console.log('Email sent: ' + info.response);
          });
        
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw new Error('Error sending password reset email');
    }
};

export const sendOtp = async (email, user) => {
    try {

        const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false });
        const resetUrl = `http://localhost:5555/Otp-varification`;
        const templatePath = path.resolve(__dirname, '../views/otp.html');
        const emailTemplate = await ejs.renderFile(templatePath, { user, resetUrl, otp });

        const mailOptions = {
            from: env.email.user,
            to: email,
            subject: 'Otp Varification Request',
            html: emailTemplate,
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);

        return otp; 
    } catch (error) {
        console.error('Error sending Otp email:', error);
        throw new Error('Error sending Otp email');
    }
};



 

  
