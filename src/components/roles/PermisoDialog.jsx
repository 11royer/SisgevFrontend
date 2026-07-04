import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Checkbox,
    FormGroup,
    FormControlLabel,
    Box,
    Divider,
    CircularProgress,
    Alert,
    Chip,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

const PermisoDialog = ({ open, rol, onClose, onSave, loading }) => {
    const [selectedPermisos, setSelectedPermisos] = useState([]);
    const [permisosAgrupados, setPermisosAgrupados] = useState({});
    const [permisosList, setPermisosList] = useState([]);

    useEffect(() => {
        if (open && rol) {
            setSelectedPermisos(rol.permisos?.map(p => p.id) || []);
        }
    }, [open, rol]);

    useEffect(() => {
        if (rol?.permisos_disponibles) {
            const agrupados = {};
            rol.permisos_disponibles.forEach(permiso => {
                if (!agrupados[permiso.modulo]) {
                    agrupados[permiso.modulo] = [];
                }
                agrupados[permiso.modulo].push(permiso);
            });
            setPermisosAgrupados(agrupados);
            setPermisosList(rol.permisos_disponibles);
        }
    }, [rol]);

    const handleTogglePermiso = (permisoId) => {
        setSelectedPermisos(prev =>
            prev.includes(permisoId)
                ? prev.filter(id => id !== permisoId)
                : [...prev, permisoId]
        );
    };

    const handleToggleModulo = (modulo, permisos) => {
        const permisosIds = permisos.map(p => p.id);
        const todosSeleccionados = permisosIds.every(id => selectedPermisos.includes(id));

        if (todosSeleccionados) {
            setSelectedPermisos(prev => prev.filter(id => !permisosIds.includes(id)));
        } else {
            const nuevos = [...selectedPermisos];
            permisosIds.forEach(id => {
                if (!nuevos.includes(id)) nuevos.push(id);
            });
            setSelectedPermisos(nuevos);
        }
    };

    const handleGuardar = () => {
        onSave(selectedPermisos);
    };

    const totalPermisos = permisosList.length;
    const seleccionados = selectedPermisos.length;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{ sx: { borderRadius: '0.75rem' } }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h6" fontWeight="bold">
                        Gestión de Permisos
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {rol?.nombre} - {seleccionados}/{totalPermisos} permisos seleccionados
                    </Typography>
                </Box>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                            <Chip
                                label={`${seleccionados} seleccionados`}
                                color="primary"
                                size="small"
                            />
                            <Chip
                                label={`${totalPermisos - seleccionados} sin seleccionar`}
                                color="default"
                                size="small"
                                variant="outlined"
                            />
                            <Chip
                                label={`${Object.keys(permisosAgrupados).length} módulos`}
                                color="info"
                                size="small"
                                variant="outlined"
                            />
                        </Box>

                        {Object.entries(permisosAgrupados).map(([modulo, permisos]) => {
                            const todosSeleccionados = permisos.every(p =>
                                selectedPermisos.includes(p.id)
                            );
                            const algunosSeleccionados = permisos.some(p =>
                                selectedPermisos.includes(p.id)
                            );

                            return (
                                <Accordion key={modulo} defaultExpanded sx={{ mb: 1 }}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                                            <Checkbox
                                                checked={todosSeleccionados}
                                                indeterminate={algunosSeleccionados && !todosSeleccionados}
                                                onChange={() => handleToggleModulo(modulo, permisos)}
                                                size="small"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <Typography variant="subtitle2" fontWeight="bold">
                                                {modulo}
                                            </Typography>
                                            <Chip
                                                label={`${permisos.filter(p => selectedPermisos.includes(p.id)).length}/${permisos.length}`}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <FormGroup>
                                            <Grid container spacing={1}>
                                                {permisos.map((permiso) => (
                                                    <Grid item xs={12} sm={6} md={4} key={permiso.id}>
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    checked={selectedPermisos.includes(permiso.id)}
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
            </DialogContent>

            <DialogActions sx={{ p: 2, gap: 1 }}>
                <Button onClick={onClose} disabled={loading}>
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleGuardar}
                    disabled={loading}
                    sx={{ borderRadius: '0.5rem' }}
                >
                    {loading ? <CircularProgress size={20} color="inherit" /> : 'Guardar Permisos'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PermisoDialog;