import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { vocabularyImportService } from "../services/vocabulary-import.service";
import type { ImportRow, VocabularyImportBatch } from "../types/vocabulary-import.type";

export function useImportVocabulary(topicId: string) {
  const queryClient = useQueryClient();

  // Keep in-memory rows (contain imageFile references, not serializable to sessionStorage)
  const [inMemoryRows, setInMemoryRows] = useState<ImportRow[]>([]);

  // Image upload progress state
  const [imageProgress, setImageProgress] = useState({ uploaded: 0, total: 0 });

  const validateMutation = useMutation({
    mutationFn: (file: File) => vocabularyImportService.uploadAndValidate(topicId, file),
    onSuccess: (batch) => {
      // We need to reconstruct rows with imageFile from the batch returned by service.
      // The service attaches imageFile/imagePreviewUrl to rows before returning the batch.
      setInMemoryRows(batch.rows);
    },
  });

  const commitMutation = useMutation({
    mutationFn: (batchId: string) =>
      vocabularyImportService.commitImport(batchId, inMemoryRows, (uploaded, total) => {
        setImageProgress({ uploaded, total });
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vocabulary-words", topicId] });
      queryClient.invalidateQueries({ queryKey: ["vocabulary-dashboard"] });
      setImageProgress({ uploaded: 0, total: 0 });
    },
  });

  return {
    validateFile: validateMutation.mutateAsync,
    isValidating: validateMutation.isPending,
    validationData: validateMutation.data as VocabularyImportBatch | undefined,
    inMemoryRows,
    commitImport: commitMutation.mutateAsync,
    isCommitting: commitMutation.isPending,
    imageProgress,
  };
}
