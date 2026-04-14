export const prerender = false;

import type { APIRoute } from "astro";
import Stripe from "stripe";
import { getTourBySlug } from "../../lib/firebase-server";
import { adminDb } from "../../lib/firebase-admin";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { applyDiscountCents, findDiscountForDate, type Discount, type Extra } from "../../lib/discounts";

const firebaseConfig = {
  apiKey: "AIzaSyAw-LXmOydyF-C-8m78BWASHsPyS8RlA1k",
  authDomain: "asterion-772c8.firebaseapp.com",
  projectId: "asterion-772c8",
  storageBucket: "asterion-772c8.firebasestorage.app",
  messagingSenderId: "650122476425",
  appId: "1:650122476425:web:edb2edd868f4136cd47f58",
};

async function getActiveDiscounts(): Promise<Discount[]> {
  try {
    if (adminDb) {
      const snap = await adminDb
        .collection("discounts")
        .where("active", "==", true)
        .get();
      return snap.docs.map((d: any) => ({ id: d.id, ...(d.data() as any) })) as Discount[];
    }
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const snap = await getDocs(query(collection(db, "discounts"), where("active", "==", true)));
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Discount[];
  } catch {
    return [];
  }
}

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
    const {
      tourSlug,
      sharedCount = 0,
      soloCount = 0,
      guestName,
      date,
      kidsCount = 0,
      extras: requestedExtras = [],
      pickup = "",
    } = body;

    const sc = Math.max(0, Number(sharedCount) || 0);
    const so = Math.max(0, Number(soloCount) || 0);
    const kc = Math.max(0, Number(kidsCount) || 0);

    if (sc + so === 0) {
      return new Response(JSON.stringify({ error: "No participants selected" }), { status: 400 });
    }

    const tourData = (await getTourBySlug(tourSlug)) as any;
    if (!tourData) {
      return new Response(JSON.stringify({ error: "Tour not found" }), { status: 404 });
    }
    const rawCents = Number(tourData.priceCents);
    const fallbackCents = Math.round(Number(tourData.price ?? 0) * 100);
    const pricePerUnit = Number.isFinite(rawCents) && rawCents > 0 ? rawCents : fallbackCents;
    if (!Number.isFinite(pricePerUnit) || pricePerUnit <= 0) {
      return new Response(JSON.stringify({ error: "Tour is missing a valid price." }), { status: 400 });
    }
    const tourName = tourData.title as string;
    const tourExtras: Extra[] = Array.isArray(tourData.extras)
      ? (tourData.extras as Extra[]).filter((e) => e && e.id && e.priceCents !== undefined && e.active !== false)
      : [];
    const extrasById = new Map(tourExtras.map((e) => [e.id, e]));

    const discounts = await getActiveDiscounts();
    const discount = findDiscountForDate(date, discounts);
    const discountPercent = discount?.percent ?? 0;

    const adjustedUnit = applyDiscountCents(pricePerUnit, discountPercent);
    const discountSuffix = discountPercent > 0 && discount ? ` (${discountPercent}% off – ${discount.name})` : "";

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    if (sc > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: `${tourName} - Shared Quad Bike${discountSuffix}`,
            description: `Guest: ${guestName} | Date: ${date} | Two persons sharing one quad.`,
          },
          unit_amount: adjustedUnit,
        },
        quantity: sc,
      });
    }

    if (so > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: `${tourName} - Solo Riding${discountSuffix}`,
            description: `Guest: ${guestName} | Date: ${date} | One person, one quad.`,
          },
          unit_amount: adjustedUnit,
        },
        quantity: so,
      });
    }

    const adultCount = sc * 2 + so;
    const quadCount = sc + so;
    const resolvedExtras: Array<{
      id: string;
      title: string;
      unit: string;
      unitPriceCents: number;
      quantity: number;
      lineTotalCents: number;
    }> = [];

    // Vehicle upgrade cap across the upgrade group
    let vehicleUpgradeQtyTotal = 0;

    for (const item of Array.isArray(requestedExtras) ? requestedExtras : []) {
      const id = String(item?.id || "").trim();
      const qty = Math.max(0, Math.floor(Number(item?.quantity) || 0));
      if (!id || qty === 0) continue;
      const extra = extrasById.get(id);
      if (!extra) continue;

      let quantity = qty;
      let lineQty = qty;
      let description = extra.description || "";

      if (extra.unit === "adult") {
        // Toggle semantics: qty > 0 means "include"; bill per billable adult
        const billable = extra.kidsFree ? adultCount : adultCount + kc;
        if (billable === 0) continue;
        quantity = 1;
        lineQty = billable;
        description = `${description || extra.title} – ${billable} ${billable === 1 ? "person" : "people"}${extra.kidsFree ? " (kids free)" : ""}`;
      } else if (extra.unit === "vehicle" && extra.upgradeGroup === "vehicle") {
        const allowed = Math.max(0, quadCount - vehicleUpgradeQtyTotal);
        quantity = Math.min(qty, allowed);
        if (quantity === 0) continue;
        lineQty = quantity;
        vehicleUpgradeQtyTotal += quantity;
      } else {
        quantity = qty;
        lineQty = qty;
      }

      const unitPriceCents = Number(extra.priceCents);
      const lineTotalCents = unitPriceCents * lineQty;

      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: extra.title,
            description: description || undefined,
          },
          unit_amount: unitPriceCents,
        },
        quantity: lineQty,
      });

      resolvedExtras.push({
        id: extra.id,
        title: extra.title,
        unit: extra.unit,
        unitPriceCents,
        quantity,
        lineTotalCents,
      });
    }

    if (lineItems.length === 0) {
      return new Response(JSON.stringify({ error: "No items selected" }), { status: 400 });
    }

    const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || new URL(request.url).host;
    const proto = request.headers.get("x-forwarded-proto") || "https";
    const origin = `${proto}://${host}`;

    // Stripe metadata values must be strings and ≤500 chars each.
    // Pack a compact array and drop trailing items if it would overflow.
    const compactExtras = resolvedExtras.map((e) => ({ i: e.id, q: e.quantity, c: e.lineTotalCents }));
    let extrasSummary = JSON.stringify(compactExtras);
    while (extrasSummary.length > 500 && compactExtras.length > 0) {
      compactExtras.pop();
      extrasSummary = JSON.stringify(compactExtras);
    }

    const baseCents = (sc + so) * pricePerUnit;
    const discountedBaseCents = applyDiscountCents(baseCents, discountPercent);

    const metadata: Record<string, string> = {
      tour: tourName.slice(0, 480),
      guestName: String(guestName).slice(0, 480),
      date: String(date),
      sharedCount: String(sc),
      soloCount: String(so),
      kidsCount: String(kc),
      discountPercent: String(discountPercent),
      discountName: (discount?.name ?? "").slice(0, 100),
      baseCents: String(baseCents),
      discountedBaseCents: String(discountedBaseCents),
      extrasSummary,
    };
    if (pickup) metadata.pickup = String(pickup).slice(0, 480);

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
      metadata,
    });

    return new Response(JSON.stringify({ url: session.url }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};
