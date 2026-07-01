import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';

const CampoSelect = ({ nombre, config, valor, onChange }) => {
    const esObligatorio = config.obligatorio || false;

    return (
        <FormControl fullWidth size="small" required={esObligatorio}>
            <InputLabel sx={{ fontSize: '0.75rem' }}>{config.etiqueta}</InputLabel>
            <Select
                value={valor || ''}
                onChange={(e) => onChange(nombre, e.target.value)}
                label={config.etiqueta}
            >
                <MenuItem value="">
                    <em>Seleccionar</em>
                </MenuItem>
                {config.opciones?.map((opcion) => (
                    <MenuItem key={opcion} value={opcion}>
                        {opcion}
                    </MenuItem>
                ))}
            </Select>
            {config.ayuda && (
                <FormHelperText>{config.ayuda}</FormHelperText>
            )}
        </FormControl>
    );
};

export default CampoSelect;