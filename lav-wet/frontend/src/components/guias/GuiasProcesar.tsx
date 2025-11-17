import React, { useState, useEffect } from 'react';
import { GuiaLavanderia } from '../../types';
import { getGuiasParaProcesar, procesarGuia } from '../../services/guiaService';
import { getAllHoteles } from '../../services/hotelService';
import { getEstadosProcesamiento } from '../../services/estadoService';
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
      const hotelesData = await getAllHoteles(1, 100);
      setHoteles(hotelesData.hotels || []);
    } catch (err) {
      console.error('Error cargando datos iniciales:', err);
      toast.error('Error al cargar hoteles');
    }
  };

  const loadGuias = async (page: number = currentPage) => {
    try {
      setLoading(true);
      setError('');
      
      // Preparar filtros
      const queryFilters: any = {};
      
      if (filters.numero_guia) {
        queryFilters.numero_guia = filters.numero_guia;
      }
      
      if (filters.hotel_id) {
        queryFilters.hotel_id = filters.hotel_id;
      }

      // Obtener guías del backend (solo Registrado y Pendiente)
      const response = await getGuiasParaProcesar(page, itemsPerPage, queryFilters);
      
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
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-300">
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
  const [observaciones, setObservaciones] = useState('');
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('');
  const [estadosDisponibles, setEstadosDisponibles] = useState<any[]>([]);

  useEffect(() => {
    // Inicializar prendas procesadas con las cantidades actuales de la BD
    if (guia.prendas) {
      setPrendasProcesadas(
        guia.prendas.map(prenda => ({
          ...prenda,
          cantidad_limpia: prenda.cantidad_limpia || 0,
          cantidad_pendiente: prenda.cantidad_sucia - (prenda.cantidad_limpia || 0)
        }))
      );
    }
    
    // Cargar estados disponibles
    loadEstados();
    
    // Establecer el estado actual de la guía si tiene estado_id
    if (guia.estado_id) {
      setEstadoSeleccionado(guia.estado_id.toString());
    }
  }, [guia]);

  const loadEstados = async () => {
    try {
      const estados = await getEstadosProcesamiento();
      setEstadosDisponibles(estados);
      
      // Si la guía tiene estado_id, usarlo; sino usar el primero de la lista
      if (guia.estado_id) {
        setEstadoSeleccionado(guia.estado_id.toString());
      } else if (estados.length > 0 && !estadoSeleccionado) {
        setEstadoSeleccionado(estados[0].id_estado.toString());
      }
    } catch (error) {
      console.error('Error cargando estados:', error);
      toast.error('Error al cargar estados');
      
      // Fallback: usar estados hardcodeados si falla la carga
      const estadosFallback = [
        { id_estado: 3, nombre_estado: 'EN PROCESO' },
        { id_estado: 2, nombre_estado: 'PENDIENTE' },
        { id_estado: 4, nombre_estado: 'LISTO PARA ENTREGA' }
      ];
      setEstadosDisponibles(estadosFallback);
      
      // Usar el estado de la guía o el primero por defecto
      if (guia.estado_id) {
        setEstadoSeleccionado(guia.estado_id.toString());
      } else {
        setEstadoSeleccionado('3');
      }
    }
  };

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
    // Validar que se haya seleccionado un estado
    if (!estadoSeleccionado) {
      toast.error('Debe seleccionar un estado para la guía');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Convertir el ID seleccionado a número
      const estadoId = parseInt(estadoSeleccionado);

      // Procesar guía en el backend
      await procesarGuia(
        guia.id_guia,
        prendasProcesadas.map(p => ({
          id_detalle: p.id_detalle,
          cantidad_limpia: p.cantidad_limpia
        })),
        observaciones,
        estadoId
      );

      // Obtener el nombre del estado seleccionado
      const estadoNombre = estadosDisponibles.find(e => e.id_estado === estadoId)?.nombre_estado || 'Actualizado';
      
      toast.success(
        <div>
          <div className="font-bold text-lg">¡Guía procesada exitosamente!</div>
          <div className="text-sm mt-1">
            Guía #{guia.numero_guia} • Nuevo estado: <span className="font-semibold">{estadoNombre}</span>
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
      // Extraer el mensaje de error del response de axios
      const errorMessage = err.response?.data?.error?.message || err.message || 'Error al procesar la guía';
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
            {/* Mensaje informativo */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Ingresa la cantidad total entregada (acumulada)</p>
                  <p className="text-xs mt-1">El sistema calculará automáticamente las prendas pendientes y actualizará el estado de la guía.</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prenda
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cant. Recogida
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cant. Entregada
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pendiente
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Observaciones originales */}
          {guia.observaciones && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Observaciones de Recojo</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">{guia.observaciones}</p>
              </div>
            </div>
          )}

          {/* Selección de estado */}
          <div className="mb-6">
            <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              id="estado"
              value={estadoSeleccionado}
              onChange={(e) => setEstadoSeleccionado(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {estadosDisponibles.map(estado => (
                <option key={estado.id_estado} value={estado.id_estado}>
                  {estado.nombre_estado}
                </option>
              ))}
            </select>
          </div>

          {/* Campo para nuevas observaciones */}
          <div className="mb-6">
            <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones del Procesamiento (Opcional)
            </label>
            <textarea
              id="observaciones"
              rows={3}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Ingrese observaciones sobre el procesamiento de las prendas..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

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