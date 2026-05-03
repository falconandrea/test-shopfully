import { useState, useRef, useCallback } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import UploadIcon from '@mui/icons-material/CloudUpload';
import { validateImageDimensions } from '../utils/validateImage';

interface CreativeUploadProps {
  uploading: boolean;
  validationErrors: Record<string, string[]> | null;
  onUpload: (file: File) => Promise<boolean>;
  disabled?: boolean;
}

export default function CreativeUpload({
  uploading,
  validationErrors,
  onUpload,
  disabled,
}: CreativeUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setLocalError(null);

      const { valid, width, height } = await validateImageDimensions(file);
      if (!valid) {
        setLocalError(`Image must be exactly 320x480px. Got ${width}x${height}px.`);
        if (inputRef.current) inputRef.current.value = '';
        return;
      }

      await onUpload(file);

      if (inputRef.current) inputRef.current.value = '';
    },
    [onUpload],
  );

  const allErrors = [
    ...(localError ? [localError] : []),
    ...(validationErrors?.image ?? []),
    ...(validationErrors?.status ?? []),
    ...(validationErrors?.campaign ?? []),
  ];

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Upload Creative</Typography>

        {allErrors.length > 0 && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {allErrors.map((msg, i) => (
              <Typography key={i} variant="body2">{msg}</Typography>
            ))}
          </Alert>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          disabled={uploading || disabled}
        />

        <Button
          variant="outlined"
          startIcon={<UploadIcon />}
          onClick={() => inputRef.current?.click()}
          disabled={uploading || disabled}
          fullWidth
        >
          {uploading ? 'Uploading...' : 'Select Image (320x480)'}
        </Button>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
          Max 3 creatives per campaign. Only 320x480px images accepted.
        </Typography>
      </CardContent>
    </Card>
  );
}
