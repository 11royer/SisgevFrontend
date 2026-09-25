import api from '../api/axios';

export const unidadService = {

  // CATÁLOGO (Disponible para todos los usuarios autenticados)
  getCatalogo: () => api.get('/catalogos/unidades'),

  // CRUD COMPLETO (Solo Administrador)
  getAll: () => api.get('/unidades'),

  getById: (id) => api.get(`/unidades/${id}`),

  create: (data) => api.post('/unidades', data),

  update: (id, data) => api.put(`/unidades/${id}`, data),

  delete: (id) => api.delete(`/unidades/${id}`),
};

export default unidadService;