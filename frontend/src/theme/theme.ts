import { createTheme, alpha } from '@mui/material/styles';

/**
 * Premium dark-mode-first MUI theme.
 *
 * Palette: deep charcoal background with electric blue accent.
 * Typography: Inter from Google Fonts.
 * Shape: slightly rounded corners (12px default).
 */

const ACCENT = '#6C63FF'; // Electric indigo
const ACCENT_LIGHT = '#9D97FF';
const BACKGROUND_DEFAULT = '#0B0E14';
const BACKGROUND_PAPER = '#131720';
const SURFACE_ELEVATED = '#1A1F2E';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: ACCENT,
      light: ACCENT_LIGHT,
      dark: '#4A42D4',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FF6B8A',
      light: '#FF8FA8',
      dark: '#D4456A',
    },
    background: {
      default: BACKGROUND_DEFAULT,
      paper: BACKGROUND_PAPER,
    },
    success: {
      main: '#4ADE80',
      dark: '#16A34A',
    },
    warning: {
      main: '#FBBF24',
      dark: '#D97706',
    },
    error: {
      main: '#F87171',
      dark: '#DC2626',
    },
    text: {
      primary: '#E8EAF0',
      secondary: '#8B92A5',
    },
    divider: alpha('#8B92A5', 0.12),
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica Neue", Arial, sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    subtitle1: {
      fontWeight: 500,
      color: '#8B92A5',
    },
    body2: {
      color: '#8B92A5',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: `${alpha('#8B92A5', 0.3)} transparent`,
          '&::-webkit-scrollbar': {
            width: 8,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: alpha('#8B92A5', 0.3),
            borderRadius: 4,
          },
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundColor: alpha(BACKGROUND_PAPER, 0.8),
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${alpha('#8B92A5', 0.08)}`,
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundColor: SURFACE_ELEVATED,
          border: `1px solid ${alpha('#8B92A5', 0.08)}`,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            borderColor: alpha(ACCENT, 0.3),
            boxShadow: `0 8px 32px ${alpha(ACCENT, 0.1)}`,
          },
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 24px',
        },
        contained: {
          background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_LIGHT} 100%)`,
          '&:hover': {
            background: `linear-gradient(135deg, ${ACCENT_LIGHT} 0%, ${ACCENT} 100%)`,
          },
        },
        outlined: {
          borderColor: alpha(ACCENT, 0.4),
          '&:hover': {
            borderColor: ACCENT,
            backgroundColor: alpha(ACCENT, 0.08),
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            '& fieldset': {
              borderColor: alpha('#8B92A5', 0.2),
            },
            '&:hover fieldset': {
              borderColor: alpha(ACCENT, 0.4),
            },
            '&.Mui-focused fieldset': {
              borderColor: ACCENT,
            },
          },
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: alpha('#8B92A5', 0.08),
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: SURFACE_ELEVATED,
          border: `1px solid ${alpha('#8B92A5', 0.12)}`,
          color: '#E8EAF0',
          fontSize: '0.8125rem',
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
