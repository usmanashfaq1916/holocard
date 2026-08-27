const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME || "";

export function getOptimizedImageUrl(
  originalUrl: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: "auto" | "webp" | "png" | "jpg";
    crop?: "fill" | "fit" | "scale" | "thumb";
  } = {}
): string {
  if (!CLOUDINARY_CLOUD_NAME || !originalUrl) return originalUrl;

  if (originalUrl.includes("res.cloudinary.com")) return originalUrl;

  const { width, height, quality = 80, format = "auto", crop = "fill" } = options;

  const parts: string[] = [];
  if (width) parts.push(`w_${width}`);
  if (height) parts.push(`h_${height}`);
  if (crop) parts.push(`c_${crop}`);
  parts.push(`q_${quality}`);
  parts.push(`f_${format}`);

  const transformations = parts.join(",");
  const encodedUrl = encodeURIComponent(originalUrl);

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/fetch/${transformations}/${encodedUrl}`;
}

export function getThumbnailUrl(originalUrl: string, size = 200): string {
  return getOptimizedImageUrl(originalUrl, {
    width: size,
    height: size,
    crop: "thumb",
    quality: 70,
    format: "webp",
  });
}

export function getBlurHash(originalUrl: string): string {
  return getOptimizedImageUrl(originalUrl, {
    width: 20,
    height: 20,
    quality: 20,
    format: "auto",
  });
}
