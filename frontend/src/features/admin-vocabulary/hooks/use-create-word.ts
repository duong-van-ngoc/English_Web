import { useMutation, useQueryClient } from "@tanstack/react-query";
import { vocabularyWordService } from "../services/vocabulary-word.service";
import type { VocabularyWordPayload } from "../types/vocabulary-word.type";

export function useCreateWord(topicId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: VocabularyWordPayload) =>
      vocabularyWordService.createWord(topicId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vocabulary-words", topicId] });
      queryClient.invalidateQueries({ queryKey: ["vocabulary-dashboard"] });
    },
  });

  return {
    createWord: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
}
