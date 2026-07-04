/** Verifica si el usuario actual tiene un permiso específico */
export const hasPermission = (user, permiso) => {
  // Si no hay usuario, no tiene permisos
  if (!user) return false;

  // Si es Administrador, tiene todos los permisos (pasa automáticamente)
  if (user.rol?.nombre === 'Administrador') return true;

  // Obtener lista de permisos del usuario
  const permisos = user.permisos || user.rol?.permisos || [];
  
  // Si permisos es un array de objetos, buscar por nombre
  if (permisos.length > 0 && typeof permisos[0] === 'object') {
    return permisos.some(p => p.nombre === permiso);
  }
  
  // Si permisos es un array de strings
  return permisos.some(p => p === permiso);
};

/** Verifica si el usuario tiene ALGUNO de los permisos listados */
export const hasAnyPermission = (user, permisosList) => {
  if (!user || !permisosList || permisosList.length === 0) return false;
  if (user.rol?.nombre === 'Administrador') return true;
  
  const userPermisos = user.permisos || user.rol?.permisos || [];
  const userPermisoNombres = userPermisos.map(p => p.nombre || p);
  
  return permisosList.some(p => userPermisoNombres.includes(p));
};

/** Verifica si el usuario tiene TODOS los permisos listados */
export const hasAllPermissions = (user, permisosList) => {
  if (!user || !permisosList || permisosList.length === 0) return false;
  if (user.rol?.nombre === 'Administrador') return true;
  
  const userPermisos = user.permisos || user.rol?.permisos || [];
  const userPermisoNombres = userPermisos.map(p => p.nombre || p);
  
  return permisosList.every(p => userPermisoNombres.includes(p));
};

export default hasPermission;