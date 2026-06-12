import { z } from "zod";

export const topicFormSchema = z.object({
  name: z
    .string()
    .min(2, "Tên chủ đề phải có ít nhất 2 ký tự")
    .max(100, "Tên chủ đề tối đa 100 ký tự"),
  description: z
    .string()
    .max(500, "Mô tả tối đa 500 ký tự")
    .optional(),
  imageUrl: z
    .string()
    .url("Đường dẫn ảnh không hợp lệ")
    .or(z.literal(""))
    .optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "LOCKED"]),
  moduleId: z.string().nullable().optional(),
});

export type TopicFormValues = z.infer<typeof topicFormSchema>;
