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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['c1', 'c2']));
    const { result } = renderHook(() => useFavourites());
    expect(result.current.favourites).toEqual(['c1', 'c2']);
  });

  it('adds a favourite when toggled on', () => {
    const { result } = renderHook(() => useFavourites());

    act(() => {
      result.current.toggleFavourite('abc');
    });

    expect(result.current.favourites).toContain('abc');
    expect(result.current.isFavourite('abc')).toBe(true);
  });

  it('removes a favourite when toggled off', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['abc']));
    const { result } = renderHook(() => useFavourites());

    act(() => {
      result.current.toggleFavourite('abc');
    });

    expect(result.current.favourites).not.toContain('abc');
    expect(result.current.isFavourite('abc')).toBe(false);
  });

  it('toggle switches state back and forth', () => {
    const { result } = renderHook(() => useFavourites());

    act(() => result.current.toggleFavourite('x'));
    expect(result.current.isFavourite('x')).toBe(true);

    act(() => result.current.toggleFavourite('x'));
    expect(result.current.isFavourite('x')).toBe(false);

    act(() => result.current.toggleFavourite('x'));
    expect(result.current.isFavourite('x')).toBe(true);
  });

  it('persists favourites to localStorage', () => {
    const { result } = renderHook(() => useFavourites());

    act(() => {
      result.current.toggleFavourite('c1');
      result.current.toggleFavourite('c2');
    });

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(stored).toEqual(expect.arrayContaining(['c1', 'c2']));
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
      result.current.toggleFavourite('cookie-fav');
    });

    expect(result.current.isFavourite('cookie-fav')).toBe(true);

    // Verify it was written to a cookie
    expect(document.cookie).toContain(STORAGE_KEY);

    // Restore
    Storage.prototype.getItem = origGetItem;
    Storage.prototype.setItem = origSetItem;
    Storage.prototype.removeItem = origRemoveItem;
    vi.restoreAllMocks();
  });
});
