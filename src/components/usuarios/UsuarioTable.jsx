// src/components/usuarios/UsuarioTable.jsx
import React from 'react';
import {
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
  Box // <--- Faltaba esta importación, por eso se ponía en blanco
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonIcon from '@mui/icons-material/Person';

const UsuarioTable = ({ usuarios, onEdit, onDelete, onView }) => {
  // --- RENDERIZADO ---
  return (
    <TableContainer component={Paper} elevation={3} sx={{ borderRadius: '0.5rem', width: '100%' }}>
      <Table size="small">
        {/* CABECERA UNIFICADA CON ESTILO SISGEV-P */}
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>Funcionario</TableCell>
            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>Usuario</TableCell>
            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>Rol / Cargo</TableCell>
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

              <TableCell>{usuario.usuario}</TableCell>

              <TableCell>
                <Chip 
                  label={usuario.rol?.nombre || 'Sin Rol'} 
                  size="small" 
                  color="primary" 
                  variant="outlined" 
                  sx={{ fontWeight: 'bold' }}
                />
              </TableCell>

              <TableCell>
                <Typography variant="caption" display="block">{usuario.email}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {usuario.telefono || 'Sin teléfono'}
                </Typography>
              </TableCell>

              {/* ACCIONES DE GESTIÓN */}
              <TableCell sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: '0.25rem' }}>
                  <Tooltip title="Ver Detalles">
                    <IconButton size="small" color="info" onClick={() => onView(usuario)}>
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Editar">
                    <IconButton size="small" color="primary" onClick={() => onEdit(usuario)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton size="small" color="error" onClick={() => onDelete(usuario)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
          {usuarios.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} sx={{ textAlign: 'center', py: 3 }}>
                <Typography color="text.secondary">No se encontraron usuarios registrados.</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UsuarioTable;