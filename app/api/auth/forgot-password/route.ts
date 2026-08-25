import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const rate = await checkRateLimit(`forgot-password:${ip}`, 3, 60000);
    if (!rate.allowed) {
      return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
    }

    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (user) {
      const token = crypto.randomUUID();
      const expires = new Date(Date.now() + 60 * 60 * 1000);

      await prisma.passwordResetToken.create({
        data: {
          token,
          userId: user.id,
          expires,
        },
      });

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://holocard.app";
      const resetUrl = `${baseUrl}/reset-password?token=${token}`;

      await sendEmail({
        to: user.email,
        subject: "Reset your HoloCard password",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #1a1a1a;">Password Reset Request</h1>
            <p style="color: #666; line-height: 1.6;">
              Hi ${user.name || "there"}, we received a request to reset your password.
            </p>
            <p style="color: #666; line-height: 1.6;">
              Click the button below to set a new password. This link expires in 1 hour.
            </p>
            <a href="${resetUrl}"
               style="display: inline-block; background: #2563EB; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">
              Reset Password
            </a>
            <p style="color: #999; font-size: 12px; margin-top: 24px;">
              If you didn't request this, you can safely ignore this email.
            </p>
          </div>
        `,
        text: `Reset your password: ${resetUrl}`,
      });
    }

    return NextResponse.json({
      message:
        "If an account exists with that email, you'll receive a reset link.",
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
