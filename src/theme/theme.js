// src/theme/theme.js
import { createTheme } from '@mui/material/styles';

// --- PALETAS DE COLORES ---

// Verde Policial - Identidad Institucional
const policeGreen = {
  50: '#e8f5e9',
  100: '#c8e6c9',
  200: '#a5d6a7',
  300: '#81c784',
  400: '#66bb6a',
  500: '#4caf50', 
  600: '#43a047',
  700: '#2e7d32', // Color principal SISGEV-P
  800: '#1b5e20',
  900: '#0d3211',
};

// Neutros para interfaces limpias
const neutralColors = {
  50: '#fafafa',
  100: '#f5f5f5',
  200: '#eeeeee',
  900: '#212121',
};

// --- CONFIGURACIÓN DEL TEMA ---

export const getTheme = (mode = 'dark') => ({
  palette: {
    mode,
    primary: {
      light: policeGreen[300],
      main: policeGreen[700],
      dark: policeGreen[900],
      contrastText: '#ffffff'
    },
    background: {
      default: mode === 'light' ? neutralColors[50] : '#121212',
      paper: mode === 'light' ? '#ffffff' : '#1e1e1e'
    },
    text: {
      primary: mode === 'light' ? '#1a1a1a' : '#ffffff',
      secondary: mode === 'light' ? '#666666' : '#b0b0b0',
    }
  },

  // Tipografía basada en unidades rem para escalabilidad
  typography: {
    fontFamily: '"Roboto", "Segoe UI", "Arial", sans-serif',
    htmlFontSize: 16,
    h4: { fontSize: '1.5rem', fontWeight: 700 },
    h6: { fontSize: '1rem', fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 }
  },

  // Espaciado base de 0.25rem (4px)
  spacing: (factor) => `${0.25 * factor}rem`,

  // Definición de 25 sombras obligatorias para MUI
  shadows: [
    'none',
    '0 2px 4px rgba(0,0,0,0.1)',
    '0 4px 8px rgba(0,0,0,0.12)',
    '0 8px 16px rgba(0,0,0,0.14)',
    ...Array(21).fill('none')
  ],

  // --- OVERRIDES DE COMPONENTES ---
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem',
          padding: '0.5rem 1.5rem',
          transition: 'all 0.2s ease-in-out',
          '&:hover': { transform: 'translateY(-1px)' }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: '0.75rem'
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: mode === 'light' ? neutralColors[100] : '#252525',
          fontWeight: 'bold'
        }
      }
    }
  }
});
