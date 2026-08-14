// app/api/send-email/route.ts
import { NextResponse } from "next/server";
import { transporter } from "@/lib/nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    // Field check
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields (name, email, message) are required" },
        { status: 400 }
      );
    }

    // Mail options
    const mailOptions = {
      from: process.env.EMAIL_USER, // আপনার নিবন্ধিত জিমেইল
      to: process.env.EMAIL_USER,   // যেখানে ইমেইলটি রিসিভ করতে চান
      replyTo: email,               // ইউজারকে রিপ্লাই দেওয়ার জন্য
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h3>New Contact Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    // Send Mail
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Email sent successfully!" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Nodemailer Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send email" },
      { status: 500 }
    );
  }
}