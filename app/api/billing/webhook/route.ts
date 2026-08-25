import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Stripe = require("stripe").default;
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-07-29.dahlia",
  });
}

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const body = await request.text();
  const sig = request.headers.get("stripe-signature") || "";

  let event: { type: string; data: { object: Record<string, unknown> & { id?: string; subscription?: string; customer?: string; metadata?: Record<string, string>; status?: string } } };
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const obj = event.data.object;
      const userId = obj.metadata?.userId;
      const plan = obj.metadata?.plan;

      if (userId && plan && ["FREE", "PRO", "BUSINESS"].includes(plan)) {
        await prisma.user.update({
          where: { id: userId },
          data: { plan: plan as "FREE" | "PRO" | "BUSINESS" },
        });

        await prisma.subscription.create({
          data: {
            userId,
            stripeSubscriptionId: obj.subscription as string,
            stripeCustomerId: obj.customer as string,
            plan: plan as "FREE" | "PRO" | "BUSINESS",
            status: "active",
          },
        });
      }
      break;
    }

    case "customer.subscription.updated": {
      const obj = event.data.object;
      const subStatus = obj.status === "active" ? "active" : "canceled";

      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: obj.id },
        data: { status: subStatus },
      });

      if (subStatus === "canceled") {
        const sub = await prisma.subscription.findFirst({
          where: { stripeSubscriptionId: obj.id },
        });
        if (sub) {
          await prisma.user.update({
            where: { id: sub.userId },
            data: { plan: "FREE" },
          });
        }
      }
      break;
    }

    case "customer.subscription.deleted": {
      const obj = event.data.object;
      const sub = await prisma.subscription.findFirst({
        where: { stripeSubscriptionId: obj.id },
      });
      if (sub) {
        await prisma.subscription.update({
          where: { id: sub.id },
          data: { status: "canceled" },
        });
        await prisma.user.update({
          where: { id: sub.userId },
          data: { plan: "FREE" },
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
