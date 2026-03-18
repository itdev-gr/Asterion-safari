export const prerender = false;

import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

export const POST: APIRoute = async ({ request }) => {
  const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return new Response(JSON.stringify({ error: "Supabase not configured" }), { status: 500 });
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  try {
    const { url } = await request.json();
    if (!url) {
      return new Response(JSON.stringify({ error: "Missing url" }), { status: 400 });
    }

    const bucketPath = url.split("/storage/v1/object/public/images/")[1];
    if (!bucketPath) {
      return new Response(JSON.stringify({ error: "Invalid URL" }), { status: 400 });
    }

    const { error } = await supabase.storage.from("images").remove([bucketPath]);
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
