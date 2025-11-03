import React, { useState, useEffect } from 'react';
import { GuiaLavanderia } from '../../types';
// import { getAllGuias, updateGuia } from '../../services/guiaService';
// import { getAllHoteles } from '../../services/hotelService';
import Pagination from '../common/Pagination';
import toast from 'react-hot-toast';

const GuiasProcesar: React.FC = () => {
  const [guias, setGuias] = useState<GuiaLavanderia[]>([]);
  const [hoteles, setHoteles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedGuia, setSelectedGuia] = useState<GuiaLavanderia | null>(null);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const itemsPerPage = 10;

  // Filtros
  const [filters, setFilters] = useState({
    numero_guia: '',
    hotel_id: '',
    estado: 'Registrado,Pendiente' // Solo mostrar estos estados
  });

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  // Cargar guías cuando cambian los filtros
  useEffect(() => {
    loadGuias();
  }, [currentPage, filters]);

  const loadInitialData = async () => {
    try {
      // Datos estáticos de hoteles para demostración
      const hotelesEstaticos = [
        { id_hotel: 1, nombre_comercial: 'Hotel Plaza', razon_social: 'Hotel Plaza SAC' },
        { id_hotel: 2, nombre_comercial: 'Hotel Ejecutivo', razon_social: 'Hotel Ejecutivo EIRL' },
        { id_hotel: 3, nombre_comercial: 'Hotel Boutique', razon_social: 'Boutique Hotels SA' },
        { id_hotel: 4, nombre_comercial: 'Hotel Marriott', razon_social: 'Marriott International' },
        { id_hotel: 5, nombre_comercial: 'Hotel Hilton', razon_social: 'Hilton Hotels Corp' }
      ];
      setHoteles(hotelesEstaticos);
    } catch (err) {
      console.error('Error cargando datos iniciales:', err);
    }
  };

  const loadGuias = async (page: number = currentPage) => {
    try {
      setLoading(true);
      setError('');
      
      // Datos estáticos de guías para demostración
      const guiasEstaticas = [
        {
          id_guia: 1,
          numero_guia: 1001,
          hotel_id: 1,
          chofer_recojo_id: 10,
          recepcionista_recojo_id: 5,
          nombre_comercial: 'Hotel Plaza',
          fecha_recoleccion: '2024-11-01',
          fecha_creacion: '2024-11-01T08:00:00Z',
          fecha_actualizacion: '2024-11-01T08:00:00Z',
          estado: 'Registrado' as const,
          observaciones: 'Recolección normal, sin observaciones especiales',
          chofer_recojo_nombre: 'Carlos Mendoza',
          recepcionista_recojo_nombre: 'Ana García',
          prendas: [
            {
              id_detalle: 1,
              guia_id: 1,
              hotel_prenda_id: 1,
              nombre_prenda: 'Sábana Individual',
              cantidad_sucia: 15,
              cantidad_limpia: 0,
              es_devuelta: false,
              precio_unitario: 5.00
            },
            {
              id_detalle: 2,
              guia_id: 1,
              hotel_prenda_id: 2,
              nombre_prenda: 'Sábana Matrimonial',
              cantidad_sucia: 8,
              cantidad_limpia: 0,
              es_devuelta: false,
              precio_unitario: 8.00
            },
            {
              id_detalle: 3,
              guia_id: 1,
              hotel_prenda_id: 4,
              nombre_prenda: 'Funda de Almohada',
              cantidad_sucia: 25,
              cantidad_limpia: 0,
              es_devuelta: false,
              precio_unitario: 2.50
            },
            {
              id_detalle: 4,
              guia_id: 1,
              hotel_prenda_id: 17,
              nombre_prenda: 'Toalla de Baño',
              cantidad_sucia: 12,
              cantidad_limpia: 0,
              es_devuelta: false,
              precio_unitario: 6.00
            }
          ]
        },
        {
          id_guia: 2,
          numero_guia: 1002,
          hotel_id: 2,
          chofer_recojo_id: 11,
          recepcionista_recojo_id: 6,
          nombre_comercial: 'Hotel Ejecutivo',
          fecha_recoleccion: '2024-11-01',
          fecha_creacion: '2024-11-01T09:30:00Z',
          fecha_actualizacion: '2024-11-01T14:15:00Z',
          estado: 'Pendiente' as const,
          observaciones: 'Algunas toallas con manchas difíciles',
          chofer_recojo_nombre: 'Luis Rodriguez',
          recepcionista_recojo_nombre: 'María López',
          prendas: [
            {
              id_detalle: 5,
              guia_id: 2,
              hotel_prenda_id: 2,
              nombre_prenda: 'Sábana Matrimonial',
              cantidad_sucia: 10,
              cantidad_limpia: 8,
              es_devuelta: false,
              precio_unitario: 8.00
            },
            {
              id_detalle: 6,
              guia_id: 2,
              hotel_prenda_id: 17,
              nombre_prenda: 'Toalla de Baño',
              cantidad_sucia: 20,
              cantidad_limpia: 18,
              es_devuelta: false,
              precio_unitario: 6.00
            },
            {
              id_detalle: 7,
              guia_id: 2,
              hotel_prenda_id: 18,
              nombre_prenda: 'Toalla de Mano',
              cantidad_sucia: 15,
              cantidad_limpia: 15,
              es_devuelta: false,
              precio_unitario: 3.50
            }
          ]
        },
        {
          id_guia: 3,
          numero_guia: 1003,
          hotel_id: 3,
          chofer_recojo_id: 12,
          recepcionista_recojo_id: 7,
          nombre_comercial: 'Hotel Boutique',
          fecha_recoleccion: '2024-10-31',
          fecha_creacion: '2024-10-31T16:45:00Z',
          fecha_actualizacion: '2024-10-31T16:45:00Z',
          estado: 'Registrado' as const,
          observaciones: undefined,
          chofer_recojo_nombre: 'Miguel Torres',
          recepcionista_recojo_nombre: 'Carmen Silva',
          prendas: [
            {
              id_detalle: 8,
              guia_id: 3,
              hotel_prenda_id: 3,
              nombre_prenda: 'Sábana King Size',
              cantidad_sucia: 6,
              cantidad_limpia: 0,
              es_devuelta: false,
              precio_unitario: 12.00
            },
            {
              id_detalle: 9,
              guia_id: 3,
              hotel_prenda_id: 13,
              nombre_prenda: 'Edredón Matrimonial',
              cantidad_sucia: 4,
              cantidad_limpia: 0,
              es_devuelta: false,
              precio_unitario: 25.00
            },
            {
              id_detalle: 10,
              guia_id: 3,
              hotel_prenda_id: 21,
              nombre_prenda: 'Toallón',
              cantidad_sucia: 8,
              cantidad_limpia: 0,
              es_devuelta: false,
              precio_unitario: 10.00
            }
          ]
        },
        {
          id_guia: 4,
          numero_guia: 1004,
          hotel_id: 4,
          chofer_recojo_id: 10,
          recepcionista_recojo_id: 8,
          nombre_comercial: 'Hotel Marriott',
          fecha_recoleccion: '2024-10-30',
          fecha_creacion: '2024-10-30T11:20:00Z',
          fecha_actualizacion: '2024-10-30T15:30:00Z',
          estado: 'Pendiente' as const,
          observaciones: 'Prenda devuelta por daño previo',
          chofer_recojo_nombre: 'Carlos Mendoza',
          recepcionista_recojo_nombre: 'Roberto Díaz',
          prendas: [
            {
              id_detalle: 11,
              guia_id: 4,
              hotel_prenda_id: 1,
              nombre_prenda: 'Sábana Individual',
              cantidad_sucia: 20,
              cantidad_limpia: 18,
              es_devuelta: false,
              precio_unitario: 5.00
            },
            {
              id_detalle: 12,
              guia_id: 4,
              hotel_prenda_id: 6,
              nombre_prenda: 'Cobertor Individual',
              cantidad_sucia: 5,
              cantidad_limpia: 4,
              es_devuelta: false,
              precio_unitario: 12.00
            },
            {
              id_detalle: 13,
              guia_id: 4,
              hotel_prenda_id: 17,
              nombre_prenda: 'Toalla de Baño',
              cantidad_sucia: 1,
              cantidad_limpia: 0,
              es_devuelta: true,
              precio_unitario: 6.00
            }
          ]
        },
        {
          id_guia: 5,
          numero_guia: 1005,
          hotel_id: 5,
          chofer_recojo_id: 11,
          recepcionista_recojo_id: 9,
          nombre_comercial: 'Hotel Hilton',
          fecha_recoleccion: '2024-10-29',
          fecha_creacion: '2024-10-29T13:10:00Z',
          fecha_actualizacion: '2024-10-29T13:10:00Z',
          estado: 'Registrado' as const,
          observaciones: 'Recolección de fin de semana',
          chofer_recojo_nombre: 'Luis Rodriguez',
          recepcionista_recojo_nombre: 'Patricia Vega',
          prendas: [
            {
              id_detalle: 14,
              guia_id: 5,
              hotel_prenda_id: 2,
              nombre_prenda: 'Sábana Matrimonial',
              cantidad_sucia: 12,
              cantidad_limpia: 0,
              es_devuelta: false,
              precio_unitario: 8.00
            },
            {
              id_detalle: 15,
              guia_id: 5,
              hotel_prenda_id: 4,
              nombre_prenda: 'Funda de Almohada',
              cantidad_sucia: 30,
              cantidad_limpia: 0,
              es_devuelta: false,
              precio_unitario: 2.50
            },
            {
              id_detalle: 16,
              guia_id: 5,
              hotel_prenda_id: 22,
              nombre_prenda: 'Cortina de Baño',
              cantidad_sucia: 8,
              cantidad_limpia: 0,
              es_devuelta: false,
              precio_unitario: 12.00
            }
          ]
        }
      ];

      // Aplicar filtros
      let guiasFiltradas = guiasEstaticas;
      
      if (filters.numero_guia) {
        guiasFiltradas = guiasFiltradas.filter(g => 
          g.numero_guia.toString().includes(filters.numero_guia)
        );
      }
      
      if (filters.hotel_id) {
        guiasFiltradas = guiasFiltradas.filter(g => 
          g.hotel_id.toString() === filters.hotel_id
        );
      }

      // Solo mostrar estados Registrado y Pendiente
      guiasFiltradas = guiasFiltradas.filter(g => 
        ['Registrado', 'Pendiente'].includes(g.estado)
      );

      // Simular paginación
      const totalItems = guiasFiltradas.length;
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const guiasPaginadas = guiasFiltradas.slice(startIndex, endIndex);

      setGuias(guiasPaginadas);
      setTotalPages(totalPages);
      setTotalItems(totalItems);
      setCurrentPage(page);
      
    } catch (err: any) {
      setError(err.message || 'Error al cargar guías');
      setGuias([]);
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
    setCurrentPage(1); // Reset a la primera página
  };

  const openProcessModal = (guia: GuiaLavanderia) => {
    setSelectedGuia(guia);
    setShowProcessModal(true);
  };

  const closeProcessModal = () => {
    setSelectedGuia(null);
    setShowProcessModal(false);
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Registrado':
        return 'bg-gray-100 text-gray-800 border border-gray-300';
      case 'Pendiente':
        return 'bg-gray-100 text-gray-800 border border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
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
            <h2 className="text-3xl font-bold mb-2">Procesar Guías</h2>
            <p className="text-blue-100 text-sm">
              Gestiona las guías registradas y pendientes para procesamiento
            </p>
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
            <label htmlFor="hotel_id" className="block text-sm font-medium text-gray-700 mb-1">
              Hotel
            </label>
            <select
              id="hotel_id"
              name="hotel_id"
              value={filters.hotel_id}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los hoteles</option>
              {hoteles.map((hotel) => (
                <option key={hotel.id_hotel} value={hotel.id_hotel}>
                  {hotel.nombre_comercial}
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

      {/* Tabla de guías */}
      <div className="bg-white shadow-xl overflow-hidden rounded-xl border border-slate-200">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
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
                      Prendas
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
                          {guia.prendas?.length || 0} tipos
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button 
                            onClick={() => openProcessModal(guia)}
                            className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 p-2 rounded-lg transition-all duration-200"
                            title="Procesar guía"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
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
                <div className="text-xl font-semibold text-gray-700 mb-2">No hay guías para procesar</div>
                <div className="text-gray-500">
                  No se encontraron guías registradas o pendientes
                </div>
              </div>
            )}
          </>
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

      {/* Modal de Procesamiento */}
      {showProcessModal && selectedGuia && (
        <ProcessModal 
          guia={selectedGuia} 
          onClose={closeProcessModal}
          onSuccess={() => {
            closeProcessModal();
            loadGuias(currentPage);
          }}
        />
      )}
    </div>
  );
};

// Componente Modal para procesar guía
interface ProcessModalProps {
  guia: GuiaLavanderia;
  onClose: () => void;
  onSuccess: () => void;
}

const ProcessModal: React.FC<ProcessModalProps> = ({ guia, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [prendasProcesadas, setPrendasProcesadas] = useState<any[]>([]);

  useEffect(() => {
    // Inicializar prendas procesadas con las cantidades originales
    if (guia.prendas) {
      setPrendasProcesadas(
        guia.prendas.map(prenda => ({
          ...prenda,
          cantidad_limpia: 0,
          cantidad_pendiente: prenda.cantidad_sucia
        }))
      );
    }
  }, [guia]);

  const actualizarCantidadLimpia = (index: number, cantidadLimpia: number) => {
    setPrendasProcesadas(prev => {
      const nuevas = [...prev];
      const cantidadSucia = nuevas[index].cantidad_sucia;
      const cantidadPendiente = Math.max(0, cantidadSucia - cantidadLimpia);
      
      nuevas[index] = {
        ...nuevas[index],
        cantidad_limpia: Math.max(0, Math.min(cantidadLimpia, cantidadSucia)),
        cantidad_pendiente: cantidadPendiente
      };
      
      return nuevas;
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      // Determinar nuevo estado basado en si hay prendas pendientes
      const hayPendientes = prendasProcesadas.some(p => p.cantidad_pendiente > 0);
      const nuevoEstado = hayPendientes ? 'Pendiente' : 'Lista para Entregar';

      // Simular guardado exitoso
      console.log('Procesando guía:', {
        id_guia: guia.id_guia,
        estado: nuevoEstado,
        prendas: prendasProcesadas.map(p => ({
          id_detalle: p.id_detalle,
          cantidad_limpia: p.cantidad_limpia,
          cantidad_pendiente: p.cantidad_pendiente
        }))
      });

      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success(
        <div>
          <div className="font-bold text-lg">¡Guía procesada exitosamente!</div>
          <div className="text-sm mt-1">
            Guía #{guia.numero_guia} • Nuevo estado: <span className="font-semibold">{nuevoEstado}</span>
          </div>
        </div>,
        {
          duration: 4000,
          position: 'top-center',
          style: {
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            fontWeight: '500',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            minWidth: '320px',
            padding: '16px 20px'
          },
          iconTheme: {
            primary: 'white',
            secondary: '#10b981'
          }
        }
      );
      
      onSuccess();
    } catch (err: any) {
      const errorMessage = err.message || 'Error al procesar la guía';
      setError(errorMessage);
      
      toast.error(
        <div>
          <div className="font-bold text-lg">Error al procesar</div>
          <div className="text-sm mt-1">{errorMessage}</div>
        </div>,
        {
          duration: 5000,
          position: 'top-center',
          style: {
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
            fontWeight: '500',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(239, 68, 68, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            minWidth: '320px',
            padding: '16px 20px'
          },
          iconTheme: {
            primary: 'white',
            secondary: '#ef4444'
          }
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl transform transition-all">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Procesar Guía #{guia.numero_guia}
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

          {/* Error */}
          {error && (
            <div className="mb-6 bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <span className="text-red-500 mr-2">⚠️</span>
                <div className="text-sm text-red-700 font-medium">{error}</div>
              </div>
            </div>
          )}

          {/* Tabla de prendas */}
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
                      Pendiente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {prendasProcesadas.map((prenda, index) => (
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          min="0"
                          max={prenda.cantidad_sucia}
                          value={prenda.cantidad_limpia}
                          onChange={(e) => actualizarCantidadLimpia(index, parseInt(e.target.value) || 0)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {prenda.cantidad_pendiente}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                          prenda.cantidad_pendiente > 0 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {prenda.cantidad_pendiente > 0 ? 'Pendiente' : 'Completo'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Observaciones */}
          {guia.observaciones && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Observaciones</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">{guia.observaciones}</p>
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg text-sm font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </span>
              ) : (
                'Procesar Guía'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuiasProcesar;