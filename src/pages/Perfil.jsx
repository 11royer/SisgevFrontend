// src/pages/Perfil.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Alert,
  Snackbar,
  CircularProgress,
  Divider,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import PersonIcon from '@mui/icons-material/Person';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import Layout from '../layout/Layout';
import { usuarioService } from '../services/UsuarioService';
import useAuth from '../auth/UseAuth';

const Perfil = () => {
  const { user: currentUser } = useAuth();

  // --- ESTADOS DE DATOS Y CARGA ---
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // --- ESTADOS DE FORMULARIO ---
  const [formData, setFormData] = useState({
    nombre_completo: '',
    email: '',
    telefono: '',
    foto_perfil: null,
  });

  useEffect(() => {
    cargarDatosPerfil();
  }, []);

  // --- LÓGICA DE CARGA ---
  const cargarDatosPerfil = async () => {
    try {
      setLoading(true);
      const response = await usuarioService.getPerfil();
      const data = response.data.data || response.data;
      setUsuario(data);
      setFormData({
        nombre_completo: data.nombre_completo || '',
        email: data.email || '',
        telefono: data.telefono || '',
        foto_perfil: null,
      });
      if (data.foto_url) setPreviewImage(data.foto_url);
    } catch (error) {
      console.error('Error al cargar perfil:', error);
      mostrarSnackbar('Error al obtener datos del servidor', 'error');
    } finally {
      setLoading(false);
    }
  };

  // --- MANEJADORES DE EVENTOS ---
  const mostrarSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const cerrarSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, foto_perfil: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const guardarPerfil = async () => {
    try {
      setGuardando(true);
      const data = new FormData();
      data.append('nombre_completo', formData.nombre_completo);
      data.append('email', formData.email);
      if (formData.telefono) data.append('telefono', formData.telefono);
      if (formData.foto_perfil) data.append('foto_perfil', formData.foto_perfil);
      data.append('_method', 'PUT'); // Necesario para Laravel con multipart/form-data

      await usuarioService.update(usuario.id, data);
      await cargarDatosPerfil();
      setEditando(false);
      mostrarSnackbar('Perfil actualizado correctamente', 'success');
    } catch (error) {
      console.error('Error al actualizar:', error);
      mostrarSnackbar('No se pudieron guardar los cambios', 'error');
    } finally {
      setGuardando(false);
    }
  };

  // --- VISTA DE CARGA ---
  if (loading) return (
    <Layout>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    </Layout>
  );

  return (
    <Layout>
      {/* CONTENEDOR PRINCIPAL RESPONSIVO */}
      <Box sx={{ width: '100%', p: { xs: '0.75rem', sm: '1.5rem' } }}>
        
        {/* ENCABEZADO UNIFICADO */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' }, 
          gap: 2, 
          mb: 2 
        }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Mi Perfil
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' } }}>
            {!editando ? (
              <Button variant="contained" startIcon={<EditIcon />} onClick={() => setEditando(true)}>
                Editar Perfil
              </Button>
            ) : (
              <>
                <Button variant="outlined" color="error" onClick={() => setEditando(false)}>
                  Cancelar
                </Button>
                <Button 
                  variant="contained" 
                  color="success" 
                  startIcon={<SaveIcon />} 
                  onClick={guardarPerfil} 
                  disabled={guardando}
                >
                  {guardando ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </>
            )}
          </Box>
        </Box>

        {/* NOTA UNIFICADA (Estilo Alert) */}
        <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
          <Typography variant="body2">
            <strong>Nota:</strong> Gestiona tu información personal y credenciales de acceso. 
            Recuerda mantener tus datos de contacto actualizados para las notificaciones del sistema SISGEV-P.
          </Typography>
        </Alert>

        {/* CONTENIDO PRINCIPAL: LADO A LADO */}
        <Grid container spacing={3} alignItems="stretch">
          
          {/* SECCIÓN 1: DATOS PERSONALES (Ocupa 7/12 en sm) */}
          <Grid item xs={12} sm={7} md={8}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: 'primary.main' }}>
                Información Personal
              </Typography>
              
              {/* ÁREA DE AVATAR */}
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 3, mb: 4 }}>
                <Box sx={{ position: 'relative' }}>
                  <Avatar 
                    src={previewImage} 
                    sx={{ width: '8rem', height: '8rem', border: '0.25rem solid', borderColor: 'primary.main' }}
                  >
                    <PersonIcon sx={{ fontSize: '4rem' }} />
                  </Avatar>
                  {editando && (
                    <IconButton 
                      component="label" 
                      sx={{ 
                        position: 'absolute', bottom: 0, right: 0, 
                        bgcolor: 'primary.main', color: 'white',
                        '&:hover': { bgcolor: 'primary.dark' } 
                      }}
                    >
                      <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                      <PhotoCameraIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
                <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{usuario?.nombre_completo}</Typography>
                  <Typography variant="body1" color="text.secondary">{usuario?.rol?.nombre || 'Funcionario Policial'}</Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Nombre Completo" name="nombre_completo" value={formData.nombre_completo} onChange={handleChange} disabled={!editando} size="small" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Correo Electrónico" name="email" value={formData.email} onChange={handleChange} disabled={!editando} size="small" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Teléfono / Celular" name="telefono" value={formData.telefono} onChange={handleChange} disabled={!editando} size="small" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Usuario de Sistema" value={usuario?.usuario || ''} disabled size="small" />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* SECCIÓN 2: SEGURIDAD (Ocupa 5/12 en sm) */}
          <Grid item xs={12} sm={5} md={4}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: 'primary.main' }}>
                Seguridad de la Cuenta
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1 }}>
                <TextField fullWidth type="password" label="Contraseña Actual" size="small" placeholder="••••••••" />
                <TextField fullWidth type="password" label="Nueva Contraseña" size="small" placeholder="••••••••" />
                <TextField fullWidth type="password" label="Confirmar Nueva" size="small" placeholder="••••••••" />
                <Button variant="outlined" fullWidth sx={{ mt: 1 }}>
                  Actualizar Contraseña
                </Button>
              </Box>
              
              <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Typography variant="caption" color="text.secondary">
                  Miembro desde: {usuario?.created_at ? new Date(usuario.created_at).toLocaleDateString() : 'N/A'}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* NOTIFICACIONES */}
        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={4000} 
          onClose={cerrarSnackbar} 
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={cerrarSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
};

export default Perfil;