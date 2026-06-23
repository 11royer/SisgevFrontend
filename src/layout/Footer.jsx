import React from 'react';
import {
    Box,
    Typography,
    Container,
    Divider,
    useTheme,
    Stack,
} from '@mui/material';

const Footer = () => {
    const theme = useTheme();
    const currentYear = new Date().getFullYear();

    return (
        <Box
            component="footer"
            sx={{
                mt: 2,
                py: 1.5,
                backgroundColor: theme.palette.mode === 'dark'
                    ? 'rgba(0, 0, 0, 0.5)'
                    : 'rgba(245, 245, 245, 0.8)',
                borderTop: `1px solid ${theme.palette.divider}`,
                backdropFilter: 'blur(6px)',
            }}
        >
            <Container maxWidth="xl">
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={1}
                >
                    {/* Información izquierda */}
                    <Typography
                        variant="caption"
                        sx={{
                            color: theme.palette.text.secondary,
                            fontSize: '0.65rem',
                            fontWeight: 500,
                        }}
                    >
                        SISGEV-P v1.0
                    </Typography>

                    {/* Información central */}
                    <Typography
                        variant="caption"
                        sx={{
                            color: theme.palette.text.secondary,
                            fontSize: '0.6rem',
                            textAlign: 'center',
                        }}
                    >
                        © {currentYear} Comando departamental de Potosi - Sistema de Gestión de Flota Vehicular Policial
                    </Typography>

                    {/* Información derecha */}
                    <Typography
                        variant="caption"
                        sx={{
                            color: theme.palette.text.secondary,
                            fontSize: '0.6rem',
                        }}
                    >
                        Todos los derechos reservados
                    </Typography>
                </Stack>
            </Container>
        </Box>
    );
};

export default Footer;