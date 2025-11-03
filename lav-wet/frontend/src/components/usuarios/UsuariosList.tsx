import React from 'react';
import { Usuario } from '../../types';
import Pagination from '../common/Pagination';

interface UsuariosListProps {
  usuarios: Usuario[];
  loading: boolean;
  error: string;
  onAdd: () => void;
  onEdit: (usuario: Usuario) => void;
  onDelete: (id: number) => Promise<void>;
  onRefresh: () => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const UsuariosList: React.FC<UsuariosListProps> = ({
  usuarios,
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
  const usuariosArray = usuarios || [];

  const handleDelete = async (id: number, nombre: string) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar al usuario "${nombre}"?`)) {
      try {
        await onDelete(id);
        onRefresh();
      } catch (error) {
        console.error('Error eliminando usuario:', error);
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
            <h2 className="text-3xl font-bold mb-2">Gestión de Usuarios</h2>
            <p className="text-blue-100 text-sm">Administra los usuarios del sistema</p>
          </div>
          <button
            onClick={onAdd}
            className="bg-white text-blue-900 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            style={{ 
              background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
              boxShadow: '0 4px 15px rgba(255, 255, 255, 0.3)'
            }}
          >
            Agregar Usuario
          </button>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white shadow-xl overflow-hidden rounded-xl border border-slate-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead style={{ 
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
            }}>
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  Hotel
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
              {usuariosArray.map((usuario, index) => (
                <tr 
                  key={usuario.id_usuario} 
                  className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300"
                  style={{ 
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc'
                  }}
                >
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {usuario.nombre_completo}
                      </div>
                      <div className="text-sm text-gray-600">
                        ID: {usuario.id_usuario}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {usuario.correo}
                    </div>
                    {usuario.telefono && (
                      <div className="text-sm text-gray-600">
                        {usuario.telefono}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 bg-blue-100 px-3 py-1 rounded-md inline-block">
                      {usuario.nombre_perfil || 'Sin rol'}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {usuario.nombre_comercial || 'Sin hotel asignado'}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
                        usuario.estado === 1
                          ? 'bg-gradient-to-r from-green-400 to-green-500 text-white'
                          : 'bg-gradient-to-r from-red-400 to-red-500 text-white'
                      }`}
                    >

                      {usuario.estado === 1 ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => onEdit(usuario)}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(usuario.id_usuario, usuario.nombre_completo)}
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

        {usuariosArray.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">👤</div>
            <div className="text-xl font-semibold text-gray-700 mb-2">No hay usuarios registrados</div>
            <div className="text-gray-500">Comienza agregando tu primer usuario al sistema</div>
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

export default UsuariosList;