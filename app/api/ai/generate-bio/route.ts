import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { role, skills, experience, style } = body;

  if (!role) {
    return NextResponse.json(
      { error: "role is required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.AI_API_KEY;

  if (!apiKey) {
    // Generate a template bio without AI
    const skillText = skills ? ` skilled in ${skills}` : "";
    const expText = experience ? ` with ${experience} of experience` : "";
    const bios = [
      `A${skillText} ${role || "professional"}${expText}, dedicated to delivering high-quality results and driving innovation.`,
      `Passionate${skillText} ${role || "professional"}${expText}. I transform complex challenges into elegant solutions that make an impact.`,
      `${experience || "Experienced"} ${role || "professional"}${skillText}. Committed to excellence and continuous learning in a rapidly evolving field.`,
    ];
    const bio = bios[Math.floor(Math.random() * bios.length)];
    return NextResponse.json({ bio, generated: false });
  }

  try {
    const prompt = `Generate a professional bio for a ${role}.${skills ? ` Skills: ${skills}.` : ""}${experience ? ` Experience: ${experience}.` : ""} Style: ${style || "professional"}. Keep it under 2 sentences. Make it compelling and specific.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a professional copywriter. Write concise, compelling professional bios.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "AI service unavailable" },
        { status: 503 }
      );
    }

    const data = await response.json();
    const bio = data.choices?.[0]?.message?.content?.trim();

    if (!bio) {
      return NextResponse.json(
        { error: "Failed to generate bio" },
        { status: 500 }
      );
    }

    return NextResponse.json({ bio, generated: true });
  } catch {
    return NextResponse.json(
      { error: "AI service error" },
      { status: 500 }
    );
  }
}
