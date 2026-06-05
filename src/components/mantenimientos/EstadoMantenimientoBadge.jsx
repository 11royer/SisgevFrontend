import React from 'react';
import { Chip } from '@mui/material';
import PendingIcon from '@mui/icons-material/Pending';
import EngineeringIcon from '@mui/icons-material/Engineering';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const EstadoMantenimientoBadge = ({ estado }) => {
    const config = {
        'pendiente': {
            color: 'warning',
            label: 'Pendiente',
            icon: <PendingIcon fontSize="small" />,
        },
        'en_proceso': {
            color: 'info',
            label: 'En Proceso',
            icon: <EngineeringIcon fontSize="small" />,
        },
        'finalizado': {
            color: 'success',
            label: 'Finalizado',
            icon: <CheckCircleIcon fontSize="small" />,
        }
    };

    const { color, label, icon } = config[estado] || config['pendiente'];

    return (
        <Chip
            icon={icon}
            label={label}
            color={color}
            size="small"
            variant="filled"
            sx={{ fontWeight: 600, minWidth: '6rem' }}
        />
    );
};

export default EstadoMantenimientoBadge;