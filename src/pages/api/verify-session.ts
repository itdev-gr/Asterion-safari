export const prerender = false;

import type { APIRoute } from "astro";
import Stripe from "stripe";

export const POST: APIRoute = async ({ request }) => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return new Response(JSON.stringify({ error: "Stripe not configured" }), { status: 500 });
  }

  const stripe = new Stripe(secretKey);

  try {
    const { sessionId } = await request.json();
    if (!sessionId) {
      return new Response(JSON.stringify({ error: "Missing session ID" }), { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return new Response(JSON.stringify({ error: "Payment not completed" }), { status: 400 });
    }

    const metadata = session.metadata || {};

    return new Response(JSON.stringify({
      tour: metadata.tour || "Unknown",
      guestName: metadata.guestName || "Unknown",
      date: metadata.date || "Unknown",
      sharedCount: Number(metadata.sharedCount) || 0,
      soloCount: Number(metadata.soloCount) || 0,
      email: session.customer_details?.email || "",
      amount: (session.amount_total || 0) / 100,
      currency: session.currency || "eur",
      stripeSessionId: session.id,
    }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
