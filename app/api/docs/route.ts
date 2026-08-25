import { NextResponse } from "next/server";

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL || "https://holocard.app";
}

export async function GET() {
  const baseUrl = getBaseUrl();

  const spec = {
    openapi: "3.0.3",
    info: {
      title: "HoloCard API",
      description: "API for HoloCard AR business card platform",
      version: "1.0.0",
      contact: { name: "HoloCard Support", email: "support@holocard.app" },
    },
    servers: [
      { url: baseUrl, description: "Production" },
      { url: "http://localhost:3000", description: "Development" },
    ],
  paths: {
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: { type: "string" },
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 8 },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Account created" },
          "409": { description: "Email already exists" },
          "429": { description: "Rate limited" },
        },
      },
    },
    "/api/cards": {
      get: {
        tags: ["Cards"],
        summary: "List user cards",
        security: [{ sessionAuth: [] }],
        responses: { "200": { description: "List of cards" } },
      },
      post: {
        tags: ["Cards"],
        summary: "Create a new card",
        security: [{ sessionAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "slug"],
                properties: {
                  name: { type: "string" },
                  slug: { type: "string" },
                  designation: { type: "string" },
                  company: { type: "string" },
                  phone: { type: "string" },
                  email: { type: "string" },
                  website: { type: "string" },
                },
              },
            },
          },
        },
        responses: { "201": { description: "Card created" } },
      },
    },
    "/api/cards/{id}": {
      get: {
        tags: ["Cards"],
        summary: "Get card by ID",
        security: [{ sessionAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Card data" }, "404": { description: "Not found" } },
      },
      patch: {
        tags: ["Cards"],
        summary: "Update card",
        security: [{ sessionAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Card updated" } },
      },
      delete: {
        tags: ["Cards"],
        summary: "Delete card",
        security: [{ sessionAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Card deleted" } },
      },
    },
    "/api/cards/by-slug/{slug}": {
      get: {
        tags: ["Cards"],
        summary: "Get card by slug (public)",
        parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Card data" }, "404": { description: "Not found" } },
      },
    },
    "/api/qr/{slug}": {
      get: {
        tags: ["QR"],
        summary: "Generate QR code for card",
        parameters: [
          { name: "slug", in: "path", required: true, schema: { type: "string" } },
          { name: "type", in: "query", schema: { type: "string", enum: ["ar", "card"], default: "ar" } },
          { name: "format", in: "query", schema: { type: "string", enum: ["png", "svg"], default: "png" } },
          { name: "size", in: "query", schema: { type: "integer", default: 300 } },
        ],
        responses: { "200": { description: "QR code image" } },
      },
    },
    "/api/analytics/track": {
      post: {
        tags: ["Analytics"],
        summary: "Track an analytics event",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["cardId", "eventType"],
                properties: {
                  cardId: { type: "string" },
                  eventType: { type: "string", enum: ["PROFILE_VIEW", "QR_SCAN", "QR_AR_SCAN", "QR_CARD_SCAN", "AR_LAUNCH", "CONTACT_SAVE"] },
                },
              },
            },
          },
        },
        responses: { "200": { description: "Event tracked" } },
      },
    },
    "/api/analytics/stats": {
      get: {
        tags: ["Analytics"],
        summary: "Get analytics stats",
        security: [{ sessionAuth: [] }],
        parameters: [
          { name: "cardId", in: "query", schema: { type: "string" } },
          { name: "range", in: "query", schema: { type: "string", enum: ["7d", "30d", "90d", "1y"], default: "30d" } },
        ],
        responses: { "200": { description: "Analytics data" } },
      },
    },
    "/api/contacts": {
      get: {
        tags: ["Contacts"],
        summary: "List user contacts",
        security: [{ sessionAuth: [] }],
        responses: { "200": { description: "List of contacts" } },
      },
      post: {
        tags: ["Contacts"],
        summary: "Save a contact (public)",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["cardId", "name", "email"],
                properties: {
                  cardId: { type: "string" },
                  name: { type: "string" },
                  email: { type: "string" },
                  phone: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
        },
        responses: { "201": { description: "Contact saved" } },
      },
    },
    "/api/ar/experiences": {
      get: {
        tags: ["AR"],
        summary: "List AR experiences",
        security: [{ sessionAuth: [] }],
        responses: { "200": { description: "List of experiences" } },
      },
      post: {
        tags: ["AR"],
        summary: "Create AR experience (idempotent)",
        security: [{ sessionAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["cardId", "name"],
                properties: {
                  cardId: { type: "string" },
                  name: { type: "string" },
                  templateType: { type: "string" },
                },
              },
            },
          },
        },
        responses: { "201": { description: "Experience created" }, "200": { description: "Experience already exists" } },
      },
    },
    "/api/ar/targets/upload": {
      post: {
        tags: ["AR"],
        summary: "Upload AR target image",
        security: [{ sessionAuth: [] }],
        requestBody: {
          content: { "multipart/form-data": { schema: { type: "object", properties: { file: { type: "string", format: "binary" }, experienceId: { type: "string" } } } } },
        },
        responses: { "201": { description: "Target uploaded" } },
      },
    },
    "/api/templates": {
      get: {
        tags: ["Templates"],
        summary: "List available templates",
        responses: { "200": { description: "List of templates" } },
      },
    },
    "/api/settings/profile": {
      put: {
        tags: ["Settings"],
        summary: "Update user profile",
        security: [{ sessionAuth: [] }],
        responses: { "200": { description: "Profile updated" } },
      },
    },
    "/api/settings/preferences": {
      get: {
        tags: ["Settings"],
        summary: "Get user preferences",
        security: [{ sessionAuth: [] }],
        responses: { "200": { description: "User preferences" } },
      },
      put: {
        tags: ["Settings"],
        summary: "Update user preferences",
        security: [{ sessionAuth: [] }],
        responses: { "200": { description: "Preferences updated" } },
      },
    },
    "/api/billing/checkout": {
      post: {
        tags: ["Billing"],
        summary: "Create Stripe checkout session",
        security: [{ sessionAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["plan"],
                properties: { plan: { type: "string", enum: ["PRO", "BUSINESS"] } },
              },
            },
          },
        },
        responses: { "200": { description: "Checkout URL" } },
      },
    },
  },
  components: {
    securitySchemes: {
      sessionAuth: {
        type: "apiKey",
        in: "cookie",
        name: "next-auth.session-token",
        description: "Session cookie from NextAuth.js",
      },
    },
  },
};
  return NextResponse.json(spec, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
