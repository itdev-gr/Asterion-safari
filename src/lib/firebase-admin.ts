import { initializeApp as initializeAdminApp, getApps as getAdminApps, cert } from "firebase-admin/app";
import { getFirestore as getAdminFirestore } from "firebase-admin/firestore";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

const hasAdminCredentials = !!(projectId && clientEmail && privateKey);

if (hasAdminCredentials && getAdminApps().length === 0) {
  initializeAdminApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

export const adminDb = hasAdminCredentials ? getAdminFirestore() : null;
