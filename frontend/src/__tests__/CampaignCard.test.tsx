import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import CampaignCard from '../components/CampaignCard';
import type { Campaign } from '../types';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('CampaignCard', () => {
  const campaign: Campaign = {
    id: '123',
    name: 'Halloween Promo',
    status: 1,
    landingUrl: 'https://example.com',
    coverImageUrl: 'https://example.com/img.jpg',
    createdAt: '2026-10-01T10:00:00Z',
  };

  const mockToggleFavourite = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderCard = (props = {}) => {
    return render(
      <BrowserRouter>
        <CampaignCard
          campaign={campaign}
          isFavourite={false}
          onToggleFavourite={mockToggleFavourite}
          {...props}
        />
      </BrowserRouter>
    );
  };

  it('renders campaign details correctly', () => {
    renderCard();
    expect(screen.getByText('Halloween Promo')).toBeInTheDocument();
    expect(screen.getByText('#123')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument(); // Chip
  });

  it('renders paused status correctly', () => {
    renderCard({ campaign: { ...campaign, status: 0 } });
    expect(screen.getByText('Paused')).toBeInTheDocument();
  });

  it('calls onToggleFavourite when clicking the heart icon without navigating', () => {
    renderCard();
    
    const favButton = screen.getByLabelText('Add to favourites');
    fireEvent.click(favButton);

    expect(mockToggleFavourite).toHaveBeenCalledWith('123');
    // Ensure navigate was NOT called because we used e.stopPropagation()
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('navigates to detail page when clicking the card area', () => {
    renderCard();
    
    // The clickable area usually wraps the content
    const cardArea = screen.getByText('Halloween Promo').closest('.MuiButtonBase-root');
    expect(cardArea).toBeInTheDocument();
    
    if (cardArea) fireEvent.click(cardArea);
    
    expect(mockNavigate).toHaveBeenCalledWith('/campaigns/123');
  });

  it('renders fallback when no image is provided', () => {
    renderCard({ campaign: { ...campaign, coverImageUrl: '' } });
    expect(screen.getByText('No image available')).toBeInTheDocument();
  });
});
