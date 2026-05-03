import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import CampaignFiltersBar from '../components/CampaignFilters';
import type { CampaignFilters } from '../types';

describe('CampaignFiltersBar', () => {
  const defaultFilters: CampaignFilters = {
    q: '',
    status: '',
    favouritesOnly: false,
    page: 1,
    limit: 12,
  };

  const mockOnFilterChange = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders search, status select, and favourites toggle', () => {
    render(
      <CampaignFiltersBar filters={defaultFilters} onFilterChange={mockOnFilterChange} />
    );

    expect(screen.getByPlaceholderText('Search by name or ID…')).toBeInTheDocument();
    // Material UI selects map to a role="combobox"
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByLabelText('Favourites only')).toBeInTheDocument();
  });

  it('debounces the search input correctly', async () => {
    render(
      <CampaignFiltersBar filters={defaultFilters} onFilterChange={mockOnFilterChange} />
    );

    const searchInput = screen.getByPlaceholderText('Search by name or ID…');
    
    // Type into the input using fireEvent
    fireEvent.change(searchInput, { target: { value: 'test query' } });

    // The handler should NOT have been called immediately
    expect(mockOnFilterChange).not.toHaveBeenCalled();

    // Fast-forward time past the debounce delay (300ms)
    vi.advanceTimersByTime(300);

    // Now it should have been called
    expect(mockOnFilterChange).toHaveBeenCalledWith({ q: 'test query', page: 1 });
  });

  it('calls onFilterChange when favourites toggle is clicked', async () => {
    render(
      <CampaignFiltersBar filters={defaultFilters} onFilterChange={mockOnFilterChange} />
    );

    const toggle = screen.getByLabelText('Favourites only');
    
    fireEvent.click(toggle);

    expect(mockOnFilterChange).toHaveBeenCalledWith({ favouritesOnly: true, page: 1 });
  });
});
