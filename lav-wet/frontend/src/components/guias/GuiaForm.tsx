import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { 
  createGuia, 
  getNextGuiaNumber
} from '../../services/guiaService';

interface PrendaDetalle {
  prenda_id: number;
  nombre_prenda: string;
  cantidad_sucia: number;
  es_devuelta: boolean;
}

const GuiaForm: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    hotel_id: '',
    fecha_recoleccion: new Date().toISOString().split('T')[0],
    chofer_recojo_id: '',
    observaciones: ''
  });
  
  // Estados para datos auxiliares
  const [hoteles, setHoteles] = useState<any[]>([]);
  const [choferes, setChoferes] = useState<any[]>([]);
  const [prendas, setPrendas] = useState<any[]>([]);
  const [numeroGuia, setNumeroGuia] = useState<number>(1);
  const [filteredPrendas, setFilteredPrendas] = useState<any[]>([]);
  
  // Estado para el detalle de prendas
  const [prendasDetalle, setPrendasDetalle] = useState<PrendaDetalle[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<{[key: number]: boolean}>({});

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  // Cargar prendas cuando cambia el hotel
  useEffect(() => {
    if (formData.hotel_id) {
      loadPrendasByHotel();
      loadNextGuiaNumber(parseInt(formData.hotel_id));
    }
  }, [formData.hotel_id]);

  const loadInitialData = async () => {
    try {
      // Datos estáticos para demostración
      const hotelesEstaticos = [
        { id_hotel: 1, nombre_comercial: 'Hotel Plaza', razon_social: 'Hotel Plaza SAC' },
        { id_hotel: 2, nombre_comercial: 'Hotel Ejecutivo', razon_social: 'Hotel Ejecutivo EIRL' },
        { id_hotel: 3, nombre_comercial: 'Hotel Boutique', razon_social: 'Boutique Hotels SA' }
      ];

      const choferesEstaticos = [
        { id_usuario: 10, nombre_completo: 'Carlos Mendoza' },
        { id_usuario: 11, nombre_completo: 'Luis Rodriguez' },
        { id_usuario: 12, nombre_completo: 'Miguel Torres' }
      ];

      setHoteles(hotelesEstaticos);
      setChoferes(choferesEstaticos);
      
      // Si el usuario es recepcionista, pre-seleccionar su hotel
      if (user?.hotel_id) {
        setFormData(prev => ({
          ...prev,
          hotel_id: user.hotel_id?.toString() || ''
        }));
      } else {
        // Para administrador, pre-seleccionar el primer hotel
        setFormData(prev => ({
          ...prev,
          hotel_id: '1'
        }));
      }
    } catch (err) {
      console.error('Error cargando datos iniciales:', err);
      setError('Error al cargar los datos iniciales');
    }
  };

  const loadPrendasByHotel = async () => {
    try {
      // Datos estáticos de prendas para demostración
      const prendasEstaticas = [
        // Ropa de Cama
        { id_prenda: 1, nombre_prenda: 'Sábana Individual', categoria: 'Ropa de Cama', precio_unitario: 5.00 },
        { id_prenda: 2, nombre_prenda: 'Sábana Matrimonial', categoria: 'Ropa de Cama', precio_unitario: 8.00 },
        { id_prenda: 3, nombre_prenda: 'Sábana King Size', categoria: 'Ropa de Cama', precio_unitario: 12.00 },
        { id_prenda: 4, nombre_prenda: 'Funda de Almohada', categoria: 'Ropa de Cama', precio_unitario: 2.50 },
        { id_prenda: 5, nombre_prenda: 'Funda de Almohada King', categoria: 'Ropa de Cama', precio_unitario: 3.00 },
        { id_prenda: 6, nombre_prenda: 'Cobertor Individual', categoria: 'Ropa de Cama', precio_unitario: 12.00 },
        { id_prenda: 7, nombre_prenda: 'Cobertor Matrimonial', categoria: 'Ropa de Cama', precio_unitario: 15.00 },
        { id_prenda: 8, nombre_prenda: 'Cobertor King Size', categoria: 'Ropa de Cama', precio_unitario: 18.00 },
        { id_prenda: 9, nombre_prenda: 'Protector de Colchón Individual', categoria: 'Ropa de Cama', precio_unitario: 10.00 },
        { id_prenda: 10, nombre_prenda: 'Protector de Colchón Matrimonial', categoria: 'Ropa de Cama', precio_unitario: 12.00 },
        { id_prenda: 11, nombre_prenda: 'Protector de Colchón King', categoria: 'Ropa de Cama', precio_unitario: 15.00 },
        { id_prenda: 12, nombre_prenda: 'Edredón Individual', categoria: 'Ropa de Cama', precio_unitario: 18.00 },
        { id_prenda: 13, nombre_prenda: 'Edredón Matrimonial', categoria: 'Ropa de Cama', precio_unitario: 25.00 },
        { id_prenda: 14, nombre_prenda: 'Edredón King Size', categoria: 'Ropa de Cama', precio_unitario: 30.00 },
        { id_prenda: 15, nombre_prenda: 'Cubrecama Individual', categoria: 'Ropa de Cama', precio_unitario: 15.00 },
        { id_prenda: 16, nombre_prenda: 'Cubrecama Matrimonial', categoria: 'Ropa de Cama', precio_unitario: 20.00 },
        
        // Toallas
        { id_prenda: 17, nombre_prenda: 'Toalla de Baño', categoria: 'Toallas', precio_unitario: 6.00 },
        { id_prenda: 18, nombre_prenda: 'Toalla de Mano', categoria: 'Toallas', precio_unitario: 3.50 },
        { id_prenda: 19, nombre_prenda: 'Toalla de Piso', categoria: 'Toallas', precio_unitario: 4.00 },
        { id_prenda: 20, nombre_prenda: 'Toalla de Playa', categoria: 'Toallas', precio_unitario: 8.00 },
        { id_prenda: 21, nombre_prenda: 'Toallón', categoria: 'Toallas', precio_unitario: 10.00 },
        
        // Cortinas
        { id_prenda: 22, nombre_prenda: 'Cortina de Baño', categoria: 'Cortinas', precio_unitario: 12.00 },
        { id_prenda: 23, nombre_prenda: 'Cortina Blackout', categoria: 'Cortinas', precio_unitario: 20.00 },
        { id_prenda: 24, nombre_prenda: 'Cortina Decorativa', categoria: 'Cortinas', precio_unitario: 15.00 },
        
        // Mantelería
        { id_prenda: 25, nombre_prenda: 'Mantel Individual', categoria: 'Mantelería', precio_unitario: 4.00 },
        { id_prenda: 26, nombre_prenda: 'Mantel para 4 personas', categoria: 'Mantelería', precio_unitario: 8.00 },
        { id_prenda: 27, nombre_prenda: 'Mantel para 6 personas', categoria: 'Mantelería', precio_unitario: 12.00 },
        { id_prenda: 28, nombre_prenda: 'Servilleta de Tela', categoria: 'Mantelería', precio_unitario: 1.50 },
        
        // Uniformes
        { id_prenda: 29, nombre_prenda: 'Uniforme de Recepción', categoria: 'Uniformes', precio_unitario: 15.00 },
        { id_prenda: 30, nombre_prenda: 'Uniforme de Limpieza', categoria: 'Uniformes', precio_unitario: 12.00 },
        { id_prenda: 31, nombre_prenda: 'Uniforme de Cocina', categoria: 'Uniformes', precio_unitario: 18.00 },
        { id_prenda: 32, nombre_prenda: 'Delantal', categoria: 'Uniformes', precio_unitario: 8.00 }
      ];
      
      setPrendas(prendasEstaticas);
      setFilteredPrendas(prendasEstaticas);
      // Limpiar detalle de prendas al cambiar hotel
      setPrendasDetalle([]);
    } catch (err) {
      console.error('Error cargando prendas:', err);
    }
  };

  const loadNextGuiaNumber = async (hotelId: number) => {
    try {
      const nextNumber = await getNextGuiaNumber(hotelId);
      setNumeroGuia(nextNumber);
    } catch (err) {
      console.error('Error obteniendo número de guía:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const agregarPrenda = () => {
    if (prendas.length === 0) {
      setError('Selecciona un hotel primero para cargar las prendas disponibles');
      return;
    }
    
    const nuevaPrenda: PrendaDetalle = {
      prenda_id: 0,
      nombre_prenda: '',
      cantidad_sucia: 1,
      es_devuelta: false
    };
    
    setPrendasDetalle(prev => [...prev, nuevaPrenda]);
  };

  const actualizarPrenda = (index: number, campo: keyof PrendaDetalle, valor: any) => {
    setPrendasDetalle(prev => {
      const nuevasPrendas = [...prev];
      
      if (campo === 'prenda_id') {
        const prendaSeleccionada = prendas.find(p => p.id_prenda === parseInt(valor));
        nuevasPrendas[index] = {
          ...nuevasPrendas[index],
          prenda_id: parseInt(valor),
          nombre_prenda: prendaSeleccionada?.nombre_prenda || ''
        };
      } else {
        nuevasPrendas[index] = {
          ...nuevasPrendas[index],
          [campo]: valor
        };
      }
      
      return nuevasPrendas;
    });
  };

  const eliminarPrenda = (index: number) => {
    setPrendasDetalle(prev => prev.filter((_, i) => i !== index));
  };

  const handlePrendaSearch = (index: number, searchValue: string) => {
    // Actualizar el valor de búsqueda en la prenda
    setPrendasDetalle(prev => {
      const nuevasPrendas = [...prev];
      nuevasPrendas[index] = {
        ...nuevasPrendas[index],
        nombre_prenda: searchValue,
        prenda_id: 0 // Reset ID cuando se cambia el texto
      };
      return nuevasPrendas;
    });

    // Mostrar sugerencias si hay texto
    setShowSuggestions(prev => ({
      ...prev,
      [index]: searchValue.trim().length > 0
    }));

    // Filtrar prendas basado en la búsqueda
    if (searchValue.trim()) {
      const filtered = prendas.filter(p => 
        p.nombre_prenda.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredPrendas(filtered);
    } else {
      setFilteredPrendas(prendas);
    }
  };

  const seleccionarPrenda = (index: number, prendaSeleccionada: any) => {
    setPrendasDetalle(prev => {
      const nuevasPrendas = [...prev];
      nuevasPrendas[index] = {
        ...nuevasPrendas[index],
        prenda_id: prendaSeleccionada.id_prenda,
        nombre_prenda: prendaSeleccionada.nombre_prenda
      };
      return nuevasPrendas;
    });
    
    // Ocultar sugerencias después de seleccionar
    setShowSuggestions(prev => ({
      ...prev,
      [index]: false
    }));
  };

  const handlePrendaFocus = (index: number) => {
    const prenda = prendasDetalle[index];
    if (prenda.nombre_prenda && prenda.prenda_id === 0) {
      setShowSuggestions(prev => ({
        ...prev,
        [index]: true
      }));
    }
  };

  const handlePrendaBlur = (index: number) => {
    // Delay para permitir click en sugerencias
    setTimeout(() => {
      setShowSuggestions(prev => ({
        ...prev,
        [index]: false
      }));
    }, 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validaciones
      if (!formData.hotel_id || !formData.chofer_recojo_id) {
        throw new Error('Por favor completa todos los campos obligatorios');
      }

      if (prendasDetalle.length === 0) {
        throw new Error('Debes agregar al menos una prenda');
      }

      // Validar que todas las prendas tengan datos válidos
      const prendasInvalidas = prendasDetalle.some(p => 
        !p.prenda_id || p.cantidad_sucia <= 0
      );
      
      if (prendasInvalidas) {
        throw new Error('Todas las prendas deben tener una selección válida y cantidad mayor a 0');
      }

      // Preparar datos para envío
      const guiaData = {
        hotel_id: parseInt(formData.hotel_id),
        fecha_recoleccion: formData.fecha_recoleccion,
        chofer_recojo_id: parseInt(formData.chofer_recojo_id),
        observaciones: formData.observaciones,
        prendas: prendasDetalle.map(p => ({
          prenda_id: p.prenda_id,
          cantidad_sucia: p.cantidad_sucia,
          es_devuelta: p.es_devuelta
        }))
      };

      await createGuia(guiaData);
      
      setSuccess(`¡Guía #${numeroGuia} registrada exitosamente!`);
      
      // Limpiar formulario
      setFormData({
        hotel_id: user?.hotel_id?.toString() || '',
        fecha_recoleccion: new Date().toISOString().split('T')[0],
        chofer_recojo_id: '',
        observaciones: ''
      });
      setPrendasDetalle([]);
      
      // Recargar número de guía
      if (formData.hotel_id) {
        loadNextGuiaNumber(parseInt(formData.hotel_id));
      }
      
    } catch (err: any) {
      setError(err.message || 'Error al registrar la guía');
    } finally {
      setLoading(false);
    }
  };

  const hotelSeleccionado = hoteles.find(h => h.id_hotel === parseInt(formData.hotel_id));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6" style={{ 
        background: 'linear-gradient(135deg, #000080 0%, #1e40af 100%)',
        color: 'white'
      }}>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">Registro de Nueva Guía</h2>
            <p className="text-blue-100 text-sm">
              Registra una nueva guía de lavandería para recolección
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-200">Número de Guía</div>
            <div className="text-4xl font-bold">#{numeroGuia}</div>
            {hotelSeleccionado && (
              <div className="text-sm text-blue-200 mt-1">
                {hotelSeleccionado.nombre_comercial}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mensajes */}
      {error && (
        <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-lg p-4 shadow-sm">
          <div className="flex items-center">
            <span className="text-red-500 mr-2">⚠️</span>
            <div className="text-sm text-red-700 font-medium">{error}</div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 rounded-lg p-4 shadow-sm">
          <div className="flex items-center">
            <span className="text-green-500 mr-2">✅</span>
            <div className="text-sm text-green-700 font-medium">{success}</div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Información General */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Información General</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hotel */}
            <div>
              <label htmlFor="hotel_id" className="block text-sm font-semibold text-gray-700 mb-2">
                Hotel *
              </label>
              <select
                id="hotel_id"
                name="hotel_id"
                value={formData.hotel_id}
                onChange={handleInputChange}
                required
                disabled={!!user?.hotel_id} // Deshabilitar si el usuario ya tiene hotel asignado
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Seleccionar hotel...</option>
                {hoteles.map((hotel) => (
                  <option key={hotel.id_hotel} value={hotel.id_hotel}>
                    {hotel.nombre_comercial}
                  </option>
                ))}
              </select>
            </div>

            {/* Fecha de Recolección */}
            <div>
              <label htmlFor="fecha_recoleccion" className="block text-sm font-semibold text-gray-700 mb-2">
                Fecha de Recolección *
              </label>
              <input
                type="date"
                id="fecha_recoleccion"
                name="fecha_recoleccion"
                value={formData.fecha_recoleccion}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white"
              />
            </div>

            {/* Chofer */}
            <div>
              <label htmlFor="chofer_recojo_id" className="block text-sm font-semibold text-gray-700 mb-2">
                Chofer de Recojo *
              </label>
              <select
                id="chofer_recojo_id"
                name="chofer_recojo_id"
                value={formData.chofer_recojo_id}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white"
              >
                <option value="">Seleccionar chofer...</option>
                {choferes.map((chofer) => (
                  <option key={chofer.id_usuario} value={chofer.id_usuario}>
                    {chofer.nombre_completo}
                  </option>
                ))}
              </select>
            </div>

            {/* Recepcionista (automático) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Recepcionista
              </label>
              <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-green-50 text-green-800 font-medium">
                {user?.nombre_completo || 'Usuario Actual'}
              </div>
            </div>

            {/* Tipo de Ropa (fijo por ahora) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tipo de Ropa
              </label>
              <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-blue-50 text-blue-800 font-medium">
                Ropa de Cama
              </div>
            </div>
          </div>

          {/* Observaciones */}
          <div className="mt-6">
            <label htmlFor="observaciones" className="block text-sm font-semibold text-gray-700 mb-2">
              Observaciones
            </label>
            <textarea
              id="observaciones"
              name="observaciones"
              value={formData.observaciones}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white resize-none"
              placeholder="Observaciones adicionales sobre la recolección..."
            />
          </div>
        </div>

        {/* Detalle de Prendas */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Detalle de Prendas</h3>
            <button
              type="button"
              onClick={agregarPrenda}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Agregar Prenda
            </button>
          </div>

          {prendasDetalle.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📦</div>
              <p>No hay prendas agregadas</p>
              <p className="text-sm">Haz clic en "Agregar Prenda" para comenzar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {prendasDetalle.map((prenda, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    {/* Selección de Prenda con Autocompletado */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prenda *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={prenda.nombre_prenda}
                          onChange={(e) => handlePrendaSearch(index, e.target.value)}
                          onFocus={() => handlePrendaFocus(index)}
                          onBlur={() => handlePrendaBlur(index)}
                          placeholder="Buscar prenda..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          autoComplete="off"
                        />
                        {/* Dropdown de sugerencias */}
                        {showSuggestions[index] && prenda.nombre_prenda && prenda.prenda_id === 0 && (
                          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-xl max-h-48 overflow-y-auto">
                            {filteredPrendas
                              .filter(p => p.nombre_prenda.toLowerCase().includes(prenda.nombre_prenda.toLowerCase()))
                              .slice(0, 8)
                              .map((p) => (
                                <button
                                  key={p.id_prenda}
                                  type="button"
                                  onClick={() => seleccionarPrenda(index, p)}
                                  className="w-full text-left px-4 py-3 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                                >
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <div className="font-medium text-gray-900">{p.nombre_prenda}</div>
                                      <div className="text-sm text-gray-500">{p.categoria}</div>
                                    </div>
                                    <div className="text-sm font-semibold text-green-600">
                                      S/ {p.precio_unitario.toFixed(2)}
                                    </div>
                                  </div>
                                </button>
                              ))
                            }
                            {filteredPrendas.filter(p => p.nombre_prenda.toLowerCase().includes(prenda.nombre_prenda.toLowerCase())).length === 0 && (
                              <div className="px-4 py-3 text-gray-500 text-center">
                                No se encontraron prendas
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Cantidad */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cantidad *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={prenda.cantidad_sucia}
                        onChange={(e) => actualizarPrenda(index, 'cantidad_sucia', parseInt(e.target.value))}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Checkbox de Devuelta */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Devolución
                      </label>
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={prenda.es_devuelta}
                          onChange={(e) => actualizarPrenda(index, 'es_devuelta', e.target.checked)}
                          className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                      </div>
                    </div>

                    {/* Botón Eliminar */}
                    <div>
                      <button
                        type="button"
                        onClick={() => eliminarPrenda(index)}
                        className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-2 rounded-md font-medium transition-all duration-300"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>

                  {/* Información adicional */}
                  <div className="mt-3 flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      {prenda.es_devuelta ? (
                        <span className="text-red-600 font-medium">
                          ⚠️ Prenda devuelta - No se cobrará
                        </span>
                      ) : (
                        <span>
                          Precio unitario: S/ {prendas.find(p => p.id_prenda === prenda.prenda_id)?.precio_unitario || '0.00'}
                        </span>
                      )}
                    </div>
                    {!prenda.es_devuelta && (
                      <div className="text-sm font-medium text-green-600">
                        Total: S/ {((prendas.find(p => p.id_prenda === prenda.prenda_id)?.precio_unitario || 0) * prenda.cantidad_sucia).toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-3 border-2 border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-sm font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            style={{
              background: loading ? '#9ca3af' : 'linear-gradient(135deg, #000080 0%, #1e40af 100%)',
              boxShadow: loading ? 'none' : '0 4px 15px rgba(0, 0, 128, 0.3)'
            }}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registrando...
              </span>
            ) : (
              'Registrar Guía'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GuiaForm;