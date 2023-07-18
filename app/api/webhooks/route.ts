import Stripe from "stripe";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { stripe } from "@/libs/stripe";
import {
  upsertPrice,
  upsertProduct,
  subscriptionStatusChangeManager,
} from "@/libs/supabaseStripe";
import { env } from "@/libs/envParser";

const eventsSet = new Set([
  "product.created",
  "product.updated",
  "price.created",
  "price.updated",
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export async function POST(req: Request) {
  const body = await req.text();
  const signatureHeader = headers().get("Stripe-Signature");

  const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;
  try {
    if (!signatureHeader || !webhookSecret) return;
    event = stripe.webhooks.constructEvent(
      body,
      signatureHeader,
      webhookSecret
    );
  } catch (error: any) {
    return new NextResponse(`Webhook error: ${error.message}`, { status: 400 });
  }

  if (eventsSet.has(event.type)) {
    try {
      switch (event.type) {
        case "product.created":
        case "product.updated":
          await upsertProduct(event.data.object as Stripe.Product);
          break;
        case "price.created":
        case "price.updated":
          await upsertPrice(event.data.object as Stripe.Price);
          break;
        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          const sub = event.data.object as Stripe.Subscription;
          await subscriptionStatusChangeManager(
            sub.id,
            sub.customer as string,
            event.type === "customer.subscription.created"
          );
          break;
        case "checkout.session.completed":
          const session = event.data.object as Stripe.Checkout.Session;
          if (session.mode === "subscription") {
            const subscriptionId = session.subscription;
            await subscriptionStatusChangeManager(
              subscriptionId as string,
              session.customer as string,
              true
            );
          }
          break;
        default:
          throw new Error("Unhandled Stripe Webhook event");
      }
    } catch (error: any) {
      return new NextResponse(`Webhook error: ${error.message}`, {
        status: 400,
      });
    }
  }
  return NextResponse.json({ received: true }, { status: 200 });
}
