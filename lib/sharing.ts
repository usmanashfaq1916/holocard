export async function shareCard(card: { name: string; slug: string; designation?: string | null }) {
  const url = `${typeof window !== "undefined" ? window.location.origin : ""}/card/${card.slug}`;
  const title = `${card.name} - ${card.designation || "Professional"} | HoloCard`;
  const text = `Check out ${card.name}'s digital business card on HoloCard`;

  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

export function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
  }
  return Promise.resolve(false);
}

export function shareViaWhatsApp(card: { name: string; slug: string }) {
  const url = `${window.location.origin}/card/${card.slug}`;
  const text = `Check out ${card.name}'s digital business card: ${url}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
}

export function shareViaEmail(card: { name: string; slug: string }) {
  const url = `${window.location.origin}/card/${card.slug}`;
  const subject = `${card.name}'s Digital Business Card`;
  const body = `Check out ${card.name}'s digital business card: ${url}`;
  window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
}

export function downloadVCard(card: {
  name: string;
  designation?: string | null;
  company?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
}) {
  const [firstName, ...rest] = card.name.split(" ");
  const lastName = rest.join(" ");

  const vcard = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${card.name}`,
    `N:${lastName};${firstName};;;`,
    card.company ? `ORG:${card.company}` : null,
    card.designation ? `TITLE:${card.designation}` : null,
    card.phone ? `TEL:${card.phone}` : null,
    card.email ? `EMAIL:${card.email}` : null,
    card.website ? `URL:${card.website}` : null,
    "END:VCARD",
  ]
    .filter(Boolean)
    .join("\r\n");

  const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${card.name.replace(/\s+/g, "-").toLowerCase()}.vcf`;
  a.click();
  URL.revokeObjectURL(url);
}
