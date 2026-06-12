import type { ImportRow } from "../types/vocabulary-import.type";

export function buildImportErrors(row: Partial<ImportRow>): string[] {
  const errors: string[] = [];

  if (!row.word || !row.word.trim()) {
    errors.push("Từ vựng không được để trống");
  }

  if (!row.meaning || !row.meaning.trim()) {
    errors.push("Nghĩa tiếng Việt không được để trống");
  }

  if (!row.partOfSpeech || !row.partOfSpeech.trim()) {
    errors.push("Từ loại không được để trống");
  } else {
    const validParts = [
      "noun",
      "verb",
      "adjective",
      "adverb",
      "phrase",
      "noun phrase",
      "verb phrase",
      "phrasal verb",
      "pronoun",
      "preposition",
      "conjunction",
      "interjection",
    ];
    if (!validParts.includes(row.partOfSpeech.toLowerCase())) {
      errors.push(`Từ loại '${row.partOfSpeech}' không hợp lệ (chấp nhận: noun, verb, adjective, adverb, phrase, noun phrase, phrasal verb)`);
    }
  }

  return errors;
}
