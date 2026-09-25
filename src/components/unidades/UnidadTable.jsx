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
  CircularProgress,
  Avatar,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ApartmentIcon from '@mui/icons-material/Apartment';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';

/**
 * Tabla de unidades institucionales.
 */
const UnidadTable = ({
  unidades,
  loading,
  onEdit,
  onDelete,
  onView,
}) => {
  // ESTADO DE CARGA
  if (loading && unidades.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: '5rem' }}>
        <CircularProgress />
      </Box>
    );
  }

  // ESTADO VACÍO
  if (unidades.length === 0 && !loading) {
    return (
      <Paper
        elevation={3}
        sx={{ p: '3rem', textAlign: 'center', borderRadius: '0.75rem' }}
      >
        <ApartmentIcon
          sx={{ fontSize: '3rem', color: 'text.secondary', mb: '1rem' }}
        />
        <Typography variant="h6" color="text.secondary">
          No se encontraron unidades registradas
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: '0.5rem' }}>
          Registra la primera unidad usando el botón "Nueva Unidad"
        </Typography>
      </Paper>
    );
  }

  // RENDER PRINCIPAL
  return (
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
              sx={{ fontWeight: 'bold', bgcolor: 'background.default', width: '30%' }}
            >
              Unidad
            </TableCell>
            <TableCell
              sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}
            >
              Sigla / Tipo
            </TableCell>
            <TableCell
              sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}
            >
              Ubicación
            </TableCell>
            <TableCell
              sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}
            >
              Contacto
            </TableCell>
            <TableCell
              sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}
            >
              Estado
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 'bold',
                bgcolor: 'background.default',
                textAlign: 'center',
              }}
            >
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {unidades.map((unidad) => (
            <TableRow
              key={unidad.id}
              hover
              sx={{ cursor: onView ? 'pointer' : 'default' }}
              onClick={() => onView && onView(unidad)}
            >
              {/* COLUMNA: UNIDAD (con avatar) */}
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Avatar
                    sx={{
                      bgcolor: 'primary.light',
                      width: '2.5rem',
                      height: '2.5rem',
                    }}
                  >
                    <ApartmentIcon fontSize="small" />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {unidad.nombre}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ID: {unidad.id}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>

              {/* COLUMNA: SIGLA / TIPO */}
              <TableCell>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {unidad.sigla ? (
                    <Chip
                      label={unidad.sigla}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ fontWeight: 'bold', width: 'fit-content' }}
                    />
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      Sin sigla
                    </Typography>
                  )}
                  {unidad.tipo && (
                    <Typography variant="caption" color="text.secondary">
                      {unidad.tipo}
                    </Typography>
                  )}
                </Box>
              </TableCell>

              {/* COLUMNA: UBICACIÓN */}
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <LocationOnIcon fontSize="small" color="action" />
                  <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                    {unidad.ubicacion || 'No especificada'}
                  </Typography>
                </Box>
              </TableCell>

              {/* COLUMNA: CONTACTO */}
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <PhoneIcon fontSize="small" color="action" />
                  <Typography variant="body2">
                    {unidad.telefono_contacto || 'Sin teléfono'}
                  </Typography>
                </Box>
              </TableCell>

              {/* COLUMNA: ESTADO */}
              <TableCell>
                <Chip
                  label={unidad.estado ? 'Activa' : 'Inactiva'}
                  color={unidad.estado ? 'success' : 'default'}
                  size="small"
                  variant={unidad.estado ? 'filled' : 'outlined'}
                  sx={{ fontWeight: 600, minWidth: '5rem' }}
                />
              </TableCell>

              {/* COLUMNA: ACCIONES */}
              <TableCell sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: '0.25rem' }}>
                  {/* VER - Solo si onView está definido */}
                  {onView && (
                    <Tooltip title="Ver detalles">
                      <span>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            onView(unidad);
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  )}

                  {/* EDITAR - Solo si onEdit está definido */}
                  {onEdit && (
                    <Tooltip title="Editar">
                      <span>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(unidad);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  )}

                  {/* ELIMINAR - Solo si onDelete está definido */}
                  {onDelete && (
                    <Tooltip title="Eliminar">
                      <span>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(unidad);
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
  );
};

export default UnidadTable;