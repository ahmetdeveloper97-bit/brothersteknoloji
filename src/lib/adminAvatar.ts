export const ADMIN_AVATAR_MAX_BYTES = 3 * 1024 * 1024;

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const validateAdminAvatar = (file: File): string => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Yalnızca JPG, PNG veya WEBP formatında fotoğraf yükleyebilirsiniz.";
  }
  if (file.size > ADMIN_AVATAR_MAX_BYTES) {
    return "Fotoğraf boyutu en fazla 3 MB olabilir.";
  }
  return "";
};

const readAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Fotoğraf okunamadı. Lütfen tekrar deneyin."));
    reader.readAsDataURL(file);
  });

const loadImage = (source: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Fotoğraf açılamadı. Farklı bir dosya deneyin."));
    image.src = source;
  });

/**
 * Fotoğrafı ortadan kare olarak kırpıp küçük bir JPEG data URL'ine çevirir.
 * Böylece yönetici profil fotoğrafı tarayıcıda saklanabiliyor.
 */
export const createAdminAvatar = async (file: File, size = 256): Promise<string> => {
  const source = await readAsDataUrl(file);
  const image = await loadImage(source);
  const edge = Math.min(image.width, image.height);
  if (!edge) throw new Error("Fotoğraf boyutu okunamadı.");

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Fotoğraf işlenemedi. Lütfen tekrar deneyin.");

  const offsetX = (image.width - edge) / 2;
  const offsetY = (image.height - edge) / 2;
  context.drawImage(image, offsetX, offsetY, edge, edge, 0, 0, size, size);
  return canvas.toDataURL("image/jpeg", 0.85);
};