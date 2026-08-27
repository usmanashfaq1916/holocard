export interface ValidationResult {
  valid: boolean;
  checks: {
    name: string;
    passed: boolean;
    message: string;
  }[];
}

export function validateCard(card: {
  name?: string;
  slug?: string;
  profileImage?: string;
}): ValidationResult {
  const checks: ValidationResult["checks"] = [];

  checks.push({
    name: "Profile Information",
    passed: Boolean(card.name && card.name.length > 0),
    message: card.name ? "Profile name is set" : "Please add your name",
  });

  checks.push({
    name: "Profile Image",
    passed: Boolean(card.profileImage),
    message: card.profileImage ? "Profile image uploaded" : "Add a profile image for better AR tracking",
  });

  checks.push({
    name: "URL Slug",
    passed: Boolean(card.slug && card.slug.length > 2),
    message: card.slug ? `URL: /card/${card.slug}` : "Please set a URL slug",
  });

  const valid = checks.every((c) => c.passed);
  return { valid, checks };
}

export function validateARExperience(experience: {
  scenes?: { elements: unknown[] }[];
}): ValidationResult {
  const checks: ValidationResult["checks"] = [];
  const hasElements = experience.scenes?.some((s) => s.elements.length > 0) ?? false;

  checks.push({
    name: "AR Elements",
    passed: hasElements,
    message: hasElements ? "At least one AR element added" : "Add at least one AR element (video, 3D, text, or button)",
  });

  const valid = checks.every((c) => c.passed);
  return { valid, checks };
}

export function validateTarget(target: {
  status?: string;
  mindFileUrl?: string;
  qualityScore?: number;
}): ValidationResult {
  const checks: ValidationResult["checks"] = [];

  checks.push({
    name: "Target Compiled",
    passed: target.status === "COMPILED" && Boolean(target.mindFileUrl),
    message: target.status === "COMPILED" ? "Target file ready" : "Please upload and compile a target image",
  });

  checks.push({
    name: "Tracking Quality",
    passed: (target.qualityScore ?? 0) >= 50,
    message: target.qualityScore
      ? `Quality score: ${target.qualityScore}/100`
      : "Quality score pending",
  });

  const valid = checks.every((c) => c.passed);
  return { valid, checks };
}

export function validateMedia(files: { type: string; size: number }[]): ValidationResult {
  const checks: ValidationResult["checks"] = [];
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "video/mp4", "model/gltf-binary"];
  const maxSize = 50 * 1024 * 1024;

  const invalidFiles = files.filter((f) => !allowedTypes.includes(f.type));
  const oversizedFiles = files.filter((f) => f.size > maxSize);

  checks.push({
    name: "File Formats",
    passed: invalidFiles.length === 0,
    message: invalidFiles.length === 0
      ? "All files are valid formats"
      : `${invalidFiles.length} file(s) have unsupported formats`,
  });

  checks.push({
    name: "File Sizes",
    passed: oversizedFiles.length === 0,
    message: oversizedFiles.length === 0
      ? "All files are under 50MB"
      : `${oversizedFiles.length} file(s) exceed 50MB limit`,
  });

  const valid = checks.every((c) => c.passed);
  return { valid, checks };
}

export function runFullValidation(data: {
  card: { name?: string; slug?: string; profileImage?: string };
  experience: { scenes?: { elements: unknown[] }[] };
  target: { status?: string; mindFileUrl?: string; qualityScore?: number };
  media: { type: string; size: number }[];
}): { valid: boolean; sections: { name: string; result: ValidationResult }[] } {
  const sections = [
    { name: "Card Validation", result: validateCard(data.card) },
    { name: "AR Validation", result: validateARExperience(data.experience) },
    { name: "Target Validation", result: validateTarget(data.target) },
    { name: "Media Validation", result: validateMedia(data.media) },
  ];

  const valid = sections.every((s) => s.result.valid);
  return { valid, sections };
}
