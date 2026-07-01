import React from 'react';
import { TextField, InputAdornment, FormHelperText } from '@mui/material';

const CampoNumero = ({ nombre, config, valor, onChange }) => {
    const esObligatorio = config.obligatorio || false;
    const esRequerido = esObligatorio && (valor === '' || valor === null || valor === undefined);

    return (
        <>
            <TextField
                fullWidth
                label={config.etiqueta}
                type="number"
                value={valor || ''}
                onChange={(e) => onChange(nombre, e.target.value)}
                required={esObligatorio}
                size="small"
                error={esRequerido}
                helperText={esRequerido ? 'Campo obligatorio' : ''}
                InputProps={{
                    inputProps: { min: 0 },
                    startAdornment: config.prefix ? (
                        <InputAdornment position="start">{config.prefix}</InputAdornment>
                    ) : null,
                    endAdornment: config.sufijo ? (
                        <InputAdornment position="end">{config.sufijo}</InputAdornment>
                    ) : null,
                }}
                sx={{ '& .MuiInputLabel-root': { fontSize: '0.75rem' } }}
            />
            {config.ayuda && (
                <FormHelperText>{config.ayuda}</FormHelperText>
            )}
        </>
    );
};

export default CampoNumero;