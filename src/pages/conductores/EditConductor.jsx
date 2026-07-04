import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Alert, CircularProgress } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import Layout from '../../layout/Layout';
import ConductorForm from '../../components/conductores/ConductorForm';
import { conductorService } from '../../services/ConductorService';
import useAuth from '../../auth/UseAuth';
import { hasPermission } from '../../utils/hasPermission';

const EditConductor = () => {
    // IMPORTANTE: useParams devuelve un objeto con las propiedades de la URL
    // El parámetro se llama 'id' como está definido en la ruta
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    
    const [conductor, setConductor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const puedeEditar = hasPermission(currentUser, 'editar_conductores');

    if (!puedeEditar) {
        return (
            <Layout>
                <Alert severity="error" sx={{ m: 2 }}>
                    No tienes permisos para editar conductores.
                    Se requiere el permiso: <strong>editar_conductores</strong>
                </Alert>
            </Layout>
        );
    }

    useEffect(() => {
        // Asegurarse de que id existe antes de cargar
        if (id) {
            cargarConductor();
        }
    }, [id]);

    const cargarConductor = async () => {
        try {
            setLoading(true);
            setError(null);
            
            console.log('Cargando conductor con ID:', id);
            
            const response = await conductorService.getById(id);
            
            // La respuesta puede estar en response.data o response.data.data
            const conductorData = response.data.data || response.data;
            
            console.log('Conductor cargado:', conductorData);
            
            setConductor(conductorData);
        } catch (error) {
            console.error('Error cargando conductor:', error);
            setError('Conductor no encontrado o error de conexión');
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

            await conductorService.update(id, formData);
            setSuccessMessage('Conductor actualizado correctamente');

            setTimeout(() => {
                navigate('/conductores');
            }, 1500);
        } catch (error) {
            console.error('Error actualizando conductor:', error);
            const mensaje = error.response?.data?.message || 'Error al actualizar conductor';
            setError(mensaje);
            throw error;
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        navigate('/conductores');
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

    if (error) {
        return (
            <Layout>
                <Box sx={{ p: 2 }}>
                    <Alert severity="error" onClose={() => setError(null)} sx={{ borderRadius: '0.5rem' }}>
                        {error}
                    </Alert>
                    <Button 
                        variant="outlined" 
                        onClick={handleCancel} 
                        sx={{ mt: 2 }}
                    >
                        Volver al listado
                    </Button>
                </Box>
            </Layout>
        );
    }

    if (!conductor) {
        return (
            <Layout>
                <Box sx={{ p: 2 }}>
                    <Alert severity="warning" sx={{ borderRadius: '0.5rem' }}>
                        No se encontraron datos del conductor
                    </Alert>
                    <Button 
                        variant="outlined" 
                        onClick={handleCancel} 
                        sx={{ mt: 2 }}
                    >
                        Volver al listado
                    </Button>
                </Box>
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
                        Editar Conductor: {conductor.nombre_completo}
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

                {/* Alertas */}
                {successMessage && (
                    <Alert severity="success" onClose={limpiarMensajes} sx={{ mb: '1.5rem', borderRadius: '0.5rem' }}>
                        {successMessage}
                    </Alert>
                )}

                {/* Formulario - Pasamos el objeto conductor completo */}
                <ConductorForm
                    conductor={conductor}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    loading={saving}
                />
            </Box>
        </Layout>
    );
};

export default EditConductor;