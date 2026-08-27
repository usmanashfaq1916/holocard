export interface ARElementTemplate {
  type: string;
  label: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  visible: boolean;
  metadata?: Record<string, unknown>;
  actions?: { type: string; payload?: Record<string, unknown>; label: string; order: number }[];
  order: number;
}

export interface ARSceneTemplate {
  name: string;
  duration: number;
  transitionType: string;
  elements: ARElementTemplate[];
}

export interface ARExperienceTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  scenes: ARSceneTemplate[];
}

export const AR_TEMPLATES: ARExperienceTemplate[] = [
  {
    id: "corporate-intro",
    name: "Corporate Intro",
    description: "Professional card reveal with name and title floating above the card.",
    category: "Corporate",
    thumbnail: "from-blue-600 to-blue-800",
    scenes: [
      {
        name: "Card Reveal",
        duration: 8,
        transitionType: "FADE",
        elements: [
          {
            type: "TEXT",
            label: "Name",
            position: { x: 0, y: 0.5, z: 0.1 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            visible: true,
            metadata: { text: "{{name}}", fontSize: 0.18, color: "#ffffff" },
            order: 0,
          },
          {
            type: "TEXT",
            label: "Title",
            position: { x: 0, y: 0.25, z: 0.1 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            visible: true,
            metadata: { text: "{{designation}} at {{company}}", fontSize: 0.08, color: "#94A3B8" },
            order: 1,
          },
          {
            type: "TEXT",
            label: "CTA",
            position: { x: 0, y: -0.2, z: 0.1 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            visible: true,
            metadata: { text: "Scan complete! Save my contact below.", fontSize: 0.06, color: "#60A5FA" },
            actions: [{ type: "SAVE_CONTACT", payload: {}, label: "Save Contact", order: 0 }],
            order: 2,
          },
        ],
      },
    ],
  },
  {
    id: "creative-portfolio",
    name: "Creative Portfolio",
    description: "Artistic reveal with floating elements and social links.",
    category: "Creative",
    thumbnail: "from-pink-500 to-orange-400",
    scenes: [
      {
        name: "Portfolio Reveal",
        duration: 10,
        transitionType: "SLIDE",
        elements: [
          {
            type: "TEXT",
            label: "Name",
            position: { x: 0, y: 0.6, z: 0.1 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            visible: true,
            metadata: { text: "{{name}}", fontSize: 0.2, color: "#ffffff" },
            order: 0,
          },
          {
            type: "BUTTON",
            label: "LinkedIn",
            position: { x: -0.4, y: 0, z: 0.1 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            visible: true,
            metadata: { label: "LinkedIn", bgColor: "#0A66C2" },
            actions: [{ type: "OPEN_LINKEDIN", payload: { url: "{{linkedin}}" }, label: "LinkedIn", order: 0 }],
            order: 1,
          },
          {
            type: "BUTTON",
            label: "Portfolio",
            position: { x: 0, y: 0, z: 0.1 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            visible: true,
            metadata: { label: "Website", bgColor: "#8B5CF6" },
            actions: [{ type: "OPEN_URL", payload: { url: "{{website}}" }, label: "Website", order: 0 }],
            order: 2,
          },
          {
            type: "BUTTON",
            label: "Contact",
            position: { x: 0.4, y: 0, z: 0.1 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            visible: true,
            metadata: { label: "Email", bgColor: "#059669" },
            actions: [{ type: "OPEN_EMAIL", payload: { url: "mailto:{{email}}" }, label: "Email", order: 0 }],
            order: 3,
          },
        ],
      },
    ],
  },
  {
    id: "minimal-clean",
    name: "Minimal Clean",
    description: "Simple, elegant reveal with just the essentials.",
    category: "Minimal",
    thumbnail: "from-gray-400 to-gray-600",
    scenes: [
      {
        name: "Simple Reveal",
        duration: 6,
        transitionType: "FADE",
        elements: [
          {
            type: "TEXT",
            label: "Name",
            position: { x: 0, y: 0.3, z: 0.1 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            visible: true,
            metadata: { text: "{{name}}", fontSize: 0.16, color: "#ffffff" },
            order: 0,
          },
          {
            type: "TEXT",
            label: "Title",
            position: { x: 0, y: 0.05, z: 0.1 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            visible: true,
            metadata: { text: "{{designation}}", fontSize: 0.08, color: "#CBD5E1" },
            order: 1,
          },
          {
            type: "TEXT",
            label: "Contact",
            position: { x: 0, y: -0.2, z: 0.1 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            visible: true,
            metadata: { text: "{{email}} · {{phone}}", fontSize: 0.06, color: "#94A3B8" },
            order: 2,
          },
        ],
      },
    ],
  },
  {
    id: "developer-showcase",
    name: "Developer Showcase",
    description: "Tech-focused layout with GitHub and project links.",
    category: "Developer",
    thumbnail: "from-green-600 to-emerald-700",
    scenes: [
      {
        name: "Dev Showcase",
        duration: 10,
        transitionType: "SCALE",
        elements: [
          {
            type: "TEXT",
            label: "Name",
            position: { x: 0, y: 0.5, z: 0.1 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            visible: true,
            metadata: { text: "{{name}}", fontSize: 0.18, color: "#10B981" },
            order: 0,
          },
          {
            type: "TEXT",
            label: "Bio",
            position: { x: 0, y: 0.2, z: 0.1 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            visible: true,
            metadata: { text: "{{bio}}", fontSize: 0.07, color: "#D1FAE5" },
            order: 1,
          },
          {
            type: "BUTTON",
            label: "GitHub",
            position: { x: -0.3, y: -0.2, z: 0.1 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            visible: true,
            metadata: { label: "GitHub", bgColor: "#333333" },
            actions: [{ type: "OPEN_GITHUB", payload: { url: "{{github}}" }, label: "GitHub", order: 0 }],
            order: 2,
          },
          {
            type: "BUTTON",
            label: "Website",
            position: { x: 0.3, y: -0.2, z: 0.1 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            visible: true,
            metadata: { label: "Website", bgColor: "#10B981" },
            actions: [{ type: "OPEN_URL", payload: { url: "{{website}}" }, label: "Website", order: 0 }],
            order: 3,
          },
        ],
      },
    ],
  },
  {
    id: "real-estate",
    name: "Real Estate",
    description: "Property showcase with 3D building, gallery and WhatsApp contact.",
    category: "Real Estate",
    thumbnail: "from-amber-500 to-orange-600",
    scenes: [
      {
        name: "Property Showcase",
        duration: 12,
        transitionType: "SLIDE",
        elements: [
          {
            type: "TEXT",
            label: "Agent Name",
            position: { x: 0, y: 0.6, z: 0.1 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            visible: true,
            metadata: { text: "{{name}}", fontSize: 0.16, color: "#F59E0B" },
            order: 0,
          },
          {
            type: "TEXT",
            label: "Title",
            position: { x: 0, y: 0.35, z: 0.1 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            visible: true,
            metadata: { text: "{{designation}}", fontSize: 0.08, color: "#FDE68A" },
            order: 1,
          },
          {
            type: "BUTTON",
            label: "WhatsApp",
            position: { x: -0.4, y: -0.1, z: 0.1 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            visible: true,
            metadata: { label: "WhatsApp", bgColor: "#25D366" },
            actions: [{ type: "OPEN_WHATSAPP", payload: { url: "{{whatsapp}}" }, label: "WhatsApp", order: 0 }],
            order: 2,
          },
          {
            type: "BUTTON",
            label: "Call",
            position: { x: 0, y: -0.1, z: 0.1 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            visible: true,
            metadata: { label: "Call", bgColor: "#16A34A" },
            actions: [{ type: "CALL", payload: { url: "tel:{{phone}}" }, label: "Call", order: 0 }],
            order: 3,
          },
          {
            type: "BUTTON",
            label: "Website",
            position: { x: 0.4, y: -0.1, z: 0.1 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            visible: true,
            metadata: { label: "Website", bgColor: "#F59E0B" },
            actions: [{ type: "OPEN_URL", payload: { url: "{{website}}" }, label: "Website", order: 0 }],
            order: 4,
          },
        ],
      },
    ],
  },
  {
    id: "product-showcase",
    name: "Product",
    description: "3D product display with video and Buy Now button.",
    category: "Product",
    thumbnail: "from-purple-500 to-indigo-600",
    scenes: [
      {
        name: "Product Display",
        duration: 10,
        transitionType: "SCALE",
        elements: [
          {
            type: "THREE_D",
            label: "3D Product",
            position: { x: 0, y: 0.3, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            visible: true,
            metadata: { shape: "torusKnot", color: "#8B5CF6", spinSpeed: 0.6 },
            order: 0,
          },
          {
            type: "TEXT",
            label: "Product Name",
            position: { x: 0, y: -0.3, z: 0.1 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            visible: true,
            metadata: { text: "{{name}}", fontSize: 0.12, color: "#ffffff" },
            order: 1,
          },
          {
            type: "BUTTON",
            label: "Buy Now",
            position: { x: 0, y: -0.55, z: 0.1 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            visible: true,
            metadata: { label: "Buy Now", bgColor: "#8B5CF6" },
            actions: [{ type: "OPEN_URL", payload: { url: "{{website}}" }, label: "Buy Now", order: 0 }],
            order: 2,
          },
        ],
      },
    ],
  },
  {
    id: "restaurant",
    name: "Restaurant",
    description: "Food gallery with menu, location and contact.",
    category: "Restaurant",
    thumbnail: "from-red-500 to-rose-600",
    scenes: [
      {
        name: "Restaurant Showcase",
        duration: 10,
        transitionType: "FADE",
        elements: [
          {
            type: "TEXT",
            label: "Restaurant Name",
            position: { x: 0, y: 0.5, z: 0.1 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            visible: true,
            metadata: { text: "{{name}}", fontSize: 0.16, color: "#EF4444" },
            order: 0,
          },
          {
            type: "TEXT",
            label: "Tagline",
            position: { x: 0, y: 0.25, z: 0.1 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            visible: true,
            metadata: { text: "Fine Dining & Craft Cocktails", fontSize: 0.07, color: "#FCA5A5" },
            order: 1,
          },
          {
            type: "BUTTON",
            label: "Menu",
            position: { x: -0.4, y: -0.1, z: 0.1 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            visible: true,
            metadata: { label: "View Menu", bgColor: "#EF4444" },
            actions: [{ type: "OPEN_URL", payload: { url: "{{website}}" }, label: "Menu", order: 0 }],
            order: 2,
          },
          {
            type: "BUTTON",
            label: "Reserve",
            position: { x: 0, y: -0.1, z: 0.1 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            visible: true,
            metadata: { label: "Reserve Table", bgColor: "#DC2626" },
            actions: [{ type: "CALL", payload: { url: "tel:{{phone}}" }, label: "Reserve", order: 0 }],
            order: 3,
          },
          {
            type: "BUTTON",
            label: "Location",
            position: { x: 0.4, y: -0.1, z: 0.1 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            visible: true,
            metadata: { label: "Directions", bgColor: "#B91C1C" },
            actions: [{ type: "OPEN_URL", payload: { url: "https://maps.google.com/?q={{location}}" }, label: "Location", order: 0 }],
            order: 4,
          },
        ],
      },
    ],
  },
];

export function getARTemplate(id: string): ARExperienceTemplate | undefined {
  return AR_TEMPLATES.find((t) => t.id === id);
}

export function getARTemplatesByCategory(category: string): ARExperienceTemplate[] {
  return AR_TEMPLATES.filter((t) => t.category === category);
}
