import { useState, useEffect, useCallback } from 'react';
import { vehiculoService } from '../services/VehiculoService';

export const useVehiculos = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState({});
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 15,
    total: 0,
  });
  
  // Estado para errores/mensajes
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const cargarVehiculos = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await vehiculoService.getAll({
        page: pagination.page,
        per_page: pagination.perPage,
        ...filtros,
        ...params,
      });
      
      setVehiculos(response.data.data);
      setPagination(prev => ({
        ...prev,
        total: response.data.meta?.total || 0,
      }));
    } catch (error) {
      console.error('Error cargando vehículos:', error);
      setError('Error al cargar la lista de vehículos');
    } finally {
      setLoading(false);
    }
  }, [filtros, pagination.page, pagination.perPage]);

  // Efecto para cargar cuando cambian los filtros o paginación
  useEffect(() => {
    cargarVehiculos();
  }, [cargarVehiculos]);

  const aplicarFiltros = (nuevosFiltros) => {
    setFiltros(nuevosFiltros);
    setPagination(prev => ({ ...prev, page: 1 })); // Resetear a página 1
  };

  const cambiarPagina = (nuevaPagina) => {
    setPagination(prev => ({ ...prev, page: nuevaPagina }));
  };

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      setError(null);
      await vehiculoService.cambiarEstado(id, nuevoEstado);
      setSuccessMessage('Estado actualizado correctamente');
      await cargarVehiculos(); // Recargar lista
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      setError('Error al actualizar el estado');
      throw error;
    }
  };

  const eliminarVehiculo = async (id) => {
    try {
      setError(null);
      await vehiculoService.delete(id);
      setSuccessMessage('Vehículo eliminado correctamente');
      await cargarVehiculos(); // Recargar lista
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error al eliminar vehículo:', error);
      const mensaje = error.response?.data?.message || 'Error al eliminar el vehículo';
      setError(mensaje);
      throw error;
    }
  };

  const limpiarMensajes = () => {
    setError(null);
    setSuccessMessage(null);
  };

  return {
    vehiculos,
    loading,
    filtros,
    pagination,
    error,
    successMessage,
    cargarVehiculos,
    aplicarFiltros,
    cambiarPagina,
    cambiarEstado,
    eliminarVehiculo,
    limpiarMensajes,
  };
};