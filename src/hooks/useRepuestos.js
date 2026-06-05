import { useState, useEffect, useCallback } from 'react';
import { repuestoService } from '../services/RepuestoService';

export const useRepuestos = () => {
    const [repuestos, setRepuestos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filtros, setFiltros] = useState({});
    const [estadisticas, setEstadisticas] = useState(null);
    const [stockBajoCount, setStockBajoCount] = useState(0);
    const [pagination, setPagination] = useState({
        page: 1,
        perPage: 15,
        total: 0,
        lastPage: 1
    });
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const cargarRepuestos = useCallback(async (params = {}) => {
        try {
            setLoading(true);
            setError(null);

            const response = await repuestoService.getAll({
                page: pagination.page,
                per_page: pagination.perPage,
                ...filtros,
                ...params,
            });

            const data = response.data.data || response.data;
            const meta = response.data.meta || {};

            setRepuestos(Array.isArray(data) ? data : []);
            setEstadisticas(response.data.estadisticas || null);
            setStockBajoCount(meta.stock_bajo_count || 0);
            setPagination(prev => ({
                ...prev,
                total: meta.total || data.length || 0,
                lastPage: meta.last_page || 1,
                page: meta.current_page || prev.page,
            }));

        } catch (error) {
            console.error('Error cargando repuestos:', error);
            setError('Error al cargar la lista de repuestos');
        } finally {
            setLoading(false);
        }
    }, [filtros, pagination.page, pagination.perPage]);

    useEffect(() => {
        cargarRepuestos();
    }, [cargarRepuestos]);

    const aplicarFiltros = (nuevosFiltros) => {
        setFiltros(nuevosFiltros);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const cambiarPagina = (nuevaPagina) => {
        setPagination(prev => ({ ...prev, page: nuevaPagina }));
    };

    const crearRepuesto = async (data) => {
        try {
            setLoading(true);
            setError(null);
            await repuestoService.create(data);
            setSuccessMessage('Repuesto registrado exitosamente');
            await cargarRepuestos();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            const mensaje = error.response?.data?.message || 'Error al registrar repuesto';
            setError(mensaje);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const actualizarRepuesto = async (id, data) => {
        try {
            setLoading(true);
            setError(null);
            await repuestoService.update(id, data);
            setSuccessMessage('Repuesto actualizado correctamente');
            await cargarRepuestos();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            const mensaje = error.response?.data?.message || 'Error al actualizar repuesto';
            setError(mensaje);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const actualizarStock = async (id, cantidad, tipo, observaciones = '') => {
        try {
            setLoading(true);
            setError(null);
            await repuestoService.actualizarStock(id, { cantidad, tipo, observaciones });
            setSuccessMessage(`Stock actualizado: ${tipo === 'entrada' ? '+' : '-'}${cantidad}`);
            await cargarRepuestos();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            const mensaje = error.response?.data?.message || 'Error al actualizar stock';
            setError(mensaje);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const eliminarRepuesto = async (id) => {
        try {
            setLoading(true);
            setError(null);
            await repuestoService.delete(id);
            setSuccessMessage('Repuesto eliminado/desactivado correctamente');
            await cargarRepuestos();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            const mensaje = error.response?.data?.message || 'Error al eliminar repuesto';
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
        repuestos,
        loading,
        filtros,
        pagination,
        estadisticas,
        stockBajoCount,
        error,
        successMessage,
        aplicarFiltros,
        cambiarPagina,
        crearRepuesto,
        actualizarRepuesto,
        actualizarStock,
        eliminarRepuesto,
        limpiarMensajes,
    };
};