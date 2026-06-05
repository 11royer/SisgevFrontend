import React from 'react';
import { Chip } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const StockBadge = ({ cantidadActual, cantidadMinima }) => {
    const esStockBajo = cantidadActual <= cantidadMinima;
    const esStockCritico = cantidadActual === 0;

    if (esStockCritico) {
        return (
            <Chip
                icon={<WarningIcon />}
                label="Sin Stock"
                color="error"
                size="small"
                variant="filled"
                sx={{ fontWeight: 600 }}
            />
        );
    }

    if (esStockBajo) {
        return (
            <Chip
                icon={<WarningIcon />}
                label="Stock Bajo"
                color="warning"
                size="small"
                variant="outlined"
                sx={{ fontWeight: 600 }}
            />
        );
    }

    return (
        <Chip
            icon={<CheckCircleIcon />}
            label="Stock OK"
            color="success"
            size="small"
            variant="outlined"
            sx={{ fontWeight: 600 }}
        />
    );
};

export default StockBadge;