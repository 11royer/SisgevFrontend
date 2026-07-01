import React from 'react';
import { Grid } from '@mui/material';
import CampoTexto from './campos/CampoTexto';
import CampoTextarea from './campos/CampoTextarea';
import CampoSelect from './campos/CampoSelect';
import CampoSelectRadio from './campos/CampoSelectRadio';
import CampoFecha from './campos/CampoFecha';
import CampoNumero from './campos/CampoNumero';
import CampoCheckbox from './campos/CampoCheckbox';
import CampoFirma from './campos/CampoFirma';

const FormularioDinamico = ({ estructura, datos, actualizarCampo }) => {
    const renderCampo = (nombre, config) => {
        const props = {
            nombre,
            config,
            valor: datos[nombre] || '',
            onChange: actualizarCampo
        };

        switch (config.tipo) {
            case 'texto':
                return <CampoTexto {...props} />;
            case 'textarea':
                return <CampoTextarea {...props} />;
            case 'select':
                return <CampoSelect {...props} />;
            case 'select_radio':
                return <CampoSelectRadio {...props} />;
            case 'fecha':
                return <CampoFecha {...props} />;
            case 'numero':
                return <CampoNumero {...props} />;
            case 'checkbox':
                return <CampoCheckbox {...props} />;
            case 'firma':
                return <CampoFirma {...props} />;
            default:
                return <CampoTexto {...props} />;
        }
    };

    if (!estructura) return null;

    return (
        <Grid container spacing={2}>
            {Object.entries(estructura.campos || {}).map(([nombre, config]) => (
                <Grid item xs={12} md={config.span || 6} key={nombre}>
                    {renderCampo(nombre, config)}
                </Grid>
            ))}
        </Grid>
    );
};

export default FormularioDinamico;