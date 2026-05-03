import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CampaignDetailPage from '../pages/CampaignDetailPage';
import * as campaignHook from '../hooks/useCampaignDetail';
import * as creativesHook from '../hooks/useCreatives';

// Mock hooks
vi.mock('../hooks/useCampaignDetail');
vi.mock('../hooks/useCreatives');

describe('CampaignDetailPage', () => {
  const mockCampaign = {
    id: 1,
    name: 'Integrated Campaign',
    status: 1,
    landingUrl: 'https://test.com',
    coverImageUrl: 'https://test.com/img.jpg',
    createdAt: '2026-01-01T00:00:00Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock implementation
    vi.mocked(creativesHook.useCreatives).mockReturnValue({
      creatives: [],
      loading: false,
      error: null,
      validationErrors: null,
      uploading: false,
      upload: vi.fn(),
    });
  });

  it('shows global loading state initially', () => {
    vi.mocked(campaignHook.useCampaignDetail).mockReturnValue({
      campaign: null,
      loading: true,
      error: null,
      notFound: false,
      validationErrors: null,
      saving: false,
      refetch: vi.fn(),
      save: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/campaigns/1']}>
        <Routes>
          <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    // The page shows a global loading indicator or the InfoCard skeleton
    expect(screen.queryByText('Integrated Campaign')).not.toBeInTheDocument();
  });

  it('renders all sections when data is loaded', () => {
    vi.mocked(campaignHook.useCampaignDetail).mockReturnValue({
      campaign: mockCampaign,
      loading: false,
      error: null,
      notFound: false,
      validationErrors: null,
      saving: false,
      refetch: vi.fn(),
      save: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/campaigns/1']}>
        <Routes>
          <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getAllByText('Integrated Campaign').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/creatives/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/upload/i).length).toBeGreaterThan(0);
  });

  it('renders 404 state when campaign is not found', () => {
    vi.mocked(campaignHook.useCampaignDetail).mockReturnValue({
      campaign: null,
      loading: false,
      error: null,
      notFound: true,
      validationErrors: null,
      saving: false,
      refetch: vi.fn(),
      save: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/campaigns/999']}>
        <Routes>
          <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/campaign not found/i)).toBeInTheDocument();
    expect(screen.getAllByText(/back to campaigns/i).length).toBeGreaterThan(0);
  });

  it('renders error state and retry button', () => {
    const mockRefetch = vi.fn();
    vi.mocked(campaignHook.useCampaignDetail).mockReturnValue({
      campaign: null,
      loading: false,
      error: 'Failed to fetch campaign data',
      notFound: false,
      validationErrors: null,
      saving: false,
      refetch: mockRefetch,
      save: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/campaigns/1']}>
        <Routes>
          <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Failed to fetch campaign data')).toBeInTheDocument();
    const retryBtn = screen.getByText(/retry/i);
    expect(retryBtn).toBeInTheDocument();
    
    fireEvent.click(retryBtn);
    expect(mockRefetch).toHaveBeenCalled();
  });
});
