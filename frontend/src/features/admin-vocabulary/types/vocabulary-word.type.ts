export type WordStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface VocabularyWord {
  id: string;
  topicId: string;
  word: string;
  phonetic?: string;
  meaning: string;
  example?: string;
  exampleVi?: string;
  audioUrl?: string;
  imageUrl?: string;
  partOfSpeech: string;
  status: WordStatus;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface VocabularyWordPayload {
  word: string;
  phonetic?: string;
  meaning: string;
  example?: string;
  exampleVi?: string;
  audioUrl?: string;
  imageUrl?: string;
  partOfSpeech: string;
  status?: WordStatus;
  tags?: string[];
}
