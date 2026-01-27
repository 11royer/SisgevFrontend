import React from 'react';
import { Chip } from '@mui/material';

const EstadoBadge = ({ estado }) => {
  const getConfig = (estado) => {
    const configs = {
      'Operativo': { color: 'success', label: 'Operativo' },
      'En Taller': { color: 'warning', label: 'En Taller' },
      'Inoperativo': { color: 'error', label: 'Inoperativo' },
      'Baja': { color: 'default', label: 'Baja' },
      'Activo': { color: 'success', label: 'Activo' },
      'Mantenimiento': { color: 'warning', label: 'Mantenimiento' },
    };
    
    return configs[estado] || { color: 'default', label: estado };
  };

  const config = getConfig(estado);

  return (
    <Chip
      label={config.label}
      color={config.color}
      size="small"
      variant="filled"
      sx={{ 
        fontWeight: 600,
        minWidth: '5rem',
        fontSize: '0.75rem',
      }}
    />
  );
};

export default EstadoBadge;