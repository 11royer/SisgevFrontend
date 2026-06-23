import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Button,
    IconButton,
    Alert,
    CircularProgress,
    Tooltip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../layout/Layout';
import { formularioService } from '../../services/FormularioService';
import { vehiculoService } from '../../services/VehiculoService';

const FormularioHistorial = () => {
    const { vehiculoId, tipo } = useParams();
    const navigate = useNavigate();

    const [formularios, setFormularios] = useState([]);
    const [vehiculo, setVehiculo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        cargarHistorial();
        cargarVehiculo();
    }, [vehiculoId, tipo]);

    const cargarHistorial = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await formularioService.getHistorial(vehiculoId, tipo);
            setFormularios(response.data.data || []);
            
        } catch (error) {
            console.error('Error cargando historial:', error);
            setError('Error al cargar el historial de formularios');
        } finally {
            setLoading(false);
        }
    };

    const cargarVehiculo = async () => {
        try {
            const response = await vehiculoService.getById(vehiculoId);
            setVehiculo(response.data.data);
        } catch (error) {
            console.error('Error cargando vehículo:', error);
        }
    };

    const handleVolver = () => {
        navigate(`/formularios/editar/${tipo}/${vehiculoId}`);
    };

    const handleVerDetalle = (id) => {
        // Navegar a la vista detalle del formulario
        navigate(`/formularios/ver/${id}`);
    };

    const handleReutilizar = (formulario) => {
        // Navegar al editor con los datos del formulario
        navigate(`/formularios/editar/${tipo}/${vehiculoId}`, {
            state: { datos: formulario.datos }
        });
    };

    const getEstadoColor = (estado) => {
        switch (estado) {
            case 'finalizado': return 'success';
            case 'borrador': return 'warning';
            case 'archivado': return 'default';
            default: return 'default';
        }
    };

    const getEstadoLabel = (estado) => {
        switch (estado) {
            case 'finalizado': return 'Finalizado';
            case 'borrador': return 'Borrador';
            case 'archivado': return 'Archivado';
            default: return estado;
        }
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

    return (
        <Layout>
            <Box sx={{ width: '100%', p: { xs: '0.75rem', md: '1.5rem' } }}>
                {/* Encabezado */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                    flexWrap: 'wrap',
                    gap: 1
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={handleVolver}
                            size="small"
                        >
                            Volver al Editor
                        </Button>
                        <Typography variant="h5" fontWeight="bold">
                            Historial de Formularios
                        </Typography>
                        {vehiculo && (
                            <Chip
                                label={`Vehículo: ${vehiculo.placa}`}
                                color="primary"
                                size="small"
                            />
                        )}
                        {tipo && (
                            <Chip
                                label={`FORM. ${tipo}`}
                                color="secondary"
                                size="small"
                                variant="outlined"
                            />
                        )}
                    </Box>
                </Box>

                {/* Error */}
                {error && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: '0.5rem' }}>
                        {error}
                    </Alert>
                )}

                {/* Tabla de historial */}
                <Paper elevation={3} sx={{ borderRadius: '0.75rem', overflow: 'hidden' }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: 'background.default' }}>
                                    <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Título</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Fecha de Emisión</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Creado por</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Fecha de Creación</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {formularios.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                                            <Typography color="text.secondary">
                                                No hay formularios registrados para este vehículo
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    formularios.map((form) => (
                                        <TableRow key={form.id} hover>
                                            <TableCell>#{form.id}</TableCell>
                                            <TableCell>{form.titulo || `FORM. ${form.tipo}`}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={getEstadoLabel(form.estado)}
                                                    color={getEstadoColor(form.estado)}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {form.fecha_emision
                                                    ? new Date(form.fecha_emision).toLocaleDateString()
                                                    : 'No emitido'}
                                            </TableCell>
                                            <TableCell>
                                                {form.creador?.nombre_completo || 'Sistema'}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(form.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell sx={{ textAlign: 'center' }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                                                    <Tooltip title="Ver Detalle">
                                                        <IconButton
                                                            size="small"
                                                            color="primary"
                                                            onClick={() => handleVerDetalle(form.id)}
                                                        >
                                                            <VisibilityIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Reutilizar">
                                                        <IconButton
                                                            size="small"
                                                            color="info"
                                                            onClick={() => handleReutilizar(form)}
                                                        >
                                                            <PictureAsPdfIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>
        </Layout>
    );
};

export default FormularioHistorial;