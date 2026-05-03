import { useState, useCallback } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CardMedia from '@mui/material/CardMedia';
import Skeleton from '@mui/material/Skeleton';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import LinkIcon from '@mui/icons-material/Link';
import ImageIcon from '@mui/icons-material/Image';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import { alpha } from '@mui/material/styles';
import type { Campaign } from '../types';

interface CampaignInfoCardProps {
  campaign: Campaign;
  loading: boolean;
  saving: boolean;
  validationErrors: Record<string, string[]> | null;
  onSave: (data: Partial<Omit<Campaign, 'createdAt'>>) => Promise<boolean>;
}

export default function CampaignInfoCard({
  campaign,
  loading,
  saving,
  validationErrors,
  onSave,
}: CampaignInfoCardProps) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: campaign.name,
    status: campaign.status,
    landingUrl: campaign.landingUrl,
    coverImageUrl: campaign.coverImageUrl,
  });

  const enterEdit = useCallback(() => {
    setForm({
      name: campaign.name,
      status: campaign.status,
      landingUrl: campaign.landingUrl,
      coverImageUrl: campaign.coverImageUrl,
    });
    setEditing(true);
  }, [campaign]);

  const handleSave = useCallback(async () => {
    const ok = await onSave(form);
    if (ok) setEditing(false);
  }, [form, onSave]);

  const handleCancel = useCallback(() => {
    setEditing(false);
  }, []);

  const fieldError = (field: string) => {
    const msgs = validationErrors?.[field];
    return msgs ? msgs.join(' ') : undefined;
  };

  const isActive = campaign.status === 1;
  const formattedDate = new Date(campaign.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  if (loading) {
    return (
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Skeleton variant="text" width="60%" height={32} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={160} sx={{ mb: 2, borderRadius: 2 }} />
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="50%" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Campaign Details
          </Typography>
          {!editing && (
            <Tooltip title="Edit campaign">
              <IconButton onClick={enterEdit} size="small"
                sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {!editing ? (
          <>
            <Box sx={{ mb: 2, borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
              {campaign.coverImageUrl ? (
                <CardMedia
                  component="img"
                  height="200"
                  image={campaign.coverImageUrl}
                  alt={campaign.name}
                  sx={{ objectFit: 'cover' }}
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              ) : null}
              <Box
                sx={{
                  display: campaign.coverImageUrl ? 'none' : 'flex',
                  height: 200,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.04),
                  color: 'text.secondary',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                <BrokenImageIcon sx={{ fontSize: 40, opacity: 0.4 }} />
                <Typography variant="caption" sx={{ opacity: 0.6 }}>No image available</Typography>
              </Box>
            </Box>

            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
              {campaign.name}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Chip
                label={isActive ? 'Active' : 'Paused'}
                size="small"
                sx={{
                  fontWeight: 600,
                  backgroundColor: (theme) =>
                    alpha(isActive ? theme.palette.success.main : theme.palette.warning.main, 0.15),
                  color: (theme) =>
                    isActive ? theme.palette.success.main : theme.palette.warning.main,
                }}
              />
              <Typography variant="caption" color="text.secondary">
                Created {formattedDate}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LinkIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="body2" component="a" href={campaign.landingUrl} target="_blank" rel="noopener"
                  sx={{ color: 'primary.main', textDecoration: 'none', wordBreak: 'break-all',
                    '&:hover': { textDecoration: 'underline' } }}>
                  {campaign.landingUrl}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ImageIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="body2" sx={{ color: 'text.secondary', wordBreak: 'break-all' }}>
                  {campaign.coverImageUrl}
                </Typography>
              </Box>
            </Box>
          </>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              error={!!fieldError('name')}
              helperText={fieldError('name')}
              fullWidth
            />
            <TextField
              label="Status"
              select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: Number(e.target.value) as 0 | 1 }))}
              error={!!fieldError('status')}
              helperText={fieldError('status')}
              fullWidth
            >
              <MenuItem value={1}>Active</MenuItem>
              <MenuItem value={0}>Paused</MenuItem>
            </TextField>
            <TextField
              label="Landing URL"
              value={form.landingUrl}
              onChange={(e) => setForm((f) => ({ ...f, landingUrl: e.target.value }))}
              error={!!fieldError('landingUrl')}
              helperText={fieldError('landingUrl')}
              fullWidth
            />
            <TextField
              label="Cover Image URL"
              value={form.coverImageUrl}
              onChange={(e) => setForm((f) => ({ ...f, coverImageUrl: e.target.value }))}
              error={!!fieldError('coverImageUrl')}
              helperText={fieldError('coverImageUrl')}
              fullWidth
            />
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button size="small" onClick={handleCancel} startIcon={<CloseIcon />}>
                Cancel
              </Button>
              <Button size="small" variant="contained" onClick={handleSave}
                disabled={saving} startIcon={<SaveIcon />}>
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
