import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Campaign404Icon from '@mui/icons-material/Campaign';
import { useCampaignDetail } from '../hooks/useCampaignDetail';
import { useCreatives } from '../hooks/useCreatives';
import CampaignInfoCard from '../components/CampaignInfoCard';
import CreativesList from '../components/CreativesList';
import CreativeUpload from '../components/CreativeUpload';

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    campaign,
    loading,
    error,
    notFound,
    validationErrors,
    saving,
    refetch,
    save,
  } = useCampaignDetail(id!);

  const {
    creatives,
    loading: creativesLoading,
    validationErrors: uploadErrors,
    uploading,
    upload,
  } = useCreatives(id!);

  if (notFound) {
    return (
      <Box>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mb: 3 }}>
          Back to campaigns
        </Button>
        <Box sx={{
          textAlign: 'center', py: 8, color: 'text.secondary',
        }}>
          <Campaign404Icon sx={{ fontSize: 64, opacity: 0.3, mb: 2 }} />
          <Typography variant="h5" sx={{ mb: 1 }}>Campaign not found</Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            The campaign with ID "{id}" does not exist.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/')}>
            Back to campaigns
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mb: 3 }}>
        Back to campaigns
      </Button>

      <Box sx={{ mb: 3 }}>
        {loading ? (
          <Skeleton variant="text" width="50%" height={40} />
        ) : (
          <Typography variant="h4" sx={{ mb: 0.5 }}>
            {campaign?.name ?? 'Campaign Detail'}
          </Typography>
        )}
        <Typography variant="body2">
          {loading ? <Skeleton variant="text" width="30%" /> : `Campaign #${id}`}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}
          action={
            <Button color="inherit" size="small" startIcon={<RefreshIcon />} onClick={refetch}>
              Retry
            </Button>
          }>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          {campaign && (
            <CampaignInfoCard
              campaign={campaign}
              loading={loading}
              saving={saving}
              validationErrors={validationErrors}
              onSave={save}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <CreativesList creatives={creatives} loading={creativesLoading} />
            <CreativeUpload
              uploading={uploading}
              validationErrors={uploadErrors}
              onUpload={upload}
              disabled={campaign?.status === 0}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
