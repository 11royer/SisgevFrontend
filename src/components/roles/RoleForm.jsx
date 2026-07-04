import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    Grid,
    Paper,
    Typography,
    Divider,
    CircularProgress,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Checkbox,
    FormGroup,
    FormControlLabel,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import SecurityIcon from '@mui/icons-material/Security';
import { permisoService } from '../../services/PermisoService';

const RoleForm = ({ role, onSubmit, onCancel, loading }) => {
    // --- ESTADOS ---
    const [formData, setFormData] = useState({
        nombre: role?.nombre || '',
        descripcion: role?.descripcion || '',
    });
    
    //  Estado para permisos
    const [permisos, setPermisos] = useState([]);
    const [permisosSeleccionados, setPermisosSeleccionados] = useState([]);
    const [cargandoPermisos, setCargandoPermisos] = useState(false);
    const [error, setError] = useState(null);

    // Agrupar permisos por módulo
    const [permisosAgrupados, setPermisosAgrupados] = useState({});

    // Cargar permisos disponibles
    useEffect(() => {
        const cargarPermisos = async () => {
            try {
                setCargandoPermisos(true);
                const response = await permisoService.getAll();
                setPermisos(response.data);
                
                // Agrupar por módulo
                const agrupados = {};
                response.data.forEach(permiso => {
                    if (!agrupados[permiso.modulo]) {
                        agrupados[permiso.modulo] = [];
                    }
                    agrupados[permiso.modulo].push(permiso);
                });
                setPermisosAgrupados(agrupados);
                
                // Si es edición, cargar permisos actuales del rol
                if (role?.id) {
                    const permisosResponse = await permisoService.getByRol(role.id);
                    const ids = permisosResponse.data.permisos.map(p => p.id);
                    setPermisosSeleccionados(ids);
                }
            } catch (error) {
                console.error('Error cargando permisos:', error);
            } finally {
                setCargandoPermisos(false);
            }
        };
        
        cargarPermisos();
    }, [role]);

    // --- MANEJADORES ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTogglePermiso = (permisoId) => {
        setPermisosSeleccionados(prev =>
            prev.includes(permisoId)
                ? prev.filter(id => id !== permisoId)
                : [...prev, permisoId]
        );
    };

    const handleToggleModulo = (modulo, permisosModulo) => {
        const ids = permisosModulo.map(p => p.id);
        const todosSeleccionados = ids.every(id => permisosSeleccionados.includes(id));
        
        if (todosSeleccionados) {
            setPermisosSeleccionados(prev => prev.filter(id => !ids.includes(id)));
        } else {
            const nuevos = [...permisosSeleccionados];
            ids.forEach(id => {
                if (!nuevos.includes(id)) nuevos.push(id);
            });
            setPermisosSeleccionados(nuevos);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        try {
            // Crear o actualizar el rol
            let response;
            if (role?.id) {
                response = await onSubmit(formData);
            } else {
                response = await onSubmit(formData);
            }
            
            // Después de crear el rol, asignar permisos
            if (response && response.data?.id) {
                const rolId = response.data.id;
                await permisoService.asignar(rolId, { permisos: permisosSeleccionados });
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Error al guardar el rol');
        }
    };

    // Para no duplicar la llamada a onSubmit, modificamos
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        try {
            // Si es edición, solo actualizar datos del rol
            if (role?.id) {
                await onSubmit(formData);
                // Actualizar permisos
                await permisoService.asignar(role.id, { permisos: permisosSeleccionados });
            } else {
                // Si es nuevo, primero crear el rol y luego asignar permisos
                const response = await onSubmit(formData);
                if (response?.data?.id) {
                    await permisoService.asignar(response.data.id, { permisos: permisosSeleccionados });
                }
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Error al guardar el rol');
        }
    };

    const totalPermisos = permisos.length;
    const seleccionados = permisosSeleccionados.length;

    return (
        <Paper elevation={3} sx={{ p: '2rem', borderRadius: '0.5rem', width: '100%' }}>
            {/* ENCABEZADO */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem', mb: '1.5rem' }}>
                <SecurityIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {role ? `Editar Rol: ${role.nombre}` : 'Registrar Nuevo Rol de Acceso'}
                </Typography>
            </Box>
            
            <Divider sx={{ mb: '2rem' }} />

            {error && (
                <Alert severity="error" sx={{ mb: '1.5rem', borderRadius: '0.5rem' }}>
                    {error}
                </Alert>
            )}

            <form onSubmit={handleFormSubmit}>
                <Grid container spacing={3}>
                    {/* NOMBRE DEL ROL */}
                    <Grid size={{ xs: 12, md: 5 }}>
                        <TextField
                            fullWidth
                            label="Nombre del Rol"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            placeholder="Ej: Operador de Guardia"
                            required
                            size="small"
                            helperText="El nombre debe ser único en el sistema"
                            disabled={role?.id <= 4}
                        />
                    </Grid>

                    {/* DESCRIPCIÓN */}
                    <Grid size={{ xs: 12, md: 7 }}>
                        <TextField
                            fullWidth
                            label="Descripción de Funciones"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            placeholder="Describa los permisos o nivel de acceso..."
                            multiline
                            rows={1}
                            size="small"
                            disabled={role?.id <= 4}
                        />
                    </Grid>

                    {/*  SECCIÓN DE PERMISOS */}
                    <Grid size={{ xs: 12 }}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <SecurityIcon color="primary" fontSize="small" />
                            Asignar Permisos
                            <Chip 
                                label={`${seleccionados}/${totalPermisos} seleccionados`} 
                                size="small" 
                                color="primary" 
                                variant="outlined" 
                            />
                        </Typography>

                        {cargandoPermisos ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                                <CircularProgress size={30} />
                            </Box>
                        ) : (
                            <Box sx={{ maxHeight: 400, overflow: 'auto', pr: 1 }}>
                                {Object.entries(permisosAgrupados).map(([modulo, lista]) => {
                                    const idsModulo = lista.map(p => p.id);
                                    const todosSeleccionados = idsModulo.every(id => permisosSeleccionados.includes(id));
                                    const algunosSeleccionados = idsModulo.some(id => permisosSeleccionados.includes(id));

                                    return (
                                        <Accordion key={modulo} defaultExpanded sx={{ mb: 1, '&:before': { display: 'none' } }}>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                                                    <Checkbox
                                                        checked={todosSeleccionados}
                                                        indeterminate={algunosSeleccionados && !todosSeleccionados}
                                                        onChange={() => handleToggleModulo(modulo, lista)}
                                                        size="small"
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                    <Typography variant="subtitle2" fontWeight="bold">
                                                        {modulo}
                                                    </Typography>
                                                    <Chip 
                                                        label={`${lista.filter(p => permisosSeleccionados.includes(p.id)).length}/${lista.length}`} 
                                                        size="small" 
                                                        variant="outlined" 
                                                    />
                                                </Box>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <FormGroup>
                                                    {/* Permisos Checkboxes */}
                                                    <Grid container spacing={1}>
                                                        {lista.map((permiso) => (
                                                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={permiso.id}>
                                                                <FormControlLabel
                                                                    control={
                                                                        <Checkbox
                                                                            checked={permisosSeleccionados.includes(permiso.id)}
                                                                            onChange={() => handleTogglePermiso(permiso.id)}
                                                                            size="small"
                                                                        />
                                                                    }
                                                                    label={
                                                                        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                                                            {permiso.descripcion || permiso.nombre}
                                                                        </Typography>
                                                                    }
                                                                />
                                                            </Grid>
                                                        ))}
                                                    </Grid>
                                                </FormGroup>
                                            </AccordionDetails>
                                        </Accordion>
                                    );
                                })}
                            </Box>
                        )}
                    </Grid>
                </Grid>

                {/* BOTONES */}
                <Box sx={{ mt: '3rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={onCancel}
                        startIcon={<CancelIcon />}
                        disabled={loading}
                        sx={{ borderRadius: '0.5rem' }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                        disabled={loading || cargandoPermisos}
                        sx={{ borderRadius: '0.5rem' }}
                    >
                        {loading ? 'Guardando...' : 'Guardar Configuración'}
                    </Button>
                </Box>
            </form>
        </Paper>
    );
};

export default RoleForm;