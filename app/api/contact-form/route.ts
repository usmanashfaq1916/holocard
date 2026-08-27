import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/email";
import { CONTACT_EMAIL } from "@/lib/config";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const { allowed } = await checkRateLimit(`contact:${ip}`, 5, 60000);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const body = await req.json();
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
    }

    const emailSent = await sendEmail({
      to: CONTACT_EMAIL,
      subject: `Contact Form: ${body.name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1a1a1a;">New Contact Form Submission</h2>
          <p style="color: #666;"><strong>Name:</strong> ${body.name}</p>
          <p style="color: #666;"><strong>Email:</strong> ${body.email}</p>
          ${body.subject ? `<p style="color: #666;"><strong>Subject:</strong> ${body.subject}</p>` : ""}
          <div style="background: #f8fafc; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <p style="margin: 0; color: #666; font-size: 14px;"><strong>Message:</strong></p>
            <p style="color: #333; line-height: 1.6;">${body.message}</p>
          </div>
          <p style="color: #999; font-size: 12px;">Reply to ${body.email} to respond.</p>
        </div>
      `,
      text: `New contact form submission from ${body.name} (${body.email}): ${body.message}`,
    });

    return NextResponse.json({
      success: true,
      message: emailSent
        ? "Message sent. We'll get back to you soon."
        : "Message received. We'll get back to you soon.",
    });
  } catch {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
