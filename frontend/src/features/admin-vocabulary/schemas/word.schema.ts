import { z } from "zod";

export const wordFormSchema = z.object({
  word: z
    .string()
    .min(1, "Từ vựng không được để trống")
    .max(100, "Từ vựng quá dài"),
  phonetic: z
    .string()
    .max(100, "Phiên âm quá dài")
    .optional(),
  meaning: z
    .string()
    .min(1, "Nghĩa tiếng Việt không được để trống")
    .max(255, "Nghĩa tiếng Việt quá dài"),
  example: z
    .string()
    .max(500, "Ví dụ quá dài")
    .optional(),
  audioUrl: z
    .string()
    .url("Đường dẫn audio không hợp lệ")
    .or(z.literal(""))
    .optional(),
  imageUrl: z
    .string()
    .url("Đường dẫn ảnh không hợp lệ")
    .or(z.literal(""))
    .optional(),
  partOfSpeech: z.string().min(1, "Từ loại bắt buộc chọn"),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  tags: z.array(z.string()).optional(),
});

export type WordFormValues = z.infer<typeof wordFormSchema>;
