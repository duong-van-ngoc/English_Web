import { useMutation, useQueryClient } from "@tanstack/react-query";
import { vocabularyImportService } from "../services/vocabulary-import.service";

export function useImportVocabulary(topicId: string) {
  const queryClient = useQueryClient();

  const validateMutation = useMutation({
    mutationFn: (file: File) => vocabularyImportService.uploadAndValidate(topicId, file),
  });

  const commitMutation = useMutation({
    mutationFn: (batchId: string) => vocabularyImportService.commitImport(batchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vocabulary-words", topicId] });
      queryClient.invalidateQueries({ queryKey: ["vocabulary-dashboard"] });
    },
  });

  return {
    validateFile: validateMutation.mutateAsync,
    isValidating: validateMutation.isPending,
    validationData: validateMutation.data,
    commitImport: commitMutation.mutateAsync,
    isCommitting: commitMutation.isPending,
  };
}
