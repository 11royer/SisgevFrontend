import { useState, useEffect, useCallback } from 'react';
import { unidadService } from '../services/UnidadService';

/**
 * Para cargar el catálogo de unidades.
 */
export const useCatalogoUnidades = () => {
  const [unidades, setUnidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Cargar el catálogo de unidades desde el backend.
   */
  const cargarCatalogo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await unidadService.getCatalogo();

      // El backend devuelve un array directo (gracias a UnidadResource::collection)
      const data = response.data.data || response.data || [];

      setUnidades(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error cargando catálogo de unidades:', err);
      setError('No se pudo cargar el catálogo de unidades');
      setUnidades([]); // Garantizar que siempre sea un array
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar automáticamente al montar el componente
  useEffect(() => {
    cargarCatalogo();
  }, [cargarCatalogo]);

  return {
    unidades,
    loading,
    error,
    cargarCatalogo, // Por si se necesita refrescar
  };
};

export default useCatalogoUnidades;