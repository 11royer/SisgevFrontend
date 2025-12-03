// src/components/LoginForm.jsx
import React, { useState } from 'react';
import { Box, TextField, Button, Alert, CircularProgress } from '@mui/material';

export default function LoginForm({ onSubmit }) {
  const [credencial, setCredencial] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e?.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onSubmit({ credencial, contraseña });
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Credenciales incorrectas';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={submit} sx={{ mt: 1 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <TextField label="Usuario o correo" value={credencial} onChange={(e)=>setCredencial(e.target.value)} fullWidth required margin="normal" autoComplete="username" />
      <TextField label="Contraseña" type="password" value={contraseña} onChange={(e)=>setContraseña(e.target.value)} fullWidth required margin="normal" autoComplete="current-password" />
      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
        {loading ? <CircularProgress size={20} color="inherit" /> : 'Iniciar sesión'}
      </Button>
    </Box>
  );
}
