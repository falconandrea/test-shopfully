/**
 * Cookie read/write helpers.
 * Used as a fallback when localStorage is unavailable (RF4).
 */

/**
 * Read a cookie value by name.
 * Returns null if the cookie does not exist.
 */
export function getCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp('(?:^|;\\s*)' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '=([^;]*)'),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Set a cookie with the given name, value, and expiry in days.
 */
export function setCookie(name: string, value: string, days: number): void {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}
