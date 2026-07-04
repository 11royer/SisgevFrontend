import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    CircularProgress,
    Alert,
    IconButton,
    Tooltip,
    TablePagination,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import Layout from '../layout/Layout';
import BitacoraFilters from '../components/bitacora/BitacoraFilters';
import { bitacoraService } from '../services/BitacoraService';

const Bitacora = () => {
    // -- ESTADOS DE DATOS --
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // -- ESTADOS DE PAGINACIÓN --
    const [pagination, setPagination] = useState({
        total: 0,
        current_page: 1,
        per_page: 50,
        last_page: 1,
    });

    // -- ESTADOS DE FILTROS --
    const [filtros, setFiltros] = useState({});
    const [filtrosAplicados, setFiltrosAplicados] = useState(false);

    // -- CARGAR REGISTROS CON FILTROS --
    useEffect(() => {
        cargarLogs();
    }, [filtros, pagination.current_page]);

    const cargarLogs = async () => {
        try {
            setLoading(true);
            setError(null);

            const params = {
                ...filtros,
                page: pagination.current_page,
                per_page: pagination.per_page,
            };

            const response = await bitacoraService.getAll(params);

            // Asegurar que los datos estén en el formato correcto
            const data = response.data.data || response.data || [];
            const meta = response.data.meta || {};

            setLogs(Array.isArray(data) ? data : []);
            setPagination({
                total: meta.total || data.length || 0,
                current_page: meta.current_page || 1,
                per_page: meta.per_page || 50,
                last_page: meta.last_page || 1,
            });
        } catch (error) {
            console.error('Error cargando bitácora:', error);
            setError('Error al cargar los registros de bitácora');
        } finally {
            setLoading(false);
        }
    };

    // -- REFRESCAR --
    const handleRefresh = () => {
        cargarLogs();
    };

    // -- MANEJAR APLICACIÓN DE FILTROS --
    const handleFilter = (nuevosFiltros) => {
        setFiltros(nuevosFiltros);
        setFiltrosAplicados(Object.keys(nuevosFiltros).length > 0);
        setPagination(prev => ({ ...prev, current_page: 1 }));
    };

    // -- MANEJAR LIMPIEZA DE FILTROS --
    const handleClearFilters = () => {
        setFiltros({});
        setFiltrosAplicados(false);
        setPagination(prev => ({ ...prev, current_page: 1 }));
    };

    // -- MANEJAR CAMBIO DE PÁGINA --
    const handlePageChange = (event, newPage) => {
        setPagination(prev => ({ ...prev, current_page: newPage + 1 }));
    };

    // -- FORMATEAR FECHA --
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
            });
        } catch {
            return dateString;
        }
    };

    // -- OBTENER COLOR SEGÚN ACCIÓN --
    const getActionColor = (accion) => {
        const acciones = {
            'Login': 'success',
            'Logout': 'warning',
            'Creación': 'primary',
            'Crear': 'primary',
            'Actualización': 'info',
            'Actualizar': 'info',
            'Editar': 'info',
            'Eliminación': 'error',
            'Eliminar': 'error',
            'Exportar': 'secondary',
            'Registro': 'primary',
            'Cambio de estado': 'warning',
            'Subir Foto Kárdex': 'info',
            'Eliminar Foto Kárdex': 'error',
            'Exportación': 'secondary',
            'Exportación Kárdex': 'secondary',
        };
        return acciones[accion] || 'default';
    };

    return (
        <Layout>
            <Box sx={{ width: '100%', p: { xs: '0.75rem', md: '1.5rem' } }}>

                {/* ENCABEZADO */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: '1.5rem',
                    flexWrap: 'wrap',
                    gap: '1rem',
                }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        Bitácora de Auditoría
                    </Typography>
                    
                    <Tooltip title="Refrescar">
                        <span>
                            <IconButton onClick={handleRefresh} disabled={loading}>
                                <RefreshIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                </Box>

                {/* ERROR */}
                {error && (
                    <Alert severity="error" sx={{ mb: '1.5rem', borderRadius: '0.5rem' }} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                {/* NOTA INFORMATIVA */}
                <Alert severity="info" sx={{ mb: '1.5rem', borderRadius: '0.5rem' }}>
                    <Typography variant="body2">
                        <strong>Nota:</strong> Registro histórico de todas las acciones realizadas en el sistema.
                        {filtrosAplicados && ' Los registros están filtrados según los criterios seleccionados.'}
                        {!filtrosAplicados && ' Los registros más recientes se muestran primero.'}
                    </Typography>
                </Alert>

                {/* COMPONENTE DE FILTROS */}
                <BitacoraFilters
                    onFilter={handleFilter}
                    onClear={handleClearFilters}
                    loading={loading}
                />

                {/* TABLA DE BITÁCORA */}
                <TableContainer
                    component={Paper}
                    elevation={3}
                    sx={{
                        borderRadius: '0.75rem',
                        overflow: 'auto',
                        maxHeight: 'calc(100vh - 20rem)',
                    }}
                >
                    <Table size="small" stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    sx={{
                                        fontWeight: 'bold',
                                        bgcolor: 'background.default',
                                        width: '18%',
                                    }}
                                >
                                    Fecha y Hora
                                </TableCell>
                                <TableCell
                                    sx={{
                                        fontWeight: 'bold',
                                        bgcolor: 'background.default',
                                        width: '18%',
                                    }}
                                >
                                    Usuario
                                </TableCell>
                                <TableCell
                                    sx={{
                                        fontWeight: 'bold',
                                        bgcolor: 'background.default',
                                        width: '12%',
                                    }}
                                >
                                    Acción
                                </TableCell>
                                <TableCell
                                    sx={{
                                        fontWeight: 'bold',
                                        bgcolor: 'background.default',
                                        width: '32%',
                                    }}
                                >
                                    Detalles
                                </TableCell>
                                <TableCell
                                    sx={{
                                        fontWeight: 'bold',
                                        bgcolor: 'background.default',
                                        width: '20%',
                                    }}
                                >
                                    IP / Navegador
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} sx={{ textAlign: 'center', py: '5rem' }}>
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : logs.length > 0 ? (
                                logs.map((log) => (
                                    <TableRow key={log.id} hover>
                                        {/* FECHA Y HORA */}
                                        <TableCell sx={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                                            {formatDate(log.created_at || log.fecha_hora)}
                                        </TableCell>

                                        {/* USUARIO */}
                                        <TableCell sx={{ fontWeight: 'medium' }}>
                                            {log.usuario?.nombre_completo || 'Sistema Automático'}
                                        </TableCell>

                                        {/* ACCIÓN */}
                                        <TableCell>
                                            <Chip
                                                label={log.accion}
                                                size="small"
                                                variant="filled"
                                                color={getActionColor(log.accion)}
                                                sx={{
                                                    fontWeight: 'bold',
                                                    fontSize: '0.7rem',
                                                    minWidth: '4rem',
                                                }}
                                            />
                                        </TableCell>

                                        {/* DESCRIPCIÓN / DETALLES */}
                                        <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                                            {log.descripcion || 'Sin detalles'}
                                        </TableCell>

                                        {/* IP / NAVEGADOR */}
                                        <TableCell sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                                            <Box>
                                                <Typography
                                                    variant="caption"
                                                    display="block"
                                                    sx={{ fontWeight: 'bold' }}
                                                >
                                                    IP: {log.ip_usuario || 'N/A'}
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    display="block"
                                                    sx={{
                                                        maxWidth: '200px',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    {log.dispositivo
                                                        ? log.dispositivo.substring(0, 50) + (log.dispositivo.length > 50 ? '...' : '')
                                                        : 'N/A'
                                                    }
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} sx={{ textAlign: 'center', py: 3 }}>
                                        <Typography color="text.secondary">
                                            {filtrosAplicados
                                                ? 'No hay registros que coincidan con los filtros seleccionados.'
                                                : 'No hay registros de bitácora disponibles.'
                                            }
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* PAGINACIÓN */}
                {!loading && logs.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                        <TablePagination
                            component="div"
                            count={pagination.total}
                            page={(pagination.current_page || 1) - 1}
                            onPageChange={handlePageChange}
                            rowsPerPage={pagination.per_page || 50}
                            rowsPerPageOptions={[25, 50, 100]}
                            labelRowsPerPage="Registros por página:"
                            labelDisplayedRows={({ from, to, count }) =>
                                `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
                            }
                            sx={{
                                '& .MuiTablePagination-select': {
                                    fontSize: '0.85rem',
                                },
                                '& .MuiTablePagination-displayedRows': {
                                    fontSize: '0.85rem',
                                },
                            }}
                        />
                    </Box>
                )}

                {/* CONTADOR DE REGISTROS */}
                {!loading && logs.length > 0 && (
                    <Box sx={{ mt: 1, textAlign: 'right' }}>
                        <Typography variant="caption" color="text.secondary">
                            Total de registros: {pagination.total}
                            {filtrosAplicados && ' (filtrados)'}
                        </Typography>
                    </Box>
                )}
            </Box>
        </Layout>
    );
};

export default Bitacora;