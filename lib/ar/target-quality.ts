export interface TargetQualityResult {
  score: number;
  rating: "excellent" | "good" | "fair" | "poor";
  checks: {
    name: string;
    passed: boolean;
    score: number;
    message: string;
  }[];
  warnings: string[];
  recommendations: string[];
}

export async function analyzeTargetQuality(
  imageUrl: string
): Promise<TargetQualityResult> {
  const checks: TargetQualityResult["checks"] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];

  try {
    const img = await loadImage(imageUrl);

    const resolutionCheck = checkResolution(img.width, img.height);
    checks.push(resolutionCheck);

    const contrastCheck = await checkContrast(img);
    checks.push(contrastCheck);

    const sharpnessCheck = await checkSharpness(img);
    checks.push(sharpnessCheck);

    const featureCheck = await checkFeatureDensity(img);
    checks.push(featureCheck);

    const aspectCheck = checkAspect(img.width, img.height);
    checks.push(aspectCheck);

    if (img.width < 800 || img.height < 600) {
      warnings.push("Image resolution is low. Use at least 800x600 for best results.");
      recommendations.push("Use a higher resolution image of the business card.");
    }

    const whiteRatio = await checkBlankAreas(img);
    if (whiteRatio > 0.4) {
      warnings.push("Image has large blank areas. Crop closer to the card.");
      recommendations.push("Keep the image sharp and crop tightly to the card edges.");
    }

    if (contrastCheck.score < 50) {
      warnings.push("Low contrast detected. AR tracking may be unreliable.");
      recommendations.push("Use indirect lighting and avoid reflections on the card.");
    }

    if (sharpnessCheck.score < 40) {
      warnings.push("Image appears blurry. AR tracking requires sharp features.");
      recommendations.push("Ensure the card is in focus and well-lit.");
    }

    const totalScore = Math.round(
      checks.reduce((sum, c) => sum + c.score, 0) / checks.length
    );

    let rating: TargetQualityResult["rating"];
    if (totalScore >= 80) rating = "excellent";
    else if (totalScore >= 60) rating = "good";
    else if (totalScore >= 40) rating = "fair";
    else rating = "poor";

    if (totalScore < 50) {
      warnings.push("Target quality is too low for reliable AR tracking.");
      recommendations.push("Consider re-uploading with better lighting and focus.");
    }

    return { score: totalScore, rating, checks, warnings, recommendations };
  } catch {
    return {
      score: 0,
      rating: "poor",
      checks: [
        {
          name: "Analysis Failed",
          passed: false,
          score: 0,
          message: "Could not analyze the image. Please try a different image.",
        },
      ],
      warnings: ["Image analysis failed."],
      recommendations: ["Please upload a clear, well-lit photo of your business card."],
    };
  }
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

function checkResolution(
  width: number,
  height: number
): TargetQualityResult["checks"][0] {
  const pixels = width * height;
  if (pixels >= 1920 * 1080) {
    return { name: "Resolution", passed: true, score: 100, message: `${width}x${height} — Excellent` };
  }
  if (pixels >= 1280 * 720) {
    return { name: "Resolution", passed: true, score: 80, message: `${width}x${height} — Good` };
  }
  if (pixels >= 800 * 600) {
    return { name: "Resolution", passed: true, score: 60, message: `${width}x${height} — Acceptable` };
  }
  return { name: "Resolution", passed: false, score: 30, message: `${width}x${height} — Too low` };
}

function checkAspect(
  width: number,
  height: number
): TargetQualityResult["checks"][0] {
  const ratio = width / height;
  if (ratio >= 1.3 && ratio <= 1.8) {
    return { name: "Aspect Ratio", passed: true, score: 100, message: "Good business card ratio" };
  }
  if (ratio >= 1.0 && ratio <= 2.2) {
    return { name: "Aspect Ratio", passed: true, score: 70, message: "Acceptable ratio" };
  }
  return { name: "Aspect Ratio", passed: false, score: 40, message: "Unusual aspect ratio — crop to card" };
}

