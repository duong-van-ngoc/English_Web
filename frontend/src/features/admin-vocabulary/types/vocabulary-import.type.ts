export interface ImportRow {
  index: number;
  word: string;
  phonetic?: string;
  meaning: string;
  partOfSpeech: string;
  example?: string;
  exampleVi?: string;
  isValid: boolean;
  errors: string[];
  // Image support (populated when importing from ZIP)
  imageFile?: File;        // Raw file from ZIP images/ folder
  imagePreviewUrl?: string; // Object URL for browser preview (revoked after commit)
}

export interface VocabularyImportBatch {
  id: string;
  fileName: string;
  fileSize: number;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  /** How many valid rows have an associated image file */
  rowsWithImages: number;
  status: "UPLOADED" | "VALIDATED" | "COMPLETED" | "FAILED";
  rows: ImportRow[];
  createdAt: string;
}
