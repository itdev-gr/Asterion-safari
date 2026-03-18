import { compressImage } from "./image-compress";

/**
 * Compress and upload an image via server-side API.
 * Returns the public URL of the uploaded image.
 */
export async function uploadImage(
  file: File,
  folder: "tours" | "gallery",
  maxWidth = 1600
): Promise<string> {
  const blob = await compressImage(file, maxWidth);
  const ext = blob.type === "image/webp" ? "webp" : "jpg";

  const formData = new FormData();
  formData.append("file", new File([blob], `image.${ext}`, { type: blob.type }));
  formData.append("folder", folder);

  const res = await fetch("/api/upload-image", { method: "POST", body: formData });
  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Upload failed");
  return data.url;
}

/**
 * Delete an image via server-side API.
 */
export async function deleteImage(publicUrl: string): Promise<void> {
  const res = await fetch("/api/delete-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: publicUrl }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Delete failed");
  }
}
