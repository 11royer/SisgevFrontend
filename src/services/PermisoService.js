import api from '../api/axios';

export const permisoService = {
    /** Obtener todos los permisos disponibles */
    getAll: () => api.get('/permisos'),

    /** Obtener permisos asignados a un rol específico */
    getByRol: (rolId) => api.get(`/permisos/rol/${rolId}`),

    /** Asignar permisos a un rol */
    asignar: (rolId, data) => api.post(`/permisos/rol/${rolId}/asignar`, data),
};

export default permisoService;