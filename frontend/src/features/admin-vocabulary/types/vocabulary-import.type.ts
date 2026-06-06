export interface ImportRow {
  index: number;
  word: string;
  phonetic?: string;
  meaning: string;
  partOfSpeech: string;
  example?: string;
  isValid: boolean;
  errors: string[];
}

export interface VocabularyImportBatch {
  id: string;
  fileName: string;
  fileSize: number;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  status: "UPLOADED" | "VALIDATED" | "COMPLETED" | "FAILED";
  rows: ImportRow[];
  createdAt: string;
}
