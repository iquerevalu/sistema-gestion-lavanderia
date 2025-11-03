import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Package, Users, Building2, FileText, TrendingUp, Clock } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const getStatsCards = () => {
    if (user?.nombre_perfil === 'Administrador') {
      return [
        {
          title: 'Hoteles Activos',
          value: '12',
          icon: Building2,
          color: 'from-blue-500 to-blue-600',
          change: '+2 este mes'
        },
        {
          title: 'Usuarios Registrados',
          value: '48',
          icon: Users,
          color: 'from-green-500 to-green-600',
          change: '+5 esta semana'
        },
        {
          title: 'Prendas Catalogadas',
          value: '156',
          icon: Package,
          color: 'from-purple-500 to-purple-600',
          change: '+12 nuevas'
        },
        {
          title: 'Guías Procesadas',
          value: '2,847',
          icon: FileText,
          color: 'from-orange-500 to-orange-600',
          change: '+156 hoy'
        }
      ];
    } else {
      return [
        {
          title: 'Guías Pendientes',
          value: '8',
          icon: Clock,
          color: 'from-yellow-500 to-yellow-600',
          change: 'Requieren atención'
        },
        {
          title: 'Procesadas Hoy',
          value: '24',
          icon: TrendingUp,
          color: 'from-green-500 to-green-600',
          change: '+12 vs ayer'
        },
        {
          title: 'En Proceso',
          value: '15',
          icon: Package,
          color: 'from-blue-500 to-blue-600',
          change: 'En lavandería'
        },
        {
          title: 'Completadas',
          value: '156',
          icon: FileText,
          color: 'from-purple-500 to-purple-600',
          change: 'Esta semana'
        }
      ];
    }
  };

  const statsCards = getStatsCards();

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-white rounded-xl shadow-lg p-8" style={{ 
        background: 'linear-gradient(135deg, #000080 0%, #1e40af 100%)',
        color: 'white'
      }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {getWelcomeMessage()}, {user?.nombre_completo?.split(' ')[0]}! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              Bienvenido al Sistema de Gestión de Lavandería
            </p>
            <p className="text-blue-200 text-sm mt-2">
              Rol: {user?.nombre_perfil} {user?.nombre_comercial && `• Hotel: ${user.nombre_comercial}`}
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Package className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${card.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  <p className="text-sm text-gray-500">{card.change}</p>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{card.title}</h3>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {user?.nombre_perfil === 'Administrador' && (
            <>
              <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-left">
                <Building2 className="w-8 h-8 text-blue-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Gestionar Hoteles</h3>
                <p className="text-sm text-gray-600">Administrar hoteles del sistema</p>
              </button>
              <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all duration-200 text-left">
                <Users className="w-8 h-8 text-green-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Gestionar Usuarios</h3>
                <p className="text-sm text-gray-600">Administrar usuarios y permisos</p>
              </button>
              <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 text-left">
                <Package className="w-8 h-8 text-purple-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Gestionar Prendas</h3>
                <p className="text-sm text-gray-600">Administrar catálogo de prendas</p>
              </button>
            </>
          )}
          
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 text-left">
            <FileText className="w-8 h-8 text-orange-600 mb-2" />
            <h3 className="font-semibold text-gray-900">
              {user?.nombre_perfil === 'Recepcionista Hotel' ? 'Nueva Guía' : 'Ver Guías'}
            </h3>
            <p className="text-sm text-gray-600">
              {user?.nombre_perfil === 'Recepcionista Hotel' 
                ? 'Crear una nueva guía de lavandería' 
                : 'Revisar guías pendientes'
              }
            </p>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Actividad Reciente</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Guía #2847 completada</p>
              <p className="text-sm text-gray-600">Hotel Plaza - hace 2 horas</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Nuevo usuario registrado</p>
              <p className="text-sm text-gray-600">María González - Recepcionista - hace 4 horas</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Package className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Nuevas prendas agregadas</p>
              <p className="text-sm text-gray-600">12 prendas de baño - hace 6 horas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;