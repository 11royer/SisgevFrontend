// src/theme/theme.js
import { createTheme } from '@mui/material/styles';

const policeGreen = {
  50: 	'#e9f6ec',
  100: '#c7ecd0',
  200: '#9de0b0',
  300: '#73d490',
  400: '#4aca76',
  500: '#2ab15b', // Verde brillante (para el botón)
  600: '#239a4e',
  700: '#1c7f3f', // Verde oscuro (primary.main)
  800: '#13652f',
  900: '#0a421a',
};

export const getTheme = (mode = 'light') => createTheme({
  palette: {
    mode,
    primary: {
      light: policeGreen[300],
      main: policeGreen[700], 
      dark: policeGreen[900],
      contrastText: '#ffffff'
    },
    background: {
      default: mode === 'light' ? '#f6f7f9' : '#121212',
      paper: mode === 'light' ? '#ffffff' : '#1e1e1e'
    },
    text: {
      primary: mode === 'light' ? '#1f2937' : '#ffffff', // Blanco para el título (SISGEV-P)
      secondary: mode === 'light' ? '#4b5563' : '#bfc5cc' // Gris claro para el subtítulo
    }
  },
  typography: { 
    fontFamily: 'Roboto, Arial, sans-serif',
  },

  components: {
    
    // A. GENERALIZACIÓN DE CAMPOS DE TEXTO (GLASSMORPHISM + AUTOFILL FIX)
    MuiTextField: {
      defaultProps: {
        size: 'small', // Compacto por defecto
        variant: 'outlined',
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { 
            // Estilos base Glassmorphism
            backgroundColor: 'rgba(255,255,255,0.10)',
            backdropFilter: 'blur(0.25rem)',
            color: '#fff', 
            borderRadius: '0.75rem',
            
            // ✔ SOLUCIÓN AUTOFILL (Anula el fondo blanco del navegador)
            '& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active': {
                WebkitBoxShadow: '0 0 0 1000px rgba(255,255,255,0.10) inset !important',
                WebkitTextFillColor: '#fff !important', 
                borderRadius: '0.75rem !important',
                transition: 'background-color 5000s ease-in-out 0s'
            },
            
            // Asegura un borde sutil al pasar el mouse
            '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255,255,255,0.20) !important',
            },
        },
        input: {
          padding: '0.4rem 1.2rem', 
          color: '#fff', 
        },
        notchedOutline: {
          borderColor: 'rgba(255,255,255,0.12)', 
          borderRadius: '0.75rem',

          // ANULACIÓN DE ENFOQUE: Mantiene el borde discreto al hacer clic
          '&.Mui-focused': {
             borderColor: 'rgba(255,255,255,0.25) !important', 
             borderWidth: '0.0625rem !important',
          }
        }
      }
    },
    MuiInputLabel: { 
      styleOverrides: {
        root: {
          color: 'rgba(255,255,255,0.70) !important',
          fontSize: '0.9rem',
          '&.Mui-focused': {
            color: 'rgba(255,255,255,0.9) !important',
          },
        }
      }
    },

    
    // GENERALIZACIÓN DE BOTONES (TAMAÑO Y COLOR COHERENTE)
    
    MuiButton: {
        styleOverrides: {
            root: {
                padding: '0.6rem 1.5rem', // Tamaño compacto
                borderRadius: '0.75rem',
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 0.1875rem 0.625rem rgba(0,0,0,0.25)', // Sombra en rem
            },
            containedPrimary: {
                backgroundColor: policeGreen[500], // Verde brillante para el botón de acción
                '&:hover': {
                    backgroundColor: policeGreen[600],
                },
            }
        },
    }
  }
});