import { useMutation, useQueryClient } from "@tanstack/react-query";
import { vocabularyWordService } from "../services/vocabulary-word.service";

export function useArchiveWord(topicId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (wordId: string) => vocabularyWordService.archiveWord(wordId),
    onSuccess: (_, wordId) => {
      queryClient.invalidateQueries({ queryKey: ["vocabulary-word", wordId] });
      queryClient.invalidateQueries({ queryKey: ["vocabulary-words", topicId] });
      queryClient.invalidateQueries({ queryKey: ["vocabulary-dashboard"] });
    },
  });

  return {
    archiveWord: mutation.mutateAsync,
    isArchiving: mutation.isPending,
    error: mutation.error,
  };
}
