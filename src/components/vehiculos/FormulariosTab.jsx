import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Chip,
    IconButton,
    Button,
    Grid,
    Divider,
    Avatar,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tooltip,
    Snackbar,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import HistoryIcon from '@mui/icons-material/History';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { formularioService } from '../../services/formularioService';

// LISTA DE FORMULARIOS TÉCNICOS
const TIPOS_FORMULARIOS = [
    { id: '01', nombre: 'Inventario de Vehículo', icon: '📋' },
    { id: '02', nombre: 'Diagnóstico Técnico', icon: '🔧' },
    { id: '03', nombre: 'Identificación de Vehículo', icon: '🆔' },
    { id: '04', nombre: 'Mantenimiento Preventivo', icon: '🛠️' },
    { id: '05', nombre: 'Mantenimiento Correctivo', icon: '🔩' },
    { id: '06', nombre: 'Orden de Trabajo Auxilio Mecánico (Vehículo)', icon: '📝' },
    { id: '07', nombre: 'Inventario de Motocicleta', icon: '🏍️' },
    { id: '08', nombre: 'Diagnóstico de Motocicleta', icon: '🔧' },
    { id: '09', nombre: 'Identificación de Motocicleta', icon: '🆔' },
    { id: '10', nombre: 'Mantenimiento Preventivo Moto', icon: '🛠️' },
    { id: '11', nombre: 'Mantenimiento Correctivo Moto', icon: '🔩' },
    { id: '12', nombre: 'Orden de Trabajo Auxilio Mecánico (Moto)', icon: '📝' },
];

