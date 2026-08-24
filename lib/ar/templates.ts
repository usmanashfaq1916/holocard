import type { ARTemplateType } from "@prisma/client";

export interface ARTemplate {
  type: ARTemplateType;
  name: string;
  description: string;
  thumbnail: string;
  scenes: {
    name: string;
    duration: number;
    transition: "NONE" | "FADE" | "SLIDE" | "SCALE";
    elements: {
      type: string;
      label: string;
      position: { x: number; y: number; z: number };
      scale: { x: number; y: number; z: number };
      animation?: { type: string; duration: number; delay: number };
      actions?: { type: string; label: string }[];
    }[];
  }[];
}

export const AR_TEMPLATES: Record<ARTemplateType, ARTemplate> = {
  CORPORATE_INTRO: {
    type: "CORPORATE_INTRO",
    name: "Corporate Intro",
    description: "Logo animation + company video + website + LinkedIn",
    thumbnail: "/templates/corporate-intro.svg",
    scenes: [
      {
        name: "Intro",
        duration: 5,
        transition: "FADE",
        elements: [
          {
            type: "3D",
            label: "Company Logo",
            position: { x: 0, y: 0.5, z: 0.3 },
            scale: { x: 0.5, y: 0.5, z: 0.5 },
            animation: { type: "rise", duration: 1, delay: 0 },
          },
          {
            type: "VIDEO",
            label: "Company Video",
            position: { x: 0, y: 0, z: 0.1 },
            scale: { x: 1.5, y: 1, z: 1 },
            animation: { type: "fade", duration: 0.5, delay: 0.8 },
          },
          {
            type: "BUTTON",
            label: "Website",
            position: { x: -0.4, y: -0.8, z: 0.2 },
            scale: { x: 1, y: 1, z: 1 },
            animation: { type: "fade", duration: 0.3, delay: 1.5 },
            actions: [{ type: "OPEN_URL", label: "Visit Website" }],
          },
          {
            type: "BUTTON",
            label: "LinkedIn",
            position: { x: 0.4, y: -0.8, z: 0.2 },
            scale: { x: 1, y: 1, z: 1 },
            animation: { type: "fade", duration: 0.3, delay: 1.8 },
            actions: [{ type: "OPEN_LINKEDIN", label: "LinkedIn" }],
          },
        ],
      },
    ],
  },
  CREATIVE_PORTFOLIO: {
    type: "CREATIVE_PORTFOLIO",
    name: "Creative Portfolio",
    description: "3D artwork + portfolio + Instagram",
    thumbnail: "/templates/creative-portfolio.svg",
    scenes: [
      {
        name: "Showcase",
        duration: 8,
        transition: "SLIDE",
        elements: [
          {
            type: "3D",
            label: "3D Artwork",
            position: { x: 0, y: 0.3, z: 0.5 },
            scale: { x: 0.8, y: 0.8, z: 0.8 },
            animation: { type: "rotate", duration: 3, delay: 0 },
          },
          {
            type: "IMAGE",
            label: "Portfolio Piece",
            position: { x: 0, y: -0.2, z: 0.1 },
            scale: { x: 1.2, y: 0.8, z: 1 },
            animation: { type: "slide", duration: 0.5, delay: 1 },
          },
          {
            type: "BUTTON",
            label: "Portfolio",
            position: { x: -0.3, y: -0.9, z: 0.2 },
            scale: { x: 1, y: 1, z: 1 },
            animation: { type: "fade", duration: 0.3, delay: 1.5 },
            actions: [{ type: "OPEN_URL", label: "View Portfolio" }],
          },
          {
            type: "BUTTON",
            label: "Instagram",
            position: { x: 0.3, y: -0.9, z: 0.2 },
            scale: { x: 1, y: 1, z: 1 },
            animation: { type: "fade", duration: 0.3, delay: 1.8 },
            actions: [{ type: "OPEN_INSTAGRAM", label: "Instagram" }],
          },
        ],
      },
    ],
  },
  DEVELOPER: {
    type: "DEVELOPER",
    name: "Developer",
    description: "3D laptop + GitHub + portfolio + LinkedIn",
    thumbnail: "/templates/developer.svg",
    scenes: [
      {
        name: "Code",
        duration: 7,
        transition: "FADE",
        elements: [
          {
            type: "3D",
            label: "3D Laptop",
            position: { x: 0, y: 0.2, z: 0.4 },
            scale: { x: 0.7, y: 0.7, z: 0.7 },
            animation: { type: "rise", duration: 1, delay: 0 },
          },
          {
            type: "TEXT",
            label: "Code Snippet",
            position: { x: 0, y: -0.3, z: 0.1 },
            scale: { x: 1, y: 1, z: 1 },
            animation: { type: "typewriter", duration: 2, delay: 0.5 },
          },
          {
            type: "BUTTON",
            label: "GitHub",
            position: { x: -0.4, y: -0.9, z: 0.2 },
            scale: { x: 1, y: 1, z: 1 },
            animation: { type: "fade", duration: 0.3, delay: 1.5 },
            actions: [{ type: "OPEN_GITHUB", label: "GitHub" }],
          },
          {
            type: "BUTTON",
            label: "LinkedIn",
            position: { x: 0.4, y: -0.9, z: 0.2 },
            scale: { x: 1, y: 1, z: 1 },
            animation: { type: "fade", duration: 0.3, delay: 1.8 },
            actions: [{ type: "OPEN_LINKEDIN", label: "LinkedIn" }],
          },
        ],
      },
    ],
  },
  REAL_ESTATE: {
    type: "REAL_ESTATE",
    name: "Real Estate",
    description: "3D building + property gallery + Call + WhatsApp",
    thumbnail: "/templates/real-estate.svg",
    scenes: [
      {
        name: "Property",
        duration: 8,
        transition: "SCALE",
        elements: [
          {
            type: "3D",
            label: "3D Building",
            position: { x: 0, y: 0.4, z: 0.5 },
            scale: { x: 0.6, y: 0.6, z: 0.6 },
            animation: { type: "rise", duration: 1.2, delay: 0 },
          },
          {
            type: "IMAGE",
            label: "Property Gallery",
            position: { x: 0, y: -0.2, z: 0.1 },
            scale: { x: 1.5, y: 1, z: 1 },
            animation: { type: "fade", duration: 0.5, delay: 1 },
          },
          {
            type: "BUTTON",
            label: "Call",
            position: { x: -0.4, y: -0.9, z: 0.2 },
            scale: { x: 1, y: 1, z: 1 },
            animation: { type: "fade", duration: 0.3, delay: 1.5 },
            actions: [{ type: "OPEN_PHONE", label: "Call Now" }],
          },
          {
            type: "BUTTON",
            label: "WhatsApp",
            position: { x: 0.4, y: -0.9, z: 0.2 },
            scale: { x: 1, y: 1, z: 1 },
            animation: { type: "fade", duration: 0.3, delay: 1.8 },
            actions: [{ type: "OPEN_WHATSAPP", label: "WhatsApp" }],
          },
        ],
      },
    ],
  },
  PRODUCT_SHOWCASE: {
    type: "PRODUCT_SHOWCASE",
    name: "Product Showcase",
    description: "3D product + demo video + website + Buy Now",
    thumbnail: "/templates/product-showcase.svg",
    scenes: [
      {
        name: "Demo",
        duration: 10,
        transition: "FADE",
        elements: [
          {
            type: "3D",
            label: "3D Product",
            position: { x: 0, y: 0.3, z: 0.6 },
            scale: { x: 0.8, y: 0.8, z: 0.8 },
            animation: { type: "rotate", duration: 4, delay: 0 },
          },
          {
            type: "VIDEO",
            label: "Demo Video",
            position: { x: 0, y: -0.1, z: 0.1 },
            scale: { x: 1.5, y: 1, z: 1 },
            animation: { type: "fade", duration: 0.5, delay: 1 },
          },
          {
            type: "BUTTON",
            label: "Website",
            position: { x: -0.3, y: -0.9, z: 0.2 },
            scale: { x: 1, y: 1, z: 1 },
            animation: { type: "fade", duration: 0.3, delay: 1.5 },
            actions: [{ type: "OPEN_URL", label: "Learn More" }],
          },
          {
            type: "BUTTON",
            label: "Buy Now",
            position: { x: 0.3, y: -0.9, z: 0.2 },
            scale: { x: 1, y: 1, z: 1 },
            animation: { type: "fade", duration: 0.3, delay: 1.8 },
            actions: [{ type: "OPEN_URL", label: "Buy Now" }],
          },
        ],
      },
    ],
  },
  PERSONAL_BRAND: {
    type: "PERSONAL_BRAND",
    name: "Personal Brand",
    description: "Animated portrait + social links + portfolio + contact",
    thumbnail: "/templates/personal-brand.svg",
    scenes: [
      {
        name: "Profile",
        duration: 8,
        transition: "FADE",
        elements: [
          {
            type: "3D",
            label: "Animated Portrait",
            position: { x: 0, y: 0.4, z: 0.4 },
            scale: { x: 0.6, y: 0.6, z: 0.6 },
            animation: { type: "float", duration: 3, delay: 0 },
          },
          {
            type: "TEXT",
            label: "Bio",
            position: { x: 0, y: -0.1, z: 0.1 },
            scale: { x: 1, y: 1, z: 1 },
            animation: { type: "fade", duration: 0.5, delay: 0.8 },
          },
          {
            type: "BUTTON",
            label: "Portfolio",
            position: { x: -0.5, y: -0.8, z: 0.2 },
            scale: { x: 1, y: 1, z: 1 },
            animation: { type: "fade", duration: 0.3, delay: 1.2 },
            actions: [{ type: "OPEN_URL", label: "Portfolio" }],
          },
          {
            type: "BUTTON",
            label: "LinkedIn",
            position: { x: 0, y: -0.8, z: 0.2 },
            scale: { x: 1, y: 1, z: 1 },
            animation: { type: "fade", duration: 0.3, delay: 1.5 },
            actions: [{ type: "OPEN_LINKEDIN", label: "LinkedIn" }],
          },
          {
            type: "BUTTON",
            label: "Contact",
            position: { x: 0.5, y: -0.8, z: 0.2 },
            scale: { x: 1, y: 1, z: 1 },
            animation: { type: "fade", duration: 0.3, delay: 1.8 },
            actions: [{ type: "OPEN_EMAIL", label: "Email" }],
          },
        ],
      },
    ],
  },
};

export function getARTemplate(type: ARTemplateType): ARTemplate {
  return AR_TEMPLATES[type];
}

export function getAllARTemplates(): ARTemplate[] {
  return Object.values(AR_TEMPLATES);
}
