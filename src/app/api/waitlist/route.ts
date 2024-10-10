import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || "tchimhan@u.rochester.edu",
        pass: process.env.SMTP_PASS || "lsod owkj fypx oiqj",
      },
    });

    // Email content
    const emailContent = `
New CarOS Waitlist Signup! 🚗

Name: ${name}
Email: ${email}
Message: ${message || "No message provided"}

Timestamp: ${new Date().toISOString()}

---
This is an automated notification from your CarOS waitlist.
    `.trim();

    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
        🚗 New CarOS Waitlist Signup!
      </h2>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message || "No message provided"}</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
      </div>
      
      <p style="color: #666; font-size: 14px; margin-top: 30px;">
        This is an automated notification from your CarOS waitlist.
      </p>
    </div>
    `;

    // Send email
    await transporter.sendMail({
      from: `"CarOS Waitlist" <${
        process.env.SMTP_USER || "kevinchimhanda@gmail.com"
      }>`,
      to: process.env.YOUR_EMAIL || "kevinchimhanda@gmail.com",
      subject: "🚗 New CarOS Waitlist Signup!",
      text: emailContent,
      html: htmlContent,
    });

    console.log("✅ Email sent successfully for waitlist signup:", email);

    return NextResponse.json(
      { message: "Successfully joined waitlist" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Waitlist signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
