import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { checkRateLimit } from "@/lib/rate-limit";

interface ExtractedFields {
  name: string;
  designation: string;
  company: string;
  phone: string;
  email: string;
  website: string;
}

const EXTRACTION_PROMPT = `You are an AI that extracts information from a business card image.
Analyze the image and extract the following fields. Return ONLY a JSON object with these exact keys, no markdown, no code fences:
{
  "name": "Full name of the person",
  "designation": "Job title or role",
  "company": "Company or organization name",
  "phone": "Phone number exactly as shown",
  "email": "Email address exactly as shown",
  "website": "Website URL exactly as shown (include https:// if present on the card)"
}
If a field is not visible or unclear, return an empty string for that field.
Do not guess or fabricate information — only return what is clearly visible on the card.`;

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rate = await checkRateLimit(`ai-extract:${session.user.id}`, 10, 60000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
  }

  const body = await req.json().catch(() => ({}));
  const imageUrl = body.imageUrl as string | undefined;

  if (!imageUrl) {
    return NextResponse.json({ error: "imageUrl is required" }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI extraction is not configured", extracted: null },
      { status: 200 }
    );
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: EXTRACTION_PROMPT },
              { type: "image_url", image_url: { url: imageUrl, detail: "high" } },
            ],
          },
        ],
        max_tokens: 500,
        temperature: 0.1,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errText = await response.text().catch(() => "unknown");
      console.error(`[Extract Card] OpenAI API error ${response.status}: ${errText}`);
      return NextResponse.json({ error: "Extraction failed", extracted: null });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim();

    if (!content) {
      return NextResponse.json({ error: "Empty response from AI", extracted: null });
    }

    const cleaned = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    const parsed = JSON.parse(cleaned);

    const extracted: ExtractedFields = {
      name: typeof parsed.name === "string" ? parsed.name : "",
      designation: typeof parsed.designation === "string" ? parsed.designation : "",
      company: typeof parsed.company === "string" ? parsed.company : "",
      phone: typeof parsed.phone === "string" ? parsed.phone : "",
      email: typeof parsed.email === "string" ? parsed.email : "",
      website: typeof parsed.website === "string" ? parsed.website : "",
    };

    return NextResponse.json({ extracted });
  } catch (e) {
    console.error("[Extract Card] Failed:", e);
    return NextResponse.json({ error: "Extraction failed", extracted: null });
  }
}
