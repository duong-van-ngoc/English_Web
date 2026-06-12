import { z } from "zod";

export const courseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  level: z.string().min(1, "Level is required"),
  description: z.string().optional(),
});
