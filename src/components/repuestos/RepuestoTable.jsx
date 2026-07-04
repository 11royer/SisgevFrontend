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
    LinearProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InventoryIcon from '@mui/icons-material/Inventory';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import StockBadge from './StockBadge';

/**
 * Tabla de repuestos con acciones CRUD
 */
const RepuestoTable = ({
    repuestos,
    loading,
    onEdit,
    onDelete,
    onView,
    onActualizarStock,
    pagination,
    onPageChange,
    // RECIBIR PERMISOS COMO PROPS
    puedeEditar = false,
    puedeEliminar = false,
    puedeActualizarStock = false,
}) => {
    const handleChangePage = (event, newPage) => {
        onPageChange(newPage + 1);
    };

    // Calcular porcentaje de stock
    const getStockPorcentaje = (actual, minima) => {
        if (actual === 0) return 0;
        const maximo = minima * 3;
        const porcentaje = (actual / maximo) * 100;
        return Math.min(porcentaje, 100);
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
                                Código / Repuesto
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>
                                Stock
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>
                                Ubicación
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>
                                Vida Útil
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
                        {repuestos.map((repuesto) => {
                            const stockPorcentaje = getStockPorcentaje(repuesto.cantidad_actual, repuesto.cantidad_minima);
                            
                            return (
                                <TableRow 
                                    key={repuesto.id} 
                                    hover
                                    sx={{ cursor: 'pointer' }}
                                    onClick={() => onView && onView(repuesto)}
                                >
                                    {/* Código y Nombre */}
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="bold" color="primary">
                                            {repuesto.codigo_interno}
                                        </Typography>
                                        <Typography variant="body2">
                                            {repuesto.nombre_repuesto}
                                        </Typography>
                                        {repuesto.descripcion && (
                                            <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>
                                                {repuesto.descripcion}
                                            </Typography>
                                        )}
                                    </TableCell>

                                    {/* Stock */}
                                    <TableCell sx={{ minWidth: 150 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                            <Typography variant="body2" fontWeight="medium">
                                                {repuesto.cantidad_actual} / {repuesto.cantidad_minima} (min)
                                            </Typography>
                                            <StockBadge 
                                                cantidadActual={repuesto.cantidad_actual}
                                                cantidadMinima={repuesto.cantidad_minima}
                                            />
                                        </Box>
                                        <LinearProgress 
                                            variant="determinate" 
                                            value={stockPorcentaje}
                                            sx={{ 
                                                height: 6, 
                                                borderRadius: 3,
                                                bgcolor: 'action.hover',
                                                '& .MuiLinearProgress-bar': {
                                                    bgcolor: stockPorcentaje < 30 ? 'error.main' : 'success.main'
                                                }
                                            }}
                                        />
                                    </TableCell>

                                    {/* Ubicación */}
                                    <TableCell>
                                        <Typography variant="body2">
                                            {repuesto.ubicacion || 'No especificada'}
                                        </Typography>
                                    </TableCell>

                                    {/* Vida Útil */}
                                    <TableCell>
                                        {repuesto.vida_util_km && (
                                            <Typography variant="caption" display="block">
                                                {repuesto.vida_util_km.toLocaleString()} km
                                            </Typography>
                                        )}
                                        {repuesto.vida_util_dias && (
                                            <Typography variant="caption" display="block" color="text.secondary">
                                                {repuesto.vida_util_dias} días
                                            </Typography>
                                        )}
                                        {!repuesto.vida_util_km && !repuesto.vida_util_dias && (
                                            <Typography variant="caption" color="text.secondary">
                                                No definida
                                            </Typography>
                                        )}
                                    </TableCell>

                                    {/* Estado */}
                                    <TableCell>
                                        {repuesto.activo ? (
                                            <Typography variant="body2" color="success.main">Activo</Typography>
                                        ) : (
                                            <Typography variant="body2" color="error.main">Inactivo</Typography>
                                        )}
                                    </TableCell>

                                    {/* CONTROLADAS POR PERMISOS con span wrapper */}
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
                                                            onView(repuesto); 
                                                        }}
                                                    >
                                                        <VisibilityIcon fontSize="small" />
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
                                                                onEdit(repuesto); 
                                                            }}
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>
                                            )}

                                            {/* ENTRADA DE STOCK - Solo si tiene permiso */}
                                            {puedeActualizarStock && onActualizarStock && (
                                                <Tooltip title="Entrada de Stock">
                                                    <span>
                                                        <IconButton 
                                                            size="small" 
                                                            color="success" 
                                                            onClick={(e) => { 
                                                                e.stopPropagation(); 
                                                                onActualizarStock(repuesto, 'entrada'); 
                                                            }}
                                                        >
                                                            <AddIcon fontSize="small" />
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>
                                            )}

                                            {/* SALIDA DE STOCK - Solo si tiene permiso */}
                                            {puedeActualizarStock && onActualizarStock && (
                                                <Tooltip title="Salida de Stock">
                                                    <span>
                                                        <IconButton 
                                                            size="small" 
                                                            color="warning" 
                                                            onClick={(e) => { 
                                                                e.stopPropagation(); 
                                                                onActualizarStock(repuesto, 'salida'); 
                                                            }}
                                                        >
                                                            <RemoveIcon fontSize="small" />
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
                                                                onDelete(repuesto); 
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

                        {repuestos.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 5 }}>
                                    <InventoryIcon sx={{ fontSize: '3rem', color: 'text.secondary', mb: 1 }} />
                                    <Typography color="text.secondary">
                                        No se encontraron repuestos registrados
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

export default RepuestoTable;