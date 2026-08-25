import { NextResponse } from "next/server";
import QRCode from "qrcode";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(_req: Request, { params }: RouteParams) {
  const { slug } = await params;
  const type = new URL(_req.url).searchParams.get("type") || "ar";
  const path = type === "card" ? "card" : "ar";
  const url = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/${path}/${slug}`;

  const format = new URL(_req.url).searchParams.get("format") || "png";

  if (format === "svg") {
    const svg = await QRCode.toString(url, {
      type: "svg",
      width: 400,
      margin: 2,
      color: { dark: "#ffffff", light: "#050A14" },
    });
    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  }

  const buffer = await QRCode.toBuffer(url, {
    width: 400,
    margin: 2,
    color: { dark: "#ffffff", light: "#050A14" },
  });

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
