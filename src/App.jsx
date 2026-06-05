import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import Usuarios from './pages/Usuarios';
import Roles from './pages/Roles';
import Bitacora from './pages/Bitacora';
import Perfil from './pages/Perfil';

// Rutas de Vehículos
import VehiculosPage from './pages/vehiculos';
import CreateVehiculo from './pages/vehiculos/CreateVehiculo';
import EditVehiculo from './pages/vehiculos/EditVehiculo';
import ViewVehiculo from './pages/vehiculos/ViewVehiculo';
import DocumentosVehiculo from './pages/vehiculos/DocumentosVehiculo';

// CONDUCTORES Y ASIGNACIONES
import ConductoresPage from './pages/conductores';
import CreateConductor from './pages/conductores/CreateConductor';
import EditConductor from './pages/conductores/EditConductor';
import ViewConductor from './pages/conductores/ViewConductor';
import AsignacionesPage from './pages/asignaciones';
import CreateAsignacion from './pages/asignaciones/CreateAsignacion';
import ViewAsignacion from './pages/asignaciones/ViewAsignacion';

// MANTENIMIENTOS Y REPUESTOS
import MantenimientosPage from './pages/mantenimientos';
import CreateMantenimiento from './pages/mantenimientos/CreateMantenimiento';
import EditMantenimiento from './pages/mantenimientos/EditMantenimiento';
import ViewMantenimiento from './pages/mantenimientos/ViewMantenimiento';
import RepuestosPage from './pages/repuestos';
import CreateRepuesto from './pages/repuestos/CreateRepuesto';
import EditRepuesto from './pages/repuestos/EditRepuesto';
import ViewRepuesto from './pages/repuestos/ViewRepuesto';

import PrivateRoute from './routes/PrivateRoute';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Rutas privadas - Dashboard y Perfil */}
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />
      
      {/* Administración */}
      <Route path="/usuarios" element={<PrivateRoute><Usuarios /></PrivateRoute>} />
      <Route path="/roles" element={<PrivateRoute><Roles /></PrivateRoute>} />
      <Route path="/bitacora" element={<PrivateRoute><Bitacora /></PrivateRoute>} />
      
      {/* Vehículos */}
      <Route path="/vehiculos" element={<PrivateRoute><VehiculosPage /></PrivateRoute>} />
      <Route path="/vehiculos/crear" element={<PrivateRoute><CreateVehiculo /></PrivateRoute>} />
      <Route path="/vehiculos/editar/:id" element={<PrivateRoute><EditVehiculo /></PrivateRoute>} />
      <Route path="/vehiculos/:id" element={<PrivateRoute><ViewVehiculo /></PrivateRoute>} />
      <Route path="/vehiculos/:id/documentos" element={<PrivateRoute><DocumentosVehiculo /></PrivateRoute>} />
      
      {/* Conductores */}
      <Route path="/conductores" element={<PrivateRoute><ConductoresPage /></PrivateRoute>} />
      <Route path="/conductores/crear" element={<PrivateRoute><CreateConductor /></PrivateRoute>} />
      <Route path="/conductores/editar/:id" element={<PrivateRoute><EditConductor /></PrivateRoute>} />
      <Route path="/conductores/:id" element={<PrivateRoute><ViewConductor /></PrivateRoute>} />
      <Route path="/conductores/:id/historial" element={<PrivateRoute><ViewConductor /></PrivateRoute>} />

      {/* Asignaciones */}
      <Route path="/asignaciones" element={<PrivateRoute><AsignacionesPage /></PrivateRoute>} />
      <Route path="/asignaciones/crear" element={<PrivateRoute><CreateAsignacion /></PrivateRoute>} />
      <Route path="/asignaciones/:id" element={<PrivateRoute><ViewAsignacion /></PrivateRoute>} />

      {/* Mantenimientos */}
      <Route path="/mantenimientos" element={<PrivateRoute><MantenimientosPage /></PrivateRoute>} />
      <Route path="/mantenimientos/crear" element={<PrivateRoute><CreateMantenimiento /></PrivateRoute>} />
      <Route path="/mantenimientos/editar/:id" element={<PrivateRoute><EditMantenimiento /></PrivateRoute>} />
      <Route path="/mantenimientos/:id" element={<PrivateRoute><ViewMantenimiento /></PrivateRoute>} />
      
      {/* Repuestos */}
      <Route path="/repuestos" element={<PrivateRoute><RepuestosPage /></PrivateRoute>} />
      <Route path="/repuestos/crear" element={<PrivateRoute><CreateRepuesto /></PrivateRoute>} />
      <Route path="/repuestos/editar/:id" element={<PrivateRoute><EditRepuesto /></PrivateRoute>} />
      <Route path="/repuestos/:id" element={<PrivateRoute><ViewRepuesto /></PrivateRoute>} />

      {/* Ruta por defecto */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}