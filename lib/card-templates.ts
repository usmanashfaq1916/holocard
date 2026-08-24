import type { ARTemplateType } from "@prisma/client";

export interface CardTemplateElement {
  type: "text" | "image" | "shape" | "line" | "qr" | "social";
  label: string;
  left: number;
  top: number;
  width?: number;
  height?: number;
  fontSize?: number;
  fontFamily?: string;
  fill?: string;
  fontWeight?: string;
  textAlign?: string;
  fieldName?: string;
}

export interface CardTemplate {
  name: string;
  style: string;
  canvasWidth: number;
  canvasHeight: number;
  backgroundColor: string;
  elements: CardTemplateElement[];
}

export const CARD_TEMPLATES: Record<string, CardTemplate> = {
  centered: {
    name: "Centered",
    style: "centered",
    canvasWidth: 1050,
    canvasHeight: 600,
    backgroundColor: "#ffffff",
    elements: [
      { type: "text", label: "Name", left: 525, top: 120, fontSize: 36, fontFamily: "Arial", fill: "#1a1a1a", fontWeight: "bold", textAlign: "center", fieldName: "name" },
      { type: "text", label: "Title", left: 525, top: 175, fontSize: 18, fontFamily: "Arial", fill: "#666666", textAlign: "center", fieldName: "designation" },
      { type: "text", label: "Company", left: 525, top: 210, fontSize: 16, fontFamily: "Arial", fill: "#999999", textAlign: "center", fieldName: "company" },
      { type: "line", label: "Divider", left: 375, top: 250, width: 300, height: 1 },
      { type: "text", label: "Phone", left: 525, top: 280, fontSize: 14, fontFamily: "Arial", fill: "#555555", textAlign: "center", fieldName: "phone" },
      { type: "text", label: "Email", left: 525, top: 310, fontSize: 14, fontFamily: "Arial", fill: "#555555", textAlign: "center", fieldName: "email" },
      { type: "text", label: "Website", left: 525, top: 340, fontSize: 14, fontFamily: "Arial", fill: "#2563EB", textAlign: "center", fieldName: "website" },
      { type: "qr", label: "QR Code", left: 850, top: 420, width: 120, height: 120 },
    ],
  },
  "left-aligned": {
    name: "Left Aligned",
    style: "left-aligned",
    canvasWidth: 1050,
    canvasHeight: 600,
    backgroundColor: "#ffffff",
    elements: [
      { type: "text", label: "Name", left: 60, top: 80, fontSize: 36, fontFamily: "Arial", fill: "#1a1a1a", fontWeight: "bold", fieldName: "name" },
      { type: "text", label: "Title", left: 60, top: 135, fontSize: 18, fontFamily: "Arial", fill: "#666666", fieldName: "designation" },
      { type: "text", label: "Company", left: 60, top: 170, fontSize: 16, fontFamily: "Arial", fill: "#999999", fieldName: "company" },
      { type: "line", label: "Divider", left: 60, top: 210, width: 400, height: 2 },
      { type: "text", label: "Phone", left: 60, top: 240, fontSize: 14, fontFamily: "Arial", fill: "#555555", fieldName: "phone" },
      { type: "text", label: "Email", left: 60, top: 275, fontSize: 14, fontFamily: "Arial", fill: "#555555", fieldName: "email" },
      { type: "text", label: "Website", left: 60, top: 310, fontSize: 14, fontFamily: "Arial", fill: "#2563EB", fieldName: "website" },
      { type: "qr", label: "QR Code", left: 850, top: 60, width: 120, height: 120 },
    ],
  },
  minimal: {
    name: "Minimal",
    style: "minimal",
    canvasWidth: 1050,
    canvasHeight: 600,
    backgroundColor: "#0F172A",
    elements: [
      { type: "text", label: "Name", left: 525, top: 180, fontSize: 42, fontFamily: "Arial", fill: "#FFFFFF", fontWeight: "bold", textAlign: "center", fieldName: "name" },
      { type: "text", label: "Title", left: 525, top: 245, fontSize: 18, fontFamily: "Arial", fill: "#94A3B8", textAlign: "center", fieldName: "designation" },
      { type: "line", label: "Divider", left: 425, top: 290, width: 200, height: 1 },
      { type: "text", label: "Email", left: 525, top: 320, fontSize: 14, fontFamily: "Arial", fill: "#60A5FA", textAlign: "center", fieldName: "email" },
      { type: "text", label: "Phone", left: 525, top: 355, fontSize: 14, fontFamily: "Arial", fill: "#60A5FA", textAlign: "center", fieldName: "phone" },
    ],
  },
};

export function getCardTemplate(style: string): CardTemplate {
  return CARD_TEMPLATES[style] || CARD_TEMPLATES.centered;
}
