import React from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Typography,
    Tooltip,
    TablePagination,
    Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';
import EstadoAsignacionBadge from './EstadoAsignacionBadge';

/**
 * Tabla de asignaciones
*/
const AsignacionTable = ({
    asignaciones,
    loading,
    onEdit,
    onDelete,
    onView,
    onFinalizar,
    pagination,
    onPageChange,
    // RECIBIR PERMISOS COMO PROPS
    puedeFinalizar = false,
    puedeEliminar = false,
    puedeEditar = false,
}) => {
    const handleChangePage = (event, newPage) => {
        onPageChange(newPage + 1);
    };

    return (
        <>
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
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>
                                Fecha Asignación
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>
                                Vehículo
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>
                                Conductor
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>
                                Destino
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>
                                Estado
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default', textAlign: 'center' }}>
                                Acciones
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {asignaciones.map((asignacion) => {
                            const esActiva = !asignacion.fecha_retorno;
                            
                            return (
                                <TableRow 
                                    key={asignacion.id} 
                                    hover
                                    sx={{ cursor: 'pointer' }}
                                    onClick={() => onView && onView(asignacion)}
                                >
                                    {/* Fecha Asignación */}
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="medium">
                                            {asignacion.fecha_asignacion_formateada || 
                                             new Date(asignacion.fecha_asignacion).toLocaleString()}
                                        </Typography>
                                        {asignacion.fecha_retorno && (
                                            <Typography variant="caption" color="text.secondary">
                                                Retorno: {new Date(asignacion.fecha_retorno).toLocaleDateString()}
                                            </Typography>
                                        )}
                                    </TableCell>

                                    {/* Vehículo */}
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <DirectionsCarIcon color="primary" fontSize="small" />
                                            <Box>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {asignacion.vehiculo?.placa || 'N/A'}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {asignacion.vehiculo?.marca} {asignacion.vehiculo?.modelo}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>

                                    {/* Conductor */}
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <PersonIcon color="action" fontSize="small" />
                                            <Box>
                                                <Typography variant="body2">
                                                    {asignacion.conductor?.nombre_completo || 'N/A'}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    CI: {asignacion.conductor?.ci || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>

                                    {/* Destino */}
                                    <TableCell>
                                        <Typography variant="body2">
                                            {asignacion.destino}
                                        </Typography>
                                        {asignacion.observaciones && (
                                            <Tooltip title={asignacion.observaciones}>
                                                <span>
                                                    <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 150 }}>
                                                        {asignacion.observaciones}
                                                    </Typography>
                                                </span>
                                            </Tooltip>
                                        )}
                                    </TableCell>

                                    {/* Estado */}
                                    <TableCell>
                                        <EstadoAsignacionBadge esActiva={esActiva} />
                                    </TableCell>

                                    {/* ACCIONES - CONTROLADAS POR PERMISOS con span wrapper */}
                                    <TableCell sx={{ textAlign: 'center' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '0.25rem' }}>
                                            {/* VER - Siempre visible */}
                                            <Tooltip title="Ver detalles">
                                                <span>
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onView(asignacion);
                                                        }}
                                                    >
                                                        <VisibilityIcon fontSize="small" />
                                                    </IconButton>
                                                </span>
                                            </Tooltip>

                                            {/* FINALIZAR - Solo si está activa Y tiene permiso */}
                                            {esActiva && puedeFinalizar && onFinalizar && (
                                                <Tooltip title="Finalizar asignación">
                                                    <span>
                                                        <IconButton
                                                            size="small"
                                                            color="success"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onFinalizar(asignacion);
                                                            }}
                                                        >
                                                            <CheckCircleIcon fontSize="small" />
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>
                                            )}

                                            {/* EDITAR - Solo si está finalizada Y tiene permiso */}
                                            {!esActiva && puedeEditar && onEdit && (
                                                <Tooltip title="Editar">
                                                    <span>
                                                        <IconButton
                                                            size="small"
                                                            color="primary"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onEdit(asignacion);
                                                            }}
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>
                                            )}

                                            {/* ELIMINAR - Solo si tiene permiso */}
                                            {puedeEliminar && onDelete && (
                                                <Tooltip title="Eliminar">
                                                    <span>
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onDelete(asignacion);
                                                            }}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>
                                            )}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            );
                        })}

                        {asignaciones.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 5 }}>
                                    <DirectionsCarIcon sx={{ fontSize: '3rem', color: 'text.secondary', mb: 1 }} />
                                    <Typography color="text.secondary">
                                        No se encontraron asignaciones
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Paginación */}
            {pagination && (
                <TablePagination
                    component="div"
                    count={pagination.total || 0}
                    page={(pagination.page || 1) - 1}
                    onPageChange={handleChangePage}
                    rowsPerPage={pagination.perPage || 15}
                    rowsPerPageOptions={[10, 15, 25, 50]}
                    labelRowsPerPage="Filas por página:"
                    sx={{ mt: 2 }}
                />
            )}
        </>
    );
};

export default AsignacionTable;