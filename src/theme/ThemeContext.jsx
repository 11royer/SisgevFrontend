// src/theme/ThemeContext.jsx
import React, { createContext, useState, useMemo, useContext } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { getTheme } from './theme';

// 1. Crea el Contexto
export const ThemeContext = createContext({ 
    mode: 'dark', // Valor por defecto
    toggleColorMode: () => {}, // Función para cambiar el modo
});

// Hook personalizado para usar el tema fácilmente
export const useThemeContext = () => useContext(ThemeContext);

// 2. Componente Proveedor
export function ThemeContextProvider({ children }) {
    // Lee el modo preferido del sistema o de localStorage al inicio
    const preferredMode = window.localStorage.getItem('colorMode') || (
        window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    );
    
    const [mode, setMode] = useState(preferredMode);

    // Función para cambiar el modo y guardarlo en localStorage
    const colorMode = useMemo(() => ({
        mode,
        toggleColorMode: () => {
            setMode((prevMode) => {
                const newMode = prevMode === 'light' ? 'dark' : 'light';
                window.localStorage.setItem('colorMode', newMode); // Persistencia
                return newMode;
            });
        },
    }), [mode]);

    // 3. Genera el tema de MUI cada vez que 'mode' cambie
    const theme = useMemo(() => createTheme(getTheme(mode)), [mode]);

    return (
        <ThemeContext.Provider value={colorMode}>
            <MuiThemeProvider theme={theme}>
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
}