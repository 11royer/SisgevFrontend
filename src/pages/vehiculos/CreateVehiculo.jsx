import React, { useState } from 'react';
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import Layout from '../../layout/Layout';
import VehiculoForm from '../../components/vehiculos/VehiculoForm';
import { vehiculoService } from '../../services/VehiculoService';
import useAuth from '../../auth/UseAuth';

const CreateVehiculo = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Verificar permisos
  const rolesPermitidos = ['Administrador', 'Operador'];
  if (!rolesPermitidos.includes(currentUser?.rol?.nombre)) {
    return (
      <Layout>
        <Alert severity="error" sx={{ m: 2 }}>
          No tienes permisos para registrar vehículos.
        </Alert>
      </Layout>
    );
  }

  const limpiarMensajes = () => {
    setError(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      limpiarMensajes();
      
      // Asegurar tipos de datos correctos
      const dataEnviar = {
        ...formData,
        anio: parseInt(formData.anio),
        kilometraje_actual: parseInt(formData.kilometraje_actual),
        en_servicio: Boolean(formData.en_servicio),
        unidad_id: formData.unidad_id || null,
      };

      await vehiculoService.create(dataEnviar);
      
      setSuccessMessage('Vehículo registrado exitosamente');
      
      // Redirigir después de 1.5 segundos
      setTimeout(() => {
        navigate('/vehiculos');
      }, 1500);
      
    } catch (error) {
      console.error('Error registrando vehículo:', error);
      
      const mensaje = error.response?.data?.message || 
                     error.response?.data?.errors?.placa?.[0] ||
                     'Error al registrar el vehículo';
      
      setError(mensaje);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/vehiculos');
  };

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
            Registrar Nuevo Vehículo
          </Typography>
          
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleCancel}
              disabled={loading}
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
            Complete todos los campos obligatorios (*) para registrar el vehículo.
            La placa, chasis y motor deben ser únicas en el sistema.
          </Typography>
        </Alert>

        {/* Formulario */}
        <VehiculoForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />

      </Box>
    </Layout>
  );
};

export default CreateVehiculo;
