import { api } from "@/lib/api";
import type { VocabularyWord, VocabularyWordPayload } from "../types/vocabulary-word.type";

export const vocabularyWordService = {
  getWordsByTopicId: async (topicId: string): Promise<VocabularyWord[]> => {
    const list = await api.getAdminTopicWords(topicId);
    return list.map((w: any) => ({
      id: w.id,
      topicId: w.topicId || "",
      word: w.word,
      phonetic: w.phonetic || "",
      meaning: w.meaning,
      example: w.example || "",
      exampleVi: w.exampleVi || "",
      partOfSpeech: w.partOfSpeech || "noun",
      status: w.status,
      tags: w.tags || [],
      createdAt: w.createdAt,
      updatedAt: w.updatedAt,
    }));
  },

  getWordById: async (id: string): Promise<VocabularyWord | null> => {
    const w = await api.getAdminTopicWord(id);
    if (!w) return null;
    return {
      id: w.id,
      topicId: w.topicId || "",
      word: w.word,
      phonetic: w.phonetic || "",
      meaning: w.meaning,
      example: w.example || "",
      exampleVi: w.exampleVi || "",
      partOfSpeech: w.partOfSpeech || "noun",
      status: w.status,
      tags: w.tags || [],
      createdAt: w.createdAt,
      updatedAt: w.updatedAt,
    };
  },

  createWord: async (topicId: string, payload: VocabularyWordPayload): Promise<VocabularyWord> => {
    const created = await api.createTopicWord(topicId, payload);
    return {
      id: created.id,
      topicId: created.topicId || "",
      word: created.word,
      phonetic: created.phonetic || "",
      meaning: created.meaning,
      example: created.example || "",
      exampleVi: created.exampleVi || "",
      partOfSpeech: created.partOfSpeech || "noun",
      status: created.status,
      tags: created.tags || [],
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    };
  },

  updateWord: async (id: string, payload: Partial<VocabularyWordPayload>): Promise<VocabularyWord> => {
    const updated = await api.updateTopicWord(id, payload);
    return {
      id: updated.id,
      topicId: updated.topicId || "",
      word: updated.word,
      phonetic: updated.phonetic || "",
      meaning: updated.meaning,
      example: updated.example || "",
      exampleVi: updated.exampleVi || "",
      partOfSpeech: updated.partOfSpeech || "noun",
      status: updated.status,
      tags: updated.tags || [],
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  },

  archiveWord: async (id: string): Promise<VocabularyWord> => {
    const updated = await api.unpublishTopicWord(id);
    return {
      id: updated.id,
      topicId: updated.topicId || "",
      word: updated.word,
      phonetic: updated.phonetic || "",
      meaning: updated.meaning,
      example: updated.example || "",
      exampleVi: updated.exampleVi || "",
      partOfSpeech: updated.partOfSpeech || "noun",
      status: updated.status,
      tags: updated.tags || [],
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  },

  publishWord: async (id: string): Promise<VocabularyWord> => {
    const updated = await api.publishTopicWord(id);
    return {
      id: updated.id,
      topicId: updated.topicId || "",
      word: updated.word,
      phonetic: updated.phonetic || "",
      meaning: updated.meaning,
      example: updated.example || "",
      exampleVi: updated.exampleVi || "",
      partOfSpeech: updated.partOfSpeech || "noun",
      status: updated.status,
      tags: updated.tags || [],
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  },
  publishAllWords: async (topicId: string): Promise<any> => {
    return api.publishAllTopicWords(topicId);
  },
};
