// src/components/bitacora/BitacoraFilters.jsx (versión simplificada)
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  Typography,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const BitacoraFilters = ({ onFilter, onExport, usuarios = [], modulos = [] }) => {
  const [filtros, setFiltros] = useState({
    fechaInicio: '',
    fechaFin: '',
    usuarioId: '',
    modulo: '',
    accion: '',
    descripcion: '',
  });

  const [acciones] = useState([
    'crear', 'editar', 'eliminar', 'login', 'logout', 'ver', 'exportar',
  ]);

  const handleChange = (name, value) => {
    setFiltros(prev => ({
      ...prev,
      [name]: value,
    }));
    if (name === 'modulo') {
      setFiltros(prev => ({ ...prev, accion: '' }));
    }
  };

  const handleAplicarFiltros = () => {
    onFilter(filtros);
  };

  const handleLimpiarFiltros = () => {
    setFiltros({
      fechaInicio: '',
      fechaFin: '',
      usuarioId: '',
      modulo: '',
      accion: '',
      descripcion: '',
    });
    onFilter({});
  };

  const filtrosActivos = Object.values(filtros).filter(
    value => value !== null && value !== ''
  ).length;

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Filtros de Bitácora</Typography>
        {filtrosActivos > 0 && (
          <Chip 
            label={`${filtrosActivos} filtro(s) activo(s)`} 
            color="primary" 
            size="small" 
          />
        )}
      </Box>

      <Grid container spacing={2}>
        {/* Fechas como textfields simples */}
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Fecha Inicio"
            type="date"
            value={filtros.fechaInicio}
            onChange={(e) => handleChange('fechaInicio', e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Fecha Fin"
            type="date"
            value={filtros.fechaFin}
            onChange={(e) => handleChange('fechaFin', e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        {/* Usuario */}
        <Grid item xs={12} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Usuario</InputLabel>
            <Select
              value={filtros.usuarioId}
              onChange={(e) => handleChange('usuarioId', e.target.value)}
              label="Usuario"
            >
              <MenuItem value="">Todos los usuarios</MenuItem>
              {usuarios.map((usuario) => (
                <MenuItem key={usuario.id} value={usuario.id}>
                  {usuario.nombre_completo} ({usuario.usuario})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Módulo */}
        <Grid item xs={12} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Módulo</InputLabel>
            <Select
              value={filtros.modulo}
              onChange={(e) => handleChange('modulo', e.target.value)}
              label="Módulo"
            >
              <MenuItem value="">Todos los módulos</MenuItem>
              {modulos.map((modulo) => (
                <MenuItem key={modulo} value={modulo}>
                  {modulo}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Acción */}
        <Grid item xs={12} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Acción</InputLabel>
            <Select
              value={filtros.accion}
              onChange={(e) => handleChange('accion', e.target.value)}
              label="Acción"
            >
              <MenuItem value="">Todas las acciones</MenuItem>
              {acciones.map((accion) => (
                <MenuItem key={accion} value={accion}>
                  {accion.charAt(0).toUpperCase() + accion.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Descripción */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Buscar en descripción"
            value={filtros.descripcion}
            onChange={(e) => handleChange('descripcion', e.target.value)}
            size="small"
            placeholder="Palabras clave..."
          />
        </Grid>

        {/* Botones */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              onClick={handleAplicarFiltros}
              startIcon={<SearchIcon />}
            >
              Aplicar Filtros
            </Button>
            
            <Button
              variant="outlined"
              onClick={handleLimpiarFiltros}
              startIcon={<ClearIcon />}
            >
              Limpiar Filtros
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default BitacoraFilters;