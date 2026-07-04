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
    Chip,
    Tooltip,
    Avatar,
    TablePagination,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import HistoryIcon from '@mui/icons-material/History';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';

/**
 * Tabla de conductores con acciones CRUD
 */
const ConductorTable = ({
    conductores,
    loading,
    onEdit,
    onDelete,
    onView,
    onHistory,
    pagination,
    onPageChange,
    // RECIBIR PERMISOS COMO PROPS
    puedeEditar = false,
    puedeEliminar = false,
}) => {
    const handleChangePage = (event, newPage) => {
        onPageChange(newPage + 1); // MUI usa base 0, backend base 1
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
                                Conductor
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>
                                CI / Licencia
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>
                                Contacto
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>
                                Estado
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>
                                Fecha Ingreso
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default', textAlign: 'center' }}>
                                Acciones
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {conductores.map((conductor) => (
                            <TableRow 
                                key={conductor.id} 
                                hover
                                sx={{ cursor: 'pointer' }}
                                onClick={() => onView && onView(conductor)}
                            >
                                {/* Columna: Nombre y avatar */}
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <Avatar sx={{ bgcolor: 'primary.light', width: '2.5rem', height: '2.5rem' }}>
                                            <PersonIcon />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body2" fontWeight="medium">
                                                {conductor.nombre_completo}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                ID: {conductor.id}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>

                                {/* Columna: CI y Licencia */}
                                <TableCell>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <BadgeIcon fontSize="small" color="action" />
                                            {conductor.ci}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Lic: {conductor.licencia}
                                        </Typography>
                                    </Box>
                                </TableCell>

                                {/* Columna: Teléfono y Dirección */}
                                <TableCell>
                                    <Typography variant="body2">
                                        {conductor.telefono || 'Sin teléfono'}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>
                                        {conductor.direccion || 'Sin dirección'}
                                    </Typography>
                                </TableCell>

                                {/* Columna: Estado */}
                                <TableCell>
                                    <Chip
                                        label={conductor.estado ? 'Activo' : 'Inactivo'}
                                        color={conductor.estado ? 'success' : 'error'}
                                        size="small"
                                        variant={conductor.estado ? 'filled' : 'outlined'}
                                        sx={{ fontWeight: 600, minWidth: '5rem' }}
                                    />
                                </TableCell>

                                {/* Columna: Fecha Ingreso */}
                                <TableCell>
                                    <Typography variant="body2">
                                        {conductor.fecha_ingreso_formateada || conductor.fecha_ingreso}
                                    </Typography>
                                </TableCell>

                                {/* CONTROLADAS POR PERMISOS (via props) con span wrapper */}
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
                                                        onView(conductor);
                                                    }}
                                                >
                                                    <VisibilityIcon fontSize="small" />
                                                </IconButton>
                                            </span>
                                        </Tooltip>
                                        
                                        {/* HISTORIAL - Siempre visible */}
                                        <Tooltip title="Historial de asignaciones">
                                            <span>
                                                <IconButton
                                                    size="small"
                                                    color="info"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onHistory(conductor);
                                                    }}
                                                >
                                                    <HistoryIcon fontSize="small" />
                                                </IconButton>
                                            </span>
                                        </Tooltip>
                                        
                                        {/* EDITAR - Solo si tiene permiso */}
                                        {puedeEditar && onEdit && (
                                            <Tooltip title="Editar">
                                                <span>
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onEdit(conductor);
                                                        }}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </span>
                                            </Tooltip>
                                        )}
                                        
                                        {/* ELIMINAR - Solo si tiene permiso */}
                                        {puedeEliminar && onDelete && (
                                            <Tooltip title={conductor.estado ? 'Desactivar' : 'Activar'}>
                                                <span>
                                                    <IconButton
                                                        size="small"
                                                        color={conductor.estado ? 'error' : 'success'}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onDelete(conductor);
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
                        ))}

                        {conductores.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 5 }}>
                                    <PersonIcon sx={{ fontSize: '3rem', color: 'text.secondary', mb: 1 }} />
                                    <Typography color="text.secondary">
                                        No se encontraron conductores registrados
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

export default ConductorTable;