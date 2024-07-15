import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';
import env from '../config/env.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
    service: env.email.service,
    auth: {
        user: env.email.user,
        pass: env.email.pass,
    },
});

// send Email
export const sendEmail = async (email, subject, templateName, templateData) => {
    try {
        const templatePath = path.resolve(__dirname, `../views/${templateName}.html`);
        const emailTemplate = await ejs.renderFile(templatePath, templateData);
        
        const mailOptions = {
            from: env.email.user,
            to: email,
            subject: subject,
            html: emailTemplate,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Error sending email');
    }
}; 



