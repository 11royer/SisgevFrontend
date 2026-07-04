import React, { useState } from 'react';
import { Box, Typography, Button, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import Layout from '../../layout/Layout';
import ConductorForm from '../../components/conductores/ConductorForm';
import { conductorService } from '../../services/ConductorService';
import useAuth from '../../auth/UseAuth';
import { hasPermission } from '../../utils/hasPermission';

const CreateConductor = () => {
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const puedeCrear = hasPermission(currentUser, 'crear_conductores');

    if (!puedeCrear) {
        return (
            <Layout>
                <Alert severity="error" sx={{ m: 2 }}>
                    No tienes permisos para registrar conductores.
                    Se requiere el permiso: <strong>crear_conductores</strong>
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

            await conductorService.create(formData);
            setSuccessMessage('Conductor registrado exitosamente');

            setTimeout(() => {
                navigate('/conductores');
            }, 1500);
        } catch (error) {
            console.error('Error registrando conductor:', error);
            const mensaje = error.response?.data?.message || 
                           error.response?.data?.errors?.ci?.[0] ||
                           'Error al registrar conductor';
            setError(mensaje);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/conductores');
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
                        Registrar Nuevo Conductor
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
                <ConductorForm
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    loading={loading}
                />
            </Box>
        </Layout>
    );
};

export default CreateConductor;