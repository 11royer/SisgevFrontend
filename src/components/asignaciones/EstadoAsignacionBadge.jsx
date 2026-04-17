import React from 'react';
import { Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';

/**
 * Badge de estado para asignaciones
 * @param {Object} props
 * @param {string} props.estado - Estado de la asignación ('Activa' o 'Finalizada')
 * @param {boolean} props.esActiva - Booleano para estado activo
 */
const EstadoAsignacionBadge = ({ estado, esActiva }) => {
    // Determinar estado si se pasa esActiva
    const estadoReal = estado || (esActiva ? 'Activa' : 'Finalizada');
    
    const config = {
        'Activa': {
            color: 'success',
            label: 'Activa',
            icon: <CheckCircleIcon fontSize="small" />,
        },
        'Finalizada': {
            color: 'default',
            label: 'Finalizada',
            icon: <PendingIcon fontSize="small" />,
        }
    };

    const { color, label, icon } = config[estadoReal] || config['Finalizada'];

    return (
        <Chip
            icon={icon}
            label={label}
            color={color}
            size="small"
            variant={estadoReal === 'Activa' ? 'filled' : 'outlined'}
            sx={{
                fontWeight: 600,
                minWidth: '5.5rem',
                '& .MuiChip-icon': { fontSize: '1rem' },
            }}
        />
    );
};

export default EstadoAsignacionBadge;