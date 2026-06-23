import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Chip,
    Button,
    Alert,
    CircularProgress,
    Divider,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormHelperText,
    Checkbox,
    FormGroup,
    FormControlLabel,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../layout/Layout';
import { formularioService } from '../../services/FormularioService';
import { vehiculoService } from '../../services/VehiculoService';

const FormularioView = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formulario, setFormulario] = useState(null);
    const [vehiculo, setVehiculo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        cargarFormulario();
    }, [id]);

    const cargarFormulario = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await formularioService.getById(id);
            const data = response.data.data;
            setFormulario(data);
            
            // Cargar vehículo
            if (data.vehiculo_id) {
                const vehResponse = await vehiculoService.getById(data.vehiculo_id);
                setVehiculo(vehResponse.data.data);
            }
            
        } catch (error) {
            console.error('Error cargando formulario:', error);
            setError('Error al cargar el formulario');
        } finally {
            setLoading(false);
        }
    };

    const handleVolver = () => {
        navigate(`/formularios/historial/${formulario?.vehiculo_id}/${formulario?.tipo}`);
    };

    const handleExportar = async () => {
        try {
            await formularioService.exportarConDatos(
                formulario.vehiculo_id,
                formulario.tipo,
                formulario.datos
            );
        } catch (error) {
            console.error('Error exportando:', error);
            alert('Error al exportar el formulario');
        }
    };

    const renderValor = (nombre, valor) => {
        if (!valor || valor === '') return 'No especificado';
        
        if (Array.isArray(valor)) {
            return valor.join(', ');
        }
        
        return valor;
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

    if (error || !formulario) {
        return (
            <Layout>
                <Alert severity="error" sx={{ m: 2 }}>{error || 'Formulario no encontrado'}</Alert>
            </Layout>
        );
    }

    const campos = formulario.datos || {};

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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={handleVolver}
                            size="small"
                        >
                            Volver
                        </Button>
                        <Typography variant="h5" fontWeight="bold">
                            {formulario.titulo || `FORM. ${formulario.tipo}`}
                        </Typography>
                        <Chip
                            label={`Vehículo: ${vehiculo?.placa || 'N/A'}`}
                            color="primary"
                            size="small"
                        />
                        <Chip
                            label={formulario.estado}
                            color={formulario.estado === 'finalizado' ? 'success' : 'warning'}
                            size="small"
                        />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<PictureAsPdfIcon />}
                            onClick={handleExportar}
                            size="small"
                        >
                            Exportar PDF
                        </Button>
                    </Box>
                </Box>

                {/* Datos del formulario */}
                <Paper elevation={3} sx={{ p: 3, borderRadius: '0.75rem' }}>
                    <Grid container spacing={2}>
                        {Object.keys(campos).map((key) => {
                            const valor = campos[key];
                            if (!valor || (Array.isArray(valor) && valor.length === 0)) return null;
                            
                            return (
                                <Grid item xs={12} md={6} key={key}>
                                    <Typography variant="caption" color="text.secondary">
                                        {key.replace(/_/g, ' ').toUpperCase()}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {renderValor(key, valor)}
                                    </Typography>
                                </Grid>
                            );
                        })}
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    <Grid container spacing={1}>
                        <Grid item xs={12} md={4}>
                            <Typography variant="caption" color="text.secondary">Estado</Typography>
                            <Typography variant="body2">
                                <Chip
                                    label={formulario.estado}
                                    color={formulario.estado === 'finalizado' ? 'success' : 'warning'}
                                    size="small"
                                />
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="caption" color="text.secondary">Fecha de Creación</Typography>
                            <Typography variant="body2">
                                {new Date(formulario.created_at).toLocaleString()}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="caption" color="text.secondary">Creado por</Typography>
                            <Typography variant="body2">
                                {formulario.creador?.nombre_completo || 'Sistema'}
                            </Typography>
                        </Grid>
                        {formulario.fecha_emision && (
                            <Grid item xs={12} md={4}>
                                <Typography variant="caption" color="text.secondary">Fecha de Emisión</Typography>
                                <Typography variant="body2">
                                    {new Date(formulario.fecha_emision).toLocaleString()}
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </Paper>
            </Box>
        </Layout>
    );
};

export default FormularioView;