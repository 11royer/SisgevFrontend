import { useState, useEffect, useCallback } from 'react';
import { mantenimientoService } from '../services/MantenimientoService';

export const useMantenimientos = () => {
    const [mantenimientos, setMantenimientos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filtros, setFiltros] = useState({});
    const [estadisticas, setEstadisticas] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        perPage: 15,
        total: 0,
        lastPage: 1
    });
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const cargarMantenimientos = useCallback(async (params = {}) => {
        try {
            setLoading(true);
            setError(null);

            const response = await mantenimientoService.getAll({
                page: pagination.page,
                per_page: pagination.perPage,
                ...filtros,
                ...params,
            });

            const data = response.data.data || response.data;
            const meta = response.data.meta || {};

            setMantenimientos(Array.isArray(data) ? data : []);
            setEstadisticas(response.data.estadisticas || null);
            setPagination(prev => ({
                ...prev,
                total: meta.total || data.length || 0,
                lastPage: meta.last_page || 1,
                page: meta.current_page || prev.page,
            }));

        } catch (error) {
            console.error('Error cargando mantenimientos:', error);
            setError('Error al cargar la lista de mantenimientos');
        } finally {
            setLoading(false);
        }
    }, [filtros, pagination.page, pagination.perPage]);

    useEffect(() => {
        cargarMantenimientos();
    }, [cargarMantenimientos]);

    const aplicarFiltros = (nuevosFiltros) => {
        setFiltros(nuevosFiltros);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const cambiarPagina = (nuevaPagina) => {
        setPagination(prev => ({ ...prev, page: nuevaPagina }));
    };

    const crearMantenimiento = async (data) => {
        try {
            setLoading(true);
            setError(null);
            await mantenimientoService.create(data);
            setSuccessMessage('Mantenimiento registrado exitosamente');
            await cargarMantenimientos();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            const mensaje = error.response?.data?.message || 'Error al registrar mantenimiento';
            setError(mensaje);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const actualizarMantenimiento = async (id, data) => {
        try {
            setLoading(true);
            setError(null);
            await mantenimientoService.update(id, data);
            setSuccessMessage('Mantenimiento actualizado correctamente');
            await cargarMantenimientos();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            const mensaje = error.response?.data?.message || 'Error al actualizar mantenimiento';
            setError(mensaje);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const cambiarEstado = async (id, estado) => {
        try {
            setLoading(true);
            setError(null);
            await mantenimientoService.cambiarEstado(id, estado);
            setSuccessMessage(`Estado actualizado a ${estado}`);
            await cargarMantenimientos();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            const mensaje = error.response?.data?.message || 'Error al cambiar estado';
            setError(mensaje);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const eliminarMantenimiento = async (id) => {
        try {
            setLoading(true);
            setError(null);
            await mantenimientoService.delete(id);
            setSuccessMessage('Mantenimiento eliminado correctamente');
            await cargarMantenimientos();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            const mensaje = error.response?.data?.message || 'Error al eliminar mantenimiento';
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
        mantenimientos,
        loading,
        filtros,
        pagination,
        estadisticas,
        error,
        successMessage,
        aplicarFiltros,
        cambiarPagina,
        crearMantenimiento,
        actualizarMantenimiento,
        cambiarEstado,
        eliminarMantenimiento,
        limpiarMensajes,
    };
};