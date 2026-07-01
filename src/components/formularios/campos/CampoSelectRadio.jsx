import React from 'react';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, FormHelperText } from '@mui/material';

const CampoSelectRadio = ({ nombre, config, valor, onChange }) => {
    const esObligatorio = config.obligatorio || false;

    return (
        <FormControl component="fieldset" required={esObligatorio} fullWidth>
            <FormLabel component="legend" sx={{ fontSize: '0.75rem' }}>
                {config.etiqueta}
                {esObligatorio && <span style={{ color: 'red' }}> *</span>}
            </FormLabel>
            <RadioGroup
                row
                value={valor || ''}
                onChange={(e) => onChange(nombre, e.target.value)}
            >
                {config.opciones?.map((opcion) => (
                    <FormControlLabel
                        key={opcion}
                        value={opcion}
                        control={<Radio size="small" />}
                        label={opcion}
                        sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.75rem' } }}
                    />
                ))}
            </RadioGroup>
            {config.ayuda && <FormHelperText>{config.ayuda}</FormHelperText>}
        </FormControl>
    );
};

export default CampoSelectRadio;