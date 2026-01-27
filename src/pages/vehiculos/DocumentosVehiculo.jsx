import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../layout/Layout';
import useAuth from '../../auth/UseAuth';
import { vehiculoService } from '../../services/VehiculoService';
import DocumentUploader from '../../components/vehiculos/DocumentUploader';

const DocumentosVehiculo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  const [vehiculo, setVehiculo] = useState(null);
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [documentoToDelete, setDocumentoToDelete] = useState(null);
  
  // Estados para mensajes
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  // Estado para el formulario de subida
  const [formData, setFormData] = useState({
    tipo_documento: '',
    descripcion: '',
    archivo: null,
  });
  
  const tiposDocumento = [
    'SOAT',
    'Revisión Técnica',
    'Tarjeta de Circulación',
    'Póliza de Seguro',
    'Factura de Compra',
    'Manual del Propietario',
    'Mantenimiento',
    'Otro'
  ];

  useEffect(() => {
    cargarDatos();
  }, [id]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Cargar información del vehículo
      const vehiculoResponse = await vehiculoService.getById(id);
      setVehiculo(vehiculoResponse.data.data);
      
      // Cargar documentos (simulado por ahora)
      // En producción, necesitarás un endpoint específico para documentos
      setDocumentos([]); // Temporalmente vacío
      
    } catch (error) {
      console.error('Error cargando documentos:', error);
      setError('Error al cargar los documentos del vehículo');
    } finally {
      setLoading(false);
    }
  };

  const limpiarMensajes = () => {
    setError(null);
    setSuccessMessage(null);
  };

  const handleVolver = () => {
    navigate(`/vehiculos/${id}`);
  };

  const handleFileSelect = (file) => {
    setFormData(prev => ({
      ...prev,
      archivo: file,
    }));
  };

  const handleFileError = (errorMessage) => {
    setError(errorMessage);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.tipo_documento || !formData.archivo) {
      setError('Por favor complete todos los campos obligatorios');
      return;
    }

    try {
      setDialogLoading(true);
      limpiarMensajes();
      
      // Aquí iría la lógica real para subir el documento
      // Por ahora, simulación
      console.log('Subiendo documento:', {
        tipo: formData.tipo_documento,
        descripcion: formData.descripcion,
        archivo: formData.archivo.name,
        vehiculo_id: id,
      });
      
      // Simular delay de subida
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Crear documento simulado
      const nuevoDocumento = {
        id: Date.now(),
        tipo_documento: formData.tipo_documento,
        descripcion: formData.descripcion || 'Sin descripción',
        fecha_subida: new Date().toISOString().split('T')[0],
        archivo_url: '#',
        archivo_size: formData.archivo.size,
        archivo_name: formData.archivo.name,
      };
      
      // Agregar a la lista
      setDocumentos(prev => [nuevoDocumento, ...prev]);
      
      // Limpiar formulario
      setFormData({
        tipo_documento: '',
        descripcion: '',
        archivo: null,
      });
      
      setOpenDialog(false);
      setSuccessMessage('Documento subido exitosamente');
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setSuccessMessage(null), 3000);
      
    } catch (error) {
      console.error('Error subiendo documento:', error);
      setError('Error al subir el documento');
    } finally {
      setDialogLoading(false);
    }
  };

  const handleDeleteClick = (documento) => {
    setDocumentoToDelete(documento);
  };

  const confirmarEliminar = async () => {
    if (!documentoToDelete) return;
    
    try {
      // Aquí iría la lógica real para eliminar
      console.log('Eliminar documento:', documentoToDelete.id);
      
      // Actualizar lista
      setDocumentos(prev => prev.filter(d => d.id !== documentoToDelete.id));
      
      setDocumentoToDelete(null);
      setSuccessMessage('Documento eliminado exitosamente');
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setSuccessMessage(null), 3000);
      
    } catch (error) {
      console.error('Error eliminando documento:', error);
      setError('Error al eliminar el documento');
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Desconocido';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
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

  if (!vehiculo) {
    return (
      <Layout>
        <Alert severity="error">Vehículo no encontrado</Alert>
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
          mb: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleVolver}
              size="small"
            >
              Volver al Vehículo
            </Button>
            
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              Documentos - {vehiculo.placa}
            </Typography>
          </Box>
          
          {/* Solo administradores y operadores pueden subir documentos */}
          {['Administrador', 'Operador'].includes(currentUser?.rol?.nombre) && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
            >
              Subir Documento
            </Button>
          )}
        </Box>

        {/* Alertas */}
        {error && (
          <Alert 
            severity="error" 
            onClose={limpiarMensajes}
            sx={{ mb: '1.5rem', borderRadius: '0.5rem' }}
          >
            {error}
          </Alert>
        )}
        
        {successMessage && (
          <Alert 
            severity="success" 
            onClose={limpiarMensajes}
            sx={{ mb: '1.5rem', borderRadius: '0.5rem' }}
          >
            {successMessage}
          </Alert>
        )}

        {/* Información del vehículo */}
        <Paper elevation={2} sx={{ p: '1rem', mb: '1.5rem', borderRadius: '0.75rem' }}>
          <Grid container spacing="1rem">
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">Vehículo:</Typography>
              <Typography variant="body1" fontWeight="medium">
                {vehiculo.marca} {vehiculo.modelo}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">Placa:</Typography>
              <Typography variant="body1" fontWeight="medium">
                {vehiculo.placa}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">Total Documentos:</Typography>
              <Typography variant="body1" fontWeight="medium">
                {documentos.length}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Lista de documentos */}
        <Paper elevation={3} sx={{ borderRadius: '0.75rem', overflow: 'hidden' }}>
          {documentos.length === 0 ? (
            <Box sx={{ p: '3rem', textAlign: 'center' }}>
              <DescriptionIcon sx={{ fontSize: '3rem', color: 'text.secondary', mb: '1rem' }} />
              <Typography variant="h6" color="text.secondary">
                No hay documentos registrados
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: '0.5rem' }}>
                {['Administrador', 'Operador'].includes(currentUser?.rol?.nombre) 
                  ? 'Sube el primer documento usando el botón "Subir Documento"'
                  : 'Contacta al administrador para subir documentos'
                }
              </Typography>
            </Box>
          ) : (
            <List>
              {documentos.map((documento, index) => (
                <ListItem
                  key={documento.id || index}
                  divider={index < documentos.length - 1}
                  sx={{ 
                    '&:hover': { 
                      backgroundColor: 'action.hover' 
                    } 
                  }}
                >
                  <ListItemIcon>
                    <DescriptionIcon color="primary" />
                  </ListItemIcon>
                  
                  <ListItemText
                    primary={
                      <Typography variant="body1" fontWeight="medium">
                        {documento.tipo_documento}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" component="span" display="block">
                          {documento.descripcion || 'Sin descripción'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" component="span" display="block">
                          Subido: {formatDate(documento.fecha_subida)}
                          {documento.archivo_size && ` • ${formatFileSize(documento.archivo_size)}`}
                          {documento.archivo_name && ` • ${documento.archivo_name}`}
                        </Typography>
                      </Box>
                    }
                  />
                  
                  <ListItemSecondaryAction>
                    <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                      <IconButton
                        size="small"
                        href={documento.archivo_url}
                        target="_blank"
                        title="Descargar"
                        disabled={documento.archivo_url === '#'}
                      >
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                      
                      {['Administrador', 'Operador'].includes(currentUser?.rol?.nombre) && (
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(documento)}
                          title="Eliminar"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </Paper>

        {/* Diálogo para subir documento */}
        <Dialog 
          open={openDialog} 
          onClose={() => !dialogLoading && setOpenDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <form onSubmit={handleSubmit}>
            <DialogTitle>Subir Nuevo Documento</DialogTitle>
            
            <DialogContent>
              <Grid container spacing="1rem" sx={{ mt: '0.5rem' }}>
                <Grid item xs={12}>
                  <FormControl fullWidth size="small" required>
                    <InputLabel>Tipo de Documento *</InputLabel>
                    <Select
                      value={formData.tipo_documento}
                      onChange={(e) => setFormData(prev => ({ ...prev, tipo_documento: e.target.value }))}
                      label="Tipo de Documento *"
                      disabled={dialogLoading}
                    >
                      <MenuItem value=""><em>Seleccionar tipo</em></MenuItem>
                      {tiposDocumento.map(tipo => (
                        <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Descripción (opcional)"
                    value={formData.descripcion}
                    onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                    multiline
                    rows={2}
                    size="small"
                    disabled={dialogLoading}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <DocumentUploader
                    onFileSelect={handleFileSelect}
                    onError={handleFileError}
                    acceptedTypes=".pdf,.jpg,.jpeg,.png"
                    maxSizeMB={5}
                    label="Seleccionar archivo"
                  />
                </Grid>
              </Grid>
            </DialogContent>
            
            <DialogActions>
              <Button 
                onClick={() => setOpenDialog(false)} 
                disabled={dialogLoading}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                disabled={dialogLoading || !formData.tipo_documento || !formData.archivo}
              >
                {dialogLoading ? <CircularProgress size={20} /> : 'Subir Documento'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Diálogo de confirmación para eliminar */}
        <Dialog 
          open={!!documentoToDelete} 
          onClose={() => setDocumentoToDelete(null)}
        >
          <DialogTitle>Confirmar Eliminación</DialogTitle>
          <DialogContent>
            <Typography>
              ¿Estás seguro de eliminar el documento "{documentoToDelete?.tipo_documento}"?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: '0.5rem' }}>
              Esta acción no se puede deshacer.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDocumentoToDelete(null)}>
              Cancelar
            </Button>
            <Button onClick={confirmarEliminar} color="error">
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>

      </Box>
    </Layout>
  );
};

export default DocumentosVehiculo;