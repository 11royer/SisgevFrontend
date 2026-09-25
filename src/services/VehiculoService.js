import api from '../api/axios';

export const vehiculoService = {
    getAll: (params = {}) => api.get('/vehiculos', { params }),
    getById: (id) => api.get(`/vehiculos/${id}`),
    create: (data) => api.post('/vehiculos', data),
    update: (id, data) => api.put(`/vehiculos/${id}`, data),
    delete: (id) => api.delete(`/vehiculos/${id}`),
    cambiarEstado: (id, estado) => api.post(`/vehiculos/${id}/cambiar-estado`, { 
        estado_operativo: estado 
    }),
    getEstadisticas: () => api.get('/vehiculos/estadisticas'),
    getHistorial: (id) => api.get(`/vehiculos/${id}/historial`),
    getOpcionesFiltro: () => api.get('/vehiculos/opciones-filtro'),
    getDocumentos: (id) => api.get(`/vehiculos/${id}/documentos`),
    subirDocumento: (formData) => api.post('/documentos', formData),
    eliminarDocumento: (id) => api.delete(`/documentos/${id}`),
};

export default vehiculoService;