async function checkContrast(
  img: HTMLImageElement
): Promise<TargetQualityResult["checks"][0]> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return { name: "Contrast", passed: false, score: 0, message: "Could not analyze" };

  const size = 200;
  canvas.width = size;
  canvas.height = size;
  ctx.drawImage(img, 0, 0, size, size);
  const data = ctx.getImageData(0, 0, size, size).data;

  let min = 255;
  let max = 0;
  let sum = 0;
  const count = data.length / 4;

  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    if (gray < min) min = gray;
    if (gray > max) max = gray;
    sum += gray;
  }

  const range = max - min;
  void sum;
  void count;
  const score = Math.min(100, Math.round((range / 128) * 100));

  return {
    name: "Contrast",
    passed: range > 60,
    score,
    message: range > 80 ? "Good contrast" : range > 60 ? "Moderate contrast" : "Low contrast",
  };
}

async function checkSharpness(
  img: HTMLImageElement
): Promise<TargetQualityResult["checks"][0]> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return { name: "Sharpness", passed: false, score: 0, message: "Could not analyze" };

  const size = 200;
  canvas.width = size;
  canvas.height = size;
  ctx.drawImage(img, 0, 0, size, size);
  const data = ctx.getImageData(0, 0, size, size).data;

  let edgeSum = 0;
  let count = 0;

  for (let y = 1; y < size - 1; y++) {
    for (let x = 1; x < size - 1; x++) {
      const idx = (y * size + x) * 4;
      const idxRight = (y * size + x + 1) * 4;
      const idxDown = ((y + 1) * size + x) * 4;

      const gray = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
      const grayRight = 0.299 * data[idxRight] + 0.587 * data[idxRight + 1] + 0.114 * data[idxRight + 2];
      const grayDown = 0.299 * data[idxDown] + 0.587 * data[idxDown + 1] + 0.114 * data[idxDown + 2];

      const gx = grayRight - gray;
      const gy = grayDown - gray;
      edgeSum += Math.sqrt(gx * gx + gy * gy);
      count++;
    }
  }

  const edgeMean = count > 0 ? edgeSum / count : 0;
  const score = Math.min(100, Math.round(edgeMean * 2));

  return {
    name: "Sharpness",
    passed: edgeMean > 5,
    score,
    message: edgeMean > 10 ? "Sharp image" : edgeMean > 5 ? "Moderately sharp" : "Blurry — may not track well",
  };
}

async function checkFeatureDensity(
  img: HTMLImageElement
): Promise<TargetQualityResult["checks"][0]> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return { name: "Feature Density", passed: false, score: 0, message: "Could not analyze" };

  const size = 100;
  canvas.width = size;
  canvas.height = size;
  ctx.drawImage(img, 0, 0, size, size);
  const data = ctx.getImageData(0, 0, size, size).data;

  let edgeCount = 0;
  const threshold = 20;

  for (let y = 1; y < size - 1; y++) {
    for (let x = 1; x < size - 1; x++) {
      const idx = (y * size + x) * 4;
      const idxRight = (y * size + x + 1) * 4;
      const idxDown = ((y + 1) * size + x) * 4;

      const gray = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
      const grayRight = 0.299 * data[idxRight] + 0.587 * data[idxRight + 1] + 0.114 * data[idxRight + 2];
      const grayDown = 0.299 * data[idxDown] + 0.587 * data[idxDown + 1] + 0.114 * data[idxDown + 2];

      if (Math.abs(grayRight - gray) > threshold || Math.abs(grayDown - gray) > threshold) {
        edgeCount++;
      }
    }
  }

  const totalPixels = (size - 2) * (size - 2);
  const ratio = edgeCount / totalPixels;
  const score = Math.min(100, Math.round(ratio * 500));

  return {
    name: "Feature Density",
    passed: ratio > 0.05,
    score,
    message: ratio > 0.1 ? "Good feature density" : ratio > 0.05 ? "Moderate features" : "Few features — add text or logo",
  };
}

async function checkBlankAreas(img: HTMLImageElement): Promise<number> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return 0;

  const size = 100;
  canvas.width = size;
  canvas.height = size;
  ctx.drawImage(img, 0, 0, size, size);
  const data = ctx.getImageData(0, 0, size, size).data;

  let whiteCount = 0;
  const totalPixels = size * size;

  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    if (gray > 240) whiteCount++;
  }

  return whiteCount / totalPixels;
}
