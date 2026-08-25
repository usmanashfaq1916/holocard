interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    console.log("Email skipped (no RESEND_API_KEY):", options.subject);
    return false;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "HoloCard <noreply@holocard.app>",
        to: [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
}

export async function sendWelcomeEmail(email: string, name: string): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: "Welcome to HoloCard!",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1a1a1a;">Welcome to HoloCard, ${name}!</h1>
        <p style="color: #666; line-height: 1.6;">
          You're all set to create your first AR-powered business card. Here's what you can do:
        </p>
        <ul style="color: #666; line-height: 1.8;">
          <li>Create your digital business card</li>
          <li>Design a physical card with our designer</li>
          <li>Generate AR experiences from your card</li>
          <li>Share via QR code or direct link</li>
        </ul>
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || "https://holocard.app"}/dashboard/cards/new"
           style="display: inline-block; background: #2563EB; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">
          Create Your First Card
        </a>
        <p style="color: #999; font-size: 12px; margin-top: 24px;">
          Need help? Reply to this email or visit our docs.
        </p>
      </div>
    `,
  });
}

export async function sendCardPublishedEmail(
  email: string,
  name: string,
  cardName: string,
  cardSlug: string
): Promise<boolean> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://holocard.app";
  return sendEmail({
    to: email,
    subject: `"${cardName}" is now live!`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1a1a1a;">Your card is published!</h1>
        <p style="color: #666; line-height: 1.6;">
          Hi ${name}, your card "${cardName}" is now live and ready to share.
        </p>
        <div style="background: #f8fafc; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="margin: 0; color: #666; font-size: 14px;">Card URL:</p>
          <a href="${baseUrl}/card/${cardSlug}" style="color: #2563EB; word-break: break-all;">
            ${baseUrl}/card/${cardSlug}
          </a>
        </div>
        <div style="background: #f8fafc; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="margin: 0; color: #666; font-size: 14px;">AR Experience:</p>
          <a href="${baseUrl}/ar/${cardSlug}" style="color: #2563EB; word-break: break-all;">
            ${baseUrl}/ar/${cardSlug}
          </a>
        </div>
        <a href="${baseUrl}/dashboard/cards"
           style="display: inline-block; background: #2563EB; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          View Dashboard
        </a>
      </div>
    `,
  });
}

export async function sendContactSaveEmail(
  email: string,
  name: string,
  contactName: string,
  cardName: string
): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: `${contactName} saved your HoloCard!`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1a1a1a;">New contact save!</h1>
        <p style="color: #666; line-height: 1.6;">
          Hi ${name}, <strong>${contactName}</strong> just saved your contact from "${cardName}".
        </p>
        <p style="color: #666; line-height: 1.6;">
          Your AR business card is working! Keep sharing to grow your network.
        </p>
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || "https://holocard.app"}/dashboard/analytics"
           style="display: inline-block; background: #2563EB; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          View Analytics
        </a>
      </div>
    `,
  });
}
