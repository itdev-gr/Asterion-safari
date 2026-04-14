/**
 * One-off: merge default extras onto existing tours in Firestore.
 * Uses Application Default Credentials (firebase CLI login).
 *
 * Run:
 *   GOOGLE_APPLICATION_CREDENTIALS=~/.config/firebase/<user>_application_default_credentials.json \
 *   node scripts/seed-extras.mjs
 */
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

initializeApp({
  credential: applicationDefault(),
  projectId: "asterion-772c8",
});

const db = getFirestore();

const defaultExtras = [
  {
    id: "lunch",
    title: "Local Lunch on the Island",
    description: "Traditional Cretan meal (main dish, salad, bread & drink) at a local tavern after the ride.",
    priceCents: 1500,
    unit: "person",
    active: true,
  },
  {
    id: "monastery",
    title: "Kera Monastery Entry Ticket",
    description: "Entry to Kera Monastery. Kids under 12 are free.",
    priceCents: 200,
    unit: "adult",
    kidsFree: true,
    active: true,
  },
  {
    id: "premium-upgrade",
    title: "Premium Vehicle",
    description: "450 cc ATV — more power, comfort, and better handling.",
    priceCents: 1500,
    unit: "vehicle",
    upgradeGroup: "vehicle",
    active: true,
  },
  {
    id: "exclusive-upgrade",
    title: "Exclusive Vehicle",
    description: "650 cc V2 with electric power steering — top-tier quad for maximum performance.",
    priceCents: 2500,
    unit: "vehicle",
    upgradeGroup: "vehicle",
    active: true,
  },
  {
    id: "camera-pack",
    title: "Action Camera Pack",
    description: "DJI Osmo4 action camera with SD card, 3 batteries, selfie-stick, and mounts.",
    priceCents: 2000,
    unit: "camera",
    active: true,
  },
];

const targetSlugs = ["day-tour", "evening-tour"];

async function run() {
  for (const slug of targetSlugs) {
    const ref = db.collection("tours").doc(slug);
    const snap = await ref.get();
    if (!snap.exists) {
      console.log(`- skip: ${slug} (doc does not exist)`);
      continue;
    }
    await ref.set(
      { extras: defaultExtras, updatedAt: FieldValue.serverTimestamp() },
      { merge: true }
    );
    console.log(`✓ patched extras on ${slug}`);
  }
  console.log("Done.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
