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
  Avatar,
  Typography,
  Chip,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import ApartmentIcon from '@mui/icons-material/Apartment';

const UsuarioTable = ({ usuarios, onEdit, onDelete, onView }) => {
  return (
    <TableContainer component={Paper} elevation={3} sx={{ borderRadius: '0.5rem', width: '100%' }}>
      <Table size="small">
        {/* CABECERA UNIFICADA CON ESTILO SISGEV-P */}
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>Funcionario</TableCell>
            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>Usuario</TableCell>
            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>Cargo / Función</TableCell>
            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>Rol</TableCell>
            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>Unidad</TableCell>
            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>Contacto</TableCell>
            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default', textAlign: 'center' }}>Acciones</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {usuarios.map((usuario) => (
            <TableRow key={usuario.id} hover>
              {/* COLUMNA PERFIL CON AVATAR */}
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Avatar
                    src={usuario.foto_url}
                    sx={{ width: '2.5rem', height: '2.5rem', bgcolor: 'primary.light' }}
                  >
                    <PersonIcon />
                  </Avatar>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {usuario.nombre_completo}
                  </Typography>
                </Box>
              </TableCell>

              {/* COLUMNA USUARIO */}
              <TableCell>{usuario.usuario}</TableCell>

              {/* NUEVA COLUMNA: CARGO / FUNCIÓN */}
              <TableCell>
                <Typography variant="body2">
                  {usuario.cargo || 'Sin cargo asignado'}
                </Typography>
              </TableCell>

              {/* COLUMNA ROL */}
              <TableCell>
                <Chip
                  label={usuario.rol?.nombre || 'Sin Rol'}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 'bold' }}
                />
              </TableCell>

              {/* UNIDAD INSTITUCIONAL */}
              <TableCell>
                {usuario.unidad ? (
                  <Tooltip title={usuario.unidad.nombre} arrow>
                    <Chip
                      icon={<ApartmentIcon />}
                      label={usuario.unidad.sigla || usuario.unidad.nombre}
                      size="small"
                      color="secondary"
                      variant="outlined"
                      sx={{ 
                        fontWeight: 'bold',
                        maxWidth: '150px',
                        '& .MuiChip-label': {
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        },
                      }}
                    />
                  </Tooltip>
                ) : (
                  <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    Sin asignar
                  </Typography>
                )}
              </TableCell>

              {/* COLUMNA CONTACTO */}
              <TableCell>
                <Typography variant="caption" display="block">{usuario.email}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {usuario.telefono || 'Sin teléfono'}
                </Typography>
              </TableCell>

              {/* ACCIONES - CON TOOLTIPS CON WRAPPER SPAN */}
              <TableCell sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: '0.25rem' }}>
                  
                  <Tooltip title="Editar">
                    <span>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => onEdit(usuario)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>

                  <Tooltip title="Eliminar">
                    <span>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDelete(usuario)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}

          {usuarios.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} sx={{ textAlign: 'center', py: 3 }}>
                <Typography color="text.secondary">
                  No se encontraron usuarios registrados.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UsuarioTable;