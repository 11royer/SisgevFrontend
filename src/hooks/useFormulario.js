import { useState, useEffect, useCallback } from 'react';
import { formularioService } from '../services/formularioService';

export const useFormulario = (tipo, vehiculoId) => {
    const [estructura, setEstructura] = useState(null);
    const [datos, setDatos] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [formularioId, setFormularioId] = useState(null);

    // Cargar estructura
    useEffect(() => {
        if (tipo) {
            cargarEstructura();
        }
    }, [tipo]);

    const cargarEstructura = async () => {
        try {
            setLoading(true);
            const response = await formularioService.getEstructura(tipo);
            setEstructura(response.data);
            
            const datosIniciales = {};
            Object.keys(response.data.campos || {}).forEach(campo => {
                datosIniciales[campo] = '';
            });
            setDatos(datosIniciales);
        } catch (error) {
            setError('Error al cargar la estructura del formulario');
        } finally {
            setLoading(false);
        }
    };

    const actualizarCampo = (nombre, valor) => {
        setDatos(prev => ({ ...prev, [nombre]: valor }));
    };

    const guardarBorrador = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await formularioService.guardarBorrador({
                vehiculo_id: vehiculoId,
                tipo: tipo,
                datos: datos
            });
            setFormularioId(response.data.data.id);
            setSuccess('Borrador guardado correctamente');
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            setError(error.response?.data?.message || 'Error al guardar');
        } finally {
            setLoading(false);
        }
    };

    const finalizar = async () => {
        try {
            setLoading(true);
            setError(null);
            if (!formularioId) {
                await guardarBorrador();
            }
            await formularioService.finalizar(formularioId);
            setSuccess('Formulario finalizado correctamente');
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            setError(error.response?.data?.message || 'Error al finalizar');
        } finally {
            setLoading(false);
        }
    };

    const exportarPDF = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await formularioService.exportar({
                vehiculo_id: vehiculoId,
                tipo: tipo,
                datos: datos
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `FORM_${tipo}_${new Date().toISOString().slice(0, 10)}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            setSuccess('PDF exportado correctamente');
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            setError('Error al exportar PDF');
        } finally {
            setLoading(false);
        }
    };

    return {
        estructura,
        datos,
        loading,
        error,
        success,
        formularioId,
        actualizarCampo,
        guardarBorrador,
        finalizar,
        exportarPDF,
        limpiarMensajes: () => { setError(null); setSuccess(null); }
    };
};