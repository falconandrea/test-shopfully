const REQUIRED_WIDTH = 320;
const REQUIRED_HEIGHT = 480;

export function validateImageDimensions(file: File): Promise<{ valid: boolean; width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        valid: img.naturalWidth === REQUIRED_WIDTH && img.naturalHeight === REQUIRED_HEIGHT,
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ valid: false, width: 0, height: 0 });
    };

    img.src = url;
  });
}
