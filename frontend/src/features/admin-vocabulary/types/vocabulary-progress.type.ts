export interface UserTopicProgress {
  userId: string;
  topicId: string;
  totalWordsLearned: number; // e.g. 80 words learned
  totalWordsInTopic: number; // total words at the time of learning
  completed: boolean;
  completedAt?: string;
  addedWordsPendingCount: number; // e.g. 20 new words added
  newWordsAdded: boolean; // flag to indicate admin added words to completed topic
}
