import React from 'react';
import { Box, Typography } from '@mui/material';

const FormularioHeader = ({ encabezado }) => {
    if (!encabezado) return null;

    return (
        <Box sx={{ 
            textAlign: 'center', 
            mb: 3, 
            pb: 2, 
            borderBottom: '2px solid #1a3c5e',
            backgroundColor: '#f8f9fa',
            p: 2,
            borderRadius: '0.75rem'
        }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a3c5e' }}>
                {encabezado.comando}
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                {encabezado.dependencia}
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                {encabezado.departamento}
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                {encabezado.unidad}
            </Typography>
            <Typography variant="h5" sx={{ 
                fontWeight: 'bold', 
                color: '#1a3c5e', 
                mt: 1, 
                p: 1, 
                backgroundColor: '#e8edf2', 
                border: '1px solid #1a3c5e',
                borderRadius: '0.5rem',
                fontSize: '1.1rem'
            }}>
                {encabezado.numero}
            </Typography>
            {encabezado.subtitulo && (
                <Typography variant="subtitle1" sx={{ 
                    fontWeight: 'bold', 
                    color: '#1a3c5e', 
                    mt: 1,
                    fontSize: '0.95rem'
                }}>
                    {encabezado.subtitulo}
                </Typography>
            )}
            <Typography variant="caption" sx={{ color: '#666', mt: 1, display: 'block' }}>
                Fecha de generación: {new Date().toLocaleString()}
            </Typography>
        </Box>
    );
};

export default FormularioHeader;