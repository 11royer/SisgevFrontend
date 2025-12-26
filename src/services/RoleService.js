// src/services/RoleService.js
import api from '../api/axios';

/**
 * Servicio para gestionar roles
 * Proporciona métodos CRUD para interactuar con la API de roles
 */
export const roleService = {
  /**
   * Obtener todos los roles
   * @returns {Promise} Promesa con la lista de roles
   */
  getAll: () => api.get('/roles'),
  
  /**
   * Obtener un rol por ID
   * @param {number} id - ID del rol
   * @returns {Promise} Promesa con los datos del rol
   */
  getById: (id) => api.get(`/roles/${id}`),
  
  /**
   * Crear un nuevo rol
   * @param {Object} data - Datos del rol a crear
   * @returns {Promise} Promesa con el rol creado
   */
  create: (data) => api.post('/roles', data),
  
  /**
   * Actualizar un rol existente
   * @param {number} id - ID del rol
   * @param {Object} data - Datos actualizados
   * @returns {Promise} Promesa con el rol actualizado
   */
  update: (id, data) => api.put(`/roles/${id}`, data),
  
  /**
   * Eliminar un rol
   * @param {number} id - ID del rol a eliminar
   * @returns {Promise} Promesa de confirmación
   */
  delete: (id) => api.delete(`/roles/${id}`),
};