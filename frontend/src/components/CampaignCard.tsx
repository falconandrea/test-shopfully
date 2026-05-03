import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import { alpha } from '@mui/material/styles';
import type { Campaign } from '../types';

interface CampaignCardProps {
  campaign: Campaign;
  isFavourite: boolean;
  onToggleFavourite: (id: number) => void;
}

/**
 * Individual campaign card component (RF1).
 *
 * Shows cover image, name, status chip, creation date,
 * and a favourite toggle heart icon. Clicking the card
 * navigates to the campaign detail page.
 */
export default function CampaignCard({
  campaign,
  isFavourite,
  onToggleFavourite,
}: CampaignCardProps) {
  const navigate = useNavigate();
  const isActive = campaign.status === 1;
  const formattedDate = new Date(campaign.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Favourite toggle — positioned over the cover image */}
      <Tooltip title={isFavourite ? 'Remove from favourites' : 'Add to favourites'}>
        <IconButton
          aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavourite(campaign.id);
          }}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 2,
            backgroundColor: (theme) => alpha(theme.palette.background.default, 0.6),
            backdropFilter: 'blur(8px)',
            transition: 'transform 0.2s ease, background-color 0.2s ease',
            '&:hover': {
              backgroundColor: (theme) => alpha(theme.palette.background.default, 0.85),
              transform: 'scale(1.15)',
            },
          }}
          size="small"
        >
          {isFavourite ? (
            <FavoriteIcon
              sx={{
                color: '#FF6B8A',
                transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                animation: 'none',
              }}
              fontSize="small"
            />
          ) : (
            <FavoriteBorderIcon
              sx={{ color: 'text.secondary' }}
              fontSize="small"
            />
          )}
        </IconButton>
      </Tooltip>

      <CardActionArea
        onClick={() => navigate(`/campaigns/${campaign.id}`)}
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        {/* Cover image */}
        {campaign.coverImageUrl ? (
          <CardMedia
            component="img"
            height="160"
            image={campaign.coverImageUrl}
            alt={campaign.name}
            sx={{
              objectFit: 'cover',
              borderBottom: (theme) => `1px solid ${alpha(theme.palette.divider, 0.5)}`,
            }}
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              // Hide broken image — show fallback
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
        ) : null}

        {/* Fallback if no cover or broken image */}
        <Box
          sx={{
            display: campaign.coverImageUrl ? 'none' : 'flex',
            flexDirection: 'column',
            height: 160,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
            borderBottom: (theme) => `1px solid ${alpha(theme.palette.divider, 0.5)}`,
            color: 'text.primary',
          }}
        >
          <BrokenImageIcon sx={{ fontSize: 40, opacity: 0.6, mb: 1 }} />
          <Typography variant="caption" sx={{ fontWeight: 600, opacity: 1, color: 'text.primary' }}>
            No image available
          </Typography>
        </Box>

        {/* Card content */}
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography
              variant="subtitle1"
              component="h2"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flexGrow: 1,
                mr: 1,
              }}
            >
              {campaign.name}
            </Typography>
            <Chip
              label={isActive ? 'Active' : 'Paused'}
              size="small"
              sx={{
                fontWeight: 700,
                backgroundColor: (theme) =>
                  alpha(isActive ? theme.palette.success.main : theme.palette.warning.main, 0.18),
                color: (theme) =>
                  isActive ? theme.palette.success.main : theme.palette.warning.main,
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: 'primary.light',
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
                px: 1,
                py: 0.5,
                borderRadius: 1,
              }}
            >
              #{campaign.id}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
              {formattedDate}
            </Typography>
          </Box>
        </CardContent>

      </CardActionArea>
    </Card>
  );
}
