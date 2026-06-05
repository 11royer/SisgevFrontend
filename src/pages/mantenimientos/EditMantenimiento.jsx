import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Alert, CircularProgress } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import Layout from '../../layout/Layout';
import MantenimientoForm from '../../components/mantenimientos/MantenimientoForm';
import { mantenimientoService } from '../../services/MantenimientoService';
import { salidaRepuestoService } from '../../services/SalidaRepuestoService';
import useAuth from '../../auth/UseAuth';

const EditMantenimiento = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    
    const [mantenimiento, setMantenimiento] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Verificar permisos
    if (!['Administrador', 'Técnico'].includes(currentUser?.rol?.nombre)) {
        return (
            <Layout>
                <Alert severity="error" sx={{ m: 2 }}>
                    No tienes permisos para editar mantenimientos.
                </Alert>
            </Layout>
        );
    }

    useEffect(() => {
        cargarMantenimiento();
    }, [id]);

    const cargarMantenimiento = async () => {
        try {
            setLoading(true);
            const response = await mantenimientoService.getById(id);
            const data = response.data.data || response.data;
            
            // Cargar también los repuestos asociados
            if (data.id) {
                try {
                    const salidasResponse = await salidaRepuestoService.getByMantenimiento(data.id);
                    const salidas = salidasResponse.data.data || salidasResponse.data || [];
                    
                    // Transformar salidas a formato que espera el formulario
                    data.salidas_repuestos = salidas.map(s => ({
                        repuesto_id: s.repuesto?.id,
                        repuesto: s.repuesto,
                        cantidad_usada: s.cantidad_usada
                    }));
                } catch (e) {
                    console.log('No hay repuestos asociados o error:', e);
                    data.salidas_repuestos = [];
                }
            }
            
            setMantenimiento(data);
        } catch (error) {
            console.error('Error cargando mantenimiento:', error);
            setError('Mantenimiento no encontrado');
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

            // Separar datos del mantenimiento y repuestos
            const { repuestos, ...mantenimientoData } = formData;

            // 1. Actualizar el mantenimiento
            await mantenimientoService.update(id, mantenimientoData);

            // 2. Gestionar repuestos: eliminar existentes y crear nuevos
            // Primero, obtener las salidas actuales
            const salidasActuales = await salidaRepuestoService.getByMantenimiento(id);
            const salidasExistentes = salidasActuales.data.data || salidasActuales.data || [];

            // Eliminar salidas que ya no están en la nueva lista
            const idsExistentes = salidasExistentes.map(s => s.repuesto?.id);
            const idsNuevos = repuestos?.map(r => r.repuesto_id) || [];
            
            const idsAEliminar = idsExistentes.filter(idExistente => !idsNuevos.includes(idExistente));
            
            for (const salida of salidasExistentes) {
                if (idsAEliminar.includes(salida.repuesto?.id)) {
                    await salidaRepuestoService.delete(salida.id);
                }
            }

            // Crear nuevas salidas para repuestos no existentes
            if (repuestos && repuestos.length > 0) {
                for (const rep of repuestos) {
                    // Verificar si ya existe
                    const yaExiste = salidasExistentes.some(s => s.repuesto?.id === rep.repuesto_id);
                    
                    if (!yaExiste) {
                        await salidaRepuestoService.create({
                            repuesto_id: rep.repuesto_id,
                            mantenimiento_id: parseInt(id),
                            cantidad_usada: rep.cantidad,
                            fecha: mantenimientoData.fecha,
                            observaciones: `Consumo en mantenimiento #${id}`
                        });
                    } else {
                        // Actualizar cantidad si ya existe
                        const salidaExistente = salidasExistentes.find(s => s.repuesto?.id === rep.repuesto_id);
                        if (salidaExistente && salidaExistente.cantidad_usada !== rep.cantidad) {
                            // Nota: La API puede no permitir actualizar cantidad, 
                            // por lo que eliminamos y recreamos
                            await salidaRepuestoService.delete(salidaExistente.id);
                            await salidaRepuestoService.create({
                                repuesto_id: rep.repuesto_id,
                                mantenimiento_id: parseInt(id),
                                cantidad_usada: rep.cantidad,
                                fecha: mantenimientoData.fecha,
                                observaciones: `Consumo en mantenimiento #${id}`
                            });
                        }
                    }
                }
            }

            setSuccessMessage('Mantenimiento actualizado correctamente');

            setTimeout(() => {
                navigate(`/mantenimientos/${id}`);
            }, 1500);

        } catch (error) {
            console.error('Error actualizando mantenimiento:', error);
            let mensaje = 'Error al actualizar mantenimiento';
            if (error.response?.data?.message) {
                mensaje = error.response.data.message;
            }
            setError(mensaje);
            throw error;
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        navigate(`/mantenimientos/${id}`);
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

    if (!mantenimiento) {
        return (
            <Layout>
                <Alert severity="error">Mantenimiento no encontrado</Alert>
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
                        Editar Mantenimiento #{mantenimiento.id}
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
                    mantenimiento={mantenimiento}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    loading={saving}
                />
            </Box>
        </Layout>
    );
};

export default EditMantenimiento;