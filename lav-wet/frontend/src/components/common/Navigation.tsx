import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, Package, Users, Building2, FileText } from 'lucide-react';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const getNavigationItems = () => {
    const items = [];

    // Navegación según el perfil de usuario
    if (user.nombre_perfil === 'Administrador') {
      items.push(
        { to: '/hoteles', icon: Building2, label: 'Hoteles' },
        { to: '/usuarios', icon: Users, label: 'Usuarios' },
        { to: '/prendas', icon: Package, label: 'Prendas' },
        { to: '/guias', icon: FileText, label: 'Guías' }
      );
    } else if (user.nombre_perfil === 'Recepcionista Hotel') {
      items.push(
        { to: '/guias/nueva', icon: FileText, label: 'Nueva Guía' },
        { to: '/guias', icon: FileText, label: 'Mis Guías' }
      );
    } else if (user.nombre_perfil === 'Operario Lavandería') {
      items.push(
        { to: '/guias/procesar', icon: Package, label: 'Procesar Guías' }
      );
    } else if (user.nombre_perfil === 'Encargado Hotel') {
      items.push(
        { to: '/guias/tracking', icon: FileText, label: 'Seguimiento' }
      );
    }

    return items;
  };

  const navigationItems = getNavigationItems();

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-xl font-bold text-blue-600">
              Sistema Lavandería
            </Link>
            <div className="hidden md:flex space-x-4">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {user.nombre_completo} ({user.nombre_perfil})
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} />
              <span>Salir</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;