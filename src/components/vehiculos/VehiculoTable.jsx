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
    TablePagination,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BuildIcon from '@mui/icons-material/Build';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate } from 'react-router-dom';
import EstadoBadge from './EstadoBadge';
import useAuth from '../../auth/UseAuth';
import { hasPermission } from '../../utils/hasPermission';

const VehiculoTable = ({
    vehiculos,
    loading,
    onEdit,
    onDelete,
    onView,
    onEstadoChange,
    pagination,
    onPageChange,
}) => {
    const navigate = useNavigate();
    
    // OBTENER USUARIO AUTENTICADO
    const { user: currentUser } = useAuth();
    
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedVehiculo, setSelectedVehiculo] = React.useState(null);

    // VERIFICAR PERMISOS DEL USUARIO
    const puedeEditar = hasPermission(currentUser, 'editar_vehiculos');
    const puedeEliminar = hasPermission(currentUser, 'eliminar_vehiculos');
    const puedeCambiarEstado = hasPermission(currentUser, 'cambiar_estado_vehiculos');

    const handleMenuOpen = (event, vehiculo) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedVehiculo(vehiculo);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedVehiculo(null);
    };

    const handleChangeEstado = (nuevoEstado) => {
        if (selectedVehiculo && onEstadoChange) {
            onEstadoChange(selectedVehiculo.id, nuevoEstado);
        }
        handleMenuClose();
    };

    const handleDeleteClick = () => {
        if (selectedVehiculo && onDelete) {
            onDelete(selectedVehiculo);
        }
        handleMenuClose();
    };

    const handleChangePage = (event, newPage) => {
        onPageChange(newPage + 1);
    };

    if (loading && vehiculos.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: '5rem' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (vehiculos.length === 0 && !loading) {
        return (
            <Paper elevation={3} sx={{ p: '3rem', textAlign: 'center', borderRadius: '0.75rem' }}>
                <DirectionsCarIcon sx={{ fontSize: '3rem', color: 'text.secondary', mb: '1rem' }} />
                <Typography variant="h6" color="text.secondary">
                    No se encontraron vehículos
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: '0.5rem' }}>
                    Intenta cambiar los filtros o registrar un nuevo vehículo
                </Typography>
            </Paper>
        );
    }

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
                                Placa / Vehículo
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>
                                Técnicos
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>
                                Estados
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>
                                Ubicación
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default', textAlign: 'center' }}>
                                Acciones
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {vehiculos.map((vehiculo) => (
                            <TableRow
                                key={vehiculo.id}
                                hover
                                sx={{ cursor: 'pointer' }}
                                onClick={() => onView && onView(vehiculo)}
                            >
                                {/* Placa y vehículo */}
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <DirectionsCarIcon color="primary" />
                                        <Box>
                                            <Typography variant="body1" fontWeight="bold" color="primary">
                                                {vehiculo.placa}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {vehiculo.marca} {vehiculo.modelo}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {vehiculo.anio} • {vehiculo.color}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>

                                {/* Datos técnicos */}
                                <TableCell>
                                    <Box>
                                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <DirectionsCarIcon fontSize="small" color="action" />
                                            {vehiculo.kilometraje_actual?.toLocaleString()} km
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Tipo: {vehiculo.tipo}
                                        </Typography>
                                        {vehiculo.numero_chasis && (
                                            <Typography variant="caption" color="text.secondary">
                                                Chasis: {vehiculo.numero_chasis}
                                            </Typography>
                                        )}
                                    </Box>
                                </TableCell>

                                {/* Estados */}
                                <TableCell>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                        <EstadoBadge estado={vehiculo.estado_operativo} />
                                        <Chip
                                            label={vehiculo.en_servicio ? 'En servicio' : 'Fuera de servicio'}
                                            size="small"
                                            color={vehiculo.en_servicio ? 'success' : 'error'}
                                            variant="outlined"
                                            sx={{ fontSize: '0.7rem', height: '1.25rem' }}
                                        />
                                        <Chip
                                            label={vehiculo.estado || 'Bueno'}
                                            size="small"
                                            variant="outlined"
                                            sx={{ fontSize: '0.65rem', height: '1.2rem' }}
                                        />
                                    </Box>
                                </TableCell>

                                {/* Ubicación - DISTRITO */}
                                <TableCell>
                                    <Box>
                                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <LocationOnIcon fontSize="small" color="action" />
                                            {vehiculo.distrito || 'N/A'}
                                        </Typography>
                                        {vehiculo.unidad?.nombre && (
                                            <Typography variant="caption" color="text.secondary">
                                                {vehiculo.unidad.nombre}
                                            </Typography>
                                        )}
                                        {vehiculo.destino && (
                                            <Typography variant="caption" color="text.secondary" display="block">
                                                Destino: {vehiculo.destino}
                                            </Typography>
                                        )}
                                    </Box>
                                </TableCell>

                                {/* CONTROLADAS POR PERMISOS con span wrapper para Tooltips */}
                                <TableCell sx={{ textAlign: 'center' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: '0.25rem' }}>
                                        {/* VER DETALLE - Siempre visible (lectura) */}
                                        <Tooltip title="Ver detalles">
                                            <span>
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={(e) => { e.stopPropagation(); onView(vehiculo); }}
                                                >
                                                    <VisibilityIcon fontSize="small" />
                                                </IconButton>
                                            </span>
                                        </Tooltip>

                                        {/* CAMBIAR ESTADO - Solo si tiene permiso */}
                                        {puedeCambiarEstado && (
                                            <Tooltip title="Cambiar estado">
                                                <span>
                                                    <IconButton
                                                        size="small"
                                                        color="info"
                                                        onClick={(e) => handleMenuOpen(e, vehiculo)}
                                                    >
                                                        <MoreVertIcon fontSize="small" />
                                                    </IconButton>
                                                </span>
                                            </Tooltip>
                                        )}

                                        {/* EDITAR - Solo si tiene permiso */}
                                        {puedeEditar && onEdit && (
                                            <Tooltip title="Editar">
                                                <span>
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={(e) => { e.stopPropagation(); onEdit(vehiculo); }}
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
                                                            onDelete(vehiculo); 
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
                    onRowsPerPageChange={() => {}}
                    rowsPerPageOptions={[10, 15, 25, 50]}
                    labelRowsPerPage="Filas por página:"
                    sx={{ mt: 2 }}
                />
            )}

            {/* Menú de cambio de estado - Solo visible si tiene permiso */}
            {puedeCambiarEstado && (
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <Typography variant="caption" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
                        Cambiar estado operativo:
                    </Typography>
                    <MenuItem onClick={() => handleChangeEstado('Operativo')}>
                        <ListItemIcon>
                            <CheckCircleIcon fontSize="small" color="success" />
                        </ListItemIcon>
                        <ListItemText>Marcar como Operativo</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => handleChangeEstado('En Taller')}>
                        <ListItemIcon>
                            <BuildIcon fontSize="small" color="warning" />
                        </ListItemIcon>
                        <ListItemText>Enviar a Taller</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => handleChangeEstado('Inoperativo')}>
                        <ListItemIcon>
                            <CancelIcon fontSize="small" color="error" />
                        </ListItemIcon>
                        <ListItemText>Marcar como Inoperativo</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => handleChangeEstado('Baja')}>
                        <ListItemIcon>
                            <CancelIcon fontSize="small" color="disabled" />
                        </ListItemIcon>
                        <ListItemText>Marcar como Baja</ListItemText>
                    </MenuItem>
                </Menu>
            )}
        </>
    );
};

export default VehiculoTable;