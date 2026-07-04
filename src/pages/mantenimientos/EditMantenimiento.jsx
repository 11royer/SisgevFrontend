import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Alert, CircularProgress } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import Layout from '../../layout/Layout';
import MantenimientoForm from '../../components/mantenimientos/MantenimientoForm';
import { mantenimientoService } from '../../services/MantenimientoService';
import { salidaRepuestoService } from '../../services/SalidaRepuestoService';
import useAuth from '../../auth/UseAuth';
import { hasPermission } from '../../utils/hasPermission';

const EditMantenimiento = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    
    const [mantenimiento, setMantenimiento] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const puedeEditar = hasPermission(currentUser, 'editar_mantenimientos');

    if (!puedeEditar) {
        return (
            <Layout>
                <Alert severity="error" sx={{ m: 2 }}>
                    No tienes permisos para editar mantenimientos.
                    Se requiere el permiso: <strong>editar_mantenimientos</strong>
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
            
            console.log('Datos del mantenimiento:', data);
            
            // NORMALIZAR EL CAMPO VEHÍCULO
            let vehiculoId = data.vehiculo_id;
            
            if (data.vehiculo && typeof data.vehiculo === 'object') {
                vehiculoId = data.vehiculo.id;
            } else if (data.vehiculo_id) {
                vehiculoId = parseInt(data.vehiculo_id);
            } else {
                vehiculoId = '';
            }
            
            // Asignar el ID normalizado
            data.vehiculo_id = vehiculoId;
            
            // Cargar también los repuestos asociados
            if (data.id) {
                try {
                    const salidasResponse = await salidaRepuestoService.getByMantenimiento(data.id);
                    const salidas = salidasResponse.data.data || salidasResponse.data || [];
                    
                    data.salidas_repuestos = salidas.map(s => ({
                        repuesto_id: s.repuesto?.id || s.repuesto_id,
                        repuesto: s.repuesto,
                        cantidad_usada: s.cantidad_usada
                    }));
                } catch (e) {
                    console.log('No hay repuestos asociados o error:', e);
                    data.salidas_repuestos = [];
                }
            }
            
            console.log('Datos normalizados:', data);
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

            const { repuestos, ...mantenimientoData } = formData;

            if (mantenimientoData.vehiculo_id) {
                mantenimientoData.vehiculo_id = parseInt(mantenimientoData.vehiculo_id);
            }

            await mantenimientoService.update(id, mantenimientoData);

            const salidasActuales = await salidaRepuestoService.getByMantenimiento(id);
            const salidasExistentes = salidasActuales.data.data || salidasActuales.data || [];

            const idsExistentes = salidasExistentes.map(s => s.repuesto?.id);
            const idsNuevos = repuestos?.map(r => r.repuesto_id) || [];
            
            const idsAEliminar = idsExistentes.filter(idExistente => !idsNuevos.includes(idExistente));
            
            for (const salida of salidasExistentes) {
                if (idsAEliminar.includes(salida.repuesto?.id)) {
                    await salidaRepuestoService.delete(salida.id);
                }
            }

            if (repuestos && repuestos.length > 0) {
                for (const rep of repuestos) {
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
                        const salidaExistente = salidasExistentes.find(s => s.repuesto?.id === rep.repuesto_id);
                        if (salidaExistente && salidaExistente.cantidad_usada !== rep.cantidad) {
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