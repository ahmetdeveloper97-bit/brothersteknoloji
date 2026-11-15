import { supabase } from "@/lib/supabase";

export const AVATAR_BUCKET = "avatars";
export const AVATAR_MAX_BYTES = 2 * 1024 * 1024;

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const validateAvatar = (file: File): string => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Yalnızca JPG, PNG veya WEBP formatında fotoğraf yükleyebilirsiniz.";
  }
  if (file.size > AVATAR_MAX_BYTES) {
    return "Fotoğraf boyutu en fazla 2 MB olabilir.";
  }
  return "";
};

const humanizeStorageError = (message: string): string => {
  const lower = message.toLowerCase();
  if (lower.includes("bucket not found") || lower.includes("not_found")) {
    return "Fotoğraf alanı (avatars) bulunamadı. Bu alan proje yöneticisi tarafından açılmalı.";
  }
  if (lower.includes("policy") || lower.includes("row-level security") || lower.includes("permission")) {
    return "Fotoğraf yükleme izni verilmedi. Depolama erişim kuralları kontrol edilmeli.";
  }
  if (lower.includes("size") || lower.includes("too large")) {
    return "Fotoğraf boyutu en fazla 2 MB olabilir.";
  }
  return "Fotoğraf yüklenemedi. Lütfen tekrar deneyin.";
};

/**
 * Uploads the avatar into the public `avatars` bucket under the user's own
 * folder and returns a public URL.
 */
export const uploadAvatar = async (file: File, userId: string): Promise<string> => {
  const rawExtension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const extension = ["jpg", "jpeg", "png", "webp"].includes(rawExtension) ? rawExtension : "jpg";
  const path = `${userId}/avatar-${Date.now()}.${extension}`;

  const { error } = await supabase.storage.from(AVATAR_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
    contentType: file.type || "image/jpeg",
  });

  if (error) throw new Error(humanizeStorageError(error.message));

  const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);
  return data.publicUrl;
};