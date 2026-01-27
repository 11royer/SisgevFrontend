import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  Button,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import Layout from '../../layout/Layout';
import VehiculoForm from '../../components/vehiculos/VehiculoForm';
import { vehiculoService } from '../../services/VehiculoService';
import useAuth from '../../auth/UseAuth';

const EditVehiculo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  const [vehiculo, setVehiculo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Verificar permisos
  const rolesPermitidos = ['Administrador', 'Operador'];
  if (!rolesPermitidos.includes(currentUser?.rol?.nombre)) {
    return (
      <Layout>
        <Alert severity="error" sx={{ m: 2 }}>
          No tienes permisos para editar vehículos.
        </Alert>
      </Layout>
    );
  }

  useEffect(() => {
    cargarVehiculo();
  }, [id]);

  const cargarVehiculo = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await vehiculoService.getById(id);
      setVehiculo(response.data.data);
    } catch (error) {
      console.error('Error cargando vehículo:', error);
      setError('Error al cargar el vehículo');
    } finally {
      setLoading(false);
    }
  };

  const limpiarMensajes = () => {
    setError(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (formData) => {
    try {
      setSaving(true);
      limpiarMensajes();
      
      // Asegurar tipos de datos correctos
      const dataEnviar = {
        ...formData,
        anio: parseInt(formData.anio),
        kilometraje_actual: parseInt(formData.kilometraje_actual),
        en_servicio: Boolean(formData.en_servicio),
        unidad_id: formData.unidad_id || null,
      };

      await vehiculoService.update(id, dataEnviar);
      
      setSuccessMessage('Vehículo actualizado exitosamente');
      
      // Redirigir después de 1.5 segundos
      setTimeout(() => {
        navigate(`/vehiculos/${id}`);
      }, 1500);
      
    } catch (error) {
      console.error('Error actualizando vehículo:', error);
      
      const mensaje = error.response?.data?.message || 
                     error.response?.data?.errors?.placa?.[0] ||
                     'Error al actualizar el vehículo';
      
      setError(mensaje);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/vehiculos/${id}`);
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (!vehiculo) {
    return (
      <Layout>
        <Alert severity="error">Vehículo no encontrado</Alert>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ width: '100%', p: { xs: '0.75rem', md: '1.5rem' } }}>
        
        {/* Encabezado */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Editar Vehículo: {vehiculo.placa}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleCancel}
              disabled={saving}
            >
              Cancelar
            </Button>
          </Box>
        </Box>

        {/* Alertas de error/éxito */}
        {error && (
          <Alert 
            severity="error" 
            onClose={limpiarMensajes}
            sx={{ mb: '1.5rem', borderRadius: '0.5rem' }}
          >
            {error}
          </Alert>
        )}
        
        {successMessage && (
          <Alert 
            severity="success" 
            onClose={limpiarMensajes}
            sx={{ mb: '1.5rem', borderRadius: '0.5rem' }}
          >
            {successMessage}
          </Alert>
        )}

        {/* Nota informativa */}
        <Alert severity="info" sx={{ mb: '1.5rem', borderRadius: '0.5rem' }}>
          <Typography variant="body2">
            Modifique los campos necesarios. Recuerde que la placa debe ser única en el sistema.
          </Typography>
        </Alert>

        {/* Formulario */}
        <VehiculoForm
          vehiculo={vehiculo}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={saving}
        />

      </Box>
    </Layout>
  );
};

export default EditVehiculo;
