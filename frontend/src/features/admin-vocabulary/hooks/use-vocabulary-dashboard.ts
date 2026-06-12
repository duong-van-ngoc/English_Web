import { useQuery } from "@tanstack/react-query";
import { vocabularyDashboardService } from "../services/vocabulary-dashboard.service";

export function useVocabularyDashboard() {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["vocabulary-dashboard"],
    queryFn: () => vocabularyDashboardService.getDashboardData(),
  });

  return {
    dashboardData: data,
    isLoading,
    error,
    refetch,
  };
}
