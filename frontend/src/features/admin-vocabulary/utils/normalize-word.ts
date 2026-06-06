/**
 * Normalize input word to avoid spaces, lowercase it, or format cleanly
 */
export function normalizeWord(word: string): string {
  if (!word) return "";
  return word.trim().toLowerCase();
}
