import React from 'react';
import { TextField, FormHelperText } from '@mui/material';

const CampoTextarea = ({ nombre, config, valor, onChange }) => {
    const esObligatorio = config.obligatorio || false;
    const esRequerido = esObligatorio && (!valor || valor.toString().trim() === '');

    return (
        <>
            <TextField
                fullWidth
                label={config.etiqueta}
                value={valor || ''}
                onChange={(e) => onChange(nombre, e.target.value)}
                multiline
                rows={config.rows || 3}
                required={esObligatorio}
                size="small"
                placeholder={config.placeholder || ''}
                error={esRequerido}
                helperText={esRequerido ? 'Campo obligatorio' : ''}
                sx={{ '& .MuiInputLabel-root': { fontSize: '0.75rem' } }}
            />
            {config.ayuda && (
                <FormHelperText>{config.ayuda}</FormHelperText>
            )}
        </>
    );
};

export default CampoTextarea;