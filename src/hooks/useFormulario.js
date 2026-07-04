import { useState, useEffect } from 'react';
import { formularioService } from '../services/formularioService';
import { vehiculoService } from '../services/VehiculoService';

export const useFormulario = (tipo, vehiculoId) => {
    const [estructura, setEstructura] = useState(null);
    const [datos, setDatos] = useState({});
    const [vehiculo, setVehiculo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [formularioId, setFormularioId] = useState(null);

    // MAPEO DE CAMPOS: cómo se llaman en el vehículo vs en el formulario
    const mapCamposVehiculo = {
        'placa': 'placa',
        'sigla': 'sigla',
        'marca': 'marca',
        'modelo': 'modelo',
        'anio': 'anio',
        'color': 'color',
        'chasis': 'numero_chasis',
        'motor_serie': 'numero_motor',
        'tipo_vehiculo': 'tipo',

        // IMPORTANTE: Usar el objeto COMPLETO, no el ID
        'clase': 'clasificacion',
        'cilindrada': 'cilindrada',
        'combustible': 'combustible',
        'transmision': 'tipo_transmision',
        'traccion': 'traccion',
        'neumatico': 'neumatico',
        'distrito': 'distrito',
        'unidad': 'unidad',
        'kilometraje': 'kilometraje_actual',
        'estado_operativo': 'estado_operativo',
        'estado_fisico': 'estado',
        'observaciones': 'observaciones',
        'fecha_adquisicion': 'fecha_adquisicion',
        'origen': 'origen',
        'destino': 'destino',
        'ocupantes': 'ocupantes',
        'fuente_recepcion': 'fuente_recepcion',
        'caja': 'tipo_caja',
        'cilindros': 'numero_cilindros',
    };

    // FUNCIÓN PARA EXTRAER VALOR DE UN CAMPO DEL VEHÍCULO
    const extraerValor = (vehiculoData, campo) => {
        // Si el campo es 'clasificacion' o 'unidad', extraer el nombre
        if (campo === 'clasificacion' || campo === 'unidad') {
            const objeto = vehiculoData[campo];
            if (objeto && typeof objeto === 'object' && objeto.nombre) {
                return objeto.nombre;
            }
            return '';
        }
        
        // Para otros campos, obtener el valor directamente
        const valor = vehiculoData[campo];
        if (valor !== undefined && valor !== null && valor !== '') {
            return valor;
        }
        return '';
    };

    // Cargar vehículo y estructura
    useEffect(() => {
        if (tipo && vehiculoId) {
            cargarDatos();
        }
    }, [tipo, vehiculoId]);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            setError(null);

            // 1. Cargar vehículo
            let vehiculoData = null;
            try {
                const vehiculoRes = await vehiculoService.getById(vehiculoId);
                vehiculoData = vehiculoRes.data.data;
                setVehiculo(vehiculoData);
                
        
                // DEPURACIÓN: Ver qué datos llegan de la API
        
                console.log('🚗 Vehículo cargado:', vehiculoData);
                console.log('🔍 UNIDAD desde API:', vehiculoData?.unidad);
                console.log('🔍 CLASIFICACION desde API:', vehiculoData?.clasificacion);
            } catch (err) {
                console.warn('⚠️ No se pudo cargar el vehículo:', err);
            }

            // 2. Cargar estructura del formulario
            const estructuraRes = await formularioService.getEstructura(tipo);
            setEstructura(estructuraRes.data);
            console.log('📋 Estructura cargada:', estructuraRes.data);

            // 3. Verificar si existe un borrador guardado
            let datosGuardados = null;
            try {
                const historialRes = await formularioService.getHistorial(vehiculoId, tipo);
                const historial = historialRes.data.data || [];
                const borrador = historial.find(f => f.estado === 'borrador');
                if (borrador) {
                    datosGuardados = borrador.datos;
                    setFormularioId(borrador.id);
                    console.log('📝 Borrador encontrado:', borrador);
                }
            } catch (err) {
                console.log('ℹ️ No hay borrador guardado');
            }

            // 4. Crear datos iniciales precargando valores del vehículo
            const datosIniciales = {};
            const campos = estructuraRes.data.campos || {};

            Object.keys(campos).forEach(campo => {
                // Si hay datos guardados (borrador), usarlos
                if (datosGuardados && datosGuardados[campo] !== undefined && datosGuardados[campo] !== '') {
                    datosIniciales[campo] = datosGuardados[campo];
                    console.log(`📝 Cargado ${campo} = ${datosGuardados[campo]} (desde borrador)`);
                    return;
                }

                // Si el campo tiene un mapeo al vehículo, precargar
                if (vehiculoData && mapCamposVehiculo[campo]) {
                    const campoVehiculo = mapCamposVehiculo[campo];
                    
                    // Usar la función extraerValor para obtener el valor correcto
                    const valor = extraerValor(vehiculoData, campoVehiculo);
                    
                    if (valor !== '' && valor !== undefined && valor !== null) {
                        datosIniciales[campo] = valor;
                        console.log(`✅ Precargado ${campo} = ${valor} (desde vehículo.${campoVehiculo})`);
                        return;
                    }
                }

                // Si no, dejar vacío
                datosIniciales[campo] = '';
            });

            console.log('📝 Datos iniciales finales:', datosIniciales);
            setDatos(datosIniciales);

        } catch (error) {
            console.error('❌ Error cargando datos:', error);
            setError('Error al cargar los datos del formulario');
        } finally {
            setLoading(false);
        }
    };

    // Actualizar campo
    const actualizarCampo = (nombre, valor) => {
        setDatos(prev => ({ ...prev, [nombre]: valor }));
    };

    // Guardar borrador
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
            console.error('❌ Error guardando:', error);
            setError(error.response?.data?.message || 'Error al guardar');
        } finally {
            setLoading(false);
        }
    };

    // Finalizar formulario
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
            console.error('❌ Error finalizando:', error);
            setError(error.response?.data?.message || 'Error al finalizar');
        } finally {
            setLoading(false);
        }
    };

    // Exportar PDF
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
            console.error('❌ Error exportando:', error);
            setError('Error al exportar PDF');
        } finally {
            setLoading(false);
        }
    };

    // Limpiar mensajes
    const limpiarMensajes = () => {
        setError(null);
        setSuccess(null);
    };

    return {
        estructura,
        datos,
        loading,
        error,
        success,
        formularioId,
        vehiculo,
        actualizarCampo,
        guardarBorrador,
        finalizar,
        exportarPDF,
        limpiarMensajes,
    };
};