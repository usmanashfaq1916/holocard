import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { checkRateLimit } from "@/lib/rate-limit";

const OLLAMA_URL = process.env.OLLAMA_BASE_URL;

function generateTemplateBio(role: string, skills?: string, experience?: string): string {
  const bios = [
    `A${skills ? ` skilled in ${skills}` : ""} ${role || "professional"}${experience ? ` with ${experience} of experience` : ""}, dedicated to delivering high-quality results and driving innovation.`,
    `Passionate${skills ? ` ${skills}` : ""} ${role || "professional"}${experience ? ` with ${experience} of experience` : ""}. I transform complex challenges into elegant solutions that make an impact.`,
    `${experience || "Experienced"} ${role || "professional"}${skills ? ` skilled in ${skills}` : ""}. Committed to excellence and continuous learning in a rapidly evolving field.`,
  ];
  return bios[Math.floor(Math.random() * bios.length)];
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rate = checkRateLimit(`ai:${session.user.id}`, 10, 60000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
  }

  const body = await req.json();
  const { role, skills, experience, style } = body;

  if (!role) {
    return NextResponse.json(
      { error: "role is required" },
      { status: 400 }
    );
  }

  // Try Ollama if configured
  if (OLLAMA_URL) {
    try {
      const prompt = `You are a professional copywriter. Generate a compelling 1-2 sentence professional bio for a ${role}.${skills ? ` Skills: ${skills}.` : ""}${experience ? ` Experience: ${experience}.` : ""} Style: ${style || "professional"}. Make it specific and engaging. Only output the bio text, nothing else.`;

      const response = await fetch(`${OLLAMA_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3.2",
          prompt,
          stream: false,
          options: {
            temperature: 0.7,
            num_predict: 200,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const bio = data.response?.trim();
        if (bio && bio.length > 20) {
          return NextResponse.json({ bio, generated: true, source: "ollama" });
        }
      }
    } catch {
      // Ollama not available, fall through to template
    }
  }

  // Template fallback
  const bio = generateTemplateBio(role, skills, experience);
  return NextResponse.json({ bio, generated: true, source: "template" });
}
