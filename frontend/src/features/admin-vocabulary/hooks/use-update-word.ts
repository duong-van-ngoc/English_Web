import { useMutation, useQueryClient } from "@tanstack/react-query";
import { vocabularyWordService } from "../services/vocabulary-word.service";
import type { VocabularyWordPayload } from "../types/vocabulary-word.type";

export function useUpdateWord(topicId: string, wordId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: Partial<VocabularyWordPayload>) =>
      vocabularyWordService.updateWord(wordId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vocabulary-word", wordId] });
      queryClient.invalidateQueries({ queryKey: ["vocabulary-words", topicId] });
    },
  });

  return {
    updateWord: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    error: mutation.error,
  };
}
