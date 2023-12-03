import { type NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

export async function POST(request: NextRequest) {
    const { email, name, message } = await request.json();

    const transport = nodemailer.createTransport({
        host: "tixxxtok.com",
        port: 465,
        secure: true, // Use SSL/TLS
        auth: {
            user: "info@tixxxtok.com", // Update with your email address
            pass: "&07xR6yVP7^Cu6ZD", // Update with your email password
        },
    });

    const mailOptions: Mail.Options = {
        from: "info@tixxxtok.com",
        to: "info@tixxxtok.com",
        // cc: email, (uncomment this line if you want to send a copy to the sender)
        subject: `Message from ${name} (${email})`,
        text: message,
    };

    const sendMailPromise = () =>
        new Promise<string>((resolve, reject) => {
            transport.sendMail(mailOptions, function (err) {
                if (!err) {
                    resolve('Email sent');
                } else {
                    console.error('Error sending email:', err);
                    reject(err.message);
                }
            });
        });

    try {
        await sendMailPromise();
        console.log('Email sent successfully');
        return NextResponse.json({ message: 'Email sent' });
    } catch (err) {
        console.error('Error sending email:', err);
        return NextResponse.json({ error: err }, { status: 500 });
    }
}