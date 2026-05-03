import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import ImageIcon from '@mui/icons-material/Image';
import type { Creative } from '../types';

interface CreativesListProps {
  creatives: Creative[];
  loading: boolean;
}

export default function CreativesList({ creatives, loading }: CreativesListProps) {
  if (loading) {
    return (
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Creatives</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 2 }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={180} sx={{ borderRadius: 2 }} />
            ))}
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Creatives ({creatives.length})
        </Typography>

        {creatives.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
            <ImageIcon sx={{ fontSize: 40, opacity: 0.3, mb: 1 }} />
            <Typography variant="body2">No creatives yet</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 2 }}>
            {creatives.map((creative) => {
              const formattedDate = new Date(creative.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              });
              return (
                <Box key={creative.id} sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
                  <Box
                    component="img"
                    src={creative.assetUrl}
                    alt={`Creative ${creative.id}`}
                    sx={{
                      width: '100%',
                      height: 180,
                      objectFit: 'cover',
                      borderRadius: 2,
                      display: 'block',
                    }}
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <Box sx={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                    px: 1, py: 0.5, borderBottomLeftRadius: 8, borderBottomRightRadius: 8,
                  }}>
                    <Typography variant="caption" sx={{ color: '#fff', fontWeight: 500 }}>
                      {formattedDate}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
