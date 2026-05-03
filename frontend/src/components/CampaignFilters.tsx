import { useState, useMemo, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import SearchIcon from '@mui/icons-material/Search';
import { debounce } from '../utils/debounce';
import type { CampaignFilters } from '../types';

interface CampaignFiltersBarProps {
  filters: CampaignFilters;
  onFilterChange: (filters: Partial<CampaignFilters>) => void;
}

const STATUS_OPTIONS = [
  { label: 'All statuses', value: '' },
  { label: 'Active', value: 1 },
  { label: 'Paused', value: 0 },
] as const;

/**
 * Filter bar for campaign list (RF2).
 *
 * Contains a debounced search field, a status dropdown, and a favourites toggle.
 * Any change resets pagination to page 1 via onFilterChange.
 */
export default function CampaignFiltersBar({ filters, onFilterChange }: CampaignFiltersBarProps) {
  // Keep a local state for the search input so the user sees keystrokes immediately
  const [searchValue, setSearchValue] = useState(filters.q ?? '');

  // Debounced handler — only fires API call after 300ms of inactivity
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        onFilterChange({ q: value, page: 1 });
      }, 300),
    [onFilterChange],
  );

  // Sync local searchValue if filters.q changes externally
  useEffect(() => {
    setSearchValue(filters.q ?? '');
  }, [filters.q]);

  // Clean up debounce timer on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchValue(value);
      debouncedSearch(value);
    },
    [debouncedSearch],
  );

  const handleStatusChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      onFilterChange({
        status: value === '' ? '' : (Number(value) as 0 | 1),
        page: 1,
      });
    },
    [onFilterChange],
  );

  const handleFavouritesChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onFilterChange({
        favouritesOnly: e.target.checked,
        page: 1,
      });
    },
    [onFilterChange],
  );

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        mb: 3,
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
      component="section"
      aria-label="Campaign filters"
    >
      <TextField
        label="Search"
        placeholder="Search by name or ID…"
        value={searchValue}
        onChange={handleSearchChange}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
        sx={{ flexGrow: 1, minWidth: 220 }}
      />

      <TextField
        select
        label="Status"
        value={filters.status === undefined ? '' : String(filters.status)}
        onChange={handleStatusChange}
        sx={{ minWidth: 160 }}
        slotProps={{
          select: {
            displayEmpty: true,
            inputProps: { 'aria-label': 'Filter by status' },
          },
        }}
      >
        {STATUS_OPTIONS.map((opt) => (
          <MenuItem key={String(opt.value)} value={String(opt.value)}>
            {opt.label}
          </MenuItem>
        ))}
      </TextField>

      <FormControlLabel
        control={
          <Switch
            checked={!!filters.favouritesOnly}
            onChange={handleFavouritesChange}
            color="primary"
            slotProps={{
              input: { 'aria-label': 'Show favourites only' }
            }}
          />
        }
        label="Favourites only"
        sx={{ color: 'text.secondary' }}
      />
    </Box>
  );
}
