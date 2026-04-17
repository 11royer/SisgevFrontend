import { useState, useEffect, useCallback } from 'react';
import { asignacionService } from '../services/AsignacionService';

/**
 * Hook para gestionar asignaciones
 * @returns {Object} Estado y funciones para asignaciones
 */
export const useAsignaciones = () => {
    // Estados principales
    const [asignaciones, setAsignaciones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filtros, setFiltros] = useState({});
    const [pagination, setPagination] = useState({
        page: 1,
        perPage: 15,
        total: 0,
        lastPage: 1,
        activas: 0 // Contador de activas
    });
    
    // Estados para mensajes
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    /**
     * Cargar asignaciones con filtros
     */
    const cargarAsignaciones = useCallback(async (params = {}) => {
        try {
            setLoading(true);
            setError(null);

            const response = await asignacionService.getAll({
                page: pagination.page,
                per_page: pagination.perPage,
                ...filtros,
                ...params,
            });

            const data = response.data.data || response.data;
            const meta = response.data.meta || {};

            setAsignaciones(Array.isArray(data) ? data : []);
            setPagination(prev => ({
                ...prev,
                total: meta.total || data.length || 0,
                lastPage: meta.last_page || 1,
                page: meta.current_page || prev.page,
                activas: meta.activas || 0,
            }));

        } catch (error) {
            console.error('Error cargando asignaciones:', error);
            setError('Error al cargar la lista de asignaciones');
        } finally {
            setLoading(false);
        }
    }, [filtros, pagination.page, pagination.perPage]);

    useEffect(() => {
        cargarAsignaciones();
    }, [cargarAsignaciones]);

    /**
     * Aplicar filtros
     */
    const aplicarFiltros = (nuevosFiltros) => {
        setFiltros(nuevosFiltros);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    /**
     * Cambiar página
     */
    const cambiarPagina = (nuevaPagina) => {
        setPagination(prev => ({ ...prev, page: nuevaPagina }));
    };

    /**
     * Crear nueva asignación
     */
    const crearAsignacion = async (data) => {
        try {
            setLoading(true);
            setError(null);

            await asignacionService.create(data);
            setSuccessMessage('Vehículo asignado exitosamente');
            await cargarAsignaciones();

            setTimeout(() => setSuccessMessage(null), 3000);
            
        } catch (error) {
            console.error('Error creando asignación:', error);
            const mensaje = error.response?.data?.message || 
                           'Error al crear la asignación';
            setError(mensaje);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Finalizar asignación (retorno)
     */
    const finalizarAsignacion = async (id) => {
        try {
            setLoading(true);
            setError(null);

            await asignacionService.finalizar(id);
            setSuccessMessage('Asignación finalizada correctamente');
            await cargarAsignaciones();

            setTimeout(() => setSuccessMessage(null), 3000);
            
        } catch (error) {
            console.error('Error finalizando asignación:', error);
            const mensaje = error.response?.data?.message || 
                           'Error al finalizar la asignación';
            setError(mensaje);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Eliminar asignación (solo finalizadas)
     */
    const eliminarAsignacion = async (id) => {
        try {
            setLoading(true);
            setError(null);

            await asignacionService.delete(id);
            setSuccessMessage('Asignación eliminada correctamente');
            await cargarAsignaciones();

            setTimeout(() => setSuccessMessage(null), 3000);
            
        } catch (error) {
            console.error('Error eliminando asignación:', error);
            const mensaje = error.response?.data?.message || 
                           'Error al eliminar la asignación';
            setError(mensaje);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const limpiarMensajes = () => {
        setError(null);
        setSuccessMessage(null);
    };

    return {
        // Datos
        asignaciones,
        loading,
        filtros,
        pagination,
        error,
        successMessage,
        
        // Funciones
        cargarAsignaciones,
        aplicarFiltros,
        cambiarPagina,
        crearAsignacion,
        finalizarAsignacion,
        eliminarAsignacion,
        limpiarMensajes,
    };
};