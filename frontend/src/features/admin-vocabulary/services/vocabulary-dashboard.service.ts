import { api } from "@/lib/api";
import type { VocabularyDashboardData } from "../types/vocabulary-dashboard.type";

export const vocabularyDashboardService = {
  getDashboardData: async (): Promise<VocabularyDashboardData> => {
    return api.getAdminVocabularyDashboard();
  },
};
