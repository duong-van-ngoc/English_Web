import { z } from "zod";

export const importRowSchema = z.object({
  word: z.string().min(1, "Từ vựng không được để trống"),
  phonetic: z.string().optional(),
  meaning: z.string().min(1, "Nghĩa không được để trống"),
  partOfSpeech: z.string().min(1, "Từ loại không được để trống"),
  example: z.string().optional(),
});

export const importBatchSchema = z.object({
  topicId: z.string().min(1, "Vui lòng chọn chủ đề"),
  file: z.any().refine((file) => file instanceof File, "Vui lòng chọn file hợp lệ"),
});
