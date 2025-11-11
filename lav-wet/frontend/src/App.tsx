import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/common/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoginForm from './components/auth/LoginForm';

import HotelesPage from './components/hoteles/HotelesPage';
import UsuariosPage from './components/usuarios/UsuariosPage';
import PrendasPage from './components/prendas/PrendasPage';
import Dashboard from './components/dashboard/Dashboard';
import GuiaForm from './components/guias/GuiaForm';
import GuiasPage from './components/guias/GuiasPage';
import GuiasProcesar from './components/guias/GuiasProcesar';
import GuiasEntregar from './components/guias/GuiasEntregar';
import GuiasSeguimiento from './components/guias/GuiasSeguimiento';

// Placeholder components - se implementarán en tareas posteriores
const Unauthorized = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso No Autorizado</h1>
      <p className="text-gray-600">No tienes permisos para acceder a esta página.</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Toaster position="top-right" />
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />

              {/* Rutas para Recepcionistas y Administrador */}
              <Route path="guias/nueva" element={
                <ProtectedRoute allowedRoles={['Recepcionista Hotel', 'Administrador']}>
                  <GuiaForm />
                </ProtectedRoute>
              } />

              {/* Rutas para Operarios y Administrador */}
              <Route path="guias/procesar" element={
                <ProtectedRoute allowedRoles={['Operario Lavandería', 'Administrador']}>
                  <GuiasProcesar />
                </ProtectedRoute>
              } />

              {/* Rutas para Choferes y Administrador */}
              <Route path="guias/entregar" element={
                <ProtectedRoute allowedRoles={['Chofer', 'Administrador']}>
                  <GuiasEntregar />
                </ProtectedRoute>
              } />

              {/* Rutas para Encargados y Administrador */}
              <Route path="guias/tracking" element={
                <ProtectedRoute allowedRoles={['Encargado Hotel', 'Administrador']}>
                  <GuiasSeguimiento />
                </ProtectedRoute>
              } />

              {/* Rutas para Administradores */}
              <Route path="hoteles" element={
                <ProtectedRoute allowedRoles={['Administrador']}>
                  <HotelesPage />
                </ProtectedRoute>
              } />

              <Route path="usuarios" element={
                <ProtectedRoute allowedRoles={['Administrador']}>
                  <UsuariosPage />
                </ProtectedRoute>
              } />

              <Route path="prendas" element={
                <ProtectedRoute allowedRoles={['Administrador']}>
                  <PrendasPage />
                </ProtectedRoute>
              } />

              {/* Ruta general para guías (acceso según rol) */}
              <Route path="guias" element={<GuiasPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;