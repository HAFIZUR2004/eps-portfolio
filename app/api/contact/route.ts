import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, whatsapp, country, buildingType, message, services, file } = body;

    const recipientEmail = process.env.CONTACT_EMAIL;
    if (!recipientEmail) {
      throw new Error('CONTACT_EMAIL is not set in environment variables');
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const servicesText = services.length > 0 ? services.join(', ') : 'None selected';

    const mailOptions: any = {
      from: `"Contact Form" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: `New Quote Request from ${fullName}`,
      html: `
        <h2>New Quote Request</h2>
        <p><strong>Full Name:</strong> ${fullName}</p>
        <p><strong>WhatsApp:</strong> ${whatsapp || 'Not provided'}</p>
        <p><strong>Country:</strong> ${country || 'Not provided'}</p>
        <p><strong>Building Type:</strong> ${buildingType || 'Not provided'}</p>
        <p><strong>Services Required:</strong> ${servicesText}</p>
        <p><strong>File Uploaded:</strong> ${file ? file.name : 'No file'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr />
        <p style="font-size:12px; color:#666;">Sent from your website contact form</p>
      `,
    };

    if (file && file.base64) {
      const base64Data = file.base64.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');

      mailOptions.attachments = [
        {
          filename: file.name,
          content: buffer,
        },
      ];
    }

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { success: true, message: 'Your message has been sent successfully!' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to send message.' },
      { status: 500 }
    );
  }
}