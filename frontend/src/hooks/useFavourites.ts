import { useState, useCallback } from 'react';
import { getCookie, setCookie } from '../utils/cookies';

const STORAGE_KEY = 'campaign_favourites';
const COOKIE_EXPIRY_DAYS = 365;

/**
 * Detect whether localStorage is available and working.
 */
function isLocalStorageAvailable(): boolean {
  try {
    const key = '__ls_test__';
    localStorage.setItem(key, '1');
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

/**
 * Read favourite IDs from the best available storage.
 */
function readFavourites(): string[] {
  try {
    if (isLocalStorageAvailable()) {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    }
  } catch {
    // fall through to cookie
  }

  const cookie = getCookie(STORAGE_KEY);
  if (cookie) {
    try {
      return JSON.parse(cookie);
    } catch {
      return [];
    }
  }
  return [];
}

/**
 * Write favourite IDs to the best available storage.
 */
function writeFavourites(ids: string[]): void {
  const json = JSON.stringify(ids);
  try {
    if (isLocalStorageAvailable()) {
      localStorage.setItem(STORAGE_KEY, json);
      return;
    }
  } catch {
    // fall through to cookie
  }
  setCookie(STORAGE_KEY, json, COOKIE_EXPIRY_DAYS);
}

/**
 * Custom hook to manage favourite campaign IDs (RF4, RF10).
 *
 * Persists to localStorage with cookie fallback.
 * Returns the current list plus helpers to query and toggle.
 */
export function useFavourites() {
  const [favourites, setFavourites] = useState<string[]>(readFavourites);

  const isFavourite = useCallback(
    (id: string) => favourites.includes(id),
    [favourites],
  );

  const toggleFavourite = useCallback((id: string) => {
    setFavourites((prev) => {
      const next = prev.includes(id)
        ? prev.filter((fav) => fav !== id)
        : [...prev, id];
      writeFavourites(next);
      return next;
    });
  }, []);

  return { favourites, isFavourite, toggleFavourite } as const;
}
