export const prerender = false;

import type { APIRoute } from "astro";
import Stripe from "stripe";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function getFirestoreDb() {
  if (getApps().length === 0) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  }
  return getFirestore();
}

export const POST: APIRoute = async ({ request }) => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secretKey || !webhookSecret) {
    return new Response(JSON.stringify({ error: "Missing Stripe configuration" }), { status: 500 });
  }

  const stripe = new Stripe(secretKey);
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return new Response(JSON.stringify({ error: "Missing signature" }), { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    return new Response(JSON.stringify({ error: `Webhook signature verification failed: ${err.message}` }), { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata || {};

    const db = getFirestoreDb();
    await db.collection("bookings").add({
      tour: metadata.tour || "Unknown",
      guestName: metadata.guestName || "Unknown",
      date: metadata.date || "Unknown",
      sharedCount: Number(metadata.sharedCount) || 0,
      soloCount: Number(metadata.soloCount) || 0,
      email: session.customer_details?.email || "",
      amount: (session.amount_total || 0) / 100,
      currency: session.currency || "eur",
      status: "paid",
      stripeSessionId: session.id,
      createdAt: new Date(),
    });
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
};
