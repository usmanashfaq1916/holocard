import { ImageResponse } from "next/og";

export const contentType = "image/png";
export const size = { width: 1200, height: 630 };
export const alt = "HoloCard";

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let name = "HoloCard User";
  let role = "Professional";
  let bio = "Interactive AR Business Card";

  try {
    const { prisma } = await import("@/lib/db");
    const card = await prisma.card.findUnique({
      where: { slug },
      select: { name: true, designation: true, company: true, bio: true },
    });

    if (card) {
      name = card.name || name;
      role = [card.designation, card.company].filter(Boolean).join(" at ") || role;
      bio = card.bio?.slice(0, 100) || bio;
    }
  } catch {
    // DB unavailable at build time — use defaults
  }

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #0A0E1A 0%, #0F172A 50%, #0C1525 100%)",
          fontFamily: "sans-serif",
          padding: "80px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "100px",
            right: "200px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #2563EB, #22D3EE)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "40px",
            fontWeight: "bold",
            color: "white",
            marginBottom: "30px",
          }}
        >
          {initials}
        </div>
        <div style={{ fontSize: "48px", fontWeight: "bold", color: "white", marginBottom: "12px", textAlign: "center" }}>
          {name}
        </div>
        <div style={{ fontSize: "24px", color: "#94A3B8", marginBottom: "20px", textAlign: "center" }}>
          {role}
        </div>
        <div style={{ fontSize: "18px", color: "#64748B", maxWidth: "700px", textAlign: "center", lineHeight: 1.5 }}>
          {bio}
        </div>
        <div style={{ position: "absolute", bottom: "40px", display: "flex", alignItems: "center", gap: "8px", fontSize: "16px", color: "#475569" }}>
          <span style={{ background: "linear-gradient(135deg, #2563EB, #22D3EE)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: "bold" }}>
            HoloCard
          </span>
          <span>·</span>
          <span>View in Augmented Reality</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
