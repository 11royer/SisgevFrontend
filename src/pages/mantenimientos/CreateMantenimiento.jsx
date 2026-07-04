import React, { useState } from 'react';
import { Box, Typography, Button, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import Layout from '../../layout/Layout';
import MantenimientoForm from '../../components/mantenimientos/MantenimientoForm';
import { mantenimientoService } from '../../services/MantenimientoService';
import { salidaRepuestoService } from '../../services/SalidaRepuestoService';
import useAuth from '../../auth/UseAuth';
import { hasPermission } from '../../utils/hasPermission';

const CreateMantenimiento = () => {
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const puedeCrear = hasPermission(currentUser, 'crear_mantenimientos');

    if (!puedeCrear) {
        return (
            <Layout>
                <Alert severity="error" sx={{ m: 2 }}>
                    No tienes permisos para registrar mantenimientos.
                    Se requiere el permiso: <strong>crear_mantenimientos</strong>
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

            // Separar datos del mantenimiento y repuestos
            const { repuestos, ...mantenimientoData } = formData;

            console.log('Datos del mantenimiento:', mantenimientoData);
            console.log('Repuestos:', repuestos);

            // 1. Crear el mantenimiento
            const response = await mantenimientoService.create(mantenimientoData);
            const nuevoMantenimiento = response.data.data || response.data;

            console.log('Mantenimiento creado:', nuevoMantenimiento);

            // 2. Si hay repuestos, crear las salidas
            if (repuestos && repuestos.length > 0 && nuevoMantenimiento?.id) {
                for (const rep of repuestos) {
                    const cantidad = rep.cantidad || rep.cantidad_usada || 0;
                    
                    if (cantidad <= 0) {
                        console.warn(`Cantidad inválida para repuesto:`, rep);
                        continue;
                    }

                    console.log(`Creando salida: repuesto_id=${rep.repuesto_id}, cantidad=${cantidad}`);
                    
                    await salidaRepuestoService.create({
                        repuesto_id: rep.repuesto_id,
                        mantenimiento_id: nuevoMantenimiento.id,
                        cantidad_usada: cantidad,
                        fecha: mantenimientoData.fecha,
                        observaciones: `Consumo en mantenimiento #${nuevoMantenimiento.id}`
                    });
                }
            }

            setSuccessMessage('Mantenimiento registrado exitosamente');

            // Redirigir después de 1.5 segundos
            setTimeout(() => {
                navigate('/mantenimientos');
            }, 1500);

        } catch (error) {
            console.error('Error registrando mantenimiento:', error);
            
            // Mensaje de error más específico
            let mensaje = 'Error al registrar mantenimiento';
            if (error.response?.data?.message) {
                mensaje = error.response.data.message;
            } else if (error.response?.data?.errors) {
                const firstError = Object.values(error.response.data.errors)[0];
                mensaje = Array.isArray(firstError) ? firstError[0] : firstError;
            }
            
            setError(mensaje);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/mantenimientos');
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
                        Registrar Nuevo Mantenimiento
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                </Box>

                {/* Alertas */}
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

                {/* Formulario */}
                <MantenimientoForm
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    loading={loading}
                />
            </Box>
        </Layout>
    );
};

export default CreateMantenimiento;