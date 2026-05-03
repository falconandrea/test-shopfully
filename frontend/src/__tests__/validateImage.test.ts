import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { validateImageDimensions } from '../utils/validateImage';

function mockImage(naturalWidth: number, naturalHeight: number, success: boolean = true) {
  return class MockImage {
    naturalWidth = naturalWidth;
    naturalHeight = naturalHeight;
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    src = '';

    constructor() {
      setTimeout(() => {
        if (success && this.onload) {
          this.onload();
        } else if (this.onerror) {
          this.onerror();
        }
      }, 0);
    }
  };
}

describe('validateImageDimensions', () => {
  const originalImage = globalThis.Image;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.Image = originalImage;
  });

  it('returns valid for exactly 320x480', async () => {
    globalThis.Image = mockImage(320, 480) as unknown as typeof Image;
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const result = await validateImageDimensions(file);
    expect(result.valid).toBe(true);
    expect(result.width).toBe(320);
    expect(result.height).toBe(480);
  });

  it('returns invalid for wrong width', async () => {
    globalThis.Image = mockImage(319, 480) as unknown as typeof Image;
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const result = await validateImageDimensions(file);
    expect(result.valid).toBe(false);
    expect(result.width).toBe(319);
    expect(result.height).toBe(480);
  });

  it('returns invalid for wrong height', async () => {
    globalThis.Image = mockImage(320, 479) as unknown as typeof Image;
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const result = await validateImageDimensions(file);
    expect(result.valid).toBe(false);
    expect(result.width).toBe(320);
    expect(result.height).toBe(479);
  });

  it('returns invalid for both dimensions wrong', async () => {
    globalThis.Image = mockImage(100, 100) as unknown as typeof Image;
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const result = await validateImageDimensions(file);
    expect(result.valid).toBe(false);
    expect(result.width).toBe(100);
    expect(result.height).toBe(100);
  });

  it('returns invalid when image fails to load', async () => {
    globalThis.Image = mockImage(0, 0, false) as unknown as typeof Image;
    const file = new File(['not-an-image'], 'bad.png', { type: 'image/png' });
    const result = await validateImageDimensions(file);
    expect(result.valid).toBe(false);
    expect(result.width).toBe(0);
    expect(result.height).toBe(0);
  });
});
