import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Paper,
    Typography,
    Chip,
    Alert,
    CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { usuarioService } from '../../services/UsuarioService';

const BitacoraFilters = ({ onFilter, onClear, loading }) => {
    const [filtros, setFiltros] = useState({
        fecha_desde: '',
        fecha_hasta: '',
        usuario_id: '',
    });

    // Estado para lista de usuarios
    const [usuarios, setUsuarios] = useState([]);
    const [cargandoUsuarios, setCargandoUsuarios] = useState(false);
    const [error, setError] = useState(null);

    // Cargar usuarios para el filtro
    useEffect(() => {
        const cargarUsuarios = async () => {
            try {
                setCargandoUsuarios(true);
                setError(null);
                const response = await usuarioService.getAll();
                const data = response.data.data || response.data || [];
                setUsuarios(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error cargando usuarios:', error);
                setError('Error al cargar la lista de usuarios');
            } finally {
                setCargandoUsuarios(false);
            }
        };

        cargarUsuarios();
    }, []);

    // Manejar cambio de filtros
    const handleChange = (name, value) => {
        setFiltros(prev => ({ ...prev, [name]: value }));
    };

    // Aplicar filtros
    const handleAplicarFiltros = () => {
        const filtrosActivos = {};
        
        // Solo enviar filtros que tengan valor
        if (filtros.usuario_id) {
            filtrosActivos.usuario_id = filtros.usuario_id;
        }
        if (filtros.fecha_desde) {
            filtrosActivos.fecha_desde = filtros.fecha_desde;
        }
        if (filtros.fecha_hasta) {
            filtrosActivos.fecha_hasta = filtros.fecha_hasta;
        }

        onFilter(filtrosActivos);
    };

    // Limpiar filtros
    const handleLimpiarFiltros = () => {
        setFiltros({
            fecha_desde: '',
            fecha_hasta: '',
            usuario_id: '',
        });
        onClear();
    };

    // Contar filtros activos
    const filtrosActivosCount = Object.values(filtros).filter(
        value => value && value !== ''
    ).length;

    return (
        <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: '0.75rem' }}>
            {/* Encabezado con resumen */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    🔍 Filtros de Bitácora
                    {filtrosActivosCount > 0 && (
                        <Chip
                            label={`${filtrosActivosCount} filtro(s) activo(s)`}
                            size="small"
                            color="primary"
                            sx={{ ml: 1 }}
                        />
                    )}
                </Typography>
            </Box>

            {/* Error al cargar usuarios */}
            {error && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: '0.5rem' }}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={2} alignItems="center">
                {/* Filtro por Usuario */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Filtrar por Usuario</InputLabel>
                        <Select
                            value={filtros.usuario_id}
                            onChange={(e) => handleChange('usuario_id', e.target.value)}
                            label="Filtrar por Usuario"
                            disabled={cargandoUsuarios}
                        >
                            <MenuItem value="">Todos los usuarios</MenuItem>
                            {cargandoUsuarios ? (
                                <MenuItem disabled>
                                    <CircularProgress size={20} sx={{ mr: 1 }} />
                                    Cargando...
                                </MenuItem>
                            ) : (
                                usuarios.map((usuario) => (
                                    <MenuItem key={usuario.id} value={usuario.id}>
                                        {usuario.nombre_completo} ({usuario.usuario})
                                    </MenuItem>
                                ))
                            )}
                        </Select>
                    </FormControl>
                </Grid>

                {/* Filtro por Fecha Desde */}
                <Grid size={{ xs: 12, md: 3 }}>
                    <TextField
                        fullWidth
                        label="Fecha Desde"
                        type="date"
                        size="small"
                        value={filtros.fecha_desde}
                        onChange={(e) => handleChange('fecha_desde', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>

                {/* Filtro por Fecha Hasta */}
                <Grid size={{ xs: 12, md: 3 }}>
                    <TextField
                        fullWidth
                        label="Fecha Hasta"
                        type="date"
                        size="small"
                        value={filtros.fecha_hasta}
                        onChange={(e) => handleChange('fecha_hasta', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>

                {/* Botones */}
                <Grid size={{ xs: 12, md: 2 }}>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleAplicarFiltros}
                            disabled={loading}
                            startIcon={<SearchIcon />}
                            sx={{ borderRadius: '0.5rem' }}
                        >
                            Buscar
                        </Button>
                        {filtrosActivosCount > 0 && (
                            <Button
                                fullWidth
                                variant="outlined"
                                color="error"
                                onClick={handleLimpiarFiltros}
                                startIcon={<ClearIcon />}
                                sx={{ borderRadius: '0.5rem' }}
                            >
                                Limpiar
                            </Button>
                        )}
                    </Box>
                </Grid>
            </Grid>

            {/* Indicador de filtros activos */}
            {filtrosActivosCount > 0 && (
                <Box sx={{ mt: 2, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="caption" color="text.secondary">
                        Mostrando resultados filtrados por:
                        {filtros.usuario_id && (
                            <Chip
                                label={`Usuario: ${usuarios.find(u => u.id === parseInt(filtros.usuario_id))?.nombre_completo || 'N/A'}`}
                                size="small"
                                sx={{ ml: 1, mr: 1 }}
                            />
                        )}
                        {filtros.fecha_desde && (
                            <Chip
                                label={`Desde: ${new Date(filtros.fecha_desde).toLocaleDateString()}`}
                                size="small"
                                sx={{ mr: 1 }}
                            />
                        )}
                        {filtros.fecha_hasta && (
                            <Chip
                                label={`Hasta: ${new Date(filtros.fecha_hasta).toLocaleDateString()}`}
                                size="small"
                            />
                        )}
                    </Typography>
                </Box>
            )}
        </Paper>
    );
};

export default BitacoraFilters;