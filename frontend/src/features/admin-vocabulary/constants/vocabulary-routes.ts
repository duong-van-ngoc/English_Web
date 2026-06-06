export const VOCABULARY_ROUTES = {
  DASHBOARD: "/admin/vocabulary",
  TOPICS_LIST: "/admin/vocabulary/topics",
  ADD_TOPIC: "/admin/vocabulary/topics/add",
  TOPIC_DETAIL: (topicId: string) => `/admin/vocabulary/topics/${topicId}`,
  TOPIC_WORDS: (topicId: string) => `/admin/vocabulary/topics/${topicId}/words`,
  ADD_WORD: (topicId: string) => `/admin/vocabulary/topics/${topicId}/words/add`,
  IMPORT_WORD: (topicId: string) => `/admin/vocabulary/topics/${topicId}/words/import`,
  EDIT_WORD: (topicId: string, wordId: string) =>
    `/admin/vocabulary/topics/${topicId}/words/${wordId}/edit`,
  PREVIEW_WORD: (topicId: string, wordId: string) =>
    `/admin/vocabulary/topics/${topicId}/words/${wordId}/preview`,
  PREVIEW_STUDENT: (topicId: string) =>
    `/admin/vocabulary/topics/${topicId}/preview-student`,
  GLOBAL_IMPORT: "/admin/vocabulary/import",
  MEDIA: "/admin/vocabulary/media",
};
