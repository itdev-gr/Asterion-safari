/**
 * One-time seed script to populate tours collection in Firestore.
 * Run: node seed-tours.mjs
 * Requires env vars: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
 */
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

const db = getFirestore();

const tours = [
  {
    slug: "day-tour",
    title: "Quad Safari Off-Road Tour with Hotel Transfer",
    shortTitle: "Day Tour",
    price: 160,
    priceCents: 16000,
    cardImage: "https://asterionsafari.com/wp-content/uploads/2022/05/IMG-20230623-WA0002-3-1-450x300.jpg",
    images: [
      { src: "https://asterionsafari.com/wp-content/uploads/2024/03/IMG-20230623-WA0002-2.jpg", alt: "Quad Safari Tour" },
      { src: "https://asterionsafari.com/wp-content/uploads/2024/03/IMG-20230625-WA0005.jpg", alt: "Quad Safari" },
      { src: "https://asterionsafari.com/wp-content/uploads/2024/03/IMG-20230529-WA0001.jpg", alt: "Quad Safari" },
      { src: "https://asterionsafari.com/wp-content/uploads/2024/03/IMG-20230623-WA0005.jpg", alt: "Quad Safari" },
      { src: "https://asterionsafari.com/wp-content/uploads/2024/03/IMG-20230523-WA0000.jpg", alt: "Quad Safari" },
    ],
    duration: "4,5 Hours",
    cancellation: "Up to 24 Hours",
    groupSize: "10 people",
    languages: "English",
    aboutText: "Embark on an unforgettable guided quad tour experience and speed through the Cretan countryside. Get to know village life as you discover everyday life on this special island. Take part in an experience which passes through picturesque Cretan villages. Take in the panoramic views and learn all about different aspects of Cretan life from your guide. Enjoy stops at Krasi, Kera Monastery, Potamies, and Avdou. Get under the skin of local culture as you visit Aposelemis Dam, Sfendyli, and Mochos. Learn all about the olive oil production process as part of your experience.",
    knowBeforeYouGo: [
      "If you book for 1 adult 1 quad is assigned, 2 adults get 1 quad to share, 3 adults get 2 quads, and so on",
      "If you want 1 quad for each person for solo driving, please make separate bookings for each adult",
      "Drivers must hold a valid car driver's license, along with an ID card in physical form",
      "Children over 6 years old can share the quad with an adult",
      "The activity provider reserves the right to change routes and stops for safety reasons",
    ],
    pickupLocations: "Sissi, Milatos, Malia, Stalida, Chersonissos, Koutouloufari, Piskopiano, Anissaras, Analipsi, Gouves, Kokkini Hani",
    highlights: [
      "Feel the adrenaline thrill of a quad bike tour through the heart of Crete",
      "Immerse yourself in local life with stops at authentic island villages",
      "Follow your guide down dirt roads and visit an olive oil factory for a tasting",
      "Marvel at the sight of Aposelemis Dam and the famous Sfedyli sunken Village",
      "Feast your eyes on the charming architecture of Mochos and Mallia's Old Town",
    ],
    included: [
      "Hotel pickup and drop-off",
      "Quad/ATV",
      "Equipment",
      "Insurance",
      "Guide",
      "Fuel",
      "Mineral water",
    ],
    excluded: ["Private expenses"],
    faq: [
      { question: "Is a driver's license required?", answer: "Yes, a valid car driving license is required. Additionally, please remember to bring your ID card." },
      { question: "What should I bring with me?", answer: "Face Mask, Comfortable walking shoes, Sunscreen, Hat & Sunglasses, Camera" },
      { question: "Is the trip available in my preferred language?", answer: "Yes, upon request, the trip can be conducted in your preferred language." },
      { question: "Free of charge Pick-Up areas", answer: "Sissi, Milatos, Malia, Stalida, Chersonissos, Koutouloufari, Piskopiano, Anissaras, Analipsi, Gouves, Kokkini Hani" },
    ],
    whyBookWithUs: [
      { title: "Expertly Guided Tours", description: "Join us for an unforgettable quad bike safari, led by seasoned guides." },
      { title: "Tailored Adventures", description: "Discover Crete's rugged landscapes tailored to suit adventurers of all levels." },
      { title: "Top-notch Equipment", description: "From safety gear to comfortable seating, we prioritize your comfort and safety." },
    ],
    contact: {
      name: "asterionquads",
      initials: "AQ",
      memberSince: "2024",
      email: "asterionquads@gmail.com",
      website: "www.asterionsafari.com",
      phone: "+30 6976339969",
    },
    shortDescription: "Embark on an unforgettable guided quad tour experience and speed through the Cretan countryside. Get to know...",
    longDescription: "In this unforgettable guided quad tour experience starts from Malia, participants will have the opportunity to pass through authentic Cretan villages with panoramic views and learn about different aspects of Cretan life. They will explore widely known destinations with panoramic views such as Krasi, Kera Monastery, Potamies, Avdou, Aposelemis Dam, Sfendyli and Mochos. On this full off road quad safari experience our guest will also have the opportunity to come in touch with the Cretan tradition and the local olive production process. Our day will end with a lot of fun on an amazing dynamic off-road route with wonderful view!",
    mapEmbedUrl: "https://www.google.com/maps/d/embed?mid=1nnzaulUEAUI-tZhsLHAJVIcryFKgRBA",
    order: 1,
    active: true,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  },
  {
    slug: "evening-tour",
    title: "Off-Road Quad Safari Evening Tour with Hotel Transfer",
    shortTitle: "Evening Tour",
    price: 130,
    priceCents: 13000,
    cardImage: "https://asterionsafari.com/wp-content/uploads/2024/03/WhatsApp-Image-2023-12-28-at-13.22.46_3eefa10c-450x300.jpg",
    images: [
      { src: "https://asterionsafari.com/wp-content/uploads/2024/03/WhatsApp-Image-2023-12-28-at-13.22.46_3eefa10c.jpg", alt: "Evening Quad Safari Tour" },
      { src: "https://asterionsafari.com/wp-content/uploads/2022/05/DJI_0918-1-scaled.jpg", alt: "Evening Quad Safari" },
      { src: "https://asterionsafari.com/wp-content/uploads/2024/03/DJI_0951-scaled.jpg", alt: "Evening Quad Safari" },
      { src: "https://asterionsafari.com/wp-content/uploads/2024/03/DJI_0936-scaled.jpg", alt: "Evening Quad Safari" },
      { src: "https://asterionsafari.com/wp-content/uploads/2022/05/IMG-20230630-WA0018.jpg", alt: "Evening Quad Safari" },
    ],
    duration: "4,5 Hours",
    cancellation: "Up to 24 Hours",
    groupSize: "10 people",
    languages: "English",
    aboutText: "Discover the mountains of Crete on a guided quad biking tour. Go offroad and ride along dusty trails as you explore Sisi, Vrahasi, and St. George's Monastery on this unique tour. Start with pickup from your hotel and get set up with your ATV, including an introductory lesson for beginners. Start the adventure by riding uphill to the Omalia Olive Press and taste some olive oil produced onsite. Arrive at the port of Malia and Potamos Beach, and enjoy the views of the surroundings. Continue on the dirt roads to explore the narrow streets of the quaint fishing village of Sisi. Head off-road along a dusty route passing by the traditional village of Vrachasi until you reach the St. George Selinari Monastery. Next, hit the off-road trail again and travel through a lush landscape of vineyards and olive forests to reach the chapel of the Prophet Elias. From here, relax and enjoy breathtaking panoramic views, before returning to the starting point.",
    knowBeforeYouGo: [
      "If you book for 1 adult 1 quad is assigned, 2 adults get 1 quad to share, 3 adults get 2 quads, and so on",
      "If you want 1 quad for each person for solo driving, please make separate bookings for each adult",
      "Drivers must hold a valid car driver's license, along with an ID card in physical form",
      "Children over 6 years old can share the quad with an adult",
      "The activity provider reserves the right to change routes and stops for safety reasons",
    ],
    pickupLocations: "Sissi, Milatos, Malia, Stalida, Chersonissos, Koutouloufari, Piskopiano, Anissaras, Analipsi, Gouves, Kokkini Hani",
    highlights: [
      "Feel the thrill of riding a quad bike as you explore the mountains of Crete",
      "Visit an olive oil factory and learn about the production of this local product",
      "Take in the stunning vistas of the mountains and seaside villages",
      "Explore a route that takes you to the villages of Sissi and Vrachasi",
      "Admire the panoramic views from the chapel of the Prophet Elias",
    ],
    included: [
      "Hotel pickup and drop-off",
      "Quad/ATV",
      "Equipment",
      "Insurance",
      "Guide",
      "Fuel",
      "Mineral water",
      "Entrance Fees",
    ],
    excluded: ["Private expenses"],
    faq: [
      { question: "Is a driver's license required?", answer: "Yes, a valid car driving license is required. Additionally, please remember to bring your ID card." },
      { question: "What should I bring with me?", answer: "Face Mask, Comfortable walking shoes, Sunscreen, Hat & Sunglasses, Camera" },
      { question: "Is the trip available in my preferred language?", answer: "Yes, upon request, the trip can be conducted in your preferred language." },
      { question: "Free of charge Pick-Up areas", answer: "Sissi, Milatos, Malia, Stalida, Chersonissos, Koutouloufari, Piskopiano, Anissaras, Analipsi, Gouves, Kokkini Hani" },
    ],
    whyBookWithUs: [
      { title: "Expertly Guided Tours", description: "Join us for an unforgettable quad bike safari in Crete, led by seasoned guides who know every twist and turn of the terrain." },
      { title: "Tailored Adventures", description: "Discover Crete's rugged landscapes and picturesque villages on our quad bike safaris, tailored to suit adventurers of all levels." },
      { title: "Top-notch Equipment", description: "From safety gear to comfortable seating, we prioritize your comfort and safety throughout the exhilarating journey." },
    ],
    contact: {
      name: "asterionquads",
      initials: "AQ",
      memberSince: "2024",
      email: "asterionquads@gmail.com",
      website: "www.asterionsafari.com",
      phone: "+30 6976339969",
    },
    shortDescription: "Discover the mountains of Crete on a guided quad biking tour. Go offroad and ride along dusty trails...",
    longDescription: "Get back to nature and explore the mountains of Crete on a guided Quad Bike tour from Malia. Journey through the stunning views of traditional mountain, seaside villages and the wildlife nature. This off-road track offers great opportunities for amazing photos and breath-taking scenery. Visit an olive oil factory. Before starting your quad tour experience, get acquainted with your ATV vehicle, including lessons for beginners, by an instructor. Begin by going uphill at Omalia Olive Press to reach your first stop, the Malia Port and Potamos Beach, where you will be greeted by impressive views of the surroundings. Continue on the dirt roads to explore the narrow streets of the quaint fishing village of Sisi.",
    mapEmbedUrl: "https://www.google.com/maps/d/embed?mid=1MfvlQRzeyF7FAqRVbK0CgTUKgQRSQm4",
    order: 2,
    active: true,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  },
];

async function seed() {
  for (const tour of tours) {
    const { slug, ...data } = tour;
    await db.collection("tours").doc(slug).set(data);
    console.log(`Seeded: ${slug}`);
  }
  console.log("Done!");
}

seed().catch(console.error);
