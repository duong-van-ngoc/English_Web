const apiOrigin = process.env.NEXT_PUBLIC_API_URL;

export function resolveMediaUrl(url?: string | null): string | null {
  if (!url) {
    return null;
  }

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  if (!apiOrigin) {
    return url;
  }

  try {
    return new URL(url, `${apiOrigin.replace(/\/$/, "")}/`).toString();
  } catch {
    return url;
  }
}
