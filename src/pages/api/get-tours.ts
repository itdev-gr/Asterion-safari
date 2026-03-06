export const prerender = false;

import type { APIRoute } from "astro";
import { adminDb } from "../../lib/firebase-admin";

export const GET: APIRoute = async () => {
  try {
    const snapshot = await adminDb
      .collection("tours")
      .where("active", "==", true)
      .orderBy("order", "asc")
      .get();

    const tours = snapshot.docs.map((doc) => ({
      id: doc.id,
      slug: doc.id,
      ...doc.data(),
    }));

    return new Response(JSON.stringify(tours), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};
