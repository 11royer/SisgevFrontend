import api from '../api/axios';

export const usuarioService = {
  

  // 1. GESTIÓN DE PERFIL (Para todos los roles)
  getPerfil: () => api.get('/me'),

  cambiarPassword: (id, data) => api.post(`/usuarios/${id}/cambiar-password`, data),

  // 2. CRUD DE USUARIOS (Solo rol Administrador)

  getAll: () => api.get('/usuarios'),
  
  getById: (id) => api.get(`/usuarios/${id}`),
  
  create: (data) => api.post('/usuarios', data),
  
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
  
  delete: (id) => api.delete(`/usuarios/${id}`),

  register: (data) => api.post('/registro', data),
};

export default usuarioService;