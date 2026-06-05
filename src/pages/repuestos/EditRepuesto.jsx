import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Alert, CircularProgress } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import Layout from '../../layout/Layout';
import RepuestoForm from '../../components/repuestos/RepuestoForm';
import { repuestoService } from '../../services/RepuestoService';
import useAuth from '../../auth/UseAuth';

const EditRepuesto = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    
    const [repuesto, setRepuesto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    if (!['Administrador', 'Técnico'].includes(currentUser?.rol?.nombre)) {
        return (
            <Layout>
                <Alert severity="error" sx={{ m: 2 }}>No tienes permisos para editar repuestos.</Alert>
            </Layout>
        );
    }

    useEffect(() => {
        cargarRepuesto();
    }, [id]);

    const cargarRepuesto = async () => {
        try {
            setLoading(true);
            const response = await repuestoService.getById(id);
            setRepuesto(response.data.data || response.data);
        } catch (error) {
            console.error('Error cargando repuesto:', error);
            setError('Repuesto no encontrado');
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

            await repuestoService.update(id, formData);
            setSuccessMessage('Repuesto actualizado correctamente');

            setTimeout(() => {
                navigate('/repuestos');
            }, 1500);
        } catch (error) {
            const mensaje = error.response?.data?.message || 'Error al actualizar repuesto';
            setError(mensaje);
            throw error;
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        navigate('/repuestos');
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

    if (!repuesto) {
        return (
            <Layout>
                <Alert severity="error">Repuesto no encontrado</Alert>
            </Layout>
        );
    }

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
                        Editar Repuesto: {repuesto.codigo_interno}
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={handleCancel}
                        disabled={saving}
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
                    repuesto={repuesto}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    loading={saving}
                />
            </Box>
        </Layout>
    );
};

export default EditRepuesto;