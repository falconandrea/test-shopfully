import { useState, useCallback, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useCampaigns } from '../hooks/useCampaigns';
import { useFavourites } from '../hooks/useFavourites';
import CampaignFiltersBar from '../components/CampaignFilters';
import CampaignGrid from '../components/CampaignGrid';
import EmptyState from '../components/EmptyState';
import type { CampaignFilters } from '../types';

/**
 * Campaign list page — the main landing screen (RF1, RF2, RF3, RF4).
 *
 * Displays a filterable, paginated grid of campaign cards
 * with favourite toggle support and proper loading/empty/error states.
 */
export default function CampaignListPage() {
  const [filters, setFilters] = useState<CampaignFilters>({
    q: '',
    status: '',
    favouritesOnly: false,
    page: 1,
    limit: 12,
  });

  const { isFavourite, toggleFavourite, favourites } = useFavourites();

  // Compute effective filters to pass down to useCampaigns
  const effectiveFilters = useMemo(() => {
    if (filters.favouritesOnly) {
      // Pass the IDs to filter on the backend
      // If favourites is empty, we must pass a fake ID to return 0 results
      return { ...filters, ids: favourites.length > 0 ? favourites : ['non-existent-id'] };
    }
    return filters;
  }, [filters, favourites]);

  const { campaigns, meta, loading, error, refetch } = useCampaigns(effectiveFilters);

  const handleFilterChange = useCallback((partial: Partial<CampaignFilters>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  return (
    <Box>
      {/* Page header */}
      <Typography variant="h4" sx={{ mb: 0.5 }}>
        Campaigns
      </Typography>
      <Typography variant="body2" sx={{ mb: 3 }}>
        Manage your advertising campaigns and creatives.
      </Typography>

      {/* Filters */}
      <CampaignFiltersBar filters={filters} onFilterChange={handleFilterChange} />

      {/* Error state */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3, borderRadius: 2 }}
          action={
            <Button
              color="inherit"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={refetch}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Empty state — only shown when not loading and no error */}
      {!loading && !error && campaigns.length === 0 && <EmptyState />}

      {/* Campaign grid — shown when loading (skeleton) or when we have data */}
      {(loading || campaigns.length > 0) && (
        <CampaignGrid
          campaigns={campaigns}
          meta={meta}
          loading={loading}
          isFavourite={isFavourite}
          onToggleFavourite={toggleFavourite}
          onPageChange={handlePageChange}
        />
      )}
    </Box>
  );
}
