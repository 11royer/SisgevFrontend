import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Button,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Alert,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    useTheme,
} from '@mui/material';
import Layout from '../../layout/Layout';
import { reporteService } from '../../services/ReporteService';
import DownloadIcon from '@mui/icons-material/Download';
import SearchIcon from '@mui/icons-material/Search';

const ReportesPage = () => {
    const location = useLocation();
    const theme = useTheme();
    
    const [tipoReporte, setTipoReporte] = useState('vehiculos');
    const [filtros, setFiltros] = useState({
        estado_operativo: '',
        distrito: '',
        fecha_desde: '',
        fecha_hasta: '',
        tipo: '',
    });
    const [reporte, setReporte] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const tiposReporte = [
        { value: 'vehiculos', label: 'Vehículos' },
        { value: 'mantenimientos', label: 'Mantenimientos' },
        { value: 'repuestos', label: 'Repuestos con Stock Bajo' },
    ];
    
    const estadosOperativos = [
        { value: '', label: 'Todos' },
        { value: 'Operativo', label: 'Operativo' },
        { value: 'En Taller', label: 'En Taller' },
        { value: 'Inoperativo', label: 'Inoperativo' },
        { value: 'Baja', label: 'Baja' },
    ];
    
    const tiposMantenimiento = [
        { value: '', label: 'Todos' },
        { value: 'Predictivo', label: 'Predictivo' },
        { value: 'Preventivo', label: 'Preventivo' },
        { value: 'Correctivo', label: 'Correctivo' },
    ];
    
    useEffect(() => {
        if (location.state?.tipo) {
            setTipoReporte(location.state.tipo);
            setTimeout(() => handleGenerarReporte(), 100);
        }
    }, [location.state]);
    
    const handleGenerarReporte = async () => {
        try {
            setLoading(true);
            setError(null);
            
            let response;
            
            if (tipoReporte === 'vehiculos') {
                response = await reporteService.vehiculos({
                    estado_operativo: filtros.estado_operativo,
                    distrito: filtros.distrito,
                });
            } else if (tipoReporte === 'mantenimientos') {
                response = await reporteService.mantenimientos({
                    tipo: filtros.tipo,
                    fecha_desde: filtros.fecha_desde,
                    fecha_hasta: filtros.fecha_hasta,
                });
            } else {
                response = await reporteService.repuestosStockBajo();
            }
            
            const data = response.data;
            setReporte({
                titulo: data.titulo || 'Reporte',
                fecha_generacion: data.fecha_generacion || new Date().toLocaleString(),
                total: data.total || (data.data?.length || 0),
                resumen: data.resumen || null,
                data: data.data || []
            });
            
        } catch (error) {
            console.error('Error generando reporte:', error);
            setError(error.response?.data?.message || 'Error al generar el reporte');
        } finally {
            setLoading(false);
        }
    };
    
    // Función de exportación que filtra parámetros vacíos
    const handleExportarCSV = () => {
        // Crear objeto con solo los filtros que tienen valor
        const filtrosExport = {};
        
        if (tipoReporte === 'vehiculos') {
            if (filtros.estado_operativo) filtrosExport.estado_operativo = filtros.estado_operativo;
            if (filtros.distrito) filtrosExport.distrito = filtros.distrito;
        } else if (tipoReporte === 'mantenimientos') {
            if (filtros.tipo) filtrosExport.tipo = filtros.tipo;
            if (filtros.fecha_desde) filtrosExport.fecha_desde = filtros.fecha_desde;
            if (filtros.fecha_hasta) filtrosExport.fecha_hasta = filtros.fecha_hasta;
        }
        
        // Llamar al servicio con los filtros limpios
        reporteService.exportarCSV(tipoReporte, filtrosExport);
    };
    
    const handleTipoChange = (newTipo) => {
        setTipoReporte(newTipo);
        setFiltros({
            estado_operativo: '',
            distrito: '',
            fecha_desde: '',
            fecha_hasta: '',
            tipo: '',
        });
        setReporte(null);
    };
    
    return (
        <Layout>
            <Box sx={{ width: '100%', p: { xs: '0.75rem', md: '1.5rem' } }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Reportes
                </Typography>
                
                {error && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: '0.75rem' }}>
                        {error}
                    </Alert>
                )}
                
                {/* Panel de Filtros */}
                <Paper elevation={2} sx={{ p: 2, mb: 2, borderRadius: '0.75rem' }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Tipo de Reporte</InputLabel>
                                <Select
                                    value={tipoReporte}
                                    onChange={(e) => handleTipoChange(e.target.value)}
                                    label="Tipo de Reporte"
                                >
                                    {tiposReporte.map(t => (
                                        <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        
                        {tipoReporte === 'vehiculos' && (
                            <>
                                <Grid item xs={12} md={3}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Estado Operativo</InputLabel>
                                        <Select
                                            value={filtros.estado_operativo}
                                            onChange={(e) => setFiltros({ ...filtros, estado_operativo: e.target.value })}
                                            label="Estado Operativo"
                                        >
                                            {estadosOperativos.map(e => (
                                                <MenuItem key={e.value} value={e.value}>{e.label}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        fullWidth
                                        label="Distrito"
                                        size="small"
                                        value={filtros.distrito}
                                        onChange={(e) => setFiltros({ ...filtros, distrito: e.target.value })}
                                    />
                                </Grid>
                            </>
                        )}
        
                        {tipoReporte === 'mantenimientos' && (
                            <>
                                <Grid item xs={12} md={3}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Tipo</InputLabel>
                                        <Select
                                            value={filtros.tipo}
                                            onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
                                            label="Tipo"
                                        >
                                            {tiposMantenimiento.map(t => (
                                                <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        fullWidth
                                        label="Fecha Desde"
                                        type="date"
                                        size="small"
                                        value={filtros.fecha_desde}
                                        onChange={(e) => setFiltros({ ...filtros, fecha_desde: e.target.value })}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        fullWidth
                                        label="Fecha Hasta"
                                        type="date"
                                        size="small"
                                        value={filtros.fecha_hasta}
                                        onChange={(e) => setFiltros({ ...filtros, fecha_hasta: e.target.value })}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                            </>
                        )}
                        
                        <Grid item xs={12} md={tipoReporte === 'vehiculos' ? 3 : 3}>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleGenerarReporte}
                                startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
                                disabled={loading}
                                sx={{ borderRadius: '0.5rem' }}
                            >
                                {loading ? 'Generando...' : 'Generar'}
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
                
                {/* Resultados */}
                {reporte && (
                    <Paper elevation={3} sx={{ borderRadius: '0.75rem', overflow: 'hidden' }}>
                        <Box sx={{ 
                            p: 2, 
                            bgcolor: 'background.default', 
                            borderBottom: '1px solid', 
                            borderColor: 'divider', 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            flexWrap: 'wrap', 
                            gap: 1 
                        }}>
                            <Box>
                                <Typography variant="h6" fontWeight="bold" sx={{ color: 'primary.main' }}>
                                    {reporte.titulo}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Generado: {reporte.fecha_generacion} | Total: {reporte.total} registros
                                </Typography>
                            </Box>
                            <Button
                                variant="outlined"
                                startIcon={<DownloadIcon />}
                                onClick={handleExportarCSV}
                                size="small"
                                sx={{ borderRadius: '0.5rem' }}
                            >
                                Exportar CSV
                            </Button>
                        </Box>
                        
                        {reporte.resumen && Object.keys(reporte.resumen).length > 0 && (
                            <Box sx={{ 
                                p: 2, 
                                display: 'flex', 
                                gap: 2, 
                                flexWrap: 'wrap', 
                                borderBottom: '1px solid', 
                                borderColor: 'divider' 
                            }}>
                                {Object.entries(reporte.resumen).map(([key, value]) => (
                                    <Chip
                                        key={key}
                                        label={`${key.replace(/_/g, ' ').toUpperCase()}: ${value}`}
                                        variant="outlined"
                                        size="small"
                                        sx={{ fontWeight: 500 }}
                                    />
                                ))}
                            </Box>
                        )}
                        
                        {reporte.data && reporte.data.length > 0 ? (
                            <TableContainer sx={{ maxHeight: 500 }}>
                                <Table size="small" stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            {Object.keys(reporte.data[0]).map(header => (
                                                <TableCell key={header} sx={{ 
                                                    fontWeight: 'bold', 
                                                    bgcolor: 'background.default',
                                                    whiteSpace: 'nowrap',
                                                    minWidth: '100px'
                                                }}>
                                                    {header.replace(/_/g, ' ').toUpperCase()}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {reporte.data.map((row, idx) => (
                                            <TableRow key={idx} hover>
                                                {Object.values(row).map((value, i) => (
                                                    <TableCell key={i}>
                                                        {typeof value === 'number' ? value.toLocaleString() : (value || '-')}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Box sx={{ p: 4, textAlign: 'center' }}>
                                <Typography color="text.secondary">
                                    No hay datos disponibles para los filtros seleccionados.
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                )}
                
                {!reporte && !loading && !error && (
                    <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '0.75rem' }}>
                        <SearchIcon sx={{ fontSize: '3rem', color: 'text.secondary', mb: 1 }} />
                        <Typography color="text.secondary">
                            Seleccione un tipo de reporte y haga clic en "Generar" para ver los resultados.
                        </Typography>
                    </Paper>
                )}
            </Box>
        </Layout>
    );
};

export default ReportesPage;