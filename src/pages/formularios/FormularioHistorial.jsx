import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    Alert,
    CircularProgress,
    TextField,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Chip,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import Layout from '../../layout/Layout';
import { formularioService } from '../../services/FormularioService';
import { vehiculoService } from '../../services/VehiculoService';
import FormularioHistorialItem from '../../components/formularios/FormularioHistorialItem';

const FormularioHistorial = () => {
    const { vehiculoId, tipo } = useParams();
    const navigate = useNavigate();

    const [formularios, setFormularios] = useState([]);
    const [vehiculo, setVehiculo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtro, setFiltro] = useState('');
    const [estadoFiltro, setEstadoFiltro] = useState('');

    useEffect(() => {
        cargarDatos();
    }, [vehiculoId, tipo]);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            setError(null);

            // Cargar vehículo
            const vehiculoRes = await vehiculoService.getById(vehiculoId);
            setVehiculo(vehiculoRes.data.data);

            // Cargar historial
            const response = await formularioService.getHistorial(vehiculoId, tipo);
            setFormularios(response.data.data || []);
        } catch (error) {
            console.error('Error cargando historial:', error);
            setError('Error al cargar el historial');
        } finally {
            setLoading(false);
        }
    };

    const handleVolver = () => {
        if (tipo) {
            navigate(`/formularios/editar/${tipo}/${vehiculoId}`);
        } else {
            navigate(`/formularios/${vehiculoId}`);
        }
    };

    const handleVerDetalle = (id) => {
        navigate(`/formularios/ver/${id}`);
    };

    const handleReutilizar = (formulario) => {
        navigate(`/formularios/editar/${formulario.tipo}/${vehiculoId}`, {
            state: { datos: formulario.datos }
        });
    };

    const handleExportar = async (formulario) => {
        try {
            const response = await formularioService.exportar({
                vehiculo_id: vehiculoId,
                tipo: formulario.tipo,
                datos: formulario.datos
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `FORM_${formulario.tipo}_${new Date().toISOString().slice(0, 10)}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error exportando:', error);
            setError('Error al exportar el formulario');
        }
    };

    const handleLimpiarFiltros = () => {
        setFiltro('');
        setEstadoFiltro('');
    };

    const formulariosFiltrados = formularios.filter(f => {
        const matchTitulo = f.titulo?.toLowerCase().includes(filtro.toLowerCase()) ||
                           f.tipo?.includes(filtro) ||
                           f.id?.toString().includes(filtro);
        const matchEstado = estadoFiltro === '' || f.estado === estadoFiltro;
        return matchTitulo && matchEstado;
    });

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
                    gap: 1,
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={handleVolver}
                            size="small"
                        >
                            Volver
                        </Button>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
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
                    <Button
                        variant="outlined"
                        onClick={cargarDatos}
                        size="small"
                        disabled={loading}
                    >
                        Refrescar
                    </Button>
                </Box>

                {/* Error */}
                {error && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: '0.5rem' }} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                {/* Filtros */}
                <Paper elevation={2} sx={{ p: 2, mb: 2, borderRadius: '0.5rem' }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={5}>
                            <TextField
                                fullWidth
                                placeholder="Buscar por título, tipo o ID..."
                                value={filtro}
                                onChange={(e) => setFiltro(e.target.value)}
                                size="small"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                    endAdornment: filtro && (
                                        <InputAdornment position="end">
                                            <IconButton size="small" onClick={() => setFiltro('')}>
                                                <ClearIcon fontSize="small" />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Estado</InputLabel>
                                <Select
                                    value={estadoFiltro}
                                    onChange={(e) => setEstadoFiltro(e.target.value)}
                                    label="Estado"
                                >
                                    <MenuItem value="">Todos</MenuItem>
                                    <MenuItem value="borrador">Borrador</MenuItem>
                                    <MenuItem value="finalizado">Finalizado</MenuItem>
                                    <MenuItem value="archivado">Archivado</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    variant="outlined"
                                    onClick={handleLimpiarFiltros}
                                    size="small"
                                >
                                    Limpiar
                                </Button>
                                <Chip
                                    label={`${formulariosFiltrados.length} resultados`}
                                    color="primary"
                                    variant="outlined"
                                    size="small"
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Lista de formularios */}
                {formulariosFiltrados.length === 0 ? (
                    <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '0.5rem' }}>
                        <Typography color="text.secondary">
                            No hay formularios registrados
                        </Typography>
                    </Paper>
                ) : (
                    <Box>
                        {formulariosFiltrados.map((formulario) => (
                            <FormularioHistorialItem
                                key={formulario.id}
                                formulario={formulario}
                                onVer={handleVerDetalle}
                                onReutilizar={handleReutilizar}
                                onExportar={handleExportar}
                            />
                        ))}
                    </Box>
                )}
            </Box>
        </Layout>
    );
};

export default FormularioHistorial;