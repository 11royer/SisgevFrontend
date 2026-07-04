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

  // ESTADOS DEL FORMULARIO
  const [credencial, setCredencial] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // MANEJADOR DE ENVÍO DEL FORMULARIO
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
        gap: "1rem"
      }}
    >
      {/* ALERTA DE ERRORES */}
      {error && <Alert severity="error">{error}</Alert>}

      {/* CAMPO: USUARIO O CORREO */}
      <TextField
        label="Usuario o correo"
        fullWidth
        required
        size="small"
        value={credencial}
        onChange={(e) => setCredencial(e.target.value)}
        slotProps={{
          input: {
            sx: {
              borderRadius: "0.75rem",
              fontSize: "0.875rem",
            },
          },
          inputLabel: {
            sx: {
              fontSize: "0.875rem",
            }
          }
        }}
      />

      {/* CAMPO: CONTRASEÑA CON BOTÓN DE VISUALIZACIÓN */}
      <TextField
        label="Contraseña"
        fullWidth
        required
        size="small"
        type={showPass ? "text" : "password"}
        value={contraseña}
        onChange={(e) => setContraseña(e.target.value)}
        slotProps={{
          input: {
            sx: {
              borderRadius: "0.75rem",
              fontSize: "0.875rem",
            },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPass(!showPass)}
                  sx={{ padding: "0.25rem" }}
                  edge="end"
                >
                  {showPass ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </IconButton>
              </InputAdornment>
            )
          },
          inputLabel: {
            sx: {
              fontSize: "0.875rem",
            }
          }
        }}
      />

      {/* BOTÓN DE INICIAR SESIÓN */}
      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={loading}
        sx={{
          // DIMENSIONES Y ESPACIADO
          padding: "0.5rem",
          borderRadius: "0.75rem",
          minHeight: "2.5rem",
          
          // TIPOGRAFÍA
          fontSize: "0.875rem",
          fontWeight: 600,
          textTransform: "none",
          
          // EFECTO VISUAL
          boxShadow: "0 0.25rem 0.75rem rgba(0,0,0,0.25)",
          
          // ANIMACIÓN DE CARGA
          '& .MuiCircularProgress-root': {
            marginRight: '0.5rem',
          }
        }}
      >
        {loading ? (
          <>
            <CircularProgress size="1.25rem" color="inherit" />
            Verificando...
          </>
        ) : (
          "Iniciar sesión"
        )}
      </Button>
    </Box>
  );
}