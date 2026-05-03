import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CampaignInfoCard from '../components/CampaignInfoCard';
import type { Campaign } from '../types';

const mockCampaign: Campaign = {
  id: 1,
  name: 'Summer Sale',
  status: 1,
  landingUrl: 'https://summer.com',
  coverImageUrl: 'https://summer.com/cover.jpg',
  createdAt: '2026-06-01T00:00:00Z',
};

describe('CampaignInfoCard', () => {
  const mockOnSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders campaign details in read mode', () => {
    render(
      <CampaignInfoCard
        campaign={mockCampaign}
        loading={false}
        saving={false}
        validationErrors={null}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByText('Summer Sale')).toBeInTheDocument();
    expect(screen.getByText('https://summer.com')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.queryByLabelText('Name')).not.toBeInTheDocument(); // TextField only in edit mode
  });

  it('toggles edit mode when clicking the edit button', () => {
    render(
      <CampaignInfoCard
        campaign={mockCampaign}
        loading={false}
        saving={false}
        validationErrors={null}
        onSave={mockOnSave}
      />
    );

    const editBtn = screen.getByLabelText('Edit campaign');
    fireEvent.click(editBtn);

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Summer Sale')).toBeInTheDocument();
  });

  it('calls onSave with updated data and closes edit mode on success', async () => {
    mockOnSave.mockResolvedValue(true);
    render(
      <CampaignInfoCard
        campaign={mockCampaign}
        loading={false}
        saving={false}
        validationErrors={null}
        onSave={mockOnSave}
      />
    );

    fireEvent.click(screen.getByLabelText('Edit campaign'));
    
    const nameInput = screen.getByLabelText('Name');
    fireEvent.change(nameInput, { target: { value: 'Winter Sale' } });
    
    fireEvent.click(screen.getByText('Save'));

    expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Winter Sale',
    }));

    await waitFor(() => {
      expect(screen.queryByLabelText('Name')).not.toBeInTheDocument();
    });
  });

  it('displays validation errors correctly', () => {
    const errors = {
      landingUrl: ['The landing url format is invalid.'],
    };

    render(
      <CampaignInfoCard
        campaign={mockCampaign}
        loading={false}
        saving={false}
        validationErrors={errors}
        onSave={mockOnSave}
      />
    );

    // Enter edit mode to see the validation errors in TextFields
    fireEvent.click(screen.getByLabelText('Edit campaign'));

    expect(screen.getByText('The landing url format is invalid.')).toBeInTheDocument();
  });

  it('shows loading skeletons when loading is true', () => {
    render(
      <CampaignInfoCard
        campaign={mockCampaign}
        loading={true}
        saving={false}
        validationErrors={null}
        onSave={mockOnSave}
      />
    );

    // Mui Skeletons have an aria-busy or specific role/class, 
    // but usually checking for lack of content is simpler here
    expect(screen.queryByText('Summer Sale')).not.toBeInTheDocument();
  });
});
