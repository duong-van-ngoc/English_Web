import { useQuery } from "@tanstack/react-query";
import { vocabularyWordService } from "../services/vocabulary-word.service";

export function useWordDetail(wordId: string) {
  const {
    data: word,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["vocabulary-word", wordId],
    queryFn: () => vocabularyWordService.getWordById(wordId),
    enabled: Boolean(wordId),
  });

  return {
    word,
    isLoading,
    error,
    refetch,
  };
}
