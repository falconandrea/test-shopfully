import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useCreatives } from '../hooks/useCreatives';
import * as api from '../services/api';
import type { Creative } from '../types';

vi.mock('../services/api');

const mockCreatives: Creative[] = [
  { id: 'uuid-1', campaignId: 1, assetUrl: 'https://example.com/c1.jpg', createdAt: '2026-01-01T00:00:00Z' },
];

describe('useCreatives', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches creatives on mount', async () => {
    vi.mocked(api.getCreatives).mockResolvedValue(mockCreatives);

    const { result } = renderHook(() => useCreatives('1'));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.creatives).toEqual(mockCreatives);
    expect(api.getCreatives).toHaveBeenCalledWith('1');
  });

  it('adds a new creative after successful upload', async () => {
    vi.mocked(api.getCreatives).mockResolvedValue([]);
    const newCreative: Creative = {
      id: 'uuid-2',
      campaignId: 1,
      assetUrl: 'https://example.com/c2.jpg',
      createdAt: '2026-01-02T00:00:00Z',
    };
    vi.mocked(api.uploadCreative).mockResolvedValue(newCreative);

    const { result } = renderHook(() => useCreatives('1'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    let success = false;
    await act(async () => {
      success = await result.current.upload(file);
    });

    expect(success).toBe(true);
    expect(result.current.creatives).toHaveLength(1);
    expect(result.current.creatives[0]).toEqual(newCreative);
    expect(api.uploadCreative).toHaveBeenCalledWith('1', file);
  });

  it('handles validation errors (422) during upload', async () => {
    vi.mocked(api.getCreatives).mockResolvedValue([]);
    vi.mocked(api.uploadCreative).mockRejectedValue({
      isAxiosError: true,
      response: {
        status: 422,
        data: {
          errors: { image: ['The image dimensions must be 320x480.'] },
        },
      },
    });

    const { result } = renderHook(() => useCreatives('1'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    const file = new File(['bad'], 'bad.jpg', { type: 'image/jpeg' });
    let success = true;
    await act(async () => {
      success = await result.current.upload(file);
    });

    expect(success).toBe(false);
    expect(result.current.validationErrors).toEqual({
      image: ['The image dimensions must be 320x480.'],
    });
  });
});
