import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vocabularyTopicService } from "../services/vocabulary-topic.service";
import type { VocabularyTopicPayload } from "../types/vocabulary-topic.type";

export function useTopics() {
  const queryClient = useQueryClient();

  const {
    data: topics = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["vocabulary-topics"],
    queryFn: () => vocabularyTopicService.getTopics(),
  });

  const createTopicMutation = useMutation({
    mutationFn: (payload: VocabularyTopicPayload) =>
      vocabularyTopicService.createTopic(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vocabulary-topics"] });
    },
  });

  return {
    topics,
    isLoading,
    error,
    refetch,
    createTopic: createTopicMutation.mutateAsync,
    isCreating: createTopicMutation.isPending,
  };
}
