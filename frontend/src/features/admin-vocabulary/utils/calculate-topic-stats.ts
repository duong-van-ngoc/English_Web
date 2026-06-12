import type { VocabularyWord } from "../types/vocabulary-word.type";

interface TopicStatsSummary {
  total: number;
  published: number;
  drafts: number;
  archived: number;
  hasMissingMedia: boolean;
}

export function calculateTopicStats(words: VocabularyWord[]): TopicStatsSummary {
  const stats = {
    total: words.length,
    published: 0,
    drafts: 0,
    archived: 0,
    hasMissingMedia: false,
  };

  words.forEach((w) => {
    if (w.status === "PUBLISHED") stats.published++;
    else if (w.status === "DRAFT") stats.drafts++;
    else if (w.status === "ARCHIVED") stats.archived++;

    if (!w.imageUrl || !w.audioUrl) {
      stats.hasMissingMedia = true;
    }
  });

  return stats;
}
