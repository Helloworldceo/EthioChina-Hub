import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(100),
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  university: z.string().trim().max(150).optional().or(z.literal("")),
  city: z.string().trim().max(100).optional().or(z.literal("")),
  program: z.string().trim().max(150).optional().or(z.literal("")),
  wechat: z.string().trim().max(100).optional().or(z.literal("")),
});

export const profileUpdateSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(100),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  university: z.string().trim().max(150).optional().or(z.literal("")),
  city: z.string().trim().max(100).optional().or(z.literal("")),
  program: z.string().trim().max(150).optional().or(z.literal("")),
  wechat: z.string().trim().max(100).optional().or(z.literal("")),
  studentIdOrDoc: z.string().trim().max(300).optional().or(z.literal("")),
});

export const resourceCategories = ["ANNOUNCEMENT", "EVENT", "GUIDE", "FAQ"] as const;

export const resourceSchema = z.object({
  title: z.string().trim().min(3, "Title is too short").max(200),
  body: z.string().trim().min(10, "Body is too short").max(10000),
  category: z.enum(resourceCategories),
  pinned: z.coerce.boolean().optional().default(false),
  published: z.coerce.boolean().optional().default(false),
});

export const requestCategories = [
  "VISA",
  "HOUSING",
  "ACADEMIC",
  "FINANCIAL",
  "EMERGENCY",
  "OTHER",
] as const;

export const requestStatuses = ["OPEN", "IN_PROGRESS", "RESOLVED"] as const;

export const supportRequestSchema = z.object({
  category: z.enum(requestCategories),
  description: z.string().trim().min(10, "Please add a bit more detail").max(5000),
});

export const postSchema = z.object({
  title: z.string().trim().min(3, "Title is too short").max(200),
  body: z.string().trim().min(20, "Tell a bit more of the story").max(10000),
});
