import React from 'react';
import {
    Box, Typography, Container, useTheme, Stack, Link,
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
                    spacing={{ xs: 0.5, sm: 2 }}
                >
                    {/* Izquierda */}
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

                    {/* Centro */}
                    <Typography
                        variant="caption"
                        sx={{
                            color: theme.palette.text.secondary,
                            fontSize: '0.6rem',
                            textAlign: 'center',
                        }}
                    >
                        © {currentYear} Comando departamental de Potosí - Sistema de Gestión de Flota Vehicular Policial
                    </Typography>

                    {/* Derecha: correo como sello de autoría */}
                    <Typography
                        variant="caption"
                        sx={{
                            color: theme.palette.text.disabled,
                            fontSize: '0.6rem',
                            fontStyle: 'italic',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        <Link
                            href="mailto:tu-correo@ejemplo.com"
                            underline="hover"
                            sx={{
                                color: 'inherit',
                                fontSize: 'inherit',
                                '&:hover': { color: theme.palette.primary.main },
                            }}
                        >
                            royermartinezperez@gmail.com
                        </Link>
                    </Typography>
                </Stack>
            </Container>
        </Box>
    );
};

export default Footer;