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
import BuildIcon from '@mui/icons-material/Build';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EstadoMantenimientoBadge from './EstadoMantenimientoBadge';

const MantenimientoTable = ({
    mantenimientos,
    loading,
    onEdit,
    onDelete,
    onView,
    onCambiarEstado,
    pagination,
    onPageChange,
}) => {
    const handleChangePage = (event, newPage) => {
        onPageChange(newPage + 1);
    };

    const tiposColores = {
        'Predictivo': 'secondary',
        'Preventivo': 'primary',
        'Correctivo': 'error',
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
                                Fecha / Vehículo
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>
                                Tipo / Descripción
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>
                                Kilometraje / Costo
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>
                                Estado
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>
                                Técnico
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default', textAlign: 'center' }}>
                                Acciones
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {mantenimientos.map((mantenimiento) => (
                            <TableRow 
                                key={mantenimiento.id} 
                                hover
                                sx={{ cursor: 'pointer' }}
                                onClick={() => onView && onView(mantenimiento)}
                            >
                                {/* Fecha y Vehículo */}
                                <TableCell>
                                    <Typography variant="body2" fontWeight="medium">
                                        {mantenimiento.fecha_formateada}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem', mt: 0.5 }}>
                                        <DirectionsCarIcon fontSize="small" color="action" />
                                        <Typography variant="body2">
                                            {mantenimiento.vehiculo?.placa || 'N/A'}
                                        </Typography>
                                    </Box>
                                </TableCell>

                                {/* Tipo y Descripción */}
                                <TableCell>
                                    <Chip
                                        label={mantenimiento.tipo}
                                        size="small"
                                        color={tiposColores[mantenimiento.tipo] || 'default'}
                                        variant="outlined"
                                        sx={{ fontWeight: 'bold', mb: 0.5 }}
                                    />
                                    <Typography variant="caption" display="block" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>
                                        {mantenimiento.descripcion}
                                    </Typography>
                                </TableCell>

                                {/* Kilometraje y Costo */}
                                <TableCell>
                                    <Typography variant="body2">
                                        {mantenimiento.km_mantenimiento?.toLocaleString()} km
                                    </Typography>
                                    {mantenimiento.costo > 0 && (
                                        <Typography variant="caption" color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <AttachMoneyIcon fontSize="small" />
                                            {mantenimiento.costo_formateado}
                                        </Typography>
                                    )}
                                </TableCell>

                                {/* Estado */}
                                <TableCell>
                                    <EstadoMantenimientoBadge estado={mantenimiento.estado_mantenimiento} />
                                </TableCell>

                                {/* Técnico */}
                                <TableCell>
                                    <Typography variant="body2">
                                        {mantenimiento.tecnico_responsable}
                                    </Typography>
                                </TableCell>

                                {/* Acciones */}
                                <TableCell sx={{ textAlign: 'center' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: '0.25rem' }}>
                                        <Tooltip title="Ver detalles">
                                            <IconButton size="small" color="primary" onClick={(e) => { e.stopPropagation(); onView(mantenimiento); }}>
                                                <VisibilityIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Editar">
                                            <IconButton size="small" color="primary" onClick={(e) => { e.stopPropagation(); onEdit(mantenimiento); }}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Eliminar">
                                            <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); onDelete(mantenimiento); }}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}

                        {mantenimientos.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 5 }}>
                                    <BuildIcon sx={{ fontSize: '3rem', color: 'text.secondary', mb: 1 }} />
                                    <Typography color="text.secondary">
                                        No se encontraron mantenimientos registrados
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

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

export default MantenimientoTable;