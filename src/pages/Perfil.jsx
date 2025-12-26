// src/pages/Perfil.jsx
import React, { useState, useEffect } from 'react';
import {Box, Paper, Typography, TextField, Button, Avatar, Grid, Alert, Snackbar, CircularProgress, Divider} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonIcon from '@mui/icons-material/Person';
import Layout from '../layout/Layout';
import { usuarioService } from '../services/UsuarioService';
import useAuth from '../auth/UseAuth';

const Perfil = () => {
  const { logout } = useAuth();
  
  // -- ESTADOS PARA GESTIÓN DE DATOS Y UI --
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [loading, setLoading] = useState(true); // Controla la carga inicial del perfil
  const [guardando, setGuardando] = useState(false); // Controla el estado del botón guardar
  
  // -- FORMULARIO DE DATOS PERSONALES --
  const [formData, setFormData] = useState({
    nombre_completo: '',
    email: '',
    telefono: '',
    foto_perfil: null,
  });
  
  // -- FORMULARIO DE SEGURIDAD (PASSWORD) --
  const [passwordData, setPasswordData] = useState({
    contraseña_actual: '',
    nueva_contraseña: '',
    confirmar_password: '',
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [previewImage, setPreviewImage] = useState(null);

  // Hook inicial para cargar datos al montar el componente
  useEffect(() => {
    cargarDatosPerfil();
  }, []);

  /**
   * Obtiene la información del usuario autenticado desde la API.
   * Se usa el endpoint '/me' para asegurar compatibilidad con todos los roles.
   */
  const cargarDatosPerfil = async () => {
    try {
      setLoading(true);
      const response = await usuarioService.getPerfil();
      
      // Manejo de la respuesta (Laravel Resource suele envolver en .data)
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
      console.error('Error cargando perfil:', error);
      mostrarSnackbar('Error al obtener datos del servidor', 'error');
    } finally {
      // Importante: Desactivar loading incluso si hay error para evitar bloqueo de pantalla
      setLoading(false);
    }
  };

  /**
   * Formatea strings de fecha ISO a formato legible boliviano (DD/MM/AAAA).
   * Previene el error 'Invalid Date' validando el input antes de procesar.
   */
  const formatearFecha = (fechaRaw) => {
    if (!fechaRaw) return "No disponible";
    const fecha = new Date(fechaRaw);
    if (isNaN(fecha.getTime())) return "Fecha no válida"; // Validación de seguridad
    
    return fecha.toLocaleDateString('es-BO', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  };

  const mostrarSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const cerrarSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

  // Activa el modo edición y permite interacción con los inputs
  const iniciarEdicion = () => setEditando(true);

  // Revierte los cambios realizados en el formulario antes de guardar
  const cancelarEdicion = () => {
    setEditando(false);
    setFormData({
      nombre_completo: usuario.nombre_completo || '',
      email: usuario.email || '',
      telefono: usuario.telefono || '',
      foto_perfil: null,
    });
    setPreviewImage(usuario.foto_url || null);
  };

  // Manejador genérico para cambios en inputs de texto
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Procesa la imagen seleccionada para previsualización local (Base64)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, foto_perfil: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  /**
   * Envía los datos actualizados al backend.
   * Se utiliza FormData para permitir la subida de archivos (foto de perfil).
   */
  const guardarPerfil = async () => {
    try {
      setGuardando(true);
      const data = new FormData();
      data.append('nombre_completo', formData.nombre_completo);
      data.append('email', formData.email);
      if (formData.telefono) data.append('telefono', formData.telefono);
      if (formData.foto_perfil) data.append('foto_perfil', formData.foto_perfil);
      
      // Hack para Laravel: PUT no soporta archivos nativamente, se simula con POST + _method
      data.append('_method', 'PUT');

      await usuarioService.update(usuario.id, data);
      await cargarDatosPerfil(); // Recargar datos frescos del servidor
      setEditando(false);
      mostrarSnackbar('Perfil actualizado correctamente');
    } catch (error) {
      mostrarSnackbar('Error al intentar guardar los cambios', 'error');
    } finally {
      setGuardando(false);
    }
  };

  /**
   * Lógica para el cambio de credenciales de acceso.
   */
  const cambiarPassword = async () => {
    if (passwordData.nueva_contraseña !== passwordData.confirmar_password) {
      return mostrarSnackbar('Las contraseñas nuevas no coinciden', 'error');
    }
    try {
      await usuarioService.cambiarPassword(usuario.id, passwordData);
      mostrarSnackbar('Contraseña actualizada. Reiniciando sesión...');
      // Cerrar sesión tras cambio de clave por seguridad
      setTimeout(() => logout(), 2000);
    } catch (error) {
      mostrarSnackbar(error.response?.data?.message || 'Error de validación', 'error');
    }
  };

  // Pantalla de carga mientras se espera la respuesta de la API
  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Cargando datos de SISGEV-P...</Typography>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ p: { xs: 1, md: 3 } }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Mi Perfil SISGEV-P
        </Typography>

        <Grid container spacing={3}>
          {/* SECCIÓN: INFORMACIÓN PERSONAL */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Datos Personales</Typography>
                {!editando ? (
                  <Button startIcon={<EditIcon />} onClick={iniciarEdicion} variant="contained">Editar</Button>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button color="error" onClick={cancelarEdicion}><CancelIcon /></Button>
                    <Button variant="contained" onClick={guardarPerfil} disabled={guardando}>
                      {guardando ? <CircularProgress size={24} color="inherit" /> : <SaveIcon />}
                    </Button>
                  </Box>
                )}
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Avatar src={previewImage} sx={{ width: 100, height: 100, mb: 2, border: '2px solid #1976d2' }}>
                  <PersonIcon sx={{ fontSize: 50 }} />
                </Avatar>
                {editando && (
                  <Button variant="outlined" component="label" size="small">
                    Subir Foto <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                  </Button>
                )}
              </Box>

              <Grid container spacing={2}>
                {/* Los campos se habilitan/deshabilitan según el estado 'editando' */}
                <Grid item xs={12}>
                  <TextField fullWidth label="Nombre Completo" name="nombre_completo" value={formData.nombre_completo} onChange={handleChange} disabled={!editando} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Correo Electrónico" name="email" value={formData.email} onChange={handleChange} disabled={!editando} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Nombre de Usuario" value={usuario?.usuario || ''} disabled />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Rol del Sistema" value={usuario?.rol?.nombre || 'Consulta'} disabled />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* SECCIÓN: SEGURIDAD Y AUDITORÍA */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>Seguridad de Acceso</Typography>
              <TextField 
                fullWidth type="password" label="Contraseña Actual" sx={{ mb: 2, mt: 1 }}
                value={passwordData.contraseña_actual}
                onChange={(e) => setPasswordData({...passwordData, contraseña_actual: e.target.value})}
              />
              <TextField 
                fullWidth type="password" label="Nueva Contraseña" sx={{ mb: 2 }}
                value={passwordData.nueva_contraseña}
                onChange={(e) => setPasswordData({...passwordData, nueva_contraseña: e.target.value})}
              />
              <TextField 
                fullWidth type="password" label="Confirmar Nueva Contraseña" sx={{ mb: 3 }}
                value={passwordData.confirmar_password}
                onChange={(e) => setPasswordData({...passwordData, confirmar_password: e.target.value})}
              />
              <Button fullWidth variant="outlined" onClick={cambiarPassword}>Actualizar Contraseña</Button>
              
              <Divider sx={{ my: 3 }} />
              
              {/* CORRECCIÓN DE FECHA: Uso de la función helper para evitar Invalid Date */}
              <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }}>
                Fecha de Registro: <strong>{formatearFecha(usuario?.created_at)}</strong>
              </Typography>
              <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }}>
                Última Actualización: <strong>{formatearFecha(usuario?.updated_at)}</strong>
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Notificaciones de éxito o error */}
        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={cerrarSnackbar}>
          <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
};

export default Perfil;