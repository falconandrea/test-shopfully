import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import type { Campaign, PaginationMeta, CampaignFilters, PaginatedResponse } from '../types';

interface UseCampaignsResult {
  campaigns: Campaign[];
  meta: PaginationMeta | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook to fetch campaigns with filters and pagination (RF10).
 *
 * Re-fetches automatically whenever the filters object changes.
 * Exposes a `refetch` function for manual retry on error.
 */
export function useCampaigns(filters: CampaignFilters): UseCampaignsResult {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const refetch = useCallback(() => {
    setRetryCount((c) => c + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    // Build query params, omitting empty values
    // Using explicit any to allow array in params
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: Record<string, any> = {};
    if (filters.q) params.q = filters.q;
    if (filters.status !== undefined && filters.status !== '') params.status = filters.status;
    if (filters.ids && filters.ids.length > 0) params.ids = filters.ids;
    params.page = filters.page ?? 1;
    params.limit = filters.limit ?? 12;

    api
      .get<PaginatedResponse<Campaign>>('/campaigns', { params })
      .then((res) => {
        if (!cancelled) {
          setCampaigns(res.data.data);
          setMeta(res.data.meta);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.response?.data?.message || err.message || 'An unexpected error occurred');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [JSON.stringify(filters), retryCount]);

  return { campaigns, meta, loading, error, refetch };
}
