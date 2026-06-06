import type { UserTopicProgress } from "../types/vocabulary-progress.type";

/**
 * Calculates number of pending words when new words are added after student completed topic
 */
export function getNewWordsCount(progress: UserTopicProgress, currentTotalWords: number): number {
  if (!progress.completed) return 0;
  
  const diff = currentTotalWords - progress.totalWordsInTopic;
  return diff > 0 ? diff : 0;
}
