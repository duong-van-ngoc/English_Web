import { useMutation, useQueryClient } from "@tanstack/react-query";
import { vocabularyWordService } from "../services/vocabulary-word.service";

export function usePublishWord(topicId: string) {
  const queryClient = useQueryClient();

  const publishWordMutation = useMutation({
    mutationFn: (wordId: string) => vocabularyWordService.publishWord(wordId),
    onSuccess: (_, wordId) => {
      queryClient.invalidateQueries({ queryKey: ["vocabulary-word", wordId] });
      queryClient.invalidateQueries({ queryKey: ["vocabulary-words", topicId] });
      queryClient.invalidateQueries({ queryKey: ["vocabulary-dashboard"] });
    },
  });

  const publishAllMutation = useMutation({
    mutationFn: () => vocabularyWordService.publishAllWords(topicId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vocabulary-words", topicId] });
      queryClient.invalidateQueries({ queryKey: ["vocabulary-dashboard"] });
    },
  });

  return {
    publishWord: publishWordMutation.mutateAsync,
    isPublishing: publishWordMutation.isPending,
    publishAllWords: publishAllMutation.mutateAsync,
    isPublishingAll: publishAllMutation.isPending,
    error: publishWordMutation.error || publishAllMutation.error,
  };
}
