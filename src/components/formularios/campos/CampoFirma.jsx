import React from 'react';
import { Box, TextField, Typography, FormHelperText } from '@mui/material';

const CampoFirma = ({ nombre, config, valor, onChange }) => {
    const esObligatorio = config.obligatorio || false;
    const esRequerido = esObligatorio && (!valor || valor.toString().trim() === '');

    return (
        <Box sx={{ 
            border: '1px dashed #ccc', 
            p: 2, 
            borderRadius: 1, 
            bgcolor: '#fafafa',
            width: '100%'
        }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                {config.etiqueta}
                {esObligatorio && <span style={{ color: 'red' }}> *</span>}
            </Typography>
            <TextField
                fullWidth
                placeholder="Nombre completo"
                value={valor || ''}
                onChange={(e) => onChange(nombre, e.target.value)}
                size="small"
                required={esObligatorio}
                error={esRequerido}
                helperText={esRequerido ? 'Campo obligatorio' : ''}
                sx={{ '& .MuiInputLabel-root': { fontSize: '0.75rem' } }}
            />
            {config.ayuda && (
                <FormHelperText>{config.ayuda}</FormHelperText>
            )}
        </Box>
    );
};

export default CampoFirma;