import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { alpha } from '@mui/material/styles';

/**
 * Campaign detail page — placeholder.
 * Will be implemented in a separate feature with:
 * - Full campaign info display (RF5)
 * - Inline editing: name, status, landingUrl, coverImageUrl (RF5)
 * - Creatives list (RF6)
 * - Creative upload form with client-side dimension check (RF7)
 * - Inline 422 error display (RF8)
 */
export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        sx={{ mb: 3 }}
      >
        Back to campaigns
      </Button>

      <Typography variant="h4" sx={{ mb: 1 }}>
        Campaign Detail
      </Typography>
      <Typography variant="body2" sx={{ mb: 4 }}>
        Campaign ID: <strong>{id}</strong>
      </Typography>

      <Box
        sx={{
          p: 6,
          borderRadius: 3,
          border: (theme) => `1px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
          backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.04),
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Campaign detail coming soon
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          This page will display campaign info, inline editing, creatives list, and upload form.
        </Typography>
      </Box>
    </Box>
  );
}
