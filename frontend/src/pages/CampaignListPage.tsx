import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

/**
 * Campaign list page — placeholder.
 * Will be implemented in a separate feature with:
 * - Paginated campaign cards (RF1)
 * - Filters by id, name, status (RF2)
 * - Loading / empty / error states (RF3)
 * - Favourite toggle (RF4)
 */
export default function CampaignListPage() {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Campaigns
      </Typography>
      <Typography variant="body2" sx={{ mb: 4 }}>
        Manage your advertising campaigns and creatives.
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
          Campaign list coming soon
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          This page will display all campaigns with filters, pagination, and favourite toggles.
        </Typography>
      </Box>
    </Box>
  );
}
