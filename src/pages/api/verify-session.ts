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

    let extras: Array<{ id: string; quantity: number; lineTotalCents: number }> = [];
    try {
      const parsed = metadata.extrasSummary ? JSON.parse(metadata.extrasSummary) : [];
      if (Array.isArray(parsed)) {
        extras = parsed.map((e: any) => ({
          id: String(e?.i ?? e?.id ?? ""),
          quantity: Number(e?.q ?? 0) || 0,
          lineTotalCents: Number(e?.c ?? 0) || 0,
        })).filter((e) => e.id);
      }
    } catch {
      extras = [];
    }

    const baseCents = Number(metadata.baseCents) || 0;
    const discountedBaseCents = Number(metadata.discountedBaseCents) || baseCents;
    const discountPercent = Number(metadata.discountPercent) || 0;

    return new Response(JSON.stringify({
      tour: metadata.tour || "Unknown",
      guestName: metadata.guestName || "Unknown",
      date: metadata.date || "Unknown",
      sharedCount: Number(metadata.sharedCount) || 0,
      soloCount: Number(metadata.soloCount) || 0,
      kidsCount: Number(metadata.kidsCount) || 0,
      pickup: metadata.pickup || "",
      discountPercent,
      discountName: metadata.discountName || "",
      baseAmount: baseCents / 100,
      discountedBaseAmount: discountedBaseCents / 100,
      extras,
      email: session.customer_details?.email || "",
      amount: (session.amount_total || 0) / 100,
      currency: session.currency || "eur",
      stripeSessionId: session.id,
    }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
