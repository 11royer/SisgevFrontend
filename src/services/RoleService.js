import api from '../api/axios';

export const roleService = {
  /**
   * Obtener todos los roles
   */
  getAll: () => api.get('/roles'),
  
  /**
   * Obtener un rol por ID
   */
  getById: (id) => api.get(`/roles/${id}`),
  
  /**
   * Crear un nuevo rol
   */
  create: (data) => api.post('/roles', data),
  
  /**
   * Actualizar un rol existente
   */
  update: (id, data) => api.put(`/roles/${id}`, data),
  
  /**
   * Eliminar un rol
   */
  delete: (id) => api.delete(`/roles/${id}`),
};