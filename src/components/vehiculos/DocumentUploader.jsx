import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  IconButton,
  Paper,
  Alert,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const DocumentUploader = ({ 
  onFileSelect, 
  onError,
  acceptedTypes = '.pdf,.jpg,.jpeg,.png',
  maxSizeMB = 5,
  label = "Subir documento"
}) => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    
    if (!selectedFile) return;
    
    // Limpiar error previo
    setError(null);
    
    // Validar tamaño
    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      const mensajeError = `El archivo no debe superar los ${maxSizeMB}MB`;
      setError(mensajeError);
      if (onError) onError(mensajeError);
      return;
    }
    
    // Validar tipo por extensión
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
    const acceptedExtensions = acceptedTypes.replace(/\./g, '').split(',');
    
    if (!acceptedExtensions.includes(fileExtension)) {
      const mensajeError = `Solo se permiten archivos: ${acceptedTypes.replace(/\./g, '').toUpperCase()}`;
      setError(mensajeError);
      if (onError) onError(mensajeError);
      return;
    }
    
    setFile(selectedFile);
    
    if (onFileSelect) {
      onFileSelect(selectedFile);
    }
    
    // Simular progreso de upload (opcional - puedes quitarlo si no lo necesitas)
    setIsUploading(true);
    const interval = setInterval(() => {
      setUploadProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return oldProgress + 10;
      });
    }, 100);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setError(null);
    
    if (onFileSelect) {
      onFileSelect(null);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box>
      {/* Mostrar error si existe */}
      {error && (
        <Alert severity="error" sx={{ mb: '1rem', borderRadius: '0.5rem' }}>
          {error}
        </Alert>
      )}
      
      <Paper 
        variant="outlined" 
        sx={{ 
          p: '1.5rem', 
          borderRadius: '0.75rem',
          borderStyle: file ? 'solid' : 'dashed',
          borderWidth: file ? '0.0625rem' : '0.125rem',
          borderColor: file ? 'primary.main' : 'divider',
          backgroundColor: file ? 'action.hover' : 'transparent',
          transition: 'all 0.2s ease-in-out',
        }}
      >
        <input
          type="file"
          id="document-upload"
          hidden
          onChange={handleFileChange}
          accept={acceptedTypes}
        />
        
        {!file ? (
          <Box sx={{ textAlign: 'center' }}>
            <CloudUploadIcon sx={{ fontSize: '3rem', color: 'text.secondary', mb: '1rem' }} />
            
            <Typography variant="body1" gutterBottom>
              {label}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: '1.5rem' }}>
              Selecciona un archivo para subir
            </Typography>
            
            <Button
              component="label"
              htmlFor="document-upload"
              variant="contained"
              startIcon={<DescriptionIcon />}
            >
              Seleccionar archivo
            </Button>
            
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: '1rem' }}>
              Formatos permitidos: {acceptedTypes.replace(/\./g, '').toUpperCase()} (Máx. {maxSizeMB}MB)
            </Typography>
          </Box>
        ) : (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '1rem' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <DescriptionIcon color="primary" sx={{ fontSize: '2rem' }} />
                <Box>
                  <Typography variant="body1" fontWeight="medium">
                    {file.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatFileSize(file.size)}
                  </Typography>
                </Box>
              </Box>
              
              <IconButton onClick={handleRemoveFile} color="error" size="small">
                <DeleteIcon />
              </IconButton>
            </Box>
            
            {isUploading ? (
              <Box sx={{ width: '100%' }}>
                <LinearProgress 
                  variant="determinate" 
                  value={uploadProgress} 
                  sx={{ height: '0.5rem', borderRadius: '0.25rem' }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: '0.5rem', display: 'block' }}>
                  Simulando subida... {uploadProgress}%
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircleIcon color="success" fontSize="small" />
                <Typography variant="caption" color="success.main">
                  Archivo listo para enviar
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default DocumentUploader;