import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CreativeUpload from '../components/CreativeUpload';
import * as validateImage from '../utils/validateImage';

// Mock validation utility
vi.mock('../utils/validateImage', () => ({
  validateImageDimensions: vi.fn(),
}));

describe('CreativeUpload', () => {
  const mockOnUpload = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders upload area when enabled', () => {
    render(
      <CreativeUpload
        uploading={false}
        validationErrors={null}
        onUpload={mockOnUpload}
        disabled={false}
      />
    );

    expect(screen.getByText(/select image/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  it('disables upload button when disabled prop is true', () => {
    render(
      <CreativeUpload
        uploading={false}
        validationErrors={null}
        onUpload={mockOnUpload}
        disabled={true}
      />
    );

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows error message when image dimensions are invalid (RF7)', async () => {
    vi.mocked(validateImage.validateImageDimensions).mockResolvedValue({
      valid: false,
      width: 100,
      height: 100
    });

    render(
      <CreativeUpload
        uploading={false}
        validationErrors={null}
        onUpload={mockOnUpload}
        disabled={false}
      />
    );

    const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByTestId('creative-file-input');
    
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText(/image must be exactly 320x480px/i)).toBeInTheDocument();
    });
    expect(mockOnUpload).not.toHaveBeenCalled();
  });

  it('calls onUpload when file is valid', async () => {
    vi.mocked(validateImage.validateImageDimensions).mockResolvedValue({
      valid: true,
      width: 320,
      height: 480
    });

    render(
      <CreativeUpload
        uploading={false}
        validationErrors={null}
        onUpload={mockOnUpload}
        disabled={false}
      />
    );

    const file = new File(['dummy content'], 'valid.jpg', { type: 'image/jpeg' });
    const input = screen.getByTestId('creative-file-input');
    
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(mockOnUpload).toHaveBeenCalledWith(file);
    });
  });
});
