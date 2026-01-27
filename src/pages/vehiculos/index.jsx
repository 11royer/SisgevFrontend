import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Alert,
  Collapse,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import Layout from '../../layout/Layout';
import VehiculoTable from '../../components/vehiculos/VehiculoTable';
import { useVehiculos } from '../../hooks/UseVehiculos';

const VehiculosPage = () => {
  const navigate = useNavigate();
  const {
    vehiculos,
    loading,
    filtros,
    pagination,
    error,
    successMessage,
    aplicarFiltros,
    cambiarPagina,
    cambiarEstado,
    eliminarVehiculo,
    limpiarMensajes,
  } = useVehiculos();

  const [filtrosLocales, setFiltrosLocales] = useState({
    search: '',
    estado_operativo: '',
    estado: '',
  });

  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const handleFiltroChange = (name, value) => {
    setFiltrosLocales(prev => ({ ...prev, [name]: value }));
  };

  const handleAplicarFiltros = () => {
    aplicarFiltros(filtrosLocales);
  };

  const handleLimpiarFiltros = () => {
    setFiltrosLocales({
      search: '',
      estado_operativo: '',
      estado: '',
    });
    aplicarFiltros({});
  };

  const handleNuevoVehiculo = () => {
    navigate('/vehiculos/crear');
  };

  const handleEditarVehiculo = (vehiculo) => {
    navigate(`/vehiculos/editar/${vehiculo.id}`);
  };

  const handleVerDetalle = (vehiculo) => {
    navigate(`/vehiculos/${vehiculo.id}`);
  };

  // Cerrar alertas automáticamente después de 5 segundos
  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        limpiarMensajes();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, successMessage, limpiarMensajes]);

  return (
    <Layout>
      <Box sx={{ width: '100%', p: { xs: '0.75rem', md: '1.5rem' } }}>
        
        {/* Encabezado */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: '1rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Gestión de Vehículos
          </Typography>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNuevoVehiculo}
            sx={{ borderRadius: '0.5rem' }}
          >
            Nuevo Vehículo
          </Button>
        </Box>

        {/* Alertas de error/éxito */}
        <Collapse in={!!error || !!successMessage}>
          <Box sx={{ mb: '1rem' }}>
            {error && (
              <Alert 
                severity="error" 
                onClose={limpiarMensajes}
                sx={{ borderRadius: '0.5rem' }}
              >
                {error}
              </Alert>
            )}
            
            {successMessage && (
              <Alert 
                severity="success" 
                onClose={limpiarMensajes}
                sx={{ borderRadius: '0.5rem' }}
              >
                {successMessage}
              </Alert>
            )}
          </Box>
        </Collapse>

        {/* Nota informativa */}
        <Alert severity="info" sx={{ mb: '1.5rem', borderRadius: '0.5rem' }}>
          <Typography variant="body2">
            Control de la flota vehicular institucional. Solo personal autorizado puede modificar registros.
          </Typography>
        </Alert>

        {/* Barra de búsqueda rápida */}
        <Paper elevation={2} sx={{ p: '1rem', mb: '1.5rem', borderRadius: '0.5rem' }}>
          <Grid container spacing="1rem" alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Buscar por placa, marca o modelo..."
                value={filtrosLocales.search}
                onChange={(e) => handleFiltroChange('search', e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: '1rem' }}>
                <Button
                  variant="outlined"
                  startIcon={<FilterListIcon />}
                  onClick={() => setMostrarFiltros(!mostrarFiltros)}
                  sx={{ flexShrink: 0 }}
                >
                  {mostrarFiltros ? 'Ocultar Filtros' : 'Más Filtros'}
                </Button>
                
                <Button
                  variant="contained"
                  onClick={handleAplicarFiltros}
                  disabled={loading}
                >
                  Buscar
                </Button>
                
                {(filtros.search || filtros.estado_operativo || filtros.estado) && (
                  <Button
                    variant="text"
                    startIcon={<ClearIcon />}
                    onClick={handleLimpiarFiltros}
                  >
                    Limpiar
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>

          {/* Filtros avanzados (colapsable) */}
          {mostrarFiltros && (
            <Box sx={{ mt: '1.5rem', pt: '1rem', borderTop: '1px solid', borderColor: 'divider' }}>
              <Grid container spacing="1rem">
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Estado Operativo</InputLabel>
                    <Select
                      value={filtrosLocales.estado_operativo}
                      onChange={(e) => handleFiltroChange('estado_operativo', e.target.value)}
                      label="Estado Operativo"
                    >
                      <MenuItem value="">Todos</MenuItem>
                      <MenuItem value="Operativo">Operativo</MenuItem>
                      <MenuItem value="En Taller">En Taller</MenuItem>
                      <MenuItem value="Inoperativo">Inoperativo</MenuItem>
                      <MenuItem value="Baja">Baja</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Estado General</InputLabel>
                    <Select
                      value={filtrosLocales.estado}
                      onChange={(e) => handleFiltroChange('estado', e.target.value)}
                      label="Estado General"
                    >
                      <MenuItem value="">Todos</MenuItem>
                      <MenuItem value="Activo">Activo</MenuItem>
                      <MenuItem value="Mantenimiento">Mantenimiento</MenuItem>
                      <MenuItem value="Baja">Baja</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>

        {/* Tabla de vehículos */}
        <VehiculoTable
          vehiculos={vehiculos}
          loading={loading}
          onEdit={handleEditarVehiculo}
          onDelete={eliminarVehiculo}
          onView={handleVerDetalle}
          onEstadoChange={cambiarEstado}
          pagination={pagination}
          onPageChange={cambiarPagina}
        />

      </Box>
    </Layout>
  );
};

export default VehiculosPage;