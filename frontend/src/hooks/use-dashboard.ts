import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useLearningDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: () => api.getDashboard(),
  });
}
