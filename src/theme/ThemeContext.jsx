// src/theme/ThemeContext.jsx
import React, { useState, useMemo } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { getTheme } from './theme'; // Tu configuración de Verde Policial
import { ThemeContext } from './ThemeContextRef'; // Importamos la referencia JS

const ThemeProvider = ({ children }) => {
  // Lógica de persistencia idéntica a la que ya tienes
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('colorMode');
    return savedMode || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  const colorMode = useMemo(() => ({
    mode,
    toggleColorMode: () => {
      setMode((prev) => {
        const newMode = prev === 'light' ? 'dark' : 'light';
        localStorage.setItem('colorMode', newMode);
        return newMode;
      });
    },
  }), [mode]);

  // Aplicamos tu configuración de theme.js (Verde Policial, etc)
  const theme = useMemo(() => createTheme(getTheme(mode)), [mode]);

  return (
    <ThemeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline /> 
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;