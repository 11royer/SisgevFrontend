import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Box,
    CircularProgress,
} from '@mui/material';

const StockUpdateDialog = ({ open, repuesto, tipo, onClose, onConfirm, loading }) => {
    const [cantidad, setCantidad] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const [error, setError] = useState('');

    const esEntrada = tipo === 'entrada';
    const titulo = esEntrada ? 'Entrada de Stock' : 'Salida de Stock';
    const botonTexto = esEntrada ? 'Agregar Stock' : 'Retirar Stock';
    const botonColor = esEntrada ? 'success' : 'warning';

    const handleConfirm = () => {
        if (!cantidad || parseInt(cantidad) <= 0) {
            setError('Ingrese una cantidad válida mayor a 0');
            return;
        }

        onConfirm(parseInt(cantidad), observaciones);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {titulo}
                {repuesto && (
                    <Typography variant="caption" display="block" color="text.secondary">
                        {repuesto.codigo_interno} - {repuesto.nombre_repuesto}
                    </Typography>
                )}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        label="Cantidad"
                        type="number"
                        value={cantidad}
                        onChange={(e) => {
                            setCantidad(e.target.value);
                            setError('');
                        }}
                        required
                        size="small"
                        InputProps={{ inputProps: { min: 1 } }}
                        error={!!error}
                        helperText={error}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Observaciones (opcional)"
                        value={observaciones}
                        onChange={(e) => setObservaciones(e.target.value)}
                        multiline
                        rows={2}
                        size="small"
                        placeholder={esEntrada ? "Ej: Compra mensual" : "Ej: Consumo en mantenimiento #123"}
                    />
                    {!esEntrada && repuesto && repuesto.cantidad_actual < cantidad && (
                        <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                            ⚠️ Stock actual: {repuesto.cantidad_actual} unidades. No hay suficiente stock.
                        </Typography>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    Cancelar
                </Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    color={botonColor}
                    disabled={loading || !cantidad}
                >
                    {loading ? <CircularProgress size={20} /> : botonTexto}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default StockUpdateDialog;