import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { checkRateLimit } from "@/lib/rate-limit";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

interface GenerateParams {
  name: string;
  role: string;
  skills: string[];
  experience: string;
  industry: string;
  style: string;
}

function buildPrompt(params: GenerateParams, action?: string, existing?: Record<string, string>): string {
  const { name, role, skills, experience, industry, style } = params;
  const skillStr = skills.length ? `Skills: ${skills.join(", ")}.` : "";
  const expStr = experience ? `Experience: ${experience}.` : "";
  const indStr = industry ? `Industry: ${industry}.` : "";
  const nameStr = name ? `Name: ${name}.` : "";

  if (action && existing) {
    const existingText = `Headline: ${existing.headline}\nBio: ${existing.bio}\nAbout: ${existing.about}\nTagline: ${existing.tagline}`;
    if (action === "improve") {
      return `You are a professional copywriter. Rewrite and improve the following professional profile content to make it more compelling and engaging. Keep the same tone (${style || "professional"}). ${nameStr} Role: ${role || "professional"}. ${skillStr} ${expStr} ${indStr}\n\nExisting content:\n${existingText}\n\nReturn ONLY a JSON object with these exact keys: headline, bio, about, tagline. No markdown, no code fences.`;
    }
    if (action === "shorten") {
      return `You are a professional copywriter. Shorten the following professional profile content to be more concise while keeping the key information. ${nameStr} Role: ${role || "professional"}.\n\nExisting content:\n${existingText}\n\nReturn ONLY a JSON object with these exact keys: headline, bio, about, tagline. No markdown, no code fences.`;
    }
    if (action === "professional") {
      return `You are a professional copywriter. Rewrite the following content in a more formal, executive tone. ${nameStr} Role: ${role || "professional"}.\n\nExisting content:\n${existingText}\n\nReturn ONLY a JSON object with these exact keys: headline, bio, about, tagline. No markdown, no code fences.`;
    }
  }

  return `You are a professional copywriter for digital business cards. Generate a professional profile with exactly 4 fields for a person named "${name || "Professional"}" who is a ${role || "professional"}${industry ? ` in the ${industry} industry` : ""}.\n\n${nameStr}\nRole: ${role || "professional"}\n${skillStr}\n${expStr}\n${indStr}\nTone: ${style || "professional"}\n\nRequirements:\n- headline: A 1-line professional headline (max 80 chars)\n- bio: A compelling 2-3 sentence professional bio\n- about: A 3-4 sentence "About" section with more personal detail\n- tagline: A short, memorable tagline (max 50 chars)\n\nReturn ONLY a JSON object with these exact keys: headline, bio, about, tagline. No markdown, no code fences, no extra text.`;
}

function generateTemplateContent(params: GenerateParams): { headline: string; bio: string; about: string; tagline: string } {
  const { name, role, skills, experience, industry } = params;
  const r = role || "Professional";
  const n = name || "A dedicated professional";
  const expStr = experience || "extensive";

  const bios = [
    `A${skills.length ? ` skilled in ${skills.join(", ")}` : ""} ${r.toLowerCase()}${experience ? ` with ${experience} of experience` : ""}, dedicated to delivering high-quality results and driving innovation in the ${industry || "industry"} space.`,
    `Passionate${skills.length ? ` ${skills[0]?.toLowerCase()}` : ""} ${r.toLowerCase()}${experience ? ` with ${experience} of experience` : ""}. I transform complex challenges into elegant solutions that make an impact.`,
    `${expStr.includes("year") ? "Experienced" : "A seasoned"} ${r.toLowerCase()}${skills.length ? ` skilled in ${skills.join(", ")}` : ""}. Committed to excellence and continuous learning in a rapidly evolving field.`,
  ];

  const taglines = [
    `Driving results through ${skills.length ? skills[0]?.toLowerCase() : "innovation"} and expertise.`,
    `Building the future, one project at a time.`,
    `${r} making an impact through innovation.`,
    `Turning vision into reality.`,
  ];

  return {
    headline: `${r}${industry ? ` | ${industry}` : ""}`,
    bio: bios[Math.floor(Math.random() * bios.length)],
    about: `${n} brings ${expStr.toLowerCase()} experience in ${r.toLowerCase()}${skills.length ? `. Proficient in ${skills.join(", ")}` : ""}. Passionate about delivering exceptional results and driving innovation in the ${industry || "technology"} space.`,
    tagline: taglines[Math.floor(Math.random() * taglines.length)],
  };
}

async function generateWithOpenAI(params: GenerateParams, action?: string, existing?: Record<string, string>): Promise<{ headline: string; bio: string; about: string; tagline: string } | null> {
  if (!OPENAI_API_KEY) return null;

  const prompt = buildPrompt(params, action, existing);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) return null;

    // Try to parse JSON from the response (strip markdown fences if present)
    const cleaned = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    const parsed = JSON.parse(cleaned);

    if (parsed.headline && parsed.bio && parsed.about && parsed.tagline) {
      return {
        headline: String(parsed.headline),
        bio: String(parsed.bio),
        about: String(parsed.about),
        tagline: String(parsed.tagline),
      };
    }
    return null;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rate = await checkRateLimit(`ai:${session.user.id}`, 10, 60000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Map frontend field names to backend names
  const name = String(body.name || "");
  const role = String(body.profession || body.role || "");
  const skills = Array.isArray(body.skills) ? body.skills.map(String) : typeof body.skills === "string" ? body.skills.split(",").map((s: string) => s.trim()).filter(Boolean) : [];
  const experience = String(body.experience || "");
  const industry = String(body.industry || "");
  const style = String(body.tone || body.style || "professional");
  const action = body.action as string | undefined;
  const existing = body.existing as Record<string, string> | undefined;

  if (!role && !action) {
    return NextResponse.json(
      { error: "Please enter your profession or role" },
      { status: 400 }
    );
  }

  const params: GenerateParams = { name, role, skills, experience, industry, style };

  // Try OpenAI first, then fall back to template
  const aiResult = await generateWithOpenAI(params, action, existing);
  if (aiResult) {
    return NextResponse.json({ ...aiResult, generated: true, source: "ai" });
  }

  const content = generateTemplateContent(params);
  return NextResponse.json({ ...content, generated: true, source: "template" });
}
