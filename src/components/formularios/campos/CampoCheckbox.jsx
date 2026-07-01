import React from 'react';
import { FormGroup, FormControlLabel, Checkbox, Typography, FormHelperText, Box } from '@mui/material';

const CampoCheckbox = ({ nombre, config, valor, onChange }) => {
    const opcionesSeleccionadas = Array.isArray(valor) ? valor : [];

    const handleChange = (opcion, checked) => {
        if (checked) {
            onChange(nombre, [...opcionesSeleccionadas, opcion]);
        } else {
            onChange(nombre, opcionesSeleccionadas.filter(item => item !== opcion));
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                {config.etiqueta}
                {config.obligatorio && <span style={{ color: 'red' }}> *</span>}
            </Typography>
            <FormGroup row sx={{ flexWrap: 'wrap' }}>
                {config.opciones?.map((opcion) => (
                    <FormControlLabel
                        key={opcion}
                        control={
                            <Checkbox
                                checked={opcionesSeleccionadas.includes(opcion)}
                                onChange={(e) => handleChange(opcion, e.target.checked)}
                                size="small"
                            />
                        }
                        label={opcion}
                        sx={{ 
                            '& .MuiFormControlLabel-label': { fontSize: '0.7rem' },
                            mr: 1,
                            width: 'auto'
                        }}
                    />
                ))}
            </FormGroup>
            {config.ayuda && <FormHelperText>{config.ayuda}</FormHelperText>}
        </Box>
    );
};

export default CampoCheckbox;