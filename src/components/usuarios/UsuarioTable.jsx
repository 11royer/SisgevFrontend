import React, { useState } from 'react';
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';
import { Box, Chip, Avatar, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonIcon from '@mui/icons-material/Person';

/**
 * Tabla de usuarios sincronizada con UsuarioResource.php
 */
const UsuarioTable = ({ usuarios = [], onEdit, onDelete, onView, loading }) => {
  const [pageSize, setPageSize] = useState(10);

  // Definición de columnas basada EXACTAMENTE en tu UsuarioResource.php
  const columns = [
    {
      field: 'foto_url',
      headerName: 'Foto',
      width: 70,
      renderCell: (params) => (
        <Avatar
          src={params.value}
          alt={params.row.nombre_completo}
          sx={{ width: 35, height: 35 }}
        >
          {!params.value && <PersonIcon />}
        </Avatar>
      ),
      sortable: false,
      filterable: false,
    },
    {
      field: 'nombre_completo', // Coincide con tu Resource
      headerName: 'Nombre Completo',
      flex: 1,
      minWidth: 180,
    },
    {
      field: 'usuario', // Coincide con tu Resource
      headerName: 'Usuario',
      width: 130,
    },
    {
      field: 'email', // Coincide con tu Resource
      headerName: 'Email',
      flex: 1,
      minWidth: 180,
    },
    {
      field: 'rol',
      headerName: 'Rol',
      width: 150,
      renderCell: (params) => {
        // Tu Resource envía un objeto: { id, nombre, descripcion }
        // Extraemos solo el nombre para mostrarlo
        const nombreRol = params.value && typeof params.value === 'object' 
          ? params.value.nombre 
          : 'Sin rol';

        return (
          <Chip 
            label={nombreRol} 
            variant="outlined" 
            size="small" 
            color="primary"
          />
        );
      }
    },
    {
      field: 'estado',
      headerName: 'Estado',
      width: 110,
      renderCell: (params) => {
        // Tu Resource envía: (bool)$this->estado
        const activo = params.value === true || params.value === 1;
        return (
          <Chip
            label={activo ? 'Activo' : 'Inactivo'}
            color={activo ? 'success' : 'error'}
            size="small"
          />
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      type: 'actions',
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Tooltip title="Ver"><VisibilityIcon color="info" /></Tooltip>}
          label="Ver"
          onClick={() => onView(params.row)}
        />,
        <GridActionsCellItem
          icon={<Tooltip title="Editar"><EditIcon color="warning" /></Tooltip>}
          label="Editar"
          onClick={() => onEdit(params.row)}
        />,
        <GridActionsCellItem
          icon={<Tooltip title="Eliminar"><DeleteIcon color="error" /></Tooltip>}
          label="Eliminar"
          onClick={() => onDelete(params.row)}
          disabled={params.row.id === 1} // Protección para admin principal
        />,
      ],
    },
  ];

  return (
    <Box sx={{ height: 500, width: '100%' }}>
      <DataGrid
        rows={Array.isArray(usuarios) ? usuarios : []}
        columns={columns}
        loading={loading}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[5, 10, 20]}
        disableSelectionOnClick
        getRowId={(row) => row.id} // Usa el ID que viene del Resource
        components={{
          Toolbar: GridToolbar,
        }}
        sx={{
          boxShadow: 1,
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f5f5f5',
          },
        }}
      />
    </Box>
  );
};

export default UsuarioTable;