import { useMutation, useQueryClient } from "@tanstack/react-query";
import { vocabularyWordService } from "../services/vocabulary-word.service";

export function usePublishWord(topicId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (wordId: string) => vocabularyWordService.publishWord(wordId),
    onSuccess: (_, wordId) => {
      queryClient.invalidateQueries({ queryKey: ["vocabulary-word", wordId] });
      queryClient.invalidateQueries({ queryKey: ["vocabulary-words", topicId] });
      queryClient.invalidateQueries({ queryKey: ["vocabulary-dashboard"] });
    },
  });

  return {
    publishWord: mutation.mutateAsync,
    isPublishing: mutation.isPending,
    error: mutation.error,
  };
}
