import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const cardSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    ),
  designation: z.string().optional(),
  company: z.string().optional(),
  bio: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
  whatsapp: z.string().optional(),
  linkedin: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  location: z.string().optional(),
  accentColor: z.string().optional(),
  bgStyle: z.enum(["solid", "gradient", "glass"]).optional(),
  bgImage: z.string().optional(),
  fontFamily: z.string().optional(),
  cardStyle: z.string().optional(),
  borderColor: z.string().optional(),
  shadowStyle: z.string().optional(),
  buttonStyle: z.string().optional(),
  layoutStyle: z.string().optional(),
  imageShape: z.string().optional(),
  socialIconStyle: z.string().optional(),
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
  ogImage: z.string().optional(),
  allowIndexing: z.boolean().optional(),
  profileImage: z.string().optional(),
  companyLogo: z.string().optional(),
  templateId: z.string().optional(),
  visibility: z.enum(["PUBLIC", "UNLISTED", "PRIVATE"]).optional(),
  status: z.enum(["ACTIVE", "DRAFT", "ARCHIVED", "DISABLED"]).optional(),
  cardType: z.enum(["PERSONAL", "PROFESSIONAL", "BUSINESS", "PORTFOLIO", "EVENT"]).optional(),
  about: z.string().optional(),
  skills: z.string().optional(),
  enableContact: z.boolean().optional(),
});

export type CardInput = z.infer<typeof cardSchema>;

export const socialLinkSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  url: z.string().url("Please enter a valid URL"),
  label: z.string().optional(),
});
