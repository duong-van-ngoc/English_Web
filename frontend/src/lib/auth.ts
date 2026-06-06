const ACCESS_TOKEN_KEY = "accessToken";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getAccessToken() {
  if (typeof window === "undefined") {
    return null;
  }

  // Try cookie first
  const match = document.cookie.match(new RegExp("(^| )" + ACCESS_TOKEN_KEY + "=([^;]*)"));
  if (match) {
    return decodeURIComponent(match[2]);
  }

  if (!canUseStorage()) {
    return null;
  }

  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string) {
  if (typeof window === "undefined") {
    return;
  }

  if (canUseStorage()) {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }

  // Sync to cookie for middleware (expires in 7 days)
  document.cookie = `${ACCESS_TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=604800; SameSite=Lax`;
}

export function clearAccessToken() {
  if (typeof window === "undefined") {
    return;
  }

  if (canUseStorage()) {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  }

  // Clear cookie
  document.cookie = `${ACCESS_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}
