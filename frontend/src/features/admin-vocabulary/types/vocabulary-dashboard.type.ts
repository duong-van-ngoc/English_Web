export interface VocabularyStats {
  totalTopics: number;
  totalWords: number;
  draftWords: number;
  needsAttentionCount: number;
}

export interface GrowthDataPoint {
  date: string;
  count: number;
}

export interface ContentHealthAlert {
  topicId: string;
  topicName: string;
  type: "image" | "audio" | "translation";
  missingCount: number;
}

export interface RecentlyUpdatedTopicSummary {
  id: string;
  name: string;
  wordCount: number;
  status: "DRAFT" | "PUBLISHED";
  updatedAt: string;
}

export interface VocabularyDashboardData {
  stats: VocabularyStats;
  growth: GrowthDataPoint[];
  healthAlerts: ContentHealthAlert[];
  recentTopics: RecentlyUpdatedTopicSummary[];
}
