import api from '../api/axios';

export const unidadService = {
  // Obtener todas las unidades (EPIs, Comandos, etc.)
  // Útil para llenar los Select/Combos en los formularios de vehículos
  getAll: () => api.get('/unidades'),

  // Obtener una unidad específica por ID
  getById: (id) => api.get(`/unidades/${id}`),

  // Si necesitas crear unidades en el futuro (Sprint de administración)
  create: (data) => api.post('/unidades', data),

  // Obtener vehículos pertenecientes a una unidad específica
  getVehiculosByUnidad: (id) => api.get(`/unidades/${id}/vehiculos`),
};

export default unidadService;