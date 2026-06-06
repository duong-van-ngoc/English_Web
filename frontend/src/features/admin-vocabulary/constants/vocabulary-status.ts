import type { TopicStatus } from "../types/vocabulary-topic.type";
import type { WordStatus } from "../types/vocabulary-word.type";

export const TOPIC_STATUS_LABELS: Record<TopicStatus, string> = {
  DRAFT: "Bản nháp",
  PUBLISHED: "Đã xuất bản",
  LOCKED: "Đã khóa",
};

export const WORD_STATUS_LABELS: Record<WordStatus, string> = {
  DRAFT: "Bản nháp",
  PUBLISHED: "Đã xuất bản",
  ARCHIVED: "Đã lưu trữ",
};

export const TOPIC_STATUS_COLORS: Record<TopicStatus, "info" | "success" | "danger"> = {
  DRAFT: "info",
  PUBLISHED: "success",
  LOCKED: "danger",
};

export const WORD_STATUS_COLORS: Record<WordStatus, "info" | "success" | "warning"> = {
  DRAFT: "info",
  PUBLISHED: "success",
  ARCHIVED: "warning",
};
