import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  LogOut, 
  Package, 
  Users, 
  Building2, 
 
  Home,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Plus,
  Eye,

  ClipboardList
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMantenimientosOpen, setIsMantenimientosOpen] = useState(true);
  const [isGuiasOpen, setIsGuiasOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const getNavigationItems = () => {
    const items = [];

    // Dashboard siempre visible
    items.push({
      type: 'single',
      to: '/',
      icon: Home,
      label: 'Dashboard',
      roles: ['all']
    });

    // Navegación según el perfil de usuario
    if (user.nombre_perfil === 'Administrador') {
      items.push(
        {
          type: 'group',
          icon: Settings,
          label: 'Mantenimientos',
          isOpen: isMantenimientosOpen,
          toggle: () => setIsMantenimientosOpen(!isMantenimientosOpen),
          children: [
            { to: '/hoteles', icon: Building2, label: 'Hoteles' },
            { to: '/usuarios', icon: Users, label: 'Usuarios' },
            { to: '/prendas', icon: Package, label: 'Prendas' }
          ]
        },
        {
          type: 'group',
          icon: ClipboardList,
          label: 'Gestión de Guías',
          isOpen: isGuiasOpen,
          toggle: () => setIsGuiasOpen(!isGuiasOpen),
          children: [
            { to: '/guias', icon: ClipboardList, label: 'Todas las Guías' },
            { to: '/guias/nueva', icon: Plus, label: 'Nueva Guía' },
            { to: '/guias/procesar', icon: Package, label: 'Procesar Guías' },
            { to: '/guias/tracking', icon: Eye, label: 'Seguimiento' }
          ]
        }
      );
    } else if (user.nombre_perfil === 'Recepcionista Hotel') {
      items.push(
        {
          type: 'single',
          to: '/guias/nueva',
          icon: Plus,
          label: 'Nueva Guía',
          roles: ['Recepcionista Hotel']
        },
        {
          type: 'single',
          to: '/guias',
          icon: ClipboardList,
          label: 'Mis Guías',
          roles: ['Recepcionista Hotel']
        }
      );
    } else if (user.nombre_perfil === 'Operario Lavandería') {
      items.push({
        type: 'single',
        to: '/guias/procesar',
        icon: Package,
        label: 'Procesar Guías',
        roles: ['Operario Lavandería']
      });
    } else if (user.nombre_perfil === 'Encargado Hotel') {
      items.push({
        type: 'single',
        to: '/guias/tracking',
        icon: Eye,
        label: 'Seguimiento',
        roles: ['Encargado Hotel']
      });
    }

    return items;
  };

  const navigationItems = getNavigationItems();

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const isActiveGroup = (children: any[]) => {
    return children?.some(child => location.pathname === child.to) || false;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Lavandería</h1>
            <p className="text-sm text-gray-500">Sistema de Gestión</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item, index) => {
          if (item.type === 'single') {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.to);
            
            return (
              <Link
                key={index}
                to={item.to}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          } else if (item.type === 'group') {
            const Icon = item.icon;
            const isGroupActive = isActiveGroup(item.children);
            
            return (
              <div key={index}>
                <button
                  onClick={item.toggle}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                    isGroupActive
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.isOpen ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>
                
                {item.isOpen && (
                  <div className="mt-2 ml-4 space-y-1">
                    {item.children.map((child, childIndex) => {
                      const ChildIcon = child.icon;
                      const isChildActive = isActiveRoute(child.to);
                      
                      return (
                        <Link
                          key={childIndex}
                          to={child.to}
                          className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                            isChildActive
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <ChildIcon size={18} />
                          <span>{child.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }
          return null;
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-gray-50 rounded-lg p-4 mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user.nombre_completo.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.nombre_completo}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user.nombre_perfil}
              </p>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-white rounded-lg shadow-lg border border-gray-200"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white shadow-xl border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <SidebarContent />
      </div>
    </>
  );
};

export default Sidebar;