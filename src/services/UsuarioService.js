// src/services/UsuarioService.js
import api from '../api/axios';

/**
 * Servicio para gestionar usuarios y perfil
 * Este servicio centraliza todas las llamadas a la API relacionadas con la identidad
 */
export const usuarioService = {
  

  // 1. GESTIÓN DE PERFIL (Para todos los roles)
  /**
   * Obtiene la información del usuario actualmente autenticado
   * @endpoint GET /api/me
   */
  getPerfil: () => api.get('/me'),

  /**
   * Cambiar la contraseña del usuario logueado
   * @param {number} id - ID del usuario
   * @param {Object} data - { contraseña_actual, nueva_contraseña }
   */
  cambiarPassword: (id, data) => api.post(`/usuarios/${id}/cambiar-password`, data),



  // 2. CRUD DE USUARIOS (Solo rol Administrador)
  /**
   * Obtener lista completa de usuarios
   * @endpoint GET /api/usuarios
   */
  getAll: () => api.get('/usuarios'),
  
  /**
   * Obtener un usuario específico por su ID
   * @param {number} id
   */
  getById: (id) => api.get(`/usuarios/${id}`),
  
  /**
   * Crear un nuevo usuario
   * @param {Object} data - Datos del usuario
   */
  create: (data) => api.post('/usuarios', data),
  
  /**
   * Actualizar datos de un usuario
   * Importante: Si envías imágenes, usa FormData en el componente
   * @param {number} id
   * @param {Object|FormData} data 
   */
  update: (id, data) => {
    // Si la data es FormData (para fotos), Laravel a veces requiere 
    // enviar un POST con el campo _method: 'PUT' para procesar archivos
    if (data instanceof FormData) {
        return api.post(`/usuarios/${id}?_method=PUT`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }
    return api.put(`/usuarios/${id}`, data);
  },
  
  /**
   * Eliminar (o desactivar) un usuario
   * @param {number} id
   */
  delete: (id) => api.delete(`/usuarios/${id}`),

  /**
   * Registrar un nuevo usuario (Ruta específica definida en tu api.php)
   * @endpoint POST /api/registro
   */
  register: (data) => api.post('/registro', data),
};

export default usuarioService;