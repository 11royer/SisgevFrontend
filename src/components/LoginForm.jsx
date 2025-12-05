// src/components/LoginForm.jsx
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function LoginForm({ onSubmit }) {
  const [credencial, setCredencial] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [showPass, setShowPass] = useState(false);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await onSubmit({ credencial, contraseña });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Credenciales incorrectas";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={submit}
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "1rem" // 16px
      }}
    >
      {error && <Alert severity="error">{error}</Alert>}

      {/* CAMPO USUARIO */}
      <TextField
        label="Usuario o correo"
        fullWidth
        required
        // Uso size="small" para la altura compacta estándar de MUI
        size="small" 
        value={credencial}
        onChange={(e) => setCredencial(e.target.value)}
        slotProps={{
          // Nota: Ya no necesitamos el padding vertical aquí gracias a size="small"
          input: {
            sx: {
              color: "#fff",
              borderRadius: "0.75rem",
              backgroundColor: "rgba(255,255,255,0.10)", // Estilo Glassmorphism
              backdropFilter: "blur(4px)",
              padding: "0.4rem 1.2rem",
            },
          },
          inputLabel: {
            sx: {
              color: "rgba(255,255,255,0.70)",
              fontSize: "0.9rem"
            }
          }
        }}
      />

      {/* CAMPO CONTRASEÑA */}
      <TextField
        label="Contraseña"
        fullWidth
        required
        // Uso size="small" para la altura compacta estándar de MUI
        size="small"
        type={showPass ? "text" : "password"}
        value={contraseña}
        onChange={(e) => setContraseña(e.target.value)}
        slotProps={{
          input: {
            sx: {
              color: "#fff",
              borderRadius: "0.75rem",
              backgroundColor: "rgba(255,255,255,0.10)",
              backdropFilter: "blur(4px)",
              padding: "0.4rem 1.2rem",
            },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPass(!showPass)}
                  // Ajustamos el tamaño del botón para que no deforme el campo
                  sx={{ color: "rgba(255,255,255,0.8)", padding: "0.3rem" }} 
                  edge="end"
                >
                  {showPass ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </IconButton>
              </InputAdornment>
            )
          },
          inputLabel: {
            sx: {
              color: "rgba(255,255,255,0.70)",
              fontSize: "0.9rem"
            }
          }
        }}
      />

      {/* BOTÓN */}
      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={loading}
        sx={{
          py: "0.4rem",
          borderRadius: "0.75rem",
          fontSize: "1rem",
          fontWeight: 600,
          textTransform: "none",
          backgroundColor: "var(--shield-color, #2ab15b)",
          ":hover": { backgroundColor: "#228e49" },
          boxShadow: "0 0.3rem 1rem rgba(0,0,0,0.25)",
        }}
      >
        {loading ? (
          <CircularProgress size="1.3rem" color="inherit" />
        ) : (
          "Iniciar sesión"
        )}
      </Button>
    </Box>
  );
}