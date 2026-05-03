import axios from 'axios';
import type { Campaign, Creative, PaginatedResponse, CampaignFilters } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export async function getCampaigns(filters: CampaignFilters): Promise<PaginatedResponse<Campaign>> {
  const params: Record<string, unknown> = {};
  if (filters.q) params.q = filters.q;
  if (filters.status !== undefined && filters.status !== '') params.status = filters.status;
  if (filters.ids && filters.ids.length > 0) params.ids = filters.ids;
  params.page = filters.page ?? 1;
  params.limit = filters.limit ?? 12;
  const res = await api.get<PaginatedResponse<Campaign>>('/campaigns', { params });
  return res.data;
}

export async function getCampaign(id: string): Promise<Campaign> {
  const res = await api.get<{ data: Campaign }>(`/campaigns/${id}`);
  return res.data.data;
}

export async function updateCampaign(id: string, data: Partial<Omit<Campaign, 'createdAt'>>): Promise<Campaign> {
  const res = await api.put<{ data: Campaign }>(`/campaigns/${id}`, { id: Number(id), ...data });
  return res.data.data;
}

export async function getCreatives(campaignId: string): Promise<Creative[]> {
  const res = await api.get<{ data: Creative[] }>(`/campaigns/${campaignId}/creatives`);
  return res.data.data;
}

export async function uploadCreative(campaignId: string, file: File): Promise<Creative> {
  const formData = new FormData();
  formData.append('image', file);
  const res = await api.post<{ data: Creative }>(`/campaigns/${campaignId}/creatives`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.data;
}

export default api;
