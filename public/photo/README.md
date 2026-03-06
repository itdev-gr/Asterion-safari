# Βίντεο Hero

Για να δείχνει το site **στο Vercel όπως στο localhost**, το βίντεο πρέπει να είναι μέσα στο repo.

1. Βάλε εδώ το αρχείο βίντεο με όνομα **`hero.mp4`** (MP4). Αν έχεις το αρχείο με άλλο όνομα, μετόνυμασέ το σε `hero.mp4`.

2. Κάνε **commit και push** το αρχείο:
   - `git add public/photo/` (και το βίντεο)
   - `git commit -m "Add hero video"`
   - `git push`

Μετά το επόμενο deploy, το Vercel θα έχει το ίδιο βίντεο με το localhost.

**Σημείωση:** Αν το αρχείο είναι >100MB, το GitHub δεν το δέχεται. Τότε ανέβασέ το αλλού (π.χ. Vercel Blob, Cloudinary) και όρισε στο Vercel το env **`PUBLIC_HERO_VIDEO_URL`** με το URL του βίντεου.
