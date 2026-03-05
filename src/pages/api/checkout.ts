export const prerender = false;

import type { APIRoute } from "astro";
import Stripe from "stripe";

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { tour, sharedCount, soloCount, guestName, date } = body;

    const pricePerUnit = tour === "evening" ? 13000 : 16000; // cents
    const tourName = tour === "evening" ? "Evening Tour" : "Day Tour";

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

    const origin = new URL(request.url).origin;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_creation: "always",
      payment_intent_data: {
        description: `${tourName} booking for ${guestName} on ${date}`,
      },
      success_url: `${origin}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${tour === "evening" ? "evening-tour" : "day-tour"}`,
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
