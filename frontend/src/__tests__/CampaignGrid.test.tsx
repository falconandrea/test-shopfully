import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CampaignGrid from '../components/CampaignGrid';
import type { Campaign, PaginationMeta } from '../types';

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Test Campaign',
    status: 1,
    landingUrl: 'https://example.com',
    coverImageUrl: 'https://example.com/img.jpg',
    createdAt: '2026-05-01T10:00:00Z',
  },
];

const mockMeta: PaginationMeta = {
  current_page: 2,
  last_page: 5,
  per_page: 12,
  total: 60,
};

describe('CampaignGrid & Pagination', () => {
  const mockToggle = vi.fn();
  const mockPageChange = vi.fn();
  const mockIsFavourite = vi.fn().mockReturnValue(false);

  // Mock useNavigate for the CampaignCard which is a child
  vi.mock('react-router-dom', () => ({
    useNavigate: () => vi.fn(),
  }));

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading skeletons when loading is true', () => {
    const { container } = render(
      <CampaignGrid
        campaigns={[]}
        meta={null}
        loading={true}
        isFavourite={mockIsFavourite}
        onToggleFavourite={mockToggle}
        onPageChange={mockPageChange}
      />
    );
    // 6 skeletons are rendered
    const skeletons = container.querySelectorAll('.MuiSkeleton-rectangular');
    expect(skeletons.length).toBe(6);
  });

  it('renders campaigns when loaded', () => {
    render(
      <CampaignGrid
        campaigns={mockCampaigns}
        meta={mockMeta}
        loading={false}
        isFavourite={mockIsFavourite}
        onToggleFavourite={mockToggle}
        onPageChange={mockPageChange}
      />
    );
    expect(screen.getByText('Test Campaign')).toBeInTheDocument();
  });

  it('renders pagination and handles Next / Prev clicks correctly', () => {
    render(
      <CampaignGrid
        campaigns={mockCampaigns}
        meta={mockMeta}
        loading={false}
        isFavourite={mockIsFavourite}
        onToggleFavourite={mockToggle}
        onPageChange={mockPageChange}
      />
    );

    expect(screen.getByText('Page 2 of 5')).toBeInTheDocument();

    const prevButton = screen.getByRole('button', { name: /previous/i });
    const nextButton = screen.getByRole('button', { name: /next/i });

    // Click Next
    fireEvent.click(nextButton);
    expect(mockPageChange).toHaveBeenCalledWith(3); // 2 + 1

    // Click Prev
    fireEvent.click(prevButton);
    expect(mockPageChange).toHaveBeenCalledWith(1); // 2 - 1
  });

  it('disables Prev on first page and Next on last page', () => {
    const edgeMeta: PaginationMeta = { ...mockMeta, current_page: 1, last_page: 1 };
    render(
      <CampaignGrid
        campaigns={mockCampaigns}
        meta={edgeMeta}
        loading={false}
        isFavourite={mockIsFavourite}
        onToggleFavourite={mockToggle}
        onPageChange={mockPageChange}
      />
    );

    // If last_page is 1, pagination controls might not even render as per our condition (meta.last_page > 1)
    // Let's test a case where last_page > 1 but we are on page 1
    const firstPageMeta: PaginationMeta = { ...mockMeta, current_page: 1, last_page: 5 };
    const { unmount } = render(
      <CampaignGrid
        campaigns={mockCampaigns}
        meta={firstPageMeta}
        loading={false}
        isFavourite={mockIsFavourite}
        onToggleFavourite={mockToggle}
        onPageChange={mockPageChange}
      />
    );

    const prevButton = screen.getAllByRole('button', { name: /previous/i })[0];
    expect(prevButton).toBeDisabled();
    
    unmount();

    // Test last page
    const lastPageMeta: PaginationMeta = { ...mockMeta, current_page: 5, last_page: 5 };
    render(
      <CampaignGrid
        campaigns={mockCampaigns}
        meta={lastPageMeta}
        loading={false}
        isFavourite={mockIsFavourite}
        onToggleFavourite={mockToggle}
        onPageChange={mockPageChange}
      />
    );

    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeDisabled();
  });
});
