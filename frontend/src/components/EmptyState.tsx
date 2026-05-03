import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { alpha } from '@mui/material/styles';
import type { SvgIconComponent } from '@mui/icons-material';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: SvgIconComponent;
}

/**
 * Reusable empty state component (RF3).
 *
 * Displays a muted icon, title and description centred
 * inside a dashed-border container matching the dark theme.
 */
export default function EmptyState({
  title = 'No campaigns found',
  description = 'Try adjusting your filters or check back later.',
  icon: Icon = SearchOffIcon,
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        py: 10,
        px: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        borderRadius: 3,
        border: (theme) => `1px dashed ${alpha(theme.palette.text.secondary, 0.25)}`,
        backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.4),
      }}
    >
      <Icon
        sx={{
          fontSize: 64,
          color: 'text.secondary',
          opacity: 0.5,
          mb: 2,
        }}
      />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
        {description}
      </Typography>
    </Box>
  );
}
