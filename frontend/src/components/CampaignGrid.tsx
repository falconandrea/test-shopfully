import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CampaignCard from './CampaignCard';
import type { Campaign, PaginationMeta } from '../types';

interface CampaignGridProps {
  campaigns: Campaign[];
  meta: PaginationMeta | null;
  loading: boolean;
  isFavourite: (id: number) => boolean;
  onToggleFavourite: (id: number) => void;
  onPageChange: (page: number) => void;
}

/**
 * Skeleton loading card placeholder.
 */
function SkeletonCard() {
  return (
    <Card sx={{ height: '100%' }}>
      <Skeleton variant="rectangular" height={160} animation="wave" />
      <CardContent>
        <Skeleton variant="text" width="70%" height={28} animation="wave" />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Skeleton variant="rounded" width={64} height={24} animation="wave" />
          <Skeleton variant="text" width={80} height={20} animation="wave" />
        </Box>
      </CardContent>
    </Card>
  );
}

/**
 * Responsive campaign card grid with pagination controls (RF1).
 *
 * Shows skeleton cards while loading.
 * Renders CampaignCard components for each campaign.
 * Pagination: Previous / Next buttons with "Page X of Y" indicator.
 */
export default function CampaignGrid({
  campaigns,
  meta,
  loading,
  isFavourite,
  onToggleFavourite,
  onPageChange,
}: CampaignGridProps) {
  const skeletonCount = 6;

  return (
    <Box>
      <Grid container spacing={3}>
        {loading
          ? Array.from({ length: skeletonCount }).map((_, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={`skeleton-${i}`}>
                <SkeletonCard />
              </Grid>
            ))
          : campaigns.map((campaign) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={campaign.id}>
                <CampaignCard
                  campaign={campaign}
                  isFavourite={isFavourite(campaign.id)}
                  onToggleFavourite={onToggleFavourite}
                />
              </Grid>
            ))}
      </Grid>

      {/* Pagination controls */}
      {meta && meta.last_page > 1 && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            mt: 4,
            pt: 3,
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Button
            variant="outlined"
            size="small"
            startIcon={<NavigateBeforeIcon />}
            disabled={meta.current_page <= 1}
            onClick={() => onPageChange(meta.current_page - 1)}
          >
            Previous
          </Button>

          <Typography variant="body2" color="text.secondary">
            Page {meta.current_page} of {meta.last_page}
          </Typography>

          <Button
            variant="outlined"
            size="small"
            endIcon={<NavigateNextIcon />}
            disabled={meta.current_page >= meta.last_page}
            onClick={() => onPageChange(meta.current_page + 1)}
          >
            Next
          </Button>
        </Box>
      )}
    </Box>
  );
}
