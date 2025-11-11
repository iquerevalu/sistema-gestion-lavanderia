import React, { useState, useEffect } from 'react';
import { GuiaLavanderia } from '../../types';
import { getGuiasParaEntregar, marcarComoEntregada, getRecepcionistasByHotel } from '../../services/guiaService';
import { getAllHoteles } from '../../services/hotelService';
import Pagination from '../common/Pagination';
import toast from 'react-hot-toast';

const GuiasEntregar: React.FC = () => {
  const [guias, setGuias] = useState<GuiaLavanderia[]>([]);
  const [hoteles, setHoteles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedGuia, setSelectedGuia] = useState<GuiaLavanderia | null>(null);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const itemsPerPage = 10;

  // Filtros
  const [filters, setFilters] = useState({
    numero_guia: '',
    hotel_id: '',
  });

  useEffect(() => {
    loadInitialData();
  }, []);

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
      
      const queryFilters: any = {};
      
      if (filters.numero_guia) {
        queryFilters.numero_guia = filters.numero_guia;
      }
      
      if (filters.hotel_id) {
        queryFilters.hotel_id = filters.hotel_id;
      }

      const response = await getGuiasParaEntregar(page, itemsPerPage, queryFilters);
      
      setGuias(response.guias || []);
      setTotalPages(response.totalPages || 1);
      setTotalItems(response.total || 0);
      setCurrentPage(page);
      
    } catch (err: any) {
      setError(err.message || 'Error al cargar guías');
      setGuias([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1);
  };

  const handleOpenDeliveryModal = (guia: GuiaLavanderia) => {
    setSelectedGuia(guia);
    setShowDeliveryModal(true);
  };

  const handleCloseModals = () => {
    setShowDeliveryModal(false);
    setShowDetailModal(false);
    setSelectedGuia(null);
  };

  const handleDeliverySuccess = () => {
    handleCloseModals();
    loadGuias();
  };

  const getEstadoColor = () => {
    return 'bg-gray-100 text-gray-800 border border-gray-300';
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
            <h2 className="text-3xl font-bold mb-2">Entregar Guías</h2>
            <p className="text-blue-100 text-sm">
              Gestiona las entregas de guías procesadas
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
              {hoteles.map(hotel => (
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
        ) : guias.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg font-medium">No hay guías para entregar</p>
            <p className="text-gray-400 text-sm mt-2">Las guías aparecerán aquí cuando estén listas para entrega</p>
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
                          {new Date(guia.fecha_recoleccion).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getEstadoColor()}`}>
                          {guia.estado}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 text-sm font-bold">
                            {guia.prendas?.length || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleOpenDeliveryModal(guia)}
                          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-200"
                        >
                          Entregar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      {/* Modal de detalle */}
      {showDetailModal && selectedGuia && (
        <DetailModal
          guia={selectedGuia}
          onClose={handleCloseModals}
        />
      )}

      {/* Modal de entrega */}
      {showDeliveryModal && selectedGuia && (
        <DeliveryModal
          guia={selectedGuia}
          onClose={handleCloseModals}
          onSuccess={handleDeliverySuccess}
        />
      )}
    </div>
  );
};

// Modal de detalle
interface DetailModalProps {
  guia: GuiaLavanderia;
  onClose: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ guia, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-2xl">
          <h3 className="text-xl font-bold text-white">
            Detalle Guía #{guia.numero_guia}
          </h3>
          <p className="text-blue-100 text-sm mt-1">
            {guia.nombre_comercial}
          </p>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Detalle de prendas */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Detalle de Prendas</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prenda</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recogida</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entregada</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pendiente</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {guia.prendas?.map((prenda, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm text-gray-900">{prenda.nombre_prenda}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{prenda.cantidad_sucia}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">{prenda.cantidad_limpia}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                        {prenda.cantidad_sucia - prenda.cantidad_limpia}
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
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-semibold transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal de entrega
interface DeliveryModalProps {
  guia: GuiaLavanderia;
  onClose: () => void;
  onSuccess: () => void;
}

const DeliveryModal: React.FC<DeliveryModalProps> = ({ guia, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [observaciones, setObservaciones] = useState('');
  const [marcarComoEntregado, setMarcarComoEntregado] = useState(true);
  const [recepcionistas, setRecepcionistas] = useState<any[]>([]);
  const [recepcionistaSeleccionada, setRecepcionistaSeleccionada] = useState('');
  const [choferNombre, setChoferNombre] = useState('');

  useEffect(() => {
    loadRecepcionistas();
    loadChoferInfo();
  }, []);

  const loadChoferInfo = () => {
    // Obtener información del usuario logueado del localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setChoferNombre(user.nombre_completo || 'Usuario actual');
    }
  };

  const loadRecepcionistas = async () => {
    try {
      const data = await getRecepcionistasByHotel(guia.hotel_id);
      setRecepcionistas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error cargando recepcionistas:', error);
      setRecepcionistas([]);
      toast.error('Error al cargar recepcionistas');
    }
  };

  const handleSubmit = async () => {
    if (!recepcionistaSeleccionada) {
      toast.error('Debe seleccionar una recepcionista');
      return;
    }

    setLoading(true);

    try {
      await marcarComoEntregada(
        guia.id_guia,
        parseInt(recepcionistaSeleccionada),
        marcarComoEntregado,
        observaciones
      );

      const mensaje = marcarComoEntregado 
        ? '¡Guía marcada como entregada!' 
        : 'Guía mantiene estado pendiente';

      toast.success(mensaje);
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || 'Error al actualizar la guía');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-2xl">
          <h3 className="text-xl font-bold text-white">
            Entregar Guía #{guia.numero_guia}
          </h3>
          <p className="text-blue-100 text-sm mt-1">
            {guia.nombre_comercial}
          </p>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Información de participantes */}
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <label className="block text-sm font-medium text-blue-900 mb-1">
                Chofer que Entrega
              </label>
              <div className="text-base font-semibold text-blue-700">
                {choferNombre}
              </div>
            </div>

            <div>
              <label htmlFor="recepcionista" className="block text-sm font-medium text-gray-700 mb-2">
                Recepcionista que Recibe *
              </label>
              <select
                id="recepcionista"
                value={recepcionistaSeleccionada}
                onChange={(e) => setRecepcionistaSeleccionada(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Seleccione...</option>
                {recepcionistas.map(recep => (
                  <option key={recep.id_usuario} value={recep.id_usuario}>
                    {recep.nombre_completo}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Detalle de prendas */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Detalle de Prendas a Entregar</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prenda</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recogida</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entregada</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pendiente</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {guia.prendas?.map((prenda, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm text-gray-900">{prenda.nombre_prenda}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{prenda.cantidad_sucia}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">{prenda.cantidad_limpia}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                        {prenda.cantidad_sucia - prenda.cantidad_limpia}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Estado de entrega */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Estado de la Entrega *
            </label>
            <div className="space-y-3">
              <label className="flex items-start space-x-3 cursor-pointer p-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  checked={marcarComoEntregado}
                  onChange={() => setMarcarComoEntregado(true)}
                  className="mt-1 w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-semibold text-gray-900">Entregado</span>
                  <p className="text-xs text-gray-600 mt-1">
                    Todas las prendas fueron entregadas. Se registrará la fecha de entrega.
                  </p>
                </div>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer p-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  checked={!marcarComoEntregado}
                  onChange={() => setMarcarComoEntregado(false)}
                  className="mt-1 w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-semibold text-gray-900">Entregado Parcial</span>
                  <p className="text-xs text-gray-600 mt-1">
                    Se entregó pero aún quedan prendas pendientes. Se registrarán los datos sin fecha de entrega.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Observaciones */}
          <div className="mb-6">
            <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones de Entrega (Opcional)
            </label>
            <textarea
              id="observaciones"
              rows={3}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Ingrese observaciones sobre la entrega..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-4 px-6 py-4 bg-gray-50 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border-2 border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !recepcionistaSeleccionada}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Procesando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuiasEntregar;
