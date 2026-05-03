import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFavourites } from '../hooks/useFavourites';

const STORAGE_KEY = 'campaign_favourites';

describe('useFavourites', () => {
  beforeEach(() => {
    localStorage.clear();
    // Clear cookies
    document.cookie = `${STORAGE_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  });

  it('starts with an empty list when no data in storage', () => {
    const { result } = renderHook(() => useFavourites());
    expect(result.current.favourites).toEqual([]);
  });

  it('reads initial state from localStorage', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([1, 2]));
    const { result } = renderHook(() => useFavourites());
    expect(result.current.favourites).toEqual([1, 2]);
  });

  it('adds a favourite when toggled on', () => {
    const { result } = renderHook(() => useFavourites());

    act(() => {
      result.current.toggleFavourite(123);
    });

    expect(result.current.favourites).toContain(123);
    expect(result.current.isFavourite(123)).toBe(true);
  });

  it('removes a favourite when toggled off', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([123]));
    const { result } = renderHook(() => useFavourites());

    act(() => {
      result.current.toggleFavourite(123);
    });

    expect(result.current.favourites).not.toContain(123);
    expect(result.current.isFavourite(123)).toBe(false);
  });

  it('toggle switches state back and forth', () => {
    const { result } = renderHook(() => useFavourites());

    act(() => result.current.toggleFavourite(99));
    expect(result.current.isFavourite(99)).toBe(true);

    act(() => result.current.toggleFavourite(99));
    expect(result.current.isFavourite(99)).toBe(false);

    act(() => result.current.toggleFavourite(99));
    expect(result.current.isFavourite(99)).toBe(true);
  });

  it('persists favourites to localStorage', () => {
    const { result } = renderHook(() => useFavourites());

    act(() => {
      result.current.toggleFavourite(1);
      result.current.toggleFavourite(2);
    });

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(stored).toEqual(expect.arrayContaining([1, 2]));
  });

  it('falls back to cookies when localStorage throws', () => {
    // Make localStorage throw on every access
    const origGetItem = Storage.prototype.getItem;
    const origSetItem = Storage.prototype.setItem;
    const origRemoveItem = Storage.prototype.removeItem;

    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('localStorage disabled');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('localStorage disabled');
    });
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('localStorage disabled');
    });

    const { result } = renderHook(() => useFavourites());

    act(() => {
      result.current.toggleFavourite(555);
    });

    expect(result.current.isFavourite(555)).toBe(true);

    // Verify it was written to a cookie
    expect(document.cookie).toContain(STORAGE_KEY);

    // Restore
    Storage.prototype.getItem = origGetItem;
    Storage.prototype.setItem = origSetItem;
    Storage.prototype.removeItem = origRemoveItem;
    vi.restoreAllMocks();
  });
});
