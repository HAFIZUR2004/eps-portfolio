import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, whatsapp, country, buildingType, message, services, file } = body;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const attachments: any[] = [];
    let imagePreviewHtml = `<p><strong>File Uploaded:</strong> ${file?.name || 'No file'}</p>`;

    // ফ্রন্টএন্ড থেকে ফাইল ডেটা পাওয়া গেলে
    if (file && file.base64) {
      const base64Data = file.base64.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      attachments.push({
        filename: file.name || 'uploaded-image.png',
        content: buffer,
        cid: 'uploadedImage', // HTML Inline Image ID
      });

      imagePreviewHtml = `
        <p><strong>Uploaded File Preview:</strong></p>
        <div style="margin: 10px 0;">
          <img src="cid:uploadedImage" alt="Uploaded Preview" style="max-width: 400px; width: 100%; border-radius: 8px; border: 1px solid #e2e8f0; display: block;" />
        </div>
      `;
    }

    const servicesText = Array.isArray(services) && services.length > 0 ? services.join(', ') : 'None selected';

    const mailOptions = {
      from: `"Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
      subject: `New Quote Request from ${fullName || 'Client'}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px;">
          <h2 style="color: #059669; margin-top: 0;">New Quote Request</h2>
          <p><strong>Full Name:</strong> ${fullName || 'Not provided'}</p>
          <p><strong>WhatsApp:</strong> ${whatsapp || 'Not provided'}</p>
          <p><strong>Country:</strong> ${country || 'Not provided'}</p>
          <p><strong>Building Type:</strong> ${buildingType || 'Not provided'}</p>
          <p><strong>Services Required:</strong> ${servicesText}</p>
          
          ${imagePreviewHtml}
          
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; background: #f9fafb; padding: 12px; border-radius: 6px; border: 1px solid #f3f4f6;">${message || 'No message provided'}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size:12px; color:#666;">Sent from your website contact form</p>
        </div>
      `,
      attachments: attachments,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Sent successfully!' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}