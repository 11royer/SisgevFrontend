import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

/**
 * Diálogo de confirmación para eliminar una unidad.
 */
const UnidadDeleteDialog = ({
  open,
  unidad,
  onConfirm,
  onCancel,
  loading = false,
}) => {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: '0.75rem' },
      }}
    >
      {/*
          ENCABEZADO
         */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          fontWeight: 'bold',
        }}
      >
        <DeleteIcon color="error" />
        Confirmar Eliminación
      </DialogTitle>

      {/*
          CONTENIDO
         */}
      <DialogContent>
        <DialogContentText>
          ¿Está seguro de que desea eliminar la siguiente unidad?
        </DialogContentText>

        {/* Tarjeta con datos de la unidad */}
        {unidad && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              bgcolor: 'action.hover',
              borderRadius: '0.5rem',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="body1" fontWeight="bold" color="primary">
              {unidad.nombre}
            </Typography>

            {unidad.sigla && (
              <Typography variant="body2" color="text.secondary">
                <strong>Sigla:</strong> {unidad.sigla}
              </Typography>
            )}

            {unidad.tipo && (
              <Typography variant="body2" color="text.secondary">
                <strong>Tipo:</strong> {unidad.tipo}
              </Typography>
            )}

            {unidad.ubicacion && (
              <Typography variant="body2" color="text.secondary">
                <strong>Ubicación:</strong> {unidad.ubicacion}
              </Typography>
            )}

            <Typography variant="body2" color="text.secondary">
              <strong>Estado:</strong>{' '}
              <span style={{ color: unidad.estado ? 'green' : 'gray' }}>
                {unidad.estado ? 'Activa' : 'Inactiva'}
              </span>
            </Typography>
          </Box>
        )}

        {/* Advertencia sobre dependencias */}
        <Alert
          severity="warning"
          icon={<WarningAmberIcon />}
          sx={{ mt: 2, borderRadius: '0.5rem' }}
        >
          <Typography variant="body2" fontWeight="bold">
            Advertencia importante:
          </Typography>
          <Typography variant="body2">
            Si esta unidad tiene <strong>usuarios o vehículos asignados</strong>, no podrá
            ser eliminada. En ese caso, primero deberá reasignar esos registros a otra
            unidad.
          </Typography>
        </Alert>

        {/* Mensaje final de irreversibilidad */}
        <DialogContentText
          sx={{
            mt: 2,
            fontSize: '0.875rem',
            color: 'error.main',
            fontWeight: 'medium',
          }}
        >
          Esta acción no se puede deshacer.
        </DialogContentText>
      </DialogContent>

      {/* ACCIONES */}
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={onCancel}
          disabled={loading}
          variant="outlined"
          sx={{ borderRadius: '0.5rem' }}
        >
          Cancelar
        </Button>

        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={loading}
          startIcon={
            loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <DeleteIcon />
            )
          }
          sx={{ borderRadius: '0.5rem' }}
        >
          {loading ? 'Eliminando...' : 'Eliminar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UnidadDeleteDialog;