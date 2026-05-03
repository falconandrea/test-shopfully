import { useState, useEffect, useCallback } from 'react';
import { getCreatives, uploadCreative } from '../services/api';
import type { Creative, ApiErrorResponse } from '../types';
import axios from 'axios';

interface UseCreativesResult {
  creatives: Creative[];
  loading: boolean;
  error: string | null;
  validationErrors: Record<string, string[]> | null;
  uploading: boolean;
  upload: (file: File) => Promise<boolean>;
}

export function useCreatives(campaignId: string): UseCreativesResult {
  const [creatives, setCreatives] = useState<Creative[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]> | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchCreatives = useCallback(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getCreatives(campaignId)
      .then((data) => {
        if (!cancelled) setCreatives(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.response?.data?.message || err.message || 'Failed to load creatives');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [campaignId]);

  useEffect(() => {
    return fetchCreatives();
  }, [fetchCreatives]);

  const upload = useCallback(
    async (file: File): Promise<boolean> => {
      setUploading(true);
      setValidationErrors(null);
      try {
        const creative = await uploadCreative(campaignId, file);
        setCreatives((prev) => [...prev, creative]);
        return true;
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 422) {
          const body = err.response.data as ApiErrorResponse;
          setValidationErrors(body.errors || {});
        } else {
          setValidationErrors({ image: [err?.response?.data?.message || err.message || 'Upload failed'] });
        }
        return false;
      } finally {
        setUploading(false);
      }
    },
    [campaignId],
  );

  return { creatives, loading, error, validationErrors, uploading, upload };
}
