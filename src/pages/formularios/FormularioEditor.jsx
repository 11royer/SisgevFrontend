import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormHelperText,
    Alert,
    CircularProgress,
    Chip,
    Divider,
    Checkbox,
    FormGroup,
    FormControlLabel,
    IconButton,
    Tooltip,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import HistoryIcon from '@mui/icons-material/History';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from 'react-router-dom';
import { formularioService } from '../../services/FormularioService';
import { vehiculoService } from '../../services/VehiculoService';
import useAuth from '../../auth/UseAuth';
import Layout from '../../layout/Layout';

const FormularioEditor = () => {
    const { tipo, vehiculoId } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();

    const [estructura, setEstructura] = useState(null);
    const [vehiculo, setVehiculo] = useState(null);
    const [datos, setDatos] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [exportando, setExportando] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Cargar estructura del formulario y datos del vehículo
    useEffect(() => {
        cargarDatos();
    }, [tipo, vehiculoId]);

    // ============================================================
    // RENDERIZAR ENCABEZADO INSTITUCIONAL (SEGÚN REGLAMENTO)
    // ============================================================
    const renderEncabezado = () => {
        if (!estructura?.encabezado) return null;
        
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
                    {estructura.encabezado.comando}
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                    {estructura.encabezado.dependencia}
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                    {estructura.encabezado.departamento}
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                    {estructura.encabezado.unidad}
                </Typography>
                <Typography variant="h5" sx={{ 
                    fontWeight: 'bold', 
                    color: '#1a3c5e', 
                    mt: 1,
                    p: 1,
                    backgroundColor: '#e8edf2',
                    border: '1px solid #1a3c5e',
                    borderRadius: '0.5rem'
                }}>
                    {estructura.encabezado.numero}
                </Typography>
                <Typography variant="caption" sx={{ color: '#666', mt: 1, display: 'block' }}>
                    Fecha de generación: {new Date().toLocaleString()}
                </Typography>
            </Box>
        );
    };

    const cargarDatos = async () => {
        try {
            setLoading(true);
            setError(null);

            // Cargar estructura del formulario
            const estructuraRes = await formularioService.getEstructura(tipo);
            setEstructura(estructuraRes.data);

            // Cargar datos del vehículo
            const vehiculoRes = await vehiculoService.getById(vehiculoId);
            setVehiculo(vehiculoRes.data.data);

            // Inicializar datos del formulario con valores del vehículo
            const datosIniciales = {};
            Object.keys(estructuraRes.data.campos).forEach(campo => {
                const mapeo = {
                    'placa': vehiculoRes.data.data.placa || '',
                    'marca': vehiculoRes.data.data.marca || '',
                    'modelo': vehiculoRes.data.data.modelo || '',
                    'anio': vehiculoRes.data.data.anio || '',
                    'color': vehiculoRes.data.data.color || '',
                    'tipo_vehiculo': vehiculoRes.data.data.tipo || '',
                    'clase': vehiculoRes.data.data.clasificacion?.nombre || '',
                    'chasis': vehiculoRes.data.data.numero_chasis || '',
                    'motor': vehiculoRes.data.data.numero_motor || '',
                    'motor_serie': vehiculoRes.data.data.numero_motor || '',
                    'cilindrada': vehiculoRes.data.data.cilindrada || '',
                    'distrito': vehiculoRes.data.data.distrito || '',
                    'kilometraje': vehiculoRes.data.data.kilometraje_actual || '',
                    'unidad': vehiculoRes.data.data.unidad?.nombre || '',
                    'unidad_solicitante': vehiculoRes.data.data.unidad?.nombre || '',
                    'estado_general': vehiculoRes.data.data.estado || 'Bueno',
                    'estado_operativo': vehiculoRes.data.data.estado_operativo || 'Operativo',
                    'observaciones': vehiculoRes.data.data.observaciones || '',
                    'traccion': vehiculoRes.data.data.traccion || '',
                    'origen': vehiculoRes.data.data.origen || '',
                    'destino': vehiculoRes.data.data.destino || '',
                    'fuente_recepcion': vehiculoRes.data.data.fuente_recepcion || '',
                    'fecha_adquisicion': vehiculoRes.data.data.fecha_adquisicion || '',
                    'marca_modelo': `${vehiculoRes.data.data.marca || ''} ${vehiculoRes.data.data.modelo || ''}`,
                    'tipo_moto': vehiculoRes.data.data.tipo || '',
                    'nro_orden': '',
                    'industria': vehiculoRes.data.data.origen || '',
                    'combustible': '',
                    'caja': '',
                    'sistema_encendido': '',
                    'tipo_transmision': '',
                    'tipo_frenos': '',
                    'falla_reportada': '',
                    'causa_probable': '',
                    'trabajo_realizado': '',
                    'repuestos_utilizados': '',
                    'costo_repuestos': '',
                    'mano_obra': '',
                    'costo_total': '',
                    'empresa_taller': '',
                    'direccion_taller': '',
                    'telefono_taller': '',
                    'nit_taller': '',
                    'trabajo_realizar': '',
                    'actividades': [],
                    'accesorios': [],
                    'danos_estructura': '',
                    'descripcion_trabajo': '',
                    'tipo_mantenimiento': '',
                    'sistema_transmision_moto': '',
                    'sistema_alimentacion_moto': '',
                    'sistema_refrigeracion_moto': '',
                    'sistema_distribucion_moto': '',
                    'sistema_lubricacion_moto': '',
                    'sistema_direccion_moto': '',
                    'sistema_suspension_moto': '',
                    'tren_rodadura_moto': '',
                    'sistema_electrico_moto': '',
                    'encendido_moto': '',
                    'arranque_moto': '',
                    'carga_moto': '',
                    'iluminacion_moto': '',
                    'tablero_control_moto': '',
                    'carroceria_moto': '',
                    'chasis_estructura_moto': '',
                    'llantas': '',
                    'cadena_transmision': '',
                };
                datosIniciales[campo] = mapeo[campo] !== undefined ? mapeo[campo] : '';
            });

            setDatos(datosIniciales);

            // Intentar cargar un borrador existente
            try {
                const historialRes = await formularioService.getHistorial(vehiculoId, tipo);
                const borradores = historialRes.data.data?.filter(f => f.estado === 'borrador') || [];
                if (borradores.length > 0) {
                    setDatos(borradores[0].datos || datosIniciales);
                }
            } catch (e) {
                // No hay borradores, continuar con datos iniciales
            }

        } catch (error) {
            console.error('Error cargando datos:', error);
            setError(error.response?.data?.message || 'Error al cargar el formulario');
        } finally {
            setLoading(false);
        }
    };

    const handleCampoChange = (nombre, valor) => {
        setDatos(prev => ({
            ...prev,
            [nombre]: valor
        }));
    };

    const handleCheckboxChange = (nombre, opcion, checked) => {
        setDatos(prev => {
            const valoresActuales = prev[nombre] || [];
            if (checked) {
                return { ...prev, [nombre]: [...valoresActuales, opcion] };
            } else {
                return { ...prev, [nombre]: valoresActuales.filter(v => v !== opcion) };
            }
        });
    };

    const handleGuardar = async () => {
        try {
            setSaving(true);
            setError(null);

            await formularioService.guardarBorrador({
                vehiculo_id: parseInt(vehiculoId),
                tipo: tipo,
                datos: datos,
                estado: 'borrador'
            });

            setSuccess('Formulario guardado correctamente');
            setTimeout(() => setSuccess(null), 3000);

        } catch (error) {
            console.error('Error guardando:', error);
            setError(error.response?.data?.message || 'Error al guardar el formulario');
        } finally {
            setSaving(false);
        }
    };

    const handleExportar = async () => {
        try {
            setExportando(true);
            setError(null);

            // Verificar campos obligatorios
            const camposObligatorios = Object.keys(estructura.campos).filter(
                campo => estructura.campos[campo].obligatorio
            );

            const camposVacios = camposObligatorios.filter(
                campo => !datos[campo] || datos[campo].toString().trim() === ''
            );

            if (camposVacios.length > 0) {
                const nombres = camposVacios.map(c => estructura.campos[c].etiqueta);
                setError(`Los siguientes campos son obligatorios: ${nombres.join(', ')}`);
                setExportando(false);
                return;
            }

            await formularioService.exportarConDatos(vehiculoId, tipo, datos);
            setSuccess('Formulario exportado correctamente');
            setTimeout(() => setSuccess(null), 3000);

        } catch (error) {
            console.error('Error exportando:', error);
            setError(error.message || 'Error al exportar el formulario');
        } finally {
            setExportando(false);
        }
    };

    const renderCampo = (nombre, config) => {
        const valor = datos[nombre] !== undefined && datos[nombre] !== null ? datos[nombre] : '';
        const esObligatorio = config.obligatorio || false;
        const esRequerido = esObligatorio && (!valor || valor.toString().trim() === '');

        switch (config.tipo) {
            case 'texto':
                return (
                    <TextField
                        fullWidth
                        label={config.etiqueta}
                        value={valor}
                        onChange={(e) => handleCampoChange(nombre, e.target.value)}
                        required={esObligatorio}
                        size="small"
                        error={esRequerido}
                        helperText={esRequerido ? 'Campo obligatorio' : (config.ayuda || '')}
                    />
                );
            case 'textarea':
                return (
                    <TextField
                        fullWidth
                        label={config.etiqueta}
                        value={valor}
                        onChange={(e) => handleCampoChange(nombre, e.target.value)}
                        multiline
                        rows={config.rows || 3}
                        required={esObligatorio}
                        size="small"
                        error={esRequerido}
                        helperText={esRequerido ? 'Campo obligatorio' : (config.ayuda || '')}
                    />
                );
            case 'numero':
                return (
                    <TextField
                        fullWidth
                        label={config.etiqueta}
                        type="number"
                        value={valor}
                        onChange={(e) => handleCampoChange(nombre, e.target.value)}
                        required={esObligatorio}
                        size="small"
                        error={esRequerido}
                        helperText={esRequerido ? 'Campo obligatorio' : (config.ayuda || '')}
                        InputProps={{ 
                            inputProps: { min: 0 },
                            startAdornment: config.prefix ? (
                                <InputAdornment position="start">{config.prefix}</InputAdornment>
                            ) : null,
                            endAdornment: config.sufijo ? (
                                <InputAdornment position="end">{config.sufijo}</InputAdornment>
                            ) : null,
                        }}
                    />
                );
            case 'fecha':
                return (
                    <TextField
                        fullWidth
                        label={config.etiqueta}
                        type="date"
                        value={valor}
                        onChange={(e) => handleCampoChange(nombre, e.target.value)}
                        required={esObligatorio}
                        size="small"
                        error={esRequerido}
                        helperText={esRequerido ? 'Campo obligatorio' : (config.ayuda || '')}
                        InputLabelProps={{ shrink: true }}
                    />
                );
            case 'select':
                return (
                    <FormControl fullWidth size="small" required={esObligatorio} error={esRequerido}>
                        <InputLabel>{config.etiqueta}</InputLabel>
                        <Select
                            value={valor}
                            onChange={(e) => handleCampoChange(nombre, e.target.value)}
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
                        {esRequerido && <FormHelperText error>Campo obligatorio</FormHelperText>}
                        {config.ayuda && <FormHelperText>{config.ayuda}</FormHelperText>}
                    </FormControl>
                );
            case 'checkbox':
                return (
                    <FormGroup>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
                            {config.etiqueta}
                            {esObligatorio && <span style={{ color: 'red' }}> *</span>}
                        </Typography>
                        {config.opciones?.map((opcion) => (
                            <FormControlLabel
                                key={opcion}
                                control={
                                    <Checkbox
                                        checked={(datos[nombre] || []).includes(opcion)}
                                        onChange={(e) => handleCheckboxChange(nombre, opcion, e.target.checked)}
                                        size="small"
                                    />
                                }
                                label={opcion}
                            />
                        ))}
                        {config.ayuda && <FormHelperText>{config.ayuda}</FormHelperText>}
                    </FormGroup>
                );
            case 'firma':
                return (
                    <Box sx={{ border: '1px dashed #ccc', p: 2, borderRadius: 1, bgcolor: '#fafafa' }}>
                        <Typography variant="caption" color="text.secondary">
                            {config.etiqueta}
                            {esObligatorio && <span style={{ color: 'red' }}> *</span>}
                        </Typography>
                        <TextField
                            fullWidth
                            placeholder="Nombre completo y firma"
                            value={valor}
                            onChange={(e) => handleCampoChange(nombre, e.target.value)}
                            size="small"
                            sx={{ mt: 1 }}
                            required={esObligatorio}
                            error={esRequerido}
                            helperText={esRequerido ? 'Campo obligatorio' : ''}
                        />
                    </Box>
                );
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <Layout>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <CircularProgress />
                </Box>
            </Layout>
        );
    }

    if (!estructura || !vehiculo) {
        return (
            <Layout>
                <Alert severity="error" sx={{ m: 2 }}>Formulario o vehículo no encontrado</Alert>
            </Layout>
        );
    }

    return (
        <Layout>
            <Box sx={{ width: '100%', p: { xs: '0.75rem', md: '1.5rem' } }}>
                {/* Encabezado */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                    flexWrap: 'wrap',
                    gap: 1
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate(`/vehiculos/${vehiculoId}`)}
                            size="small"
                        >
                            Volver
                        </Button>
                        <Typography variant="h5" fontWeight="bold">
                            {estructura.titulo}
                        </Typography>
                        <Chip
                            label={`Vehículo: ${vehiculo.placa}`}
                            color="primary"
                            size="small"
                        />
                        <Chip
                            label="Borrador"
                            color="warning"
                            size="small"
                            variant="outlined"
                        />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Tooltip title="Ver historial de formularios">
                            <Button
                                variant="outlined"
                                startIcon={<HistoryIcon />}
                                onClick={() => navigate(`/formularios/historial/${vehiculo.id}/${tipo}`)}
                                size="small"
                            >
                                Historial
                            </Button>
                        </Tooltip>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<SaveIcon />}
                            onClick={handleGuardar}
                            disabled={saving}
                            size="small"
                        >
                            {saving ? 'Guardando...' : 'Guardar Borrador'}
                        </Button>
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<PictureAsPdfIcon />}
                            onClick={handleExportar}
                            disabled={exportando}
                            size="small"
                        >
                            {exportando ? 'Generando...' : 'Exportar PDF'}
                        </Button>
                    </Box>
                </Box>

                {/* ============================================================
                    ENCABEZADO INSTITUCIONAL DEL REGLAMENTO
                    ============================================================ */}
                {renderEncabezado()}

                {/* Mensajes */}
                {error && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: '0.5rem' }} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert severity="success" sx={{ mb: 2, borderRadius: '0.5rem' }} onClose={() => setSuccess(null)}>
                        {success}
                    </Alert>
                )}

                {/* Nota informativa */}
                <Alert severity="info" sx={{ mb: 2, borderRadius: '0.5rem' }}>
                    <Typography variant="body2">
                        Complete los campos del formulario. Los campos con <strong style={{ color: 'red' }}>*</strong> son obligatorios.
                        Puede guardar como borrador en cualquier momento.
                    </Typography>
                </Alert>

                {/* Formulario */}
                <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, borderRadius: '0.75rem' }}>
                    <Grid container spacing={2.5}>
                        {Object.keys(estructura.campos).map((nombre) => {
                            const config = estructura.campos[nombre];
                            const esObligatorio = config.obligatorio || false;
                            const esRequerido = esObligatorio && (!datos[nombre] || datos[nombre].toString().trim() === '');
                            const colspan = config.colspan || (config.tipo === 'textarea' || config.tipo === 'checkbox' ? 4 : 2);
                            
                            return (
                                <Grid 
                                    item 
                                    xs={12} 
                                    md={colspan === 4 ? 12 : colspan === 2 ? 6 : 3} 
                                    key={nombre}
                                    sx={{
                                        borderLeft: esRequerido ? '3px solid #d32f2f' : 'none',
                                        pl: esRequerido ? 1 : 0,
                                    }}
                                >
                                    {renderCampo(nombre, config)}
                                    {esRequerido && (
                                        <FormHelperText sx={{ color: 'error.main', ml: 0 }}>
                                            ⚠️ Campo obligatorio
                                        </FormHelperText>
                                    )}
                                </Grid>
                            );
                        })}
                    </Grid>

                    {/* ============================================================
                        NOTA DEL REGLAMENTO (aparece al final de los formularios)
                        ============================================================ */}
                    <Divider sx={{ my: 3 }} />
                    
                    <Box sx={{ 
                        p: 2, 
                        bgcolor: '#f8f9fa', 
                        borderRadius: '0.5rem',
                        border: '1px solid #ddd',
                        mb: 3
                    }}>
                        <Typography variant="caption" color="text.secondary">
                            <strong>Nota:</strong> Según el Decreto Supremo N° 283, del 2 de septiembre de 2009, Art. 4 (Calificación):
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                            a. <strong>Bueno</strong>, cuando el vehículo se encuentra en condiciones óptimas de funcionamiento.
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                            b. <strong>Regular</strong>, cuando el vehículo requiere de alguna reparación mecánica que no imposibilita su uso.
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                            c. <strong>Deteriorado</strong>, cuando el vehículo presenta fallas mecánicas que imposibilitan su uso.
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                            d. <strong>Fuera de uso</strong>, cuando el vehículo es considerado inutilizable por obsolescencia, siniestro, desmantelamiento.
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, flexWrap: 'wrap' }}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate(`/vehiculos/${vehiculoId}`)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<SaveIcon />}
                            onClick={handleGuardar}
                            disabled={saving}
                        >
                            {saving ? 'Guardando...' : 'Guardar Borrador'}
                        </Button>
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<PictureAsPdfIcon />}
                            onClick={handleExportar}
                            disabled={exportando}
                        >
                            {exportando ? 'Generando...' : 'Exportar PDF'}
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Layout>
    );
};

export default FormularioEditor;