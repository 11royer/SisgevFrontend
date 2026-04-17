import { useState, useEffect, useCallback } from 'react';
import { conductorService } from '../services/ConductorService';

/**
 * Hook para gestionar conductores
 * @returns {Object} Estado y funciones para conductores
 */
export const useConductores = () => {
    // Estados principales
    const [conductores, setConductores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filtros, setFiltros] = useState({});
    const [pagination, setPagination] = useState({
        page: 1,
        perPage: 15,
        total: 0,
        lastPage: 1
    });
    
    // Estados para mensajes
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    /**
     * Cargar conductores con filtros y paginación
     */
    const cargarConductores = useCallback(async (params = {}) => {
        try {
            setLoading(true);
            setError(null);

            const response = await conductorService.getAll({
                page: pagination.page,
                per_page: pagination.perPage,
                ...filtros,
                ...params,
            });

            // Manejar diferentes estructuras de respuesta
            const data = response.data.data || response.data;
            const meta = response.data.meta || {};

            setConductores(Array.isArray(data) ? data : []);
            setPagination(prev => ({
                ...prev,
                total: meta.total || data.length || 0,
                lastPage: meta.last_page || 1,
                page: meta.current_page || prev.page,
            }));

        } catch (error) {
            console.error('Error cargando conductores:', error);
            setError('Error al cargar la lista de conductores');
        } finally {
            setLoading(false);
        }
    }, [filtros, pagination.page, pagination.perPage]);

    // Cargar cuando cambian filtros o paginación
    useEffect(() => {
        cargarConductores();
    }, [cargarConductores]);

    /**
     * Aplicar nuevos filtros
     * @param {Object} nuevosFiltros 
     */
    const aplicarFiltros = (nuevosFiltros) => {
        setFiltros(nuevosFiltros);
        setPagination(prev => ({ ...prev, page: 1 })); // Reset a página 1
    };

    /**
     * Cambiar página
     * @param {number} nuevaPagina 
     */
    const cambiarPagina = (nuevaPagina) => {
        setPagination(prev => ({ ...prev, page: nuevaPagina }));
    };

    /**
     * Crear un nuevo conductor
     * @param {Object} data 
     */
    const crearConductor = async (data) => {
        try {
            setLoading(true);
            setError(null);

            await conductorService.create(data);
            setSuccessMessage('Conductor registrado exitosamente');
            await cargarConductores(); // Recargar lista

            // Limpiar mensaje después de 3 segundos
            setTimeout(() => setSuccessMessage(null), 3000);
            
        } catch (error) {
            console.error('Error creando conductor:', error);
            const mensaje = error.response?.data?.message || 
                           error.response?.data?.errors?.ci?.[0] ||
                           'Error al registrar conductor';
            setError(mensaje);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Actualizar un conductor existente
     * @param {number} id 
     * @param {Object} data 
     */
    const actualizarConductor = async (id, data) => {
        try {
            setLoading(true);
            setError(null);

            await conductorService.update(id, data);
            setSuccessMessage('Conductor actualizado correctamente');
            await cargarConductores();

            setTimeout(() => setSuccessMessage(null), 3000);
            
        } catch (error) {
            console.error('Error actualizando conductor:', error);
            const mensaje = error.response?.data?.message || 
                           'Error al actualizar conductor';
            setError(mensaje);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Eliminar/desactivar un conductor
     * @param {number} id 
     */
    const eliminarConductor = async (id) => {
        try {
            setLoading(true);
            setError(null);

            await conductorService.delete(id);
            setSuccessMessage('Conductor desactivado correctamente');
            await cargarConductores();

            setTimeout(() => setSuccessMessage(null), 3000);
            
        } catch (error) {
            console.error('Error eliminando conductor:', error);
            const mensaje = error.response?.data?.message || 
                           'Error al eliminar conductor';
            setError(mensaje);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Limpiar mensajes de error/éxito
     */
    const limpiarMensajes = () => {
        setError(null);
        setSuccessMessage(null);
    };

    return {
        // Datos
        conductores,
        loading,
        filtros,
        pagination,
        error,
        successMessage,
        
        // Funciones
        cargarConductores,
        aplicarFiltros,
        cambiarPagina,
        crearConductor,
        actualizarConductor,
        eliminarConductor,
        limpiarMensajes,
    };
};