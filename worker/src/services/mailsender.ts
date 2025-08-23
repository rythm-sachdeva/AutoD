import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();



export const sendEmail = async(to: string,subject:string,body:string)=>{
    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SENDER_ADDRESS,
            pass: process.env.APP_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.SENDER_ADDRESS,
        to,
        subject,
        text: body,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}