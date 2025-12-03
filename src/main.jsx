// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import AppRoutes from './App';
import { AuthProvider, AuthContext } from './auth/AuthContext';
import { getTheme } from './theme/theme';

function ThemeWrapper({ children }) {
  const { themeMode } = React.useContext(AuthContext);
  const theme = getTheme(themeMode || 'light');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeWrapper>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ThemeWrapper>
    </AuthProvider>
  </React.StrictMode>
);
