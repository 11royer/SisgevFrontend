import api from '../api/axios';

export const documentoService = {
    /**
     * Obtener todos los documentos
     */
    getAll: (params = {}) => api.get('/documentos', { params }),
    
    /**
     * Obtener un documento por ID
     */
    getById: (id) => api.get(`/documentos/${id}`),
    
    /**
     * Obtener documentos por vehículo
     */
    getByVehiculo: (vehiculoId) => api.get(`/documentos?vehiculo_id=${vehiculoId}`),
    
    /**
     * Crear un nuevo documento
     */
    create: (data) => api.post('/documentos', data),
    
    /**
     * Actualizar un documento
     */
    update: (id, data) => api.put(`/documentos/${id}`, data),
    
    /**
     * Eliminar un documento
     */
    delete: (id) => api.delete(`/documentos/${id}`),
};

export default documentoService;