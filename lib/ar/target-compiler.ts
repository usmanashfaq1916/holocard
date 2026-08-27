export interface TargetQuality {
  score: number;
  rating: "EXCELLENT" | "GOOD" | "POOR";
  featureCount: number;
  trackingFeatureCount: number;
  recommendations: string[];
}

export interface CompileResult {
  buffer: Uint8Array;
  quality: TargetQuality;
  dimensions: { width: number; height: number };
}

export interface CompileProgress {
  phase: "matching" | "tracking" | "exporting";
  progress: number;
}

const MIN_IMAGE_WIDTH = 500;
const MIN_IMAGE_HEIGHT = 300;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const SUPPORTED_TYPES = ["image/png", "image/jpeg", "image/webp"];

export function validateTargetFile(file: File): { valid: boolean; error?: string } {
  if (!SUPPORTED_TYPES.includes(file.type)) {
    return { valid: false, error: "Unsupported format. Use PNG, JPG, or WEBP." };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "File too large. Maximum size is 10MB." };
  }
  return { valid: true };
}

export async function validateTargetImage(
  file: File
): Promise<{ valid: boolean; error?: string; width?: number; height?: number }> {
  if (typeof Image === "undefined" || typeof URL === "undefined") {
    return { valid: true };
  }
  const img = new Image();
  const url = URL.createObjectURL(file);

  return new Promise((resolve) => {
    img.onload = () => {
      URL.revokeObjectURL(url);
      if (img.width < MIN_IMAGE_WIDTH || img.height < MIN_IMAGE_HEIGHT) {
        resolve({
          valid: false,
          error: `Image too small. Minimum ${MIN_IMAGE_WIDTH}x${MIN_IMAGE_HEIGHT}px. Got ${img.width}x${img.height}px.`,
          width: img.width,
          height: img.height,
        });
        return;
      }
      resolve({ valid: true, width: img.width, height: img.height });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ valid: false, error: "Failed to load image." });
    };
    img.src = url;
  });
}

function assessQuality(
  matchingFeatures: number,
  trackingFeatures: number,
  width: number,
  height: number
): TargetQuality {
  const recommendations: string[] = [];
  let score = 0;

  if (matchingFeatures > 500) {
    score += 40;
  } else if (matchingFeatures > 200) {
    score += 25;
  } else {
    score += 10;
    recommendations.push("Image has few distinctive features. Add more visual detail.");
  }

  if (trackingFeatures > 100) {
    score += 30;
  } else if (trackingFeatures > 50) {
    score += 20;
  } else {
    score += 5;
    recommendations.push("Limited tracking points. Use a more textured image.");
  }

  if (width >= 1000 && height >= 600) {
    score += 20;
  } else if (width >= 700 && height >= 400) {
    score += 10;
  } else {
    score += 5;
    recommendations.push("Higher resolution improves tracking reliability.");
  }

  if (width >= 800 && height >= 500 && width <= 2000 && height <= 1200) {
    score += 10;
  }

  let rating: "EXCELLENT" | "GOOD" | "POOR";
  if (score >= 70) rating = "EXCELLENT";
  else if (score >= 40) rating = "GOOD";
  else rating = "POOR";

  if (recommendations.length === 0) {
    recommendations.push("Great target image! It should track well in AR.");
  }

  return {
    score,
    rating,
    featureCount: matchingFeatures,
    trackingFeatureCount: trackingFeatures,
    recommendations,
  };
}

export async function compileTarget(
  file: File,
  onProgress?: (progress: CompileProgress) => void
): Promise<CompileResult> {
  const { Compiler } = await import("mind-ar/dist/mindar-image.prod.js");

  const img = await loadImage(file);
  const compiler = new Compiler();

  onProgress?.({ phase: "matching", progress: 0 });

  const dataList = (await compiler.compileImageTargets([img], (p: number) => {
    const phase = p < 50 ? "matching" : "tracking";
    onProgress?.({ phase, progress: p });
  })) as { matchingData?: { maximaPoints: unknown[]; minimaPoints: unknown[] }[]; trackingData?: { points: unknown[] }[] }[];

  onProgress?.({ phase: "exporting", progress: 95 });

  const buffer = compiler.exportData();

  const matchingFeatures = dataList[0]?.matchingData?.reduce(
    (sum: number, kf: { maximaPoints: unknown[]; minimaPoints: unknown[] }) =>
      sum + kf.maximaPoints.length + kf.minimaPoints.length,
    0
  ) ?? 0;

  const trackingFeatures = dataList[0]?.trackingData?.reduce(
    (sum: number, tf: { points: unknown[] }) => sum + tf.points.length,
    0
  ) ?? 0;

  const quality = assessQuality(
    matchingFeatures,
    trackingFeatures,
    img.width,
    img.height
  );

  onProgress?.({ phase: "exporting", progress: 100 });

  return {
    buffer,
    quality,
    dimensions: { width: img.width, height: img.height },
  };
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
