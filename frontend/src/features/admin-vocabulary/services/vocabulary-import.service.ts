import type { VocabularyImportBatch } from "../types/vocabulary-import.type";

export const vocabularyImportService = {
  uploadAndValidate: async (topicId: string, file: File): Promise<VocabularyImportBatch> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: "batch-" + Math.random().toString(36).substr(2, 9),
          fileName: file.name,
          fileSize: file.size,
          totalRows: 3,
          validRows: 2,
          invalidRows: 1,
          status: "VALIDATED",
          createdAt: new Date().toISOString(),
          rows: [
            {
              index: 1,
              word: "sustainable",
              phonetic: "/səˈsteɪnəbl/",
              meaning: "bền vững",
              partOfSpeech: "adjective",
              example: "This is a sustainable project.",
              isValid: true,
              errors: [],
            },
            {
              index: 2,
              word: "pollute",
              phonetic: "/pəˈluːt/",
              meaning: "làm ô nhiễm",
              partOfSpeech: "verb",
              example: "Factories pollute the air.",
              isValid: true,
              errors: [],
            },
            {
              index: 3,
              word: "",
              phonetic: "",
              meaning: "chất thải nguy hại",
              partOfSpeech: "xyz",
              example: "",
              isValid: false,
              errors: ["Từ vựng không được để trống", "Từ loại 'xyz' không hợp lệ"],
            },
          ],
        });
      }, 500);
    });
  },

  commitImport: async (batchId: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Committed import for batch ${batchId}`);
        resolve();
      }, 500);
    });
  },
};
