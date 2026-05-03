import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useCampaignDetail } from '../hooks/useCampaignDetail';
import * as api from '../services/api';
import type { Campaign } from '../types';

vi.mock('../services/api');

const mockCampaign: Campaign = {
  id: 1,
  name: 'Test Campaign',
  status: 1,
  landingUrl: 'https://example.com',
  coverImageUrl: 'https://example.com/image.jpg',
  createdAt: '2026-01-01T00:00:00Z',
};

describe('useCampaignDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches and returns campaign data on mount', async () => {
    vi.mocked(api.getCampaign).mockResolvedValue(mockCampaign);

    const { result } = renderHook(() => useCampaignDetail('1'));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.campaign).toEqual(mockCampaign);
    expect(result.current.notFound).toBe(false);
    expect(api.getCampaign).toHaveBeenCalledWith('1');
  });

  it('handles 404 error correctly', async () => {
    vi.mocked(api.getCampaign).mockRejectedValue({
      isAxiosError: true,
      response: { status: 404 },
    });

    const { result } = renderHook(() => useCampaignDetail('999'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.notFound).toBe(true);
    expect(result.current.campaign).toBeNull();
  });

  it('updates campaign data correctly', async () => {
    vi.mocked(api.getCampaign).mockResolvedValue(mockCampaign);
    const updatedCampaign = { ...mockCampaign, name: 'Updated Name' };
    vi.mocked(api.updateCampaign).mockResolvedValue(updatedCampaign);

    const { result } = renderHook(() => useCampaignDetail('1'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    let success: boolean = false;
    await act(async () => {
      success = await result.current.save({ name: 'Updated Name' });
    });

    expect(success).toBe(true);
    expect(result.current.campaign?.name).toBe('Updated Name');
    expect(api.updateCampaign).toHaveBeenCalledWith('1', { name: 'Updated Name' });
  });

  it('handles validation errors (422) during save', async () => {
    vi.mocked(api.getCampaign).mockResolvedValue(mockCampaign);
    vi.mocked(api.updateCampaign).mockRejectedValue({
      isAxiosError: true,
      response: {
        status: 422,
        data: {
          message: 'The given data was invalid.',
          errors: { name: ['The name field is required.'] },
        },
      },
    });

    const { result } = renderHook(() => useCampaignDetail('1'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    let success: boolean = true;
    await act(async () => {
      success = await result.current.save({ name: '' });
    });

    expect(success).toBe(false);
    expect(result.current.validationErrors).toEqual({
      name: ['The name field is required.'],
    });
  });
});
