import { useState, useEffect, useCallback } from 'react';
import { getCampaign, updateCampaign } from '../services/api';
import type { Campaign, ApiErrorResponse } from '../types';
import axios from 'axios';

interface UseCampaignDetailResult {
  campaign: Campaign | null;
  loading: boolean;
  error: string | null;
  notFound: boolean;
  validationErrors: Record<string, string[]> | null;
  saving: boolean;
  refetch: () => void;
  save: (data: Partial<Omit<Campaign, 'createdAt'>>) => Promise<boolean>;
}

export function useCampaignDetail(id: string): UseCampaignDetailResult {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]> | null>(null);
  const [saving, setSaving] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const refetch = useCallback(() => {
    setRetryCount((c) => c + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setNotFound(false);

    getCampaign(id)
      .then((data) => {
        if (!cancelled) setCampaign(data);
      })
      .catch((err) => {
        if (!cancelled) {
          if (axios.isAxiosError(err) && err.response?.status === 404) {
            setNotFound(true);
          } else {
            setError(err?.response?.data?.message || err.message || 'An unexpected error occurred');
          }
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, retryCount]);

  const save = useCallback(
    async (data: Partial<Omit<Campaign, 'createdAt'>>): Promise<boolean> => {
      setSaving(true);
      setValidationErrors(null);
      try {
        const updated = await updateCampaign(id, data);
        setCampaign(updated);
        return true;
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 422) {
          const body = err.response.data as ApiErrorResponse;
          setValidationErrors(body.errors || {});
        } else {
          setError(err?.response?.data?.message || err.message || 'Failed to update campaign');
        }
        return false;
      } finally {
        setSaving(false);
      }
    },
    [id],
  );

  return { campaign, loading, error, notFound, validationErrors, saving, refetch, save };
}
