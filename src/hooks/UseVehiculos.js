import { useState, useEffect, useCallback } from 'react';
import { vehiculoService } from '../services/VehiculoService';

export const useVehiculos = () => {
    const [vehiculos, setVehiculos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filtros, setFiltros] = useState({
        search: '',
        estado_operativo: '',
        distrito: '',
        unidad_id: '',
        clasificacion_id: '',
    });
    const [pagination, setPagination] = useState({
        page: 1,
        perPage: 15,
        total: 0,
        lastPage: 1
    });
    const [estadisticas, setEstadisticas] = useState(null);
    const [distritosDisponibles, setDistritosDisponibles] = useState([]);
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

            const data = response.data.data || response.data || [];
            const meta = response.data.meta || {};
            const estadisticasData = response.data.estadisticas || null;
            const filtrosData = response.data.filtros || {};

            setVehiculos(Array.isArray(data) ? data : []);
            setEstadisticas(estadisticasData);
            
            // ===== GUARDAR DISTRITOS DISPONIBLES =====
            setDistritosDisponibles(filtrosData.distritos || []);
            
            setPagination(prev => ({
                ...prev,
                total: meta.total || data.length || 0,
                lastPage: meta.last_page || 1,
                page: meta.current_page || prev.page,
            }));

        } catch (error) {
            console.error('Error cargando vehículos:', error);
            setError('Error al cargar la lista de vehículos');
        } finally {
            setLoading(false);
        }
    }, [filtros, pagination.page, pagination.perPage]);

    useEffect(() => {
        cargarVehiculos();
    }, [cargarVehiculos]);

    const aplicarFiltros = (nuevosFiltros) => {
        setFiltros(prev => ({
            ...prev,
            ...nuevosFiltros
        }));
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const cambiarPagina = (nuevaPagina) => {
        setPagination(prev => ({ ...prev, page: nuevaPagina }));
    };

    const cambiarEstado = async (id, nuevoEstado) => {
        try {
            setError(null);
            await vehiculoService.cambiarEstado(id, nuevoEstado);
            setSuccessMessage('Estado actualizado correctamente');
            await cargarVehiculos();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            console.error('Error al actualizar estado:', error);
            const mensaje = error.response?.data?.message || 'Error al actualizar el estado';
            setError(mensaje);
            throw error;
        }
    };

    const eliminarVehiculo = async (id) => {
        try {
            setError(null);
            const response = await vehiculoService.delete(id);
            
            if (response.data.eliminado) {
                setSuccessMessage('Vehículo eliminado correctamente');
            } else {
                setSuccessMessage(response.data.message || 'Vehículo desactivado (marcado como BAJA)');
            }
            
            await cargarVehiculos();
            setTimeout(() => setSuccessMessage(null), 3000);
            
            return response.data;
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
        estadisticas,
        distritosDisponibles,
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