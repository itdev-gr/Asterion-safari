# Βίντεο Hero

Για να δείχνει το site **στο Vercel όπως στο localhost**, το βίντεο πρέπει να είναι μέσα στο repo.

1. Βάλε εδώ το αρχείο βίντεο με ακριβώς αυτό το όνομα:
   **`aerial-view-of-atv-team-driving-slow-through-the-f-2025-12-17-03-40-13-utc.mov`**
   (ή κάντο convert σε `.mp4` και πες στο dev να αλλάξει το path στο Hero)

2. Κάνε **commit και push** το αρχείο:
   - `git add public/photo/` (και το βίντεο)
   - `git commit -m "Add hero video"`
   - `git push`

Μετά το επόμενο deploy, το Vercel θα έχει το ίδιο βίντεο με το localhost.

**Σημείωση:** Αν το αρχείο είναι >100MB, το GitHub δεν το δέχεται. Τότε ανέβασέ το αλλού (π.χ. Vercel Blob, Cloudinary) και όρισε στο Vercel το env **`PUBLIC_HERO_VIDEO_URL`** με το URL του βίντεου.
