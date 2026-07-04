import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Typography,
    Alert,
    Snackbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Chip,
    Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SecurityIcon from '@mui/icons-material/Security';
import Layout from '../layout/Layout';
import RoleForm from '../components/roles/RoleForm';
import PermisoDialog from '../components/roles/PermisoDialog';
import { roleService } from '../services/RoleService';
import { permisoService } from '../services/PermisoService';

const Roles = () => {
    // --- ESTADOS DE DATOS ---
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- ESTADOS DE FORMULARIO Y DIÁLOGOS ---
    const [showForm, setShowForm] = useState(false);
    const [roleEdit, setRoleEdit] = useState(null);
    const [formLoading, setFormLoading] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // ESTADOS PARA GESTIÓN DE PERMISOS
    const [permisoDialogOpen, setPermisoDialogOpen] = useState(false);
    const [rolSeleccionado, setRolSeleccionado] = useState(null);
    const [permisosAsignados, setPermisosAsignados] = useState([]);
    const [permisosDisponibles, setPermisosDisponibles] = useState([]);
    const [guardandoPermisos, setGuardandoPermisos] = useState(false);

    // --- EFFECTS ---
    useEffect(() => {
        cargarRoles();
        cargarPermisosDisponibles();
    }, []);

    // --- LÓGICA DE CARGA ---

    const cargarRoles = async () => {
        try {
            setLoading(true);
            const response = await roleService.getAll();
            setRoles(response.data);
        } catch (error) {
            console.error('Error cargando roles:', error);
            mostrarSnackbar('Error al cargar la lista de roles', 'error');
        } finally {
            setLoading(false);
        }
    };

    const cargarPermisosDisponibles = async () => {
        try {
            const response = await permisoService.getAll();
            setPermisosDisponibles(response.data);
        } catch (error) {
            console.error('Error cargando permisos:', error);
        }
    };

    // --- MANEJADORES DE EVENTOS ---
    const mostrarSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const cerrarSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleNuevoRol = () => {
        setRoleEdit(null);
        setShowForm(true);
    };

    const handleEditarRol = (role) => {
        setRoleEdit(role);
        setShowForm(true);
    };

    const handleEliminarRol = (role) => {
        if (role.id <= 4) {
            mostrarSnackbar('No se puede eliminar un rol base del sistema', 'error');
            return;
        }
        setRoleToDelete(role);
        setShowDeleteDialog(true);
    };

    const confirmarEliminarRol = async () => {
        if (!roleToDelete) return;
        try {
            setDeleteLoading(true);
            await roleService.delete(roleToDelete.id);
            setRoles(prev => prev.filter(r => r.id !== roleToDelete.id));
            mostrarSnackbar('Rol eliminado correctamente', 'success');
            setShowDeleteDialog(false);
        } catch (error) {
            mostrarSnackbar('Error al eliminar el rol', 'error');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleSubmitRol = async (formData) => {
        try {
            setFormLoading(true);
            if (roleEdit) {
                await roleService.update(roleEdit.id, formData);
                mostrarSnackbar('Rol actualizado correctamente');
            } else {
                await roleService.create(formData);
                mostrarSnackbar('Rol creado correctamente');
            }
            await cargarRoles();
            setShowForm(false);
        } catch (error) {
            console.error('Error guardando rol:', error);
            throw error;
        } finally {
            setFormLoading(false);
        }
    };

    // MANEJADORES DE PERMISOS
    const handleAbrirPermisos = async (rol) => {
        try {
            setRolSeleccionado(rol);
            const response = await permisoService.getByRol(rol.id);
            const permisosIds = response.data.permisos.map(p => p.id);
            setPermisosAsignados(permisosIds);
            setPermisoDialogOpen(true);
        } catch (error) {
            console.error('Error cargando permisos del rol:', error);
            mostrarSnackbar('Error al cargar los permisos', 'error');
        }
    };

    const handleGuardarPermisos = async (permisosIds) => {
        if (!rolSeleccionado) return;

        try {
            setGuardandoPermisos(true);
            await permisoService.asignar(rolSeleccionado.id, { permisos: permisosIds });
            setPermisosAsignados(permisosIds);
            setPermisoDialogOpen(false);
            mostrarSnackbar('Permisos asignados correctamente', 'success');
            await cargarRoles();
        } catch (error) {
            console.error('Error guardando permisos:', error);
            const mensaje = error.response?.data?.message || 'Error al asignar permisos';
            mostrarSnackbar(mensaje, 'error');
        } finally {
            setGuardandoPermisos(false);
        }
    };

    // Enriquecer roles con permisos disponibles
    const rolesConPermisos = roles.map(rol => ({
        ...rol,
        permisos_disponibles: permisosDisponibles,
    }));

    // --- RENDER ---
    return (
        <Layout>
            <Box sx={{ width: '100%', p: { xs: '0.75rem', md: '1.5rem' } }}>

                {/* ENCABEZADO */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '1rem' }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Gestión de Roles</Typography>
                    {!showForm && (
                        <Button variant="contained" startIcon={<AddIcon />} onClick={handleNuevoRol} disabled={loading}>
                            Nuevo Rol
                        </Button>
                    )}
                </Box>

                {/* NOTA INFORMATIVA */}
                <Alert severity="info" sx={{ mb: '1.5rem', borderRadius: '0.5rem' }}>
                    <Typography variant="body2">
                        <strong>Nota:</strong> Administra los niveles de acceso. Los roles del sistema (ID 1-4) son estructurales y no pueden eliminarse.
                    </Typography>
                </Alert>

                {/* CONTENIDO PRINCIPAL */}
                {showForm ? (
                    <RoleForm
                        role={roleEdit}
                        onSubmit={handleSubmitRol}
                        onCancel={() => setShowForm(false)}
                        loading={formLoading}
                    />
                ) : (
                    <>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: '5rem' }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <TableContainer component={Paper} elevation={3} sx={{ borderRadius: '0.5rem' }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>ID</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>Nombre del Rol</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>Descripción</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>Tipo</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>Permisos</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>Acciones</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {roles.map((role) => {
                                            const esBase = role.id <= 4;
                                            const cantidadPermisos = role.permisos?.length || 0;

                                            return (
                                                <TableRow key={role.id} hover>
                                                    <TableCell>{role.id}</TableCell>
                                                    <TableCell sx={{ fontWeight: 'medium' }}>{role.nombre}</TableCell>
                                                    <TableCell color="text.secondary">
                                                        {role.descripcion || 'Sin descripción'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={esBase ? 'Sistema' : 'Personalizado'}
                                                            color={esBase ? 'primary' : 'default'}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            {/* Añadir wrapper span para botón deshabilitado */}
                                                            <Tooltip title="Gestionar permisos">
                                                                <span>
                                                                    <IconButton
                                                                        size="small"
                                                                        color={cantidadPermisos > 0 ? 'primary' : 'default'}
                                                                        onClick={() => handleAbrirPermisos(role)}
                                                                        disabled={esBase}
                                                                    >
                                                                        <SecurityIcon fontSize="small" />
                                                                    </IconButton>
                                                                </span>
                                                            </Tooltip>
                                                            <Chip
                                                                label={`${cantidadPermisos} permisos`}
                                                                size="small"
                                                                variant="outlined"
                                                                color={cantidadPermisos > 0 ? 'primary' : 'default'}
                                                            />
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <IconButton
                                                            size="small"
                                                            color="primary"
                                                            onClick={() => handleEditarRol(role)}
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                        {/* Añadir wrapper span para botón deshabilitado */}
                                                        <Tooltip title="No se puede eliminar un rol base del sistema">
                                                            <span>
                                                                <IconButton
                                                                    size="small"
                                                                    color="error"
                                                                    disabled={esBase}
                                                                    onClick={() => handleEliminarRol(role)}
                                                                >
                                                                    <DeleteIcon fontSize="small" />
                                                                </IconButton>
                                                            </span>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </>
                )}

                {/* DIÁLOGO DE PERMISOS */}
                <PermisoDialog
                    open={permisoDialogOpen}
                    rol={rolSeleccionado ? rolesConPermisos.find(r => r.id === rolSeleccionado.id) : null}
                    onClose={() => setPermisoDialogOpen(false)}
                    onSave={handleGuardarPermisos}
                    loading={guardandoPermisos}
                />

                {/* DIÁLOGO DE ELIMINACIÓN */}
                <Dialog
                    open={showDeleteDialog}
                    onClose={() => !deleteLoading && setShowDeleteDialog(false)}
                    fullWidth
                    maxWidth="xs"
                >
                    <DialogTitle>Confirmar Eliminación</DialogTitle>
                    <DialogContent>
                        <Typography>
                            ¿Estás seguro de eliminar el rol <strong>{roleToDelete?.nombre}</strong>?
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                            Esta acción no se puede deshacer.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowDeleteDialog(false)} disabled={deleteLoading}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={confirmarEliminarRol}
                            color="error"
                            variant="contained"
                            disabled={deleteLoading}
                        >
                            {deleteLoading ? 'Eliminando...' : 'Eliminar'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* SNACKBAR */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={4000}
                    onClose={cerrarSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert
                        severity={snackbar.severity}
                        variant="filled"
                        sx={{ borderRadius: '0.5rem' }}
                        onClose={cerrarSnackbar}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </Layout>
    );
};

export default Roles;