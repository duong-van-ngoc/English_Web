import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vocabularyTopicService } from "../services/vocabulary-topic.service";
import type { VocabularyTopicPayload } from "../types/vocabulary-topic.type";

export function useTopicDetail(topicId: string) {
  const queryClient = useQueryClient();

  const {
    data: topic,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["vocabulary-topic", topicId],
    queryFn: () => vocabularyTopicService.getTopicById(topicId),
    enabled: Boolean(topicId),
  });

  const updateTopicMutation = useMutation({
    mutationFn: (payload: Partial<VocabularyTopicPayload>) =>
      vocabularyTopicService.updateTopic(topicId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vocabulary-topic", topicId] });
      queryClient.invalidateQueries({ queryKey: ["vocabulary-topics"] });
    },
  });

  const deleteTopicMutation = useMutation({
    mutationFn: () => vocabularyTopicService.deleteTopic(topicId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vocabulary-topics"] });
    },
  });

  return {
    topic,
    isLoading,
    error,
    refetch,
    updateTopic: updateTopicMutation.mutateAsync,
    isUpdating: updateTopicMutation.isPending,
    deleteTopic: deleteTopicMutation.mutateAsync,
    isDeleting: deleteTopicMutation.isPending,
  };
}
