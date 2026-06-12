export type TopicStatus = "DRAFT" | "PUBLISHED" | "LOCKED";

export interface VocabularyTopic {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  status: TopicStatus;
  wordCount: number;
  moduleId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface VocabularyTopicPayload {
  name: string;
  description?: string;
  imageUrl?: string;
  status?: TopicStatus;
  moduleId?: string | null;
}
