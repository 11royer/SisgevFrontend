import React, { useState } from 'react';
import { Box, Typography, Button, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import Layout from '../../layout/Layout';
import RepuestoForm from '../../components/repuestos/RepuestoForm';
import { repuestoService } from '../../services/RepuestoService';
import useAuth from '../../auth/UseAuth';

const CreateRepuesto = () => {
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    if (!['Administrador', 'Técnico'].includes(currentUser?.rol?.nombre)) {
        return (
            <Layout>
                <Alert severity="error" sx={{ m: 2 }}>No tienes permisos para registrar repuestos.</Alert>
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

            await repuestoService.create(formData);
            setSuccessMessage('Repuesto registrado exitosamente');

            setTimeout(() => {
                navigate('/repuestos');
            }, 1500);
        } catch (error) {
            console.error('Error registrando repuesto:', error);
            const mensaje = error.response?.data?.message || 
                           error.response?.data?.errors?.codigo_interno?.[0] ||
                           'Error al registrar repuesto';
            setError(mensaje);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/repuestos');
    };

    return (
        <Layout>
            <Box sx={{ width: '100%', p: { xs: '0.75rem', md: '1.5rem' } }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: '1.5rem',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        Registrar Nuevo Repuesto
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

                <RepuestoForm
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    loading={loading}
                />
            </Box>
        </Layout>
    );
};

export default CreateRepuesto;