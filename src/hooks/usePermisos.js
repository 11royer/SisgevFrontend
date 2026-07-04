import { useState, useEffect, useCallback } from 'react';
import { permisoService } from '../services/PermisoService';

export const usePermisos = (rolId = null) => {
    const [permisos, setPermisos] = useState([]);
    const [permisosAsignados, setPermisosAsignados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Cargar todos los permisos disponibles
    const cargarPermisos = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await permisoService.getAll();
            setPermisos(response.data);
        } catch (error) {
            console.error('Error cargando permisos:', error);
            setError('Error al cargar los permisos');
        } finally {
            setLoading(false);
        }
    }, []);

    // Cargar permisos asignados a un rol específico
    const cargarPermisosRol = useCallback(async (id) => {
        if (!id) return;
        try {
            setLoading(true);
            setError(null);
            const response = await permisoService.getByRol(id);
            setPermisosAsignados(response.data.permisos.map(p => p.id));
        } catch (error) {
            console.error('Error cargando permisos del rol:', error);
            setError('Error al cargar los permisos del rol');
        } finally {
            setLoading(false);
        }
    }, []);

    // Asignar permisos a un rol
    const asignarPermisos = async (id, permisosIds) => {
        try {
            setLoading(true);
            setError(null);
            await permisoService.asignar(id, { permisos: permisosIds });
            setSuccess('Permisos asignados correctamente');
            setTimeout(() => setSuccess(null), 3000);
            return true;
        } catch (error) {
            console.error('Error asignando permisos:', error);
            const mensaje = error.response?.data?.message || 'Error al asignar permisos';
            setError(mensaje);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Cargar permisos al montar
    useEffect(() => {
        cargarPermisos();
    }, [cargarPermisos]);

    // Cargar permisos del rol si se proporciona un ID
    useEffect(() => {
        if (rolId) {
            cargarPermisosRol(rolId);
        }
    }, [rolId, cargarPermisosRol]);

    const limpiarMensajes = () => {
        setError(null);
        setSuccess(null);
    };

    return {
        permisos,
        permisosAsignados,
        loading,
        error,
        success,
        cargarPermisos,
        cargarPermisosRol,
        asignarPermisos,
        limpiarMensajes,
    };
};

export default usePermisos;