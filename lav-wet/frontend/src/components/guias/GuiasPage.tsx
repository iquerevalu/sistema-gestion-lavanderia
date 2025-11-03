import React, { useState, useEffect } from 'react';
import { GuiaLavanderia } from '../../types';
import { getAllGuias } from '../../services/guiaService';
import { useAuth } from '../../hooks/useAuth';
import Pagination from '../common/Pagination';

const GuiasPage: React.FC = () => {
  const { user } = useAuth();
  const [guias, setGuias] = useState<GuiaLavanderia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // Cargar guías
  const loadGuias = async (page: number = currentPage) => {
    try {
      setLoading(true);
      setError('');
      const response = await getAllGuias(page, itemsPerPage);
      setGuias(response.guias || []);
      setTotalPages(response.totalPages || 1);
      setTotalItems(response.total || 0);
      setCurrentPage(page);
    } catch (err: any) {
      setError(err.message || 'Error al cargar guías');
      setGuias([]);
      console.error('Error cargando guías:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGuias();
  }, []);

  const handlePageChange = (page: number) => {
    loadGuias(page);
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Registrado':
        return 'bg-gradient-to-r from-blue-400 to-blue-500 text-white';
      case 'Pendiente':
        return 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white';
      case 'Procesandose':
        return 'bg-gradient-to-r from-orange-400 to-orange-500 text-white';
      case 'Lista para Entregar':
        return 'bg-gradient-to-r from-green-400 to-green-500 text-white';
      case 'En Ruta':
        return 'bg-gradient-to-r from-purple-400 to-purple-500 text-white';
      case 'Entregado':
        return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-lg p-4 shadow-sm">
        <div className="flex items-center">
          <span className="text-red-500 mr-2">⚠️</span>
          <div className="text-sm text-red-700 font-medium">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6" style={{ 
        background: 'linear-gradient(135deg, #000080 0%, #1e40af 100%)',
        color: 'white'
      }}>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              {user?.nombre_perfil === 'Recepcionista Hotel' ? 'Mis Guías' : 'Gestión de Guías'}
            </h2>
            <p className="text-blue-100 text-sm">
              {user?.nombre_perfil === 'Recepcionista Hotel' 
                ? 'Visualiza y gestiona las guías de tu hotel'
                : 'Administra todas las guías del sistema'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Tabla de guías */}
      <div className="bg-white shadow-xl overflow-hidden rounded-xl border border-slate-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead style={{ 
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
            }}>
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  Guía
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  Hotel
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  Chofer
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {guias.map((guia, index) => (
                <tr 
                  key={guia.id_guia} 
                  className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300"
                  style={{ 
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc'
                  }}
                >
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        Guía #{guia.numero_guia}
                      </div>
                      <div className="text-sm text-gray-600">
                        ID: {guia.id_guia}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {guia.nombre_comercial}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(guia.fecha_recoleccion).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${getEstadoColor(guia.estado)}`}
                    >
                      {guia.estado}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {guia.chofer_recojo_nombre}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                        Ver Detalle
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {guias.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <div className="text-xl font-semibold text-gray-700 mb-2">No hay guías registradas</div>
            <div className="text-gray-500">
              {user?.nombre_perfil === 'Recepcionista Hotel' 
                ? 'Comienza registrando tu primera guía'
                : 'No se han registrado guías en el sistema'
              }
            </div>
          </div>
        )}
      </div>

      {/* Paginación */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default GuiasPage;