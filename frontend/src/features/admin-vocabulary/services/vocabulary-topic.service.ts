import { api } from "@/lib/api";
import type { VocabularyTopic, VocabularyTopicPayload } from "../types/vocabulary-topic.type";

const DEFAULT_COURSE_ID = "on-thi-vstep-b1";

export const vocabularyTopicService = {
  getTopics: async (): Promise<VocabularyTopic[]> => {
    const list = await api.getAdminVocabularyTopics(DEFAULT_COURSE_ID);
    return list.map((t: any) => ({
      id: t.id,
      name: t.name,
      description: t.description || "",
      imageUrl: t.imageUrl || "",
      status: t.status === "DRAFT" ? "DRAFT" : t.status === "PUBLISHED" ? "PUBLISHED" : "LOCKED",
      wordCount: t._count?.vocabularies || 0,
      moduleId: t.moduleId || null,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));
  },

  getTopicById: async (id: string): Promise<VocabularyTopic | null> => {
    const t = await api.getAdminVocabularyTopic(id);
    if (!t) return null;
    return {
      id: t.id,
      name: t.name,
      description: t.description || "",
      imageUrl: t.imageUrl || "",
      status: t.status === "DRAFT" ? "DRAFT" : t.status === "PUBLISHED" ? "PUBLISHED" : "LOCKED",
      wordCount: t._count?.vocabularies || 0,
      moduleId: t.moduleId || null,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    };
  },

  createTopic: async (payload: VocabularyTopicPayload): Promise<VocabularyTopic> => {
    // Map status from mock to real ContentStatus
    const status = payload.status === "LOCKED" ? "ARCHIVED" : payload.status || "DRAFT";
    const created = await api.createVocabularyTopic(DEFAULT_COURSE_ID, {
      name: payload.name,
      description: payload.description,
      imageUrl: payload.imageUrl,
      icon: "eco", // default icon
      level: "B1", // default level
      status,
      moduleId: payload.moduleId,
    });
    return {
      id: created.id,
      name: created.name,
      description: created.description || "",
      imageUrl: created.imageUrl || "",
      status: created.status === "DRAFT" ? "DRAFT" : created.status === "PUBLISHED" ? "PUBLISHED" : "LOCKED",
      wordCount: 0,
      moduleId: created.moduleId || null,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    };
  },

  updateTopic: async (id: string, payload: Partial<VocabularyTopicPayload>): Promise<VocabularyTopic> => {
    const backendPayload: any = { ...payload };
    if (payload.status === "LOCKED") {
      backendPayload.status = "ARCHIVED";
    }
    const updated = await api.updateVocabularyTopic(id, backendPayload);
    return {
      id: updated.id,
      name: updated.name,
      description: updated.description || "",
      imageUrl: updated.imageUrl || "",
      status: updated.status === "DRAFT" ? "DRAFT" : updated.status === "PUBLISHED" ? "PUBLISHED" : "LOCKED",
      wordCount: updated._count?.vocabularies || 0,
      moduleId: updated.moduleId || null,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  },

  deleteTopic: async (id: string): Promise<void> => {
    await api.deleteVocabularyTopic(id);
  },

  lockTopic: async (id: string): Promise<VocabularyTopic> => {
    return vocabularyTopicService.updateTopic(id, { status: "LOCKED" });
  },

  unlockTopic: async (id: string): Promise<VocabularyTopic> => {
    return vocabularyTopicService.updateTopic(id, { status: "DRAFT" }); // sets back to draft
  },

  publishTopic: async (id: string): Promise<VocabularyTopic> => {
    const updated = await api.publishVocabularyTopic(id);
    return {
      id: updated.id,
      name: updated.name,
      description: updated.description || "",
      imageUrl: updated.imageUrl || "",
      status: updated.status === "DRAFT" ? "DRAFT" : updated.status === "PUBLISHED" ? "PUBLISHED" : "LOCKED",
      wordCount: updated._count?.vocabularies || 0,
      moduleId: updated.moduleId || null,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  },

  unpublishTopic: async (id: string): Promise<VocabularyTopic> => {
    const updated = await api.unpublishVocabularyTopic(id);
    return {
      id: updated.id,
      name: updated.name,
      description: updated.description || "",
      imageUrl: updated.imageUrl || "",
      status: updated.status === "DRAFT" ? "DRAFT" : updated.status === "PUBLISHED" ? "PUBLISHED" : "LOCKED",
      wordCount: updated._count?.vocabularies || 0,
      moduleId: updated.moduleId || null,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  },
};
