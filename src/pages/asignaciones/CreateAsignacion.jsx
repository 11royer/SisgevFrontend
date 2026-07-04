import React, { useState } from 'react';
import { Box, Typography, Button, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import Layout from '../../layout/Layout';
import AsignacionForm from '../../components/asignaciones/AsignacionForm';
import { asignacionService } from '../../services/AsignacionService';
import useAuth from '../../auth/UseAuth';
import { hasPermission } from '../../utils/hasPermission';

const CreateAsignacion = () => {
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const puedeCrear = hasPermission(currentUser, 'crear_asignaciones');

    if (!puedeCrear) {
        return (
            <Layout>
                <Alert severity="error" sx={{ m: 2 }}>
                    No tienes permisos para crear asignaciones.
                    Se requiere el permiso: <strong>crear_asignaciones</strong>
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

            await asignacionService.create(formData);
            setSuccessMessage('Vehículo asignado exitosamente');

            setTimeout(() => {
                navigate('/asignaciones');
            }, 1500);
        } catch (error) {
            console.error('Error creando asignación:', error);
            const mensaje = error.response?.data?.message || 
                           error.response?.data?.errors?.vehiculo_id?.[0] ||
                           error.response?.data?.errors?.conductor_id?.[0] ||
                           'Error al crear la asignación';
            setError(mensaje);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/asignaciones');
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
                        Nueva Asignación de Vehículo
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
                    <Alert severity="error" onClose={limpiarMensajes} sx={{ mb: '1.5rem', borderRadius: '0.5rem' }}>
                        {error}
                    </Alert>
                )}
                {successMessage && (
                    <Alert severity="success" onClose={limpiarMensajes} sx={{ mb: '1.5rem', borderRadius: '0.5rem' }}>
                        {successMessage}
                    </Alert>
                )}

                {/* Formulario */}
                <AsignacionForm
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    loading={loading}
                />
            </Box>
        </Layout>
    );
};

export default CreateAsignacion;