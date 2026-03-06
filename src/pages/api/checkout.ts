export const prerender = false;

import type { APIRoute } from "astro";
import Stripe from "stripe";
import { adminDb } from "../../lib/firebase-admin";

export const POST: APIRoute = async ({ request }) => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return new Response(
      JSON.stringify({ error: "Stripe secret key is not configured" }),
      { status: 500 }
    );
  }
  const stripe = new Stripe(secretKey);
  try {
    const body = await request.json();
    const { tourSlug, sharedCount, soloCount, guestName, date } = body;

    // Fetch tour from Firestore for pricing
    const tourDoc = await adminDb.collection("tours").doc(tourSlug).get();
    if (!tourDoc.exists) {
      return new Response(JSON.stringify({ error: "Tour not found" }), { status: 404 });
    }
    const tourData = tourDoc.data()!;
    const pricePerUnit = tourData.priceCents;
    const tourName = tourData.title;

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    if (sharedCount > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: `${tourName} - Shared Quad Bike`,
            description: `Guest: ${guestName} | Date: ${date} | Booking for two persons, one quad bike for shared use.`,
          },
          unit_amount: pricePerUnit,
        },
        quantity: sharedCount,
      });
    }

    if (soloCount > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: `${tourName} - Solo Riding`,
            description: `Guest: ${guestName} | Date: ${date} | Booking for one person, one quad bike for individual use.`,
          },
          unit_amount: pricePerUnit,
        },
        quantity: soloCount,
      });
    }

    if (lineItems.length === 0) {
      return new Response(JSON.stringify({ error: "No items selected" }), {
        status: 400,
      });
    }

    const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || new URL(request.url).host;
    const proto = request.headers.get("x-forwarded-proto") || "https";
    const origin = `${proto}://${host}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_creation: "always",
      payment_intent_data: {
        description: `${tourName} booking for ${guestName} on ${date}`,
      },
      success_url: `${origin}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/tours/${tourSlug}`,
      metadata: {
        tour: tourName,
        guestName,
        date,
        sharedCount: String(sharedCount),
        soloCount: String(soloCount),
      },
    });

    return new Response(JSON.stringify({ url: session.url }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};
