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
import { useNavigate } from 'react-router-dom';
import EstadoBadge from './EstadoBadge';

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
  
  // Estado para el menú contextual
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedVehiculo, setSelectedVehiculo] = React.useState(null);
  
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

  const handleChangePage = (event, newPage) => {
    onPageChange(newPage + 1); // MUI usa base 0, nuestro backend usa base 1
  };

  const handleChangeRowsPerPage = (event) => {
    onPageChange(1); // Volver a la primera página
    // Aquí podrías cambiar el perPage si tu hook lo soporta
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
              <TableCell sx={{ 
                fontWeight: 'bold', 
                bgcolor: 'background.default',
                minWidth: '8rem',
              }}>
                Placa / Vehículo
              </TableCell>
              
              <TableCell sx={{ 
                fontWeight: 'bold', 
                bgcolor: 'background.default',
                minWidth: '8rem',
              }}>
                Datos Técnicos
              </TableCell>
              
              <TableCell sx={{ 
                fontWeight: 'bold', 
                bgcolor: 'background.default',
                minWidth: '8rem',
              }}>
                Estado
              </TableCell>
              
              <TableCell sx={{ 
                fontWeight: 'bold', 
                bgcolor: 'background.default',
                minWidth: '8rem',
              }}>
                Unidad / Ubicación
              </TableCell>
              
              <TableCell sx={{ 
                fontWeight: 'bold', 
                bgcolor: 'background.default',
                width: '8rem',
                textAlign: 'center',
              }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          
          <TableBody>
            {vehiculos.map((vehiculo) => (
              <TableRow 
                key={vehiculo.id} 
                hover
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: 'action.hover' }
                }}
                onClick={() => onView && onView(vehiculo)}
              >
                {/* Columna 1: Placa y vehículo */}
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
                
                {/* Columna 2: Datos técnicos */}
                <TableCell>
                  <Box>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <DirectionsCarIcon fontSize="small" color="action" />
                      {vehiculo.kilometraje_actual?.toLocaleString()} km
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tipo: {vehiculo.tipo}
                    </Typography>
                  </Box>
                </TableCell>
                
                {/* Columna 3: Estados */}
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <EstadoBadge estado={vehiculo.estado_operativo} />
                    <Chip
                      label={vehiculo.en_servicio ? 'En servicio' : 'Fuera de servicio'}
                      size="small"
                      color={vehiculo.en_servicio ? 'success' : 'error'}
                      variant="outlined"
                      sx={{ 
                        fontSize: '0.7rem',
                        height: '1.25rem',
                      }}
                    />
                  </Box>
                </TableCell>
                
                {/* Columna 4: Unidad */}
                <TableCell>
                  {vehiculo.unidad ? (
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {vehiculo.unidad.sigla}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>
                        {vehiculo.unidad.nombre}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary" fontStyle="italic">
                      Sin asignar
                    </Typography>
                  )}
                </TableCell>
                
                {/* Columna 5: Acciones */}
                <TableCell sx={{ textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: '0.25rem' }}>
                    <Tooltip title="Ver detalles">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          onView && onView(vehiculo);
                        }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit && onEdit(vehiculo);
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Más opciones">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, vehiculo)}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
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
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 15, 25, 50]}
          labelRowsPerPage="Filas por página:"
          sx={{ 
            '& .MuiTablePagination-toolbar': {
              paddingLeft: 0,
            }
          }}
        />
      )}
      
      {/* Menú contextual para cambiar estado */}
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
        
        <MenuItem onClick={() => {
          if (selectedVehiculo && onDelete) {
            onDelete(selectedVehiculo);
          }
          handleMenuClose();
        }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText sx={{ color: 'error.main' }}>Eliminar Vehículo</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default VehiculoTable;