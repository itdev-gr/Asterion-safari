export const prerender = false;

import type { APIRoute } from "astro";
import { getActiveTours } from "../../lib/firebase-server";

export const GET: APIRoute = async () => {
  try {
    const tours = await getActiveTours();

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