const FormulariosTab = ({ vehiculoId, vehiculoPlaca }) => {
    const navigate = useNavigate();
    const [formularios, setFormularios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        cargarDatos();
    }, [vehiculoId]);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await formularioService.getByVehiculo(vehiculoId);
            setFormularios(response.data.formularios || []);
        } catch (error) {
            console.error('Error cargando formularios:', error);
            setError('Error al cargar los formularios');
        } finally {
            setLoading(false);
        }
    };

    const obtenerInfo = (tipoId) => {
        const existente = formularios.find(f => f.tipo === tipoId);
        return {
            estado: existente?.estado || null,
            id: existente?.id || null,
            fecha: existente?.updated_at || null,
        };
    };

    const getEstadoColor = (estado) => {
        switch (estado) {
            case 'finalizado': return 'success';
            case 'borrador': return 'warning';
            default: return 'default';
        }
    };

    const getEstadoLabel = (estado) => {
        switch (estado) {
            case 'finalizado': return 'Finalizado';
            case 'borrador': return 'Borrador';
            default: return 'Sin registro';
        }
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleEditar = (tipo, id) => {
        navigate(`/formularios/editar/${tipo}/${vehiculoId}`);
    };

    const handleExportar = async (tipo) => {
        try {
            const data = { vehiculo_id: vehiculoId, tipo };
            const response = await formularioService.exportar(data);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `FORM_${tipo}_${new Date().toISOString().slice(0, 10)}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            showSnackbar(`Formulario ${tipo} exportado correctamente`, 'success');
        } catch (error) {
            console.error('Error exportando:', error);
            showSnackbar('Error al exportar el formulario', 'error');
        }
    };

    const handleHistorial = (tipo) => {
        navigate(`/formularios/historial/${vehiculoId}/${tipo}`);
    };

    if (loading) {
        return (
            <Box sx={{ py: 2 }}>
                {[1, 2, 3, 4].map((i) => (
                    <Paper 
                        key={i} 
                        sx={{ 
                            p: 2, 
                            mb: 1, 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            borderRadius: '0.75rem',
                        }}
                    >
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: 'action.hover' }} />
                            <Box>
                                <Box sx={{ width: 200, height: 20, bgcolor: 'action.hover', borderRadius: 1, mb: 0.5 }} />
                                <Box sx={{ width: 150, height: 16, bgcolor: 'action.hover', borderRadius: 1 }} />
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: 'action.hover' }} />
                            <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: 'action.hover' }} />
                            <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: 'action.hover' }} />
                        </Box>
                    </Paper>
                ))}
            </Box>
        );
    }

    return (
        <Box>
            {error && (
                <Alert 
                    severity="error" 
                    sx={{ mb: 2, borderRadius: '0.5rem' }} 
                    onClose={() => setError(null)}
                >
                    {error}
                </Alert>
            )}

            {/* HEADER */}
            <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5, 
                mb: 2, 
                flexWrap: 'wrap' 
            }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: 'text.primary' }}>
                    📋 Formularios Técnicos
                </Typography>
                <Chip
                    label={`Total: ${formularios.length}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                />
                <Chip
                    label={`Finalizados: ${formularios.filter(f => f.estado === 'finalizado').length}`}
                    size="small"
                    color="success"
                    variant="outlined"
                />
                <Chip
                    label={`Borradores: ${formularios.filter(f => f.estado === 'borrador').length}`}
                    size="small"
                    color="warning"
                    variant="outlined"
                />
            </Box>

            {formularios.length === 0 && (
                <Alert 
                    severity="info" 
                    sx={{ mb: 2, borderRadius: '0.5rem' }}
                >
                    No hay formularios registrados para este vehículo.
                </Alert>
            )}

            {TIPOS_FORMULARIOS.map((tipo) => {
                const info = obtenerInfo(tipo.id);
                const estado = info.estado;

                // Color del borde según estado
                const getBorderColor = () => {
                    if (!estado) return 'divider';
                    if (estado === 'finalizado') return 'success.main';
                    if (estado === 'borrador') return 'warning.main';
                    return 'divider';
                };

                return (
                    <Paper
                        key={tipo.id}
                        elevation={1}
                        sx={{
                            p: 1.5,
                            mb: 1,
                            borderRadius: '0.75rem',
                            borderLeft: `4px solid`,
                            borderColor: getBorderColor(),
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 1,
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': { 
                                backgroundColor: 'action.hover',
                                transform: 'translateX(4px)',
                            },
                        }}
                    >
                        {/* Información del formulario */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Typography variant="h6">{tipo.icon}</Typography>
                            <Box>
                                <Typography variant="body2" fontWeight="medium" sx={{ color: 'text.primary' }}>
                                    FORM. {tipo.id} - {tipo.nombre}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5, flexWrap: 'wrap' }}>
                                    <Chip
                                        label={getEstadoLabel(estado)}
                                        color={getEstadoColor(estado)}
                                        size="small"
                                        variant={estado ? 'filled' : 'outlined'}
                                    />
                                    {info.fecha && (
                                        <Typography variant="caption" color="text.secondary">
                                            {new Date(info.fecha).toLocaleDateString()}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        </Box>

                        {/* Acciones */}
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            <Tooltip title={estado ? 'Editar' : 'Crear'}>
                                <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => handleEditar(tipo.id, info.id)}
                                    sx={{
                                        borderRadius: 1,
                                        p: 0.75,
                                        bgcolor: estado ? 'transparent' : 'primary.main',
                                        color: estado ? 'primary.main' : 'white',
                                        '&:hover': {
                                            bgcolor: estado ? 'primary.light' : 'primary.dark',
                                            color: estado ? 'primary.main' : 'white'
                                        },
                                    }}
                                >
                                    {estado ? <EditIcon fontSize="small" /> : <AddIcon fontSize="small" />}
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Exportar PDF">
                                <IconButton
                                    size="small"
                                    color="success"
                                    onClick={() => handleExportar(tipo.id)}
                                    sx={{ 
                                        borderRadius: 1, 
                                        p: 0.75, 
                                        '&:hover': { 
                                            backgroundColor: 'success.light',
                                            color: 'success.dark',
                                        } 
                                    }}
                                >
                                    <PictureAsPdfIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Ver Historial">
                                <IconButton
                                    size="small"
                                    color="info"
                                    onClick={() => handleHistorial(tipo.id)}
                                    sx={{ 
                                        borderRadius: 1, 
                                        p: 0.75, 
                                        '&:hover': { 
                                            backgroundColor: 'info.light',
                                            color: 'info.dark',
                                        } 
                                    }}
                                >
                                    <HistoryIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Paper>
                );
            })}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    severity={snackbar.severity}
                    variant="filled"
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    sx={{ borderRadius: '0.5rem' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default FormulariosTab;