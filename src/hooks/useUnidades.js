import { useState, useEffect, useCallback } from 'react';
import { unidadService } from '../services/UnidadService';

/**
 * Gestiona del CRUD completo de unidades.
 */
export const useUnidades = () => {

  // ESTADOS
  const [unidades, setUnidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // CARGA DE DATOS
  const cargarUnidades = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await unidadService.getAll();
      const data = response.data.data || response.data || [];
      setUnidades(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error cargando unidades:', err);
      setError('Error al cargar la lista de unidades');
      setUnidades([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar al montar el hook
  useEffect(() => {
    cargarUnidades();
  }, [cargarUnidades]);

  // OPERACIONES CRUD
  const crearUnidad = async (data) => {
    try {
      setLoading(true);
      setError(null);

      await unidadService.create(data);
      setSuccessMessage('Unidad registrada exitosamente');
      await cargarUnidades();

      // Limpiar el mensaje después de 3 segundos
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error creando unidad:', err);

      // Extraer mensaje específico del backend si existe
      const mensaje =
        err.response?.data?.message ||
        err.response?.data?.errors?.nombre?.[0] ||
        'Error al registrar la unidad';

      setError(mensaje);
      throw err; // Re-lanzar para que el componente pueda reaccionar
    } finally {
      setLoading(false);
    }
  };

  const actualizarUnidad = async (id, data) => {
    try {
      setLoading(true);
      setError(null);

      await unidadService.update(id, data);
      setSuccessMessage('Unidad actualizada correctamente');
      await cargarUnidades();

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error actualizando unidad:', err);

      const mensaje =
        err.response?.data?.message ||
        err.response?.data?.errors?.nombre?.[0] ||
        'Error al actualizar la unidad';

      setError(mensaje);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const eliminarUnidad = async (id) => {
    try {
      setLoading(true);
      setError(null);

      await unidadService.delete(id);
      setSuccessMessage('Unidad eliminada correctamente');
      await cargarUnidades();

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error eliminando unidad:', err);

      const mensaje =
        err.response?.data?.message ||
        'Error al eliminar la unidad. Puede tener usuarios o vehículos asignados.';

      setError(mensaje);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // UTILIDADES
  const limpiarMensajes = () => {
    setError(null);
    setSuccessMessage(null);
  };

  // RETORNO
  return {
    // Datos
    unidades,
    loading,
    error,
    successMessage,

    // Funciones
    cargarUnidades,
    crearUnidad,
    actualizarUnidad,
    eliminarUnidad,
    limpiarMensajes,
  };
};

export default useUnidades;