import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Usuario } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  allowedUserTypes?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  allowedUserTypes,
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar roles permitidos
  if (allowedRoles && !allowedRoles.includes(user.nombre_perfil || '')) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Verificar tipos de usuario permitidos (por ahora no se usa)
  if (allowedUserTypes && allowedUserTypes.length > 0) {
    // Lógica futura si se necesita
  }

  return <>{children}</>;
};

export default ProtectedRoute;