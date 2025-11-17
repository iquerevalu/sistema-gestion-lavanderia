import React, { useState, useEffect } from 'react';
import { GuiaLavanderia } from '../../types';
import { getGuiasTracking } from '../../services/guiaService';
import { useAuth } from '../../hooks/useAuth';
import Pagination from '../common/Pagination';
import toast from 'react-hot-toast';

const GuiasSeguimiento: React.FC = () => {
  const { user } = useAuth();
  const [guias, setGuias] = useState<GuiaLavanderia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedGuia, setSelectedGuia] = useState<GuiaLavanderia | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const itemsPerPage = 10;

  // Filtros
  const [filters, setFilters] = useState({
    numero_guia: '',
    estado: '',
    hotel_id: user?.hotel_id?.toString() || '' // Filtrar por hotel del usuario
  });

  // Estados disponibles para seguimiento
  const estadosDisponibles = [
    'REGISTRADO',
    'PENDIENTE', 
    'EN PROCESO',
    'LISTO PARA ENTREGA',
    'EN RUTA',
    'ENTREGA PARCIAL',
    'ENTREGADO'
  ];

  useEffect(() => {
    loadGuias();
  }, [currentPage, filters]);

  const loadGuias = async (page: number = currentPage) => {
    try {
      setLoading(true);
      setError('');
      
      // Preparar filtros
      const queryFilters: any = {};
      
      if (filters.numero_guia) {
        queryFilters.numero_guia = filters.numero_guia;
      }
      
      if (filters.estado) {
        queryFilters.estado = filters.estado;
      }
      
      // El hotel_id ya está en los filtros desde el useEffect inicial
      if (filters.hotel_id) {
        queryFilters.hotel_id = filters.hotel_id;
      }

      // Obtener guías del backend
      const response = await getGuiasTracking(page, itemsPerPage, queryFilters);
      
      setGuias(response.guias || []);
      setTotalPages(response.totalPages || 1);
      setTotalItems(response.total || 0);
      setCurrentPage(page);
      
      /* DATOS MOCK ELIMINADOS - Ahora usa datos reales
      const guiasEstaticas = [
        {
          id_guia: 1,
          numero_guia: 1001,
          hotel_id: 1,
          chofer_recojo_id: 10,
          chofer_entrega_id: 11,
          recepcionista_recojo_id: 5,
          recepcionista_entrega_id: 6,
          nombre_comercial: 'Hotel Plaza',
          fecha_recoleccion: '2024-11-01',
          fecha_entrega: '2024-11-03',
          fecha_creacion: '2024-11-01T08:00:00Z',
          fecha_actualizacion: '2024-11-03T16:30:00Z',
          estado: 'Entregado' as const,
          observaciones: 'Entrega completada sin observaciones',
          chofer_recojo_nombre: 'Carlos Mendoza',
          chofer_entrega_nombre: 'Luis Rodriguez',
          recepcionista_recojo_nombre: 'Ana García',
          recepcionista_entrega_nombre: 'María López',
          prendas: [
            {
              id_detalle: 1,
              guia_id: 1,
              hotel_prenda_id: 1,
              nombre_prenda: 'Sábana Individual',
              cantidad_sucia: 15,
              cantidad_limpia: 15,
              es_devuelta: false,
              precio_unitario: 5.00
            },
            {
              id_detalle: 2,
              guia_id: 1,
              hotel_prenda_id: 2,
              nombre_prenda: 'Sábana Matrimonial',
              cantidad_sucia: 8,
              cantidad_limpia: 8,
              es_devuelta: false,
              precio_unitario: 8.00
            },
            {
              id_detalle: 3,
              guia_id: 1,
              hotel_prenda_id: 4,
              nombre_prenda: 'Funda de Almohada',
              cantidad_sucia: 25,
              cantidad_limpia: 25,
              es_devuelta: false,
              precio_unitario: 2.50
            }
          ],
          historial: [
            {
              id_historial: 1,
              guia_id: 1,
              estado_anterior: undefined,
              estado_nuevo: 'Registrado',
              usuario_id: 5,
              fecha_cambio: '2024-11-01T08:00:00Z',
              observaciones: 'Guía registrada por recepcionista',
              nombre_usuario: 'Ana García'
            },
            {
              id_historial: 2,
              guia_id: 1,
              estado_anterior: 'Registrado',
              estado_nuevo: 'Procesandose',
              usuario_id: 15,
              fecha_cambio: '2024-11-02T10:30:00Z',
              observaciones: 'Iniciado procesamiento en lavandería',
              nombre_usuario: 'Pedro Operario'
            },
            {
              id_historial: 3,
              guia_id: 1,
              estado_anterior: 'Procesandose',
              estado_nuevo: 'Lista para Entregar',
              usuario_id: 15,
              fecha_cambio: '2024-11-02T16:00:00Z',
              observaciones: 'Procesamiento completado',
              nombre_usuario: 'Pedro Operario'
            },
            {
              id_historial: 4,
              guia_id: 1,
              estado_anterior: 'Lista para Entregar',
              estado_nuevo: 'En Ruta',
              usuario_id: 11,
              fecha_cambio: '2024-11-03T09:00:00Z',
              observaciones: 'Salida para entrega',
              nombre_usuario: 'Luis Rodriguez'
            },
            {
              id_historial: 5,
              guia_id: 1,
              estado_anterior: 'En Ruta',
              estado_nuevo: 'Entregado',
              usuario_id: 6,
              fecha_cambio: '2024-11-03T16:30:00Z',
              observaciones: 'Entrega confirmada por recepcionista',
              nombre_usuario: 'María López'
            }
          ]
        },
        {
          id_guia: 2,
          numero_guia: 1002,
          hotel_id: 1,
          chofer_recojo_id: 11,
          recepcionista_recojo_id: 5,
          nombre_comercial: 'Hotel Plaza',
          fecha_recoleccion: '2024-11-02',
          fecha_creacion: '2024-11-02T09:30:00Z',
          fecha_actualizacion: '2024-11-02T14:15:00Z',
          estado: 'En Ruta' as const,
          observaciones: 'En camino para entrega',
          chofer_recojo_nombre: 'Luis Rodriguez',
          chofer_entrega_nombre: 'Carlos Mendoza',
          recepcionista_recojo_nombre: 'Ana García',
          prendas: [
            {
              id_detalle: 6,
              guia_id: 2,
              hotel_prenda_id: 2,
              nombre_prenda: 'Sábana Matrimonial',
              cantidad_sucia: 10,
              cantidad_limpia: 10,
              es_devuelta: false,
              precio_unitario: 8.00
            },
            {
              id_detalle: 7,
              guia_id: 2,
              hotel_prenda_id: 17,
              nombre_prenda: 'Toalla de Baño',
              cantidad_sucia: 20,
              cantidad_limpia: 20,
              es_devuelta: false,
              precio_unitario: 6.00
            }
          ],
          historial: [
            {
              id_historial: 6,
              guia_id: 2,
              estado_anterior: undefined,
              estado_nuevo: 'Registrado',
              usuario_id: 5,
              fecha_cambio: '2024-11-02T09:30:00Z',
              observaciones: 'Guía registrada',
              nombre_usuario: 'Ana García'
            },
            {
              id_historial: 7,
              guia_id: 2,
              estado_anterior: 'Registrado',
              estado_nuevo: 'Lista para Entregar',
              usuario_id: 15,
              fecha_cambio: '2024-11-02T14:15:00Z',
              observaciones: 'Procesamiento completado',
              nombre_usuario: 'Pedro Operario'
            },
            {
              id_historial: 8,
              guia_id: 2,
              estado_anterior: 'Lista para Entregar',
              estado_nuevo: 'En Ruta',
              usuario_id: 10,
              fecha_cambio: '2024-11-03T08:00:00Z',
              observaciones: 'Salida para entrega',
              nombre_usuario: 'Carlos Mendoza'
            }
          ]
        },
        {
          id_guia: 3,
          numero_guia: 1003,
          hotel_id: 1,
          chofer_recojo_id: 12,
          recepcionista_recojo_id: 5,
          nombre_comercial: 'Hotel Plaza',
          fecha_recoleccion: '2024-11-03',
          fecha_creacion: '2024-11-03T16:45:00Z',
          fecha_actualizacion: '2024-11-03T18:20:00Z',
          estado: 'Lista para Entregar' as const,
          observaciones: 'Listo para recoger',
          chofer_recojo_nombre: 'Miguel Torres',
          recepcionista_recojo_nombre: 'Ana García',
          prendas: [
            {
              id_detalle: 9,
              guia_id: 3,
              hotel_prenda_id: 3,
              nombre_prenda: 'Sábana King Size',
              cantidad_sucia: 6,
              cantidad_limpia: 6,
              es_devuelta: false,
              precio_unitario: 12.00
            },
            {
              id_detalle: 10,
              guia_id: 3,
              hotel_prenda_id: 13,
              nombre_prenda: 'Edredón Matrimonial',
              cantidad_sucia: 4,
              cantidad_limpia: 4,
              es_devuelta: false,
              precio_unitario: 25.00
            }
          ],
          historial: [
            {
              id_historial: 9,
              guia_id: 3,
              estado_anterior: undefined,
              estado_nuevo: 'Registrado',
              usuario_id: 5,
              fecha_cambio: '2024-11-03T16:45:00Z',
              observaciones: 'Guía registrada',
              nombre_usuario: 'Ana García'
            },
            {
              id_historial: 10,
              guia_id: 3,
              estado_anterior: 'Registrado',
              estado_nuevo: 'Procesandose',
              usuario_id: 15,
              fecha_cambio: '2024-11-03T17:30:00Z',
              observaciones: 'Iniciado procesamiento',
              nombre_usuario: 'Pedro Operario'
            },
            {
              id_historial: 11,
              guia_id: 3,
              estado_anterior: 'Procesandose',
              estado_nuevo: 'Lista para Entregar',
              usuario_id: 15,
              fecha_cambio: '2024-11-03T18:20:00Z',
              observaciones: 'Procesamiento completado',
              nombre_usuario: 'Pedro Operario'
            }
          ]
        },
        {
          id_guia: 4,
          numero_guia: 1004,
          hotel_id: 1,
          chofer_recojo_id: 10,
          recepcionista_recojo_id: 5,
          nombre_comercial: 'Hotel Plaza',
          fecha_recoleccion: '2024-11-04',
          fecha_creacion: '2024-11-04T11:20:00Z',
          fecha_actualizacion: '2024-11-04T14:45:00Z',
          estado: 'Procesandose' as const,
          observaciones: 'En proceso de lavado',
          chofer_recojo_nombre: 'Carlos Mendoza',
          recepcionista_recojo_nombre: 'Ana García',
          prendas: [
            {
              id_detalle: 12,
              guia_id: 4,
              hotel_prenda_id: 1,
              nombre_prenda: 'Sábana Individual',
              cantidad_sucia: 20,
              cantidad_limpia: 15,
              es_devuelta: false,
              precio_unitario: 5.00
            },
            {
              id_detalle: 13,
              guia_id: 4,
              hotel_prenda_id: 17,
              nombre_prenda: 'Toalla de Baño',
              cantidad_sucia: 12,
              cantidad_limpia: 12,
              es_devuelta: false,
              precio_unitario: 6.00
            }
          ],
          historial: [
            {
              id_historial: 12,
              guia_id: 4,
              estado_anterior: undefined,
              estado_nuevo: 'Registrado',
              usuario_id: 5,
              fecha_cambio: '2024-11-04T11:20:00Z',
              observaciones: 'Guía registrada',
              nombre_usuario: 'Ana García'
            },
            {
              id_historial: 13,
              guia_id: 4,
              estado_anterior: 'Registrado',
              estado_nuevo: 'Procesandose',
              usuario_id: 15,
              fecha_cambio: '2024-11-04T14:45:00Z',
              observaciones: 'Iniciado procesamiento',
              nombre_usuario: 'Pedro Operario'
            }
          ]
        },
        {
          id_guia: 5,
          numero_guia: 1005,
          hotel_id: 1,
          chofer_recojo_id: 11,
          recepcionista_recojo_id: 5,
          nombre_comercial: 'Hotel Plaza',
          fecha_recoleccion: '2024-11-04',
          fecha_creacion: '2024-11-04T13:10:00Z',
          fecha_actualizacion: '2024-11-04T15:30:00Z',
          estado: 'Pendiente' as const,
          observaciones: 'Algunas prendas requieren tratamiento especial',
          chofer_recojo_nombre: 'Luis Rodriguez',
          recepcionista_recojo_nombre: 'Ana García',
          prendas: [
            {
              id_detalle: 14,
              guia_id: 5,
              hotel_prenda_id: 2,
              nombre_prenda: 'Sábana Matrimonial',
              cantidad_sucia: 12,
              cantidad_limpia: 10,
              es_devuelta: false,
              precio_unitario: 8.00
            },
            {
              id_detalle: 15,
              guia_id: 5,
              hotel_prenda_id: 22,
              nombre_prenda: 'Cortina de Baño',
              cantidad_sucia: 8,
              cantidad_limpia: 6,
              es_devuelta: false,
              precio_unitario: 12.00
            }
          ],
          historial: [
            {
              id_historial: 14,
              guia_id: 5,
              estado_anterior: undefined,
              estado_nuevo: 'Registrado',
              usuario_id: 5,
              fecha_cambio: '2024-11-04T13:10:00Z',
              observaciones: 'Guía registrada',
              nombre_usuario: 'Ana García'
            },
            {
              id_historial: 15,
              guia_id: 5,
              estado_anterior: 'Registrado',
              estado_nuevo: 'Pendiente',
              usuario_id: 15,
              fecha_cambio: '2024-11-04T15:30:00Z',
              observaciones: 'Algunas prendas requieren tratamiento especial',
              nombre_usuario: 'Pedro Operario'
            }
          ]
        },
        {
          id_guia: 6,
          numero_guia: 1006,
          hotel_id: 1,
          chofer_recojo_id: 12,
          recepcionista_recojo_id: 5,
          nombre_comercial: 'Hotel Plaza',
          fecha_recoleccion: '2024-11-05',
          fecha_creacion: '2024-11-05T10:15:00Z',
          fecha_actualizacion: '2024-11-05T10:15:00Z',
          estado: 'Registrado' as const,
          observaciones: 'Recolección matutina',
          chofer_recojo_nombre: 'Miguel Torres',
          recepcionista_recojo_nombre: 'Ana García',
          prendas: [
            {
              id_detalle: 16,
              guia_id: 6,
              hotel_prenda_id: 4,
              nombre_prenda: 'Funda de Almohada',
              cantidad_sucia: 30,
              cantidad_limpia: 0,
              es_devuelta: false,
              precio_unitario: 2.50
            },
            {
              id_detalle: 17,
              guia_id: 6,
              hotel_prenda_id: 18,
              nombre_prenda: 'Toalla de Mano',
              cantidad_sucia: 25,
              cantidad_limpia: 0,
              es_devuelta: false,
              precio_unitario: 3.50
            }
          ],
          historial: [
            {
              id_historial: 16,
              guia_id: 6,
              estado_anterior: undefined,
              estado_nuevo: 'Registrado',
              usuario_id: 5,
              fecha_cambio: '2024-11-05T10:15:00Z',
              observaciones: 'Guía registrada',
              nombre_usuario: 'Ana García'
            }
          ]
        }
      ]; */
      
    } catch (err: any) {
      setError(err.message || 'Error al cargar guías');
      setGuias([]);
      toast.error('Error al cargar guías');
      console.error('Error cargando guías:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1);
  };

  const openDetailModal = (guia: GuiaLavanderia) => {
    setSelectedGuia(guia);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setSelectedGuia(null);
    setShowDetailModal(false);
  };

  const getEstadoColor = (estado: string) => {
    return 'bg-gray-100 text-gray-800 border border-gray-300';
  };

  const getEstadoIcon = (estado: string) => {
    const estadoUpper = estado.toUpperCase();
    switch (estadoUpper) {
      case 'REGISTRADO':
        return '📝';
      case 'PENDIENTE':
        return '⏳';
      case 'EN PROCESO':
        return '🔄';
      case 'LISTO PARA ENTREGA':
        return '✅';
      case 'EN RUTA':
        return '🚚';
      case 'ENTREGA PARCIAL':
        return '📦';
      case 'ENTREGADO':
        return '✅';
      default:
        return '❓';
    }
  };

  const getProgreso = (estado: string) => {
    const estados = ['REGISTRADO', 'PENDIENTE', 'EN PROCESO', 'LISTO PARA ENTREGA', 'EN RUTA', 'ENTREGA PARCIAL', 'ENTREGADO'];
    const index = estados.indexOf(estado.toUpperCase());
    return index >= 0 ? ((index + 1) / estados.length) * 100 : 0;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6" style={{ 
        background: 'linear-gradient(135deg, #000080 0%, #1e40af 100%)',
        color: 'white'
      }}>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">Seguimiento de Guías</h2>
            <p className="text-blue-100 text-sm">
              Monitorea el estado y progreso de las guías de tu hotel
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-200">Hotel</div>
            <div className="text-xl font-bold">{user?.nombre_comercial}</div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="numero_guia" className="block text-sm font-medium text-gray-700 mb-1">
              Número de Guía
            </label>
            <input
              type="text"
              id="numero_guia"
              name="numero_guia"
              value={filters.numero_guia}
              onChange={handleFilterChange}
              placeholder="Ej: 123"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              id="estado"
              name="estado"
              value={filters.estado}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los estados</option>
              {estadosDisponibles.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => loadGuias(1)}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-md font-medium transition-all duration-300"
            >
              Buscar
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-lg p-4 shadow-sm">
          <div className="flex items-center">
            <span className="text-red-500 mr-2">⚠️</span>
            <div className="text-sm text-red-700 font-medium">{error}</div>
          </div>
        </div>
      )}

      {/* Vista de Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : guias.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <div className="text-xl font-semibold text-gray-700 mb-2">No hay guías registradas</div>
            <div className="text-gray-500">
              No se encontraron guías para tu hotel
            </div>
          </div>
        ) : (
          guias.map((guia) => (
            <div 
              key={guia.id_guia}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-200 overflow-hidden"
            >
              {/* Header de la tarjeta */}
              <div className="bg-gradient-to-r from-slate-600 to-slate-700 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-white">
                    <h3 className="font-bold text-lg">Guía #{guia.numero_guia}</h3>
                    <p className="text-slate-200 text-sm">
                      {new Date(guia.fecha_recoleccion).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-3xl">
                    {getEstadoIcon(guia.estado)}
                  </div>
                </div>
              </div>

              {/* Contenido de la tarjeta */}
              <div className="p-4">
                {/* Estado y progreso */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Estado actual</span>
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full shadow-sm ${getEstadoColor(guia.estado)}`}>
                      {guia.estado}
                    </span>
                  </div>
                  
                  {/* Barra de progreso */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${getProgreso(guia.estado)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Progreso: {Math.round(getProgreso(guia.estado))}%
                  </div>
                </div>

                {/* Información adicional */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Chofer:</span>
                    <span className="font-medium">{guia.chofer_recojo_nombre}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Prendas:</span>
                    <span className="font-medium">{guia.prendas?.length || 0} tipos</span>
                  </div>
                  {guia.fecha_entrega && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Entrega:</span>
                      <span className="font-medium">
                        {new Date(guia.fecha_entrega).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Botón de acción */}
                <button
                  onClick={() => openDetailModal(guia)}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Ver Detalle
                </button>
              </div>
            </div>
          ))
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

      {/* Modal de Detalle */}
      {showDetailModal && selectedGuia && (
        <DetailModal 
          guia={selectedGuia} 
          onClose={closeDetailModal}
          onRefresh={closeDetailModal}
        />
      )}
    </div>
  );
};

// Componente Modal para ver detalle
interface DetailModalProps {
  guia: GuiaLavanderia;
  onClose: () => void;
  onRefresh: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ guia, onClose, onRefresh }) => {
  const getEstadoColor = (estado: string) => {
    return 'bg-gray-100 text-gray-800 border border-gray-300';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl transform transition-all">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Detalle de Guía #{guia.numero_guia}
              </h3>
              <p className="text-gray-600">
                {guia.nombre_comercial} - {new Date(guia.fecha_recoleccion).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-all duration-300 hover:bg-gray-100 rounded-full p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Información General */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Información General</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(guia.estado)}`}>
                    {guia.estado}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha Recolección:</span>
                  <span className="font-medium">{new Date(guia.fecha_recoleccion).toLocaleDateString()}</span>
                </div>
                {guia.fecha_entrega && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fecha Entrega:</span>
                    <span className="font-medium">{new Date(guia.fecha_entrega).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Chofer Recojo:</span>
                  <span className="font-medium">{guia.chofer_recojo_nombre}</span>
                </div>
                {guia.chofer_entrega_nombre && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Chofer Entrega:</span>
                    <span className="font-medium">{guia.chofer_entrega_nombre}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Personal</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Recepcionista Recojo:</span>
                  <span className="font-medium">{guia.recepcionista_recojo_nombre}</span>
                </div>
                {guia.recepcionista_entrega_nombre && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Recepcionista Entrega:</span>
                    <span className="font-medium">{guia.recepcionista_entrega_nombre}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Detalle de Prendas */}
          {guia.prendas && guia.prendas.length > 0 && (
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Detalle de Prendas</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prenda
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cant. Sucia
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cant. Limpia
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {guia.prendas.map((prenda, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {prenda.nombre_prenda}
                          </div>
                          {prenda.es_devuelta && (
                            <div className="text-xs text-red-600 font-medium">
                              DEVUELTA
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {prenda.cantidad_sucia}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {prenda.cantidad_limpia || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                            (prenda.cantidad_limpia || 0) >= prenda.cantidad_sucia
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {(prenda.cantidad_limpia || 0) >= prenda.cantidad_sucia ? 'Completo' : 'Pendiente'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Observaciones */}
          {guia.observaciones && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Observaciones</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">{guia.observaciones}</p>
              </div>
            </div>
          )}

          {/* Historial */}
          {guia.historial && guia.historial.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Historial de Estados</h4>
              <div className="space-y-3">
                {guia.historial.map((historial, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(historial.estado_nuevo)}`}>
                        {historial.estado_nuevo}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {historial.nombre_usuario}
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(historial.fecha_cambio).toLocaleString()}
                      </div>
                      {historial.observaciones && (
                        <div className="text-sm text-gray-700 mt-1">
                          {historial.observaciones}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botón Cerrar */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuiasSeguimiento;