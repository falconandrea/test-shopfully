import { Outlet, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CampaignIcon from '@mui/icons-material/Campaign';
import { alpha } from '@mui/material/styles';

/**
 * Root layout with glassmorphic AppBar and responsive content area.
 * Renders child routes via <Outlet />.
 */
export default function Layout() {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} component="div">
      <AppBar position="sticky" component="header">
        <Toolbar>
          <IconButton
            edge="start"
            color="primary"
            onClick={() => navigate('/')}
            aria-label="Go to campaigns list"
            sx={{
              mr: 1.5,
              background: (theme) => alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                background: (theme) => alpha(theme.palette.primary.main, 0.2),
              },
            }}
          >
            <CampaignIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #6C63FF 0%, #FF6B8A 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
            }}
            onClick={() => navigate('/')}
            role="link"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                navigate('/');
              }
            }}
          >
            Campaign Manager
          </Typography>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="lg"
        component="main"
        sx={{
          flex: 1,
          py: 4,
        }}
      >
        <Outlet />
      </Container>
    </Box>
  );
}
