// src/theme/ThemeContextRef.js
import { createContext, useContext } from 'react';

// 1. Definimos el objeto del contexto
export const ThemeContext = createContext(null);

// 2. Definimos el Hook de uso para toda la app
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext debe ser usado dentro de un ThemeProvider');
  }
  return context;
};