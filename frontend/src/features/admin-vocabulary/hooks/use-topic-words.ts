import { useQuery } from "@tanstack/react-query";
import { vocabularyWordService } from "../services/vocabulary-word.service";

export function useTopicWords(topicId: string) {
  const {
    data: words = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["vocabulary-words", topicId],
    queryFn: () => vocabularyWordService.getWordsByTopicId(topicId),
    enabled: Boolean(topicId),
  });

  return {
    words,
    isLoading,
    error,
    refetch,
  };
}
