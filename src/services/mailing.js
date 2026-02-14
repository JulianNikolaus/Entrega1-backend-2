import nodemailer from 'nodemailer';
import config from '../config/config.js';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.mailingUser,
        pass: config.mailingPassword
    }
});

export const sendEmail = async (to, subject, html) => {
    return await transporter.sendMail({
        from: `Ecommerce <${config.mailingUser}>`,
        to,
        subject,
        html
    });
};