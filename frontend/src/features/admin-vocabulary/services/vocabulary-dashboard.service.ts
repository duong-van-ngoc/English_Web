import type { VocabularyDashboardData } from "../types/vocabulary-dashboard.type";

export const vocabularyDashboardService = {
  getDashboardData: async (): Promise<VocabularyDashboardData> => {
    // TODO: Replace with actual backend API call using axiosInstance/fetch
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          stats: {
            totalTopics: 15,
            totalWords: 1240,
            draftWords: 186,
            needsAttentionCount: 42,
          },
          growth: [
            { date: "Tuần 1", count: 800 },
            { date: "Tuần 2", count: 950 },
            { date: "Tuần 3", count: 1100 },
            { date: "Tuần 4", count: 1240 },
          ],
          healthAlerts: [
            {
              topicId: "1",
              topicName: "Business Travel",
              type: "image",
              missingCount: 12,
            },
            {
              topicId: "2",
              topicName: "Culinary Arts",
              type: "audio",
              missingCount: 8,
            },
            {
              topicId: "3",
              topicName: "Global Politics",
              type: "translation",
              missingCount: 4,
            },
          ],
          recentTopics: [
            {
              id: "space-exploration",
              name: "Space Exploration",
              wordCount: 84,
              status: "PUBLISHED",
              updatedAt: "2 giờ trước",
            },
            {
              id: "genetic-engineering",
              name: "Genetic Engineering",
              wordCount: 112,
              status: "DRAFT",
              updatedAt: "5 giờ trước",
            },
            {
              id: "urban-planning",
              name: "Urban Planning",
              wordCount: 67,
              status: "PUBLISHED",
              updatedAt: "Hôm qua",
            },
            {
              id: "macroeconomics",
              name: "Macroeconomics",
              wordCount: 156,
              status: "PUBLISHED",
              updatedAt: "2 ngày trước",
            },
            {
              id: "cognitive-science",
              name: "Cognitive Science",
              wordCount: 93,
              status: "DRAFT",
              updatedAt: "3 ngày trước",
            },
          ],
        });
      }, 300);
    });
  },
};
