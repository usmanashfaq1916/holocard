import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    console.error("[CSP Violation]", body);
  } catch {
    // Silently ignore parse errors
  }
  return new NextResponse(null, { status: 204 });
}
