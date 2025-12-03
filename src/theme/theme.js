// src/theme/theme.js
import { createTheme } from '@mui/material/styles';

const policeGreen = {
  50:  '#e9f6ec',
  100: '#c7ecd0',
  200: '#9de0b0',
  300: '#73d490',
  400: '#4aca76',
  500: '#2ab15b',
  600: '#239a4e',
  700: '#1c7f3f',
  800: '#13652f',
  900: '#0a421a',
};

export const getTheme = (mode = 'light') => createTheme({
  palette: {
    mode,
    primary: {
      light: policeGreen[300],
      main: policeGreen[700], // verde oscuro como primary main para contraste
      dark: policeGreen[900],
      contrastText: '#ffffff'
    },
    background: {
      default: mode === 'light' ? '#f6f7f9' : '#121212',
      paper: mode === 'light' ? '#ffffff' : '#1e1e1e'
    },
    text: {
      primary: mode === 'light' ? '#1f2937' : '#ffffff',
      secondary: mode === 'light' ? '#4b5563' : '#bfc5cc'
    }
  },
  typography: { fontFamily: 'Roboto, Arial, sans-serif' },
});
