import React from 'react';
import { Hotel } from '../../types';
import Pagination from '../common/Pagination';

interface HotelesListProps {
  hoteles: Hotel[];
  loading: boolean;
  error: string;
  onAdd: () => void;
  onEdit: (hotel: Hotel) => void;
  onDelete: (id: number) => Promise<void>;
  onRefresh: () => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const HotelesList: React.FC<HotelesListProps> = ({
  hoteles,
  loading,
  error,
  onAdd,
  onEdit,
  onDelete,
  onRefresh,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange
}) => {
  const hotelesArray = hoteles || [];

  const handleDelete = async (id: number, nombre: string) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el hotel "${nombre}"?`)) {
      try {
        await onDelete(id);
        onRefresh();
      } catch (error) {
        console.error('Error eliminando hotel:', error);
      }
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
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
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
            <h2 className="text-3xl font-bold mb-2">Gestión de Hoteles</h2>
            <p className="text-blue-100 text-sm">Administra los hoteles registrados en el sistema</p>
          </div>
          <button
            onClick={onAdd}
            className="bg-white text-blue-900 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            style={{ 
              background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
              boxShadow: '0 4px 15px rgba(255, 255, 255, 0.3)'
            }}
          >
            Agregar Hotel
          </button>
        </div>
      </div>

      {/* Tabla de hoteles */}
      <div className="bg-white shadow-xl overflow-hidden rounded-xl border border-slate-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead style={{ 
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
            }}>
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  Hotel
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  RUC
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {hotelesArray.map((hotel, index) => (
                <tr 
                  key={hotel.id_hotel} 
                  className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300"
                  style={{ 
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc'
                  }}
                >
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {hotel.nombre_comercial}
                      </div>
                      <div className="text-sm text-gray-600">
                        {hotel.razon_social}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm font-mono text-gray-900 bg-gray-100 px-3 py-1 rounded-md inline-block">
                      {hotel.ruc || 'Sin RUC'}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {hotel.telefono}
                    </div>
                    <div className="text-sm text-gray-600">
                      {hotel.correo_contacto}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
                        hotel.estado === 1
                          ? 'bg-gradient-to-r from-green-400 to-green-500 text-white'
                          : 'bg-gradient-to-r from-red-400 to-red-500 text-white'
                      }`}
                    >

                      {hotel.estado === 1 ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => onEdit(hotel)}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(hotel.id_hotel, hotel.nombre_comercial)}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {hotelesArray.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏨</div>
            <div className="text-xl font-semibold text-gray-700 mb-2">No hay hoteles registrados</div>
            <div className="text-gray-500">Comienza agregando tu primer hotel al sistema</div>
          </div>
        )}
      </div>

      {/* Paginación */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default HotelesList;