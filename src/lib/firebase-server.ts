/**
 * Server-side Firestore access that works with or without admin credentials.
 * Falls back to the client SDK (public reads) when admin creds are missing.
 */
import { adminDb } from "./firebase-admin";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAw-LXmOydyF-C-8m78BWASHsPyS8RlA1k",
  authDomain: "asterion-772c8.firebaseapp.com",
  projectId: "asterion-772c8",
  storageBucket: "asterion-772c8.firebasestorage.app",
  messagingSenderId: "650122476425",
  appId: "1:650122476425:web:edb2edd868f4136cd47f58",
};

function getClientDb() {
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  return getFirestore(app);
}

/**
 * Fetch all active tours ordered by `order` field.
 */
export async function getActiveTours() {
  if (adminDb) {
    const snapshot = await adminDb
      .collection("tours")
      .where("active", "==", true)
      .orderBy("order", "asc")
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, slug: doc.id, ...doc.data() }));
  }

  // Fallback: client SDK
  const db = getClientDb();
  const q = query(
    collection(db, "tours"),
    where("active", "==", true),
    orderBy("order", "asc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, slug: d.id, ...d.data() }));
}

/**
 * Fetch all gallery images ordered by `order` field.
 */
export async function getGalleryImages() {
  if (adminDb) {
    const snapshot = await adminDb
      .collection("gallery")
      .orderBy("order", "asc")
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  // Fallback: client SDK
  const db = getClientDb();
  const q = query(collection(db, "gallery"), orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Fetch a single tour by slug (document ID).
 */
export async function getTourBySlug(slug: string) {
  if (adminDb) {
    const docSnap = await adminDb.collection("tours").doc(slug).get();
    if (!docSnap.exists) return null;
    return { slug: docSnap.id, ...docSnap.data() };
  }

  // Fallback: client SDK
  const db = getClientDb();
  const docSnap = await getDoc(doc(db, "tours", slug));
  if (!docSnap.exists()) return null;
  return { slug: docSnap.id, ...docSnap.data() };
}
