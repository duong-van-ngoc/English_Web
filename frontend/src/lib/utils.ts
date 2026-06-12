/**
 * Utility helper to join class names conditionally
 */
export function cn(...inputs: (string | undefined | null | boolean | Record<string, boolean>)[]) {
  return inputs
    .flatMap((input) => {
      if (!input) return [];
      if (typeof input === "string") return [input];
      return Object.entries(input)
        .filter(([_, val]) => val)
        .map(([key]) => key);
    })
    .join(" ");
}
