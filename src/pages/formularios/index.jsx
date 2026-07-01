import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Paper, 
    Grid, 
    Card, 
    CardContent, 
    CardActions, 
    Button, 
    Chip,
    CircularProgress,
    Alert
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import DescriptionIcon from '@mui/icons-material/Description';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import HistoryIcon from '@mui/icons-material/History';
import Layout from '../../layout/Layout';
import { vehiculoService } from '../../services/VehiculoService';
import { formularioService } from '../../services/FormularioService';

const tiposFormularios = [
    { id: '01', nombre: 'Inventario de Vehículo', icon: '📋' },
    { id: '02', nombre: 'Diagnóstico Técnico de Vehículo', icon: '🔧' },
    { id: '03', nombre: 'Identificación de Vehículo', icon: '🆔' },
    { id: '04', nombre: 'Mantenimiento Preventivo de Vehículo', icon: '🛠️' },
    { id: '05', nombre: 'Mantenimiento Correctivo de Vehículo', icon: '🔩' },
    { id: '06', nombre: 'Orden de Trabajo de Auxilio Mecánico', icon: '📝' },
    { id: '07', nombre: 'Inventario de Motocicleta', icon: '🏍️' },
    { id: '08', nombre: 'Diagnóstico de Motocicleta', icon: '🔧' },
    { id: '09', nombre: 'Identificación de Motocicleta', icon: '🆔' },
    { id: '10', nombre: 'Mantenimiento Preventivo de Motocicleta', icon: '🛠️' },
    { id: '11', nombre: 'Mantenimiento Correctivo de Motocicleta', icon: '🔩' },
    { id: '12', nombre: 'Kárdex del Vehículo', icon: '📂' },
];

const FormulariosPage = () => {
    const { vehiculoId } = useParams();
    const navigate = useNavigate();
    const [vehiculo, setVehiculo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formulariosExistentes, setFormulariosExistentes] = useState([]);

    useEffect(() => {
        cargarDatos();
    }, [vehiculoId]);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            setError(null);

            // Cargar vehículo
            const vehiculoRes = await vehiculoService.getById(vehiculoId);
            setVehiculo(vehiculoRes.data.data);

            // Cargar formularios existentes
            const historialRes = await formularioService.getHistorial(vehiculoId);
            setFormulariosExistentes(historialRes.data.data || []);
        } catch (error) {
            console.error('Error cargando datos:', error);
            setError('Error al cargar los datos');
        } finally {
            setLoading(false);
        }
    };

    const handleCrearFormulario = (tipo) => {
        navigate(`/formularios/editar/${tipo}/${vehiculoId}`);
    };

    const handleVerHistorial = () => {
        navigate(`/formularios/historial/${vehiculoId}`);
    };

    const handleExportarKardex = async () => {
        try {
            const response = await formularioService.exportarKardex(vehiculoId);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `KARDEX_${vehiculo?.placa || 'vehiculo'}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error exportando Kárdex:', error);
            setError('Error al exportar el Kárdex');
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

    if (error) {
        return (
            <Layout>
                <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>
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
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                            Formularios
                        </Typography>
                        {vehiculo && (
                            <Typography variant="subtitle1" color="text.secondary">
                                Vehículo: {vehiculo.placa} - {vehiculo.marca} {vehiculo.modelo}
                            </Typography>
                        )}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant="outlined"
                            startIcon={<HistoryIcon />}
                            onClick={handleVerHistorial}
                            size="small"
                        >
                            Historial
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<PictureAsPdfIcon />}
                            onClick={handleExportarKardex}
                            size="small"
                            color="secondary"
                        >
                            Kárdex
                        </Button>
                    </Box>
                </Box>

                {/* Estadísticas rápidas */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={6} sm={3}>
                        <Paper sx={{ p: '1rem', textAlign: 'center', borderRadius: '0.75rem' }}>
                            <Typography variant="h5" color="primary.main" fontWeight="bold">
                                {formulariosExistentes.length}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">Total</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Paper sx={{ p: '1rem', textAlign: 'center', borderRadius: '0.75rem' }}>
                            <Typography variant="h5" color="warning.main" fontWeight="bold">
                                {formulariosExistentes.filter(f => f.estado === 'borrador').length}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">Borradores</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Paper sx={{ p: '1rem', textAlign: 'center', borderRadius: '0.75rem' }}>
                            <Typography variant="h5" color="success.main" fontWeight="bold">
                                {formulariosExistentes.filter(f => f.estado === 'finalizado').length}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">Finalizados</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Paper sx={{ p: '1rem', textAlign: 'center', borderRadius: '0.75rem' }}>
                            <Typography variant="h5" color="text.primary" fontWeight="bold">
                                {formulariosExistentes.filter(f => f.estado === 'archivado').length}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">Archivados</Typography>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Grid de formularios */}
                <Grid container spacing={2}>
                    {tiposFormularios.map((tipo) => {
                        const existe = formulariosExistentes.some(f => f.tipo === tipo.id);
                        const ultimoEstado = formulariosExistentes.find(f => f.tipo === tipo.id)?.estado;

                        return (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={tipo.id}>
                                <Card 
                                    sx={{ 
                                        borderRadius: '0.75rem',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'all 0.2s ease-in-out',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 4,
                                        }
                                    }}
                                >
                                    <CardContent sx={{ flex: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <Typography variant="h5">{tipo.icon}</Typography>
                                            <Chip 
                                                label={tipo.id} 
                                                size="small" 
                                                color={existe ? 'primary' : 'default'}
                                                variant={existe ? 'filled' : 'outlined'}
                                            />
                                            {ultimoEstado && (
                                                <Chip 
                                                    label={ultimoEstado} 
                                                    size="small" 
                                                    color={ultimoEstado === 'finalizado' ? 'success' : 'warning'}
                                                    variant="outlined"
                                                />
                                            )}
                                        </Box>
                                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                            {tipo.nombre}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {existe ? 'Formulario existente' : 'Crear nuevo formulario'}
                                        </Typography>
                                    </CardContent>
                                    <CardActions sx={{ p: 2, pt: 0 }}>
                                        <Button
                                            fullWidth
                                            variant={existe ? 'outlined' : 'contained'}
                                            size="small"
                                            startIcon={<DescriptionIcon />}
                                            onClick={() => handleCrearFormulario(tipo.id)}
                                            sx={{ borderRadius: '0.5rem' }}
                                        >
                                            {existe ? 'Editar' : 'Crear'}
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </Box>
        </Layout>
    );
};

export default FormulariosPage;