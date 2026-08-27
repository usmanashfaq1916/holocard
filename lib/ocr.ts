export interface ExtractedCardData {
  name: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  socialLinks: { platform: string; url: string }[];
}

export function extractFromText(text: string): Partial<ExtractedCardData> {
  const result: Partial<ExtractedCardData> = {
    socialLinks: [],
  };

  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  for (const line of lines) {
    if (!result.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(line)) {
      result.email = line;
    } else if (!result.phone && /^[\+]?[\d\s\-\(\)]{7,20}$/.test(line)) {
      result.phone = line;
    } else if (!result.website && /^https?:\/\//.test(line)) {
      result.website = line;
    } else if (/linkedin\.com/i.test(line)) {
      const url = line.startsWith("http") ? line : `https://${line}`;
      result.socialLinks?.push({ platform: "linkedin", url });
    } else if (/twitter\.com|x\.com/i.test(line)) {
      const url = line.startsWith("http") ? line : `https://${line}`;
      result.socialLinks?.push({ platform: "twitter", url });
    } else if (/github\.com/i.test(line)) {
      const url = line.startsWith("http") ? line : `https://${line}`;
      result.socialLinks?.push({ platform: "github", url });
    } else if (/instagram\.com/i.test(line)) {
      const url = line.startsWith("http") ? line : `https://${line}`;
      result.socialLinks?.push({ platform: "instagram", url });
    } else if (/facebook\.com/i.test(line)) {
      const url = line.startsWith("http") ? line : `https://${line}`;
      result.socialLinks?.push({ platform: "facebook", url });
    }
  }

  if (!result.name && lines.length > 0) {
    const possibleName = lines.find(
      (l) =>
        l.length > 2 &&
        l.length < 50 &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(l) &&
        !/^https?:\/\//.test(l) &&
        !/^[\+]?[\d\s\-\(\)]{7,20}$/.test(l) &&
        !/ceo|cto|engineer|manager|director|founder|president|vp|lead/i.test(l)
    );
    if (possibleName) {
      result.name = possibleName;
    }
  }

  if (!result.title) {
    const titleLine = lines.find((l) =>
      /ceo|cto|engineer|manager|director|founder|president|vp|lead|designer|developer|analyst|consultant|architect/i.test(l)
    );
    if (titleLine) {
      result.title = titleLine;
    }
  }

  return result;
}

export function generateSampleData(): ExtractedCardData {
  return {
    name: "John Doe",
    title: "Senior Software Engineer",
    company: "TechCorp",
    phone: "+1 555 0123",
    email: "john@techcorp.com",
    website: "https://techcorp.com",
    address: "123 Main St, San Francisco, CA",
    socialLinks: [
      { platform: "linkedin", url: "https://linkedin.com/in/johndoe" },
      { platform: "github", url: "https://github.com/johndoe" },
    ],
  };
}
