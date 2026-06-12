import type { VocabularyWord } from "../types/vocabulary-word.type";

export interface MissingAssetsReport {
  missingImages: VocabularyWord[];
  missingAudio: VocabularyWord[];
}

export function detectMissingAssets(words: VocabularyWord[]): MissingAssetsReport {
  const report: MissingAssetsReport = {
    missingImages: [],
    missingAudio: [],
  };

  words.forEach((word) => {
    if (!word.imageUrl) {
      report.missingImages.push(word);
    }
    if (!word.audioUrl) {
      report.missingAudio.push(word);
    }
  });

  return report;
}
