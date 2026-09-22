import { createTheme } from '@mui/material/styles'

// OTL Gadgets refined brand system
export const colors = {
  black: '#080808',
  white: '#FFFFFF',
  bg: '#F6F8FA',
  red: '#E31C25',
  redDark: '#C4141C',
  redGlow: 'rgba(227, 28, 37, 0.18)',
  grey: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#1E293B',
    800: '#0F172A',
  },
}

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: colors.black, contrastText: colors.white },
    secondary: { main: colors.red, contrastText: colors.white },
    background: { default: colors.bg, paper: colors.white },
    text: { primary: colors.black, secondary: colors.grey[500] },
    error: { main: colors.red },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.025em' },
    h2: { fontWeight: 800, letterSpacing: '-0.02em' },
    h3: { fontWeight: 700, letterSpacing: '-0.015em' },
    h4: { fontWeight: 700, letterSpacing: '-0.01em' },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 700, textTransform: 'none', letterSpacing: '0.01em' },
  },
  shape: { borderRadius: 12 },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 22px',
          fontWeight: 700,
          transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
          '&:active': { transform: 'scale(0.98)' },
        },
        containedPrimary: {
          boxShadow: '0 4px 14px rgba(8, 8, 8, 0.15)',
          '&:hover': { boxShadow: '0 8px 20px rgba(8, 8, 8, 0.25)', transform: 'translateY(-1px)' },
        },
        containedSecondary: {
          boxShadow: '0 4px 14px rgba(227, 28, 37, 0.25)',
          '&:hover': { boxShadow: '0 8px 24px rgba(227, 28, 37, 0.38)', transform: 'translateY(-1px)', backgroundColor: colors.redDark },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': { borderWidth: '1.5px', backgroundColor: 'rgba(8, 8, 8, 0.04)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          borderColor: colors.grey[200],
          transition: 'all 250ms cubic-bezier(0.16, 1, 0.3, 1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          borderRadius: 8,
        },
      },
    },
    MuiContainer: {
      styleOverrides: { root: { paddingLeft: 20, paddingRight: 20 } },
    },
  },
})

export default theme

