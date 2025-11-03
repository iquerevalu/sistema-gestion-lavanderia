# 💻 Ejemplos de Código - Sistema de Gestión de Guías de Lavandería

## 📋 Tabla de Contenidos

- [Componentes React Detallados](#-componentes-react-detallados)
- [Servicios API Completos](#-servicios-api-completos)
- [Controladores Backend](#-controladores-backend)
- [Middleware y Utilidades](#-middleware-y-utilidades)
- [Configuraciones](#-configuraciones)

## 🎨 Componentes React Detallados

### GuiaForm.tsx - Implementación Completa
```typescript
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { createGuia, getNextGuiaNumber } from '../../services/guiaService';
import toast from 'react-hot-toast';

interface PrendaDetalle {
  prenda_id: number;
  nombre_prenda: string;
  cantidad_sucia: number;
  es_devuelta: boolean;
  precio_unitario: number;
}

interface FormData {
  hotel_id: string;
  fecha_recoleccion: string;
  chofer_recojo_id: string;
  observaciones: string;
}

const GuiaForm: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    hotel_id: user?.hotel_id?.toString() || '',
    fecha_recoleccion: new Date().toISOString().split('T')[0],
    chofer_recojo_id: '',
    observaciones: ''
  });

  // Estados para datos auxiliares
  const [choferes, setChoferes] = useState<any[]>([]);
  const [prendas, setPrendas] = useState<any[]>([]);
  const [numeroGuia, setNumeroGuia] = useState<number>(1);
  const [prendasDetalle, setPrendasDetalle] = useState<PrendaDetalle[]>([]);
  const [filteredPrendas, setFilteredPrendas] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<{[key: number]: boolean}>({});

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (formData.hotel_id) {
      loadPrendasByHotel();
      loadNextGuiaNumber(parseInt(formData.hotel_id));
    }
  }, [formData.hotel_id]);

  const loadInitialData = async () => {
    try {
      // Datos estáticos para demostración
      const choferesEstaticos = [
        { id_usuario: 10, nombre_completo: 'Carlos Mendoza' },
        { id_usuario: 11, nombre_completo: 'Luis Rodriguez' },
        { id_usuario: 12, nombre_completo: 'Miguel Torres' }
      ];
      setChoferes(choferesEstaticos);
    } catch (err) {
      console.error('Error cargando datos iniciales:', err);
      toast.error('Error al cargar los datos iniciales');
    }
  };

  const loadPrendasByHotel = async () => {
    try {
      const prendasEstaticas = [
        { id_prenda: 1, nombre_prenda: 'Sábana Individual', precio_unitario: 5.00 },
        { id_prenda: 2, nombre_prenda: 'Sábana Matrimonial', precio_unitario: 8.00 },
        { id_prenda: 3, nombre_prenda: 'Funda de Almohada', precio_unitario: 2.50 },
        { id_prenda: 4, nombre_prenda: 'Toalla de Baño', precio_unitario: 6.00 },
        { id_prenda: 5, nombre_prenda: 'Toalla de Mano', precio_unitario: 3.50 }
      ];
      setPrendas(prendasEstaticos);
      setFilteredPrendas(prendasEstaticos);
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const agregarPrenda = () => {
    if (prendas.length === 0) {
      toast.error('Selecciona un hotel primero para cargar las prendas disponibles');
      return;
    }
    
    const nuevaPrenda: PrendaDetalle = {
      prenda_id: 0,
      nombre_prenda: '',
      cantidad_sucia: 1,
      es_devuelta: false,
      precio_unitario: 0
    };
    
    setPrendasDetalle(prev => [...prev, nuevaPrenda]);
  };

  const handlePrendaSearch = (index: number, searchValue: string) => {
    setPrendasDetalle(prev => {
      const nuevasPrendas = [...prev];
      nuevasPrendas[index] = {
        ...nuevasPrendas[index],
        nombre_prenda: searchValue,
        prenda_id: 0
      };
      return nuevasPrendas;
    });

    setShowSuggestions(prev => ({
      ...prev,
      [index]: searchValue.trim().length > 0
    }));

    if (searchValue.trim()) {
      const filtered = prendas.filter(p => 
        p.nombre_prenda.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredPrendas(filtered);
    }
  };

  const seleccionarPrenda = (index: number, prendaSeleccionada: any) => {
    setPrendasDetalle(prev => {
      const nuevasPrendas = [...prev];
      nuevasPrendas[index] = {
        ...nuevasPrendas[index],
        prenda_id: prendaSeleccionada.id_prenda,
        nombre_prenda: prendaSeleccionada.nombre_prenda,
        precio_unitario: prendaSeleccionada.precio_unitario
      };
      return nuevasPrendas;
    });
    
    setShowSuggestions(prev => ({
      ...prev,
      [index]: false
    }));
  };

  const actualizarPrenda = (index: number, campo: keyof PrendaDetalle, valor: any) => {
    setPrendasDetalle(prev => {
      const nuevasPrendas = [...prev];
      nuevasPrendas[index] = {
        ...nuevasPrendas[index],
        [campo]: valor
      };
      return nuevasPrendas;
    });
  };

  const eliminarPrenda = (index: number) => {
    setPrendasDetalle(prev => prev.filter((_, i) => i !== index));
  };

  const calcularTotal = () => {
    return prendasDetalle.reduce((total, prenda) => {
      if (!prenda.es_devuelta) {
        return total + (prenda.precio_unitario * prenda.cantidad_sucia);
      }
      return total;
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validaciones
      if (!formData.hotel_id || !formData.chofer_recojo_id) {
        throw new Error('Por favor completa todos los campos obligatorios');
      }

      if (prendasDetalle.length === 0) {
        throw new Error('Debes agregar al menos una prenda');
      }

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
      
      toast.success(
        <div>
          <div className="font-bold">¡Guía registrada exitosamente!</div>
          <div className="text-sm">Guía #{numeroGuia} • Total: S/ {calcularTotal().toFixed(2)}</div>
        </div>,
        { duration: 4000 }
      );
      
      // Limpiar formulario
      setFormData({
        hotel_id: user?.hotel_id?.toString() || '',
        fecha_recoleccion: new Date().toISOString().split('T')[0],
        chofer_recojo_id: '',
        observaciones: ''
      });
      setPrendasDetalle([]);
      
      if (formData.hotel_id) {
        loadNextGuiaNumber(parseInt(formData.hotel_id));
      }
      
    } catch (err: any) {
      toast.error(err.message || 'Error al registrar la guía');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header con información de la guía */}
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
            <div className="text-sm text-blue-200 mt-1">
              {user?.nombre_comercial}
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Información General */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Información General</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              />
            </div>

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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              >
                <option value="">Seleccionar chofer...</option>
                {choferes.map((chofer) => (
                  <option key={chofer.id_usuario} value={chofer.id_usuario}>
                    {chofer.nombre_completo}
                  </option>
                ))}
              </select>
            </div>
          </div>

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
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 resize-none"
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
                                    <div className="font-medium text-gray-900">{p.nombre_prenda}</div>
                                    <div className="text-sm font-semibold text-green-600">
                                      S/ {p.precio_unitario.toFixed(2)}
                                    </div>
                                  </div>
                                </button>
                              ))
                            }
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
                          Precio unitario: S/ {prenda.precio_unitario.toFixed(2)}
                        </span>
                      )}
                    </div>
                    {!prenda.es_devuelta && (
                      <div className="text-sm font-medium text-green-600">
                        Total: S/ {(prenda.precio_unitario * prenda.cantidad_sucia).toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Total General */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-blue-900">Total de la Guía:</span>
                  <span className="text-2xl font-bold text-blue-900">S/ {calcularTotal().toFixed(2)}</span>
                </div>
              </div>
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
```## 🔌 
Servicios API Completos

### guiaService.ts - Servicio Frontend
```typescript
import apiClient from './apiClient';

export interface CreateGuiaRequest {
  hotel_id: number;
  chofer_recojo_id: number;
  fecha_recoleccion: string;
  observaciones?: string;
  prendas: {
    prenda_id: number;
    cantidad_sucia: number;
    es_devuelta: boolean;
  }[];
}

export interface UpdateGuiaRequest {
  estado?: string;
  prendas?: {
    id_detalle: number;
    cantidad_limpia: number;
  }[];
}

export interface GuiaFilters {
  numero_guia?: string;
  estado?: string;
  hotel_id?: number;
  fecha_desde?: string;
  fecha_hasta?: string;
}

class GuiaService {
  private readonly baseUrl = '/guias';

  async getAllGuias(page: number = 1, limit: number = 10, filters: GuiaFilters = {}) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
        )
      });

      const response = await apiClient.get(`${this.baseUrl}?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching guias:', error);
      throw this.handleError(error);
    }
  }

  async getGuiaById(id: number) {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching guia:', error);
      throw this.handleError(error);
    }
  }

  async createGuia(guiaData: CreateGuiaRequest) {
    try {
      const response = await apiClient.post(this.baseUrl, guiaData);
      return response.data;
    } catch (error) {
      console.error('Error creating guia:', error);
      throw this.handleError(error);
    }
  }

  async updateGuia(id: number, updateData: UpdateGuiaRequest) {
    try {
      const response = await apiClient.put(`${this.baseUrl}/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating guia:', error);
      throw this.handleError(error);
    }
  }

  async deleteGuia(id: number) {
    try {
      const response = await apiClient.delete(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting guia:', error);
      throw this.handleError(error);
    }
  }

  async getNextGuiaNumber(hotelId: number): Promise<number> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/next-number/${hotelId}`);
      return response.data.next_number;
    } catch (error) {
      console.error('Error getting next guia number:', error);
      throw this.handleError(error);
    }
  }

  async getGuiaHistorial(id: number) {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${id}/historial`);
      return response.data;
    } catch (error) {
      console.error('Error fetching guia historial:', error);
      throw this.handleError(error);
    }
  }

  async exportGuias(filters: GuiaFilters = {}, format: 'pdf' | 'excel' = 'pdf') {
    try {
      const params = new URLSearchParams({
        format,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
        )
      });

      const response = await apiClient.get(`${this.baseUrl}/export?${params}`, {
        responseType: 'blob'
      });

      // Crear URL para descarga
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `guias_${new Date().toISOString().split('T')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error('Error exporting guias:', error);
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      // Error de respuesta del servidor
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          return new Error(data.message || 'Datos inválidos');
        case 401:
          return new Error('No autorizado. Por favor inicia sesión nuevamente.');
        case 403:
          return new Error('No tienes permisos para realizar esta acción');
        case 404:
          return new Error('Guía no encontrada');
        case 409:
          return new Error('La guía ya existe');
        case 422:
          return new Error(data.message || 'Error de validación');
        case 500:
          return new Error('Error interno del servidor');
        default:
          return new Error(data.message || 'Error desconocido');
      }
    } else if (error.request) {
      // Error de red
      return new Error('Error de conexión. Verifica tu conexión a internet.');
    } else {
      // Error de configuración
      return new Error('Error en la configuración de la solicitud');
    }
  }
}

export const guiaService = new GuiaService();

// Funciones de conveniencia para mantener compatibilidad
export const getAllGuias = guiaService.getAllGuias.bind(guiaService);
export const getGuiaById = guiaService.getGuiaById.bind(guiaService);
export const createGuia = guiaService.createGuia.bind(guiaService);
export const updateGuia = guiaService.updateGuia.bind(guiaService);
export const deleteGuia = guiaService.deleteGuia.bind(guiaService);
export const getNextGuiaNumber = guiaService.getNextGuiaNumber.bind(guiaService);
export const getGuiaHistorial = guiaService.getGuiaHistorial.bind(guiaService);
export const exportGuias = guiaService.exportGuias.bind(guiaService);
```

### apiClient.ts - Cliente HTTP Base
```typescript
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

class ApiClient {
  private client: AxiosInstance;
  private readonly baseURL: string;
  private readonly timeout: number;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    this.timeout = parseInt(import.meta.env.VITE_API_TIMEOUT || '10000');

    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        // Agregar token de autenticación
        const token = localStorage.getItem('token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Agregar timestamp para evitar cache
        if (config.method === 'get') {
          config.params = {
            ...config.params,
            _t: Date.now()
          };
        }

        // Log de requests en desarrollo
        if (import.meta.env.DEV) {
          console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
            params: config.params,
            data: config.data
          });
        }

        return config;
      },
      (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log de responses en desarrollo
        if (import.meta.env.DEV) {
          console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, {
            status: response.status,
            data: response.data
          });
        }

        return response;
      },
      (error) => {
        // Log de errores
        if (import.meta.env.DEV) {
          console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
            status: error.response?.status,
            data: error.response?.data
          });
        }

        // Manejar errores de autenticación
        if (error.response?.status === 401) {
          this.handleUnauthorized();
        }

        // Manejar errores de red
        if (!error.response) {
          console.error('Network error:', error.message);
        }

        return Promise.reject(error);
      }
    );
  }

  private handleUnauthorized(): void {
    // Limpiar token y redirigir al login
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Evitar redirección infinita
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  // Métodos HTTP
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get(url, config);
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.post(url, data, config);
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.put(url, data, config);
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.patch(url, data, config);
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.delete(url, config);
  }

  // Métodos de utilidad
  setAuthToken(token: string): void {
    localStorage.setItem('token', token);
  }

  clearAuthToken(): void {
    localStorage.removeItem('token');
  }

  getBaseURL(): string {
    return this.baseURL;
  }

  // Método para subir archivos
  async uploadFile(url: string, file: File, onProgress?: (progress: number) => void): Promise<AxiosResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.client.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
  }

  // Método para descargar archivos
  async downloadFile(url: string, filename?: string): Promise<void> {
    const response = await this.client.get(url, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  }
}

// Exportar instancia singleton
export default new ApiClient();
```## 🎛 Co
ntroladores Backend

### guiaController.ts - Controlador Completo
```typescript
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { guiaService } from '../services/guiaService';
import { logger } from '../utils/logger';
import { AuthenticatedRequest } from '../types';

export class GuiaController {
  
  async getAllGuias(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Parámetros inválidos',
          details: errors.array()
        });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filters = {
        numero_guia: req.query.numero_guia as string,
        estado: req.query.estado as string,
        hotel_id: req.query.hotel_id ? parseInt(req.query.hotel_id as string) : undefined,
        fecha_desde: req.query.fecha_desde as string,
        fecha_hasta: req.query.fecha_hasta as string
      };

      // Filtrar por hotel si el usuario no es administrador
      if (req.user?.perfil_nombre !== 'Administrador' && req.user?.hotel_id) {
        filters.hotel_id = req.user.hotel_id;
      }

      const result = await guiaService.getAllGuias(page, limit, filters);

      logger.info('Guías obtenidas exitosamente', {
        userId: req.user?.id_usuario,
        page,
        limit,
        total: result.total
      });

      res.json(result);
    } catch (error) {
      logger.error('Error obteniendo guías', {
        error: error.message,
        userId: req.user?.id_usuario,
        stack: error.stack
      });
      next(error);
    }
  }

  async getGuiaById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const guiaId = parseInt(id);

      if (isNaN(guiaId)) {
        return res.status(400).json({
          error: 'ID de guía inválido'
        });
      }

      const guia = await guiaService.getGuiaById(guiaId);

      if (!guia) {
        return res.status(404).json({
          error: 'Guía no encontrada'
        });
      }

      // Verificar permisos: solo admin o usuarios del mismo hotel
      if (req.user?.perfil_nombre !== 'Administrador' && 
          req.user?.hotel_id !== guia.hotel_id) {
        return res.status(403).json({
          error: 'No tienes permisos para ver esta guía'
        });
      }

      logger.info('Guía obtenida exitosamente', {
        guiaId,
        userId: req.user?.id_usuario
      });

      res.json(guia);
    } catch (error) {
      logger.error('Error obteniendo guía', {
        error: error.message,
        guiaId: req.params.id,
        userId: req.user?.id_usuario
      });
      next(error);
    }
  }

  async createGuia(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Datos de guía inválidos',
          details: errors.array()
        });
      }

      const guiaData = req.body;
      const userId = req.user!.id_usuario;

      // Verificar permisos: solo recepcionistas y administradores pueden crear guías
      if (!['Administrador', 'Recepcionista'].includes(req.user!.perfil_nombre)) {
        return res.status(403).json({
          error: 'No tienes permisos para crear guías'
        });
      }

      // Si es recepcionista, solo puede crear guías para su hotel
      if (req.user!.perfil_nombre === 'Recepcionista' && 
          req.user!.hotel_id !== guiaData.hotel_id) {
        return res.status(403).json({
          error: 'Solo puedes crear guías para tu hotel'
        });
      }

      // Validar que las prendas existan y pertenezcan al hotel
      await guiaService.validatePrendas(guiaData.prendas, guiaData.hotel_id);

      const newGuia = await guiaService.createGuia(guiaData, userId);

      logger.info('Guía creada exitosamente', {
        guiaId: newGuia.id_guia,
        numeroGuia: newGuia.numero_guia,
        hotelId: guiaData.hotel_id,
        userId
      });

      res.status(201).json({
        message: 'Guía creada exitosamente',
        guia: newGuia
      });
    } catch (error) {
      logger.error('Error creando guía', {
        error: error.message,
        userId: req.user?.id_usuario,
        guiaData: req.body
      });
      next(error);
    }
  }

  async updateGuia(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Datos de actualización inválidos',
          details: errors.array()
        });
      }

      const { id } = req.params;
      const guiaId = parseInt(id);
      const updateData = req.body;
      const userId = req.user!.id_usuario;

      if (isNaN(guiaId)) {
        return res.status(400).json({
          error: 'ID de guía inválido'
        });
      }

      // Obtener guía actual para verificar permisos
      const currentGuia = await guiaService.getGuiaById(guiaId);
      if (!currentGuia) {
        return res.status(404).json({
          error: 'Guía no encontrada'
        });
      }

      // Verificar permisos según el tipo de actualización
      if (updateData.estado) {
        // Solo operarios y administradores pueden cambiar estados
        if (!['Administrador', 'Operario'].includes(req.user!.perfil_nombre)) {
          return res.status(403).json({
            error: 'No tienes permisos para cambiar el estado de la guía'
          });
        }
      }

      // Validar transición de estado
      if (updateData.estado && !guiaService.isValidStateTransition(currentGuia.estado, updateData.estado)) {
        return res.status(400).json({
          error: `No se puede cambiar de estado ${currentGuia.estado} a ${updateData.estado}`
        });
      }

      const updatedGuia = await guiaService.updateGuia(guiaId, updateData, userId);

      logger.info('Guía actualizada exitosamente', {
        guiaId,
        previousState: currentGuia.estado,
        newState: updateData.estado,
        userId
      });

      res.json({
        message: 'Guía actualizada exitosamente',
        guia: updatedGuia
      });
    } catch (error) {
      logger.error('Error actualizando guía', {
        error: error.message,
        guiaId: req.params.id,
        userId: req.user?.id_usuario,
        updateData: req.body
      });
      next(error);
    }
  }

  async deleteGuia(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const guiaId = parseInt(id);
      const userId = req.user!.id_usuario;

      if (isNaN(guiaId)) {
        return res.status(400).json({
          error: 'ID de guía inválido'
        });
      }

      // Solo administradores pueden eliminar guías
      if (req.user!.perfil_nombre !== 'Administrador') {
        return res.status(403).json({
          error: 'No tienes permisos para eliminar guías'
        });
      }

      const guia = await guiaService.getGuiaById(guiaId);
      if (!guia) {
        return res.status(404).json({
          error: 'Guía no encontrada'
        });
      }

      // No permitir eliminar guías que ya están en proceso
      if (!['Registrado'].includes(guia.estado)) {
        return res.status(400).json({
          error: 'No se puede eliminar una guía que ya está en proceso'
        });
      }

      await guiaService.deleteGuia(guiaId, userId);

      logger.info('Guía eliminada exitosamente', {
        guiaId,
        numeroGuia: guia.numero_guia,
        userId
      });

      res.json({
        message: 'Guía eliminada exitosamente'
      });
    } catch (error) {
      logger.error('Error eliminando guía', {
        error: error.message,
        guiaId: req.params.id,
        userId: req.user?.id_usuario
      });
      next(error);
    }
  }

  async getNextGuiaNumber(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { hotelId } = req.params;
      const hotelIdNum = parseInt(hotelId);

      if (isNaN(hotelIdNum)) {
        return res.status(400).json({
          error: 'ID de hotel inválido'
        });
      }

      // Verificar permisos: solo usuarios del hotel o administradores
      if (req.user!.perfil_nombre !== 'Administrador' && 
          req.user!.hotel_id !== hotelIdNum) {
        return res.status(403).json({
          error: 'No tienes permisos para obtener números de guía de este hotel'
        });
      }

      const nextNumber = await guiaService.getNextGuiaNumber(hotelIdNum);

      res.json({
        next_number: nextNumber
      });
    } catch (error) {
      logger.error('Error obteniendo siguiente número de guía', {
        error: error.message,
        hotelId: req.params.hotelId,
        userId: req.user?.id_usuario
      });
      next(error);
    }
  }

  async getGuiaHistorial(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const guiaId = parseInt(id);

      if (isNaN(guiaId)) {
        return res.status(400).json({
          error: 'ID de guía inválido'
        });
      }

      // Verificar que la guía existe y el usuario tiene permisos
      const guia = await guiaService.getGuiaById(guiaId);
      if (!guia) {
        return res.status(404).json({
          error: 'Guía no encontrada'
        });
      }

      if (req.user!.perfil_nombre !== 'Administrador' && 
          req.user!.hotel_id !== guia.hotel_id) {
        return res.status(403).json({
          error: 'No tienes permisos para ver el historial de esta guía'
        });
      }

      const historial = await guiaService.getGuiaHistorial(guiaId);

      res.json({
        historial
      });
    } catch (error) {
      logger.error('Error obteniendo historial de guía', {
        error: error.message,
        guiaId: req.params.id,
        userId: req.user?.id_usuario
      });
      next(error);
    }
  }

  async exportGuias(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const format = req.query.format as string || 'pdf';
      const filters = {
        numero_guia: req.query.numero_guia as string,
        estado: req.query.estado as string,
        hotel_id: req.query.hotel_id ? parseInt(req.query.hotel_id as string) : undefined,
        fecha_desde: req.query.fecha_desde as string,
        fecha_hasta: req.query.fecha_hasta as string
      };

      // Filtrar por hotel si no es administrador
      if (req.user!.perfil_nombre !== 'Administrador' && req.user!.hotel_id) {
        filters.hotel_id = req.user!.hotel_id;
      }

      const exportData = await guiaService.exportGuias(filters, format);

      // Configurar headers para descarga
      const filename = `guias_${new Date().toISOString().split('T')[0]}.${format}`;
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

      logger.info('Guías exportadas exitosamente', {
        format,
        filters,
        userId: req.user!.id_usuario
      });

      res.send(exportData);
    } catch (error) {
      logger.error('Error exportando guías', {
        error: error.message,
        userId: req.user?.id_usuario,
        filters: req.query
      });
      next(error);
    }
  }

  async getGuiaStats(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const hotelId = req.user!.perfil_nombre === 'Administrador' ? 
        undefined : req.user!.hotel_id;

      const stats = await guiaService.getGuiaStats(hotelId);

      res.json(stats);
    } catch (error) {
      logger.error('Error obteniendo estadísticas de guías', {
        error: error.message,
        userId: req.user?.id_usuario
      });
      next(error);
    }
  }
}

export const guiaController = new GuiaController();
```## 
🛡 Middleware y Utilidades

### auth.ts - Middleware de Autenticación
```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { userService } from '../services/userService';
import { logger } from '../utils/logger';

export interface AuthenticatedRequest extends Request {
  user?: {
    id_usuario: number;
    correo: string;
    perfil_id: number;
    hotel_id?: number;
    nombre_completo: string;
    perfil_nombre: string;
    nombre_comercial?: string;
  };
}

export interface JWTPayload {
  id_usuario: number;
  correo: string;
  perfil_id: number;
  hotel_id?: number;
  iat: number;
  exp: number;
}

export const authenticateToken = async (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'Token de acceso requerido',
        code: 'NO_TOKEN'
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;

    // Obtener información actualizada del usuario
    const user = await userService.getUserById(decoded.id_usuario);
    
    if (!user) {
      return res.status(401).json({
        error: 'Usuario no encontrado',
        code: 'USER_NOT_FOUND'
      });
    }

    if (user.estado !== 1) {
      return res.status(401).json({
        error: 'Usuario inactivo',
        code: 'USER_INACTIVE'
      });
    }

    // Agregar información del usuario al request
    req.user = {
      id_usuario: user.id_usuario,
      correo: user.correo,
      perfil_id: user.perfil_id,
      hotel_id: user.hotel_id,
      nombre_completo: user.nombre_completo,
      perfil_nombre: user.nombre_perfil,
      nombre_comercial: user.nombre_comercial
    };

    next();
  } catch (error) {
    logger.error('Error en autenticación', {
      error: error.message,
      token: req.headers['authorization']?.substring(0, 20) + '...'
    });

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expirado',
        code: 'TOKEN_EXPIRED'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Token inválido',
        code: 'INVALID_TOKEN'
      });
    }

    return res.status(401).json({
      error: 'Error de autenticación',
      code: 'AUTH_ERROR'
    });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Usuario no autenticado'
      });
    }

    if (!roles.includes(req.user.perfil_nombre)) {
      logger.warn('Acceso denegado por rol', {
        userId: req.user.id_usuario,
        userRole: req.user.perfil_nombre,
        requiredRoles: roles,
        endpoint: req.path
      });

      return res.status(403).json({
        error: 'No tienes permisos para acceder a este recurso',
        required_roles: roles,
        user_role: req.user.perfil_nombre
      });
    }

    next();
  };
};

export const requireHotel = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Usuario no autenticado'
    });
  }

  // Administradores pueden acceder a cualquier hotel
  if (req.user.perfil_nombre === 'Administrador') {
    return next();
  }

  // Otros usuarios deben tener hotel asignado
  if (!req.user.hotel_id) {
    return res.status(403).json({
      error: 'Usuario sin hotel asignado'
    });
  }

  next();
};

export const optionalAuth = async (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    const user = await userService.getUserById(decoded.id_usuario);
    
    if (user && user.estado === 1) {
      req.user = {
        id_usuario: user.id_usuario,
        correo: user.correo,
        perfil_id: user.perfil_id,
        hotel_id: user.hotel_id,
        nombre_completo: user.nombre_completo,
        perfil_nombre: user.nombre_perfil,
        nombre_comercial: user.nombre_comercial
      };
    }
  } catch (error) {
    // Ignorar errores en autenticación opcional
    logger.debug('Error en autenticación opcional', { error: error.message });
  }

  next();
};
```

### validation.ts - Middleware de Validación
```typescript
import { body, param, query, ValidationChain } from 'express-validator';

// Validaciones para Guías
export const validateGuiaCreation: ValidationChain[] = [
  body('hotel_id')
    .isInt({ min: 1 })
    .withMessage('Hotel ID debe ser un número válido'),
  
  body('chofer_recojo_id')
    .isInt({ min: 1 })
    .withMessage('Chofer ID debe ser un número válido'),
  
  body('fecha_recoleccion')
    .isISO8601()
    .withMessage('Fecha de recolección debe ser válida')
    .custom((value) => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (date < today) {
        throw new Error('La fecha de recolección no puede ser anterior a hoy');
      }
      return true;
    }),
  
  body('observaciones')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Las observaciones no pueden exceder 500 caracteres'),
  
  body('prendas')
    .isArray({ min: 1 })
    .withMessage('Debe incluir al menos una prenda'),
  
  body('prendas.*.prenda_id')
    .isInt({ min: 1 })
    .withMessage('ID de prenda debe ser válido'),
  
  body('prendas.*.cantidad_sucia')
    .isInt({ min: 1, max: 1000 })
    .withMessage('Cantidad sucia debe ser entre 1 y 1000'),
  
  body('prendas.*.es_devuelta')
    .isBoolean()
    .withMessage('es_devuelta debe ser verdadero o falso')
];

export const validateGuiaUpdate: ValidationChain[] = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID de guía debe ser válido'),
  
  body('estado')
    .optional()
    .isIn(['Registrado', 'Pendiente', 'Procesandose', 'Lista para Entregar', 'En Ruta', 'Entregado'])
    .withMessage('Estado no válido'),
  
  body('prendas')
    .optional()
    .isArray()
    .withMessage('Prendas debe ser un array'),
  
  body('prendas.*.id_detalle')
    .if(body('prendas').exists())
    .isInt({ min: 1 })
    .withMessage('ID de detalle debe ser válido'),
  
  body('prendas.*.cantidad_limpia')
    .if(body('prendas').exists())
    .isInt({ min: 0, max: 1000 })
    .withMessage('Cantidad limpia debe ser entre 0 y 1000')
];

// Validaciones para Usuarios
export const validateUserCreation: ValidationChain[] = [
  body('nombre_completo')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Nombre completo debe tener entre 2 y 255 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('Nombre completo solo puede contener letras y espacios'),
  
  body('correo')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email no es válido')
    .isLength({ max: 255 })
    .withMessage('Email no puede exceder 255 caracteres'),
  
  body('telefono')
    .optional()
    .matches(/^[+]?[\d\s\-()]+$/)
    .withMessage('Teléfono no es válido')
    .isLength({ min: 7, max: 20 })
    .withMessage('Teléfono debe tener entre 7 y 20 caracteres'),
  
  body('perfil_id')
    .isInt({ min: 1 })
    .withMessage('Perfil ID debe ser válido'),
  
  body('hotel_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Hotel ID debe ser válido'),
  
  body('password')
    .isLength({ min: 6, max: 128 })
    .withMessage('Password debe tener entre 6 y 128 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password debe contener al menos una minúscula, una mayúscula y un número')
];

export const validateUserUpdate: ValidationChain[] = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID de usuario debe ser válido'),
  
  body('nombre_completo')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Nombre completo debe tener entre 2 y 255 caracteres'),
  
  body('correo')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Email no es válido'),
  
  body('telefono')
    .optional()
    .matches(/^[+]?[\d\s\-()]+$/)
    .withMessage('Teléfono no es válido'),
  
  body('perfil_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Perfil ID debe ser válido'),
  
  body('hotel_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Hotel ID debe ser válido'),
  
  body('estado')
    .optional()
    .isIn([0, 1])
    .withMessage('Estado debe ser 0 o 1')
];

// Validaciones para Hoteles
export const validateHotelCreation: ValidationChain[] = [
  body('ruc')
    .optional()
    .matches(/^\d{11}$/)
    .withMessage('RUC debe tener 11 dígitos'),
  
  body('razon_social')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Razón social debe tener entre 2 y 255 caracteres'),
  
  body('nombre_comercial')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Nombre comercial debe tener entre 2 y 255 caracteres'),
  
  body('direccion')
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Dirección debe tener entre 5 y 500 caracteres'),
  
  body('correo_contacto')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email de contacto no es válido'),
  
  body('telefono')
    .matches(/^[+]?[\d\s\-()]+$/)
    .withMessage('Teléfono no es válido')
    .isLength({ min: 7, max: 20 })
    .withMessage('Teléfono debe tener entre 7 y 20 caracteres')
];

// Validaciones para Prendas
export const validatePrendaCreation: ValidationChain[] = [
  body('nombre_prenda')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Nombre de prenda debe tener entre 2 y 255 caracteres'),
  
  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Descripción no puede exceder 500 caracteres'),
  
  body('categoria_id')
    .isInt({ min: 1 })
    .withMessage('Categoría ID debe ser válido')
];

// Validaciones de consulta
export const validatePagination: ValidationChain[] = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Página debe ser un número mayor a 0'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Límite debe ser entre 1 y 100')
];

export const validateDateRange: ValidationChain[] = [
  query('fecha_desde')
    .optional()
    .isISO8601()
    .withMessage('Fecha desde debe ser válida'),
  
  query('fecha_hasta')
    .optional()
    .isISO8601()
    .withMessage('Fecha hasta debe ser válida')
    .custom((value, { req }) => {
      if (req.query.fecha_desde && value < req.query.fecha_desde) {
        throw new Error('Fecha hasta debe ser posterior a fecha desde');
      }
      return true;
    })
];

// Validación de login
export const validateLogin: ValidationChain[] = [
  body('correo')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email no es válido'),
  
  body('password')
    .isLength({ min: 1 })
    .withMessage('Password es requerido')
];
```### logger
.ts - Sistema de Logging
```typescript
import winston from 'winston';
import path from 'path';

// Configuración de niveles personalizados
const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue'
  }
};

// Formato personalizado para logs
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let logMessage = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    
    if (Object.keys(meta).length > 0) {
      logMessage += ` ${JSON.stringify(meta, null, 2)}`;
    }
    
    return logMessage;
  })
);

// Formato para consola
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let logMessage = `${timestamp} ${level}: ${message}`;
    
    if (Object.keys(meta).length > 0) {
      logMessage += ` ${JSON.stringify(meta)}`;
    }
    
    return logMessage;
  })
);

// Crear directorio de logs si no existe
const logsDir = path.join(process.cwd(), 'logs');

// Configuración de transports
const transports: winston.transport[] = [
  // Archivo para todos los logs
  new winston.transports.File({
    filename: path.join(logsDir, 'combined.log'),
    format: logFormat,
    maxsize: 10 * 1024 * 1024, // 10MB
    maxFiles: 5
  }),
  
  // Archivo solo para errores
  new winston.transports.File({
    filename: path.join(logsDir, 'error.log'),
    level: 'error',
    format: logFormat,
    maxsize: 10 * 1024 * 1024, // 10MB
    maxFiles: 5
  }),
  
  // Archivo para requests HTTP
  new winston.transports.File({
    filename: path.join(logsDir, 'http.log'),
    level: 'http',
    format: logFormat,
    maxsize: 10 * 1024 * 1024, // 10MB
    maxFiles: 3
  })
];

// Agregar consola en desarrollo
if (process.env.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      format: consoleFormat,
      level: 'debug'
    })
  );
}

// Crear logger
export const logger = winston.createLogger({
  levels: customLevels.levels,
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports,
  exitOnError: false
});

// Agregar colores
winston.addColors(customLevels.colors);

// Middleware para logging de requests HTTP
export const httpLogger = (req: any, res: any, next: any) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress,
      userId: req.user?.id_usuario
    };
    
    if (res.statusCode >= 400) {
      logger.warn('HTTP Request Error', logData);
    } else {
      logger.http('HTTP Request', logData);
    }
  });
  
  next();
};

// Función para logging de errores de base de datos
export const logDatabaseError = (error: any, query: string, params?: any[]) => {
  logger.error('Database Error', {
    error: error.message,
    code: error.code,
    query,
    params,
    stack: error.stack
  });
};

// Función para logging de autenticación
export const logAuthEvent = (event: string, userId?: number, details?: any) => {
  logger.info('Auth Event', {
    event,
    userId,
    timestamp: new Date().toISOString(),
    ...details
  });
};

// Función para logging de operaciones críticas
export const logCriticalOperation = (operation: string, userId: number, details: any) => {
  logger.warn('Critical Operation', {
    operation,
    userId,
    timestamp: new Date().toISOString(),
    ...details
  });
};

// Stream para Morgan (si se usa)
export const morganStream = {
  write: (message: string) => {
    logger.http(message.trim());
  }
};

export default logger;
```

## ⚙️ Configuraciones

### vite.config.ts - Configuración Frontend
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  
  // Configuración de desarrollo
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    }
  },
  
  // Configuración de build
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['react-hot-toast'],
          utils: ['axios']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  
  // Alias para imports
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@services': path.resolve(__dirname, './src/services'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@hooks': path.resolve(__dirname, './src/hooks')
    }
  },
  
  // Variables de entorno
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString())
  },
  
  // Optimización de dependencias
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios'],
    exclude: ['@vite/client', '@vite/env']
  },
  
  // CSS
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    }
  },
  
  // Preview (para testing del build)
  preview: {
    port: 4173,
    host: true
  }
});
```

### tsconfig.json - Configuración TypeScript
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    
    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    
    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    
    /* Path mapping */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@services/*": ["./src/services/*"],
      "@types/*": ["./src/types/*"],
      "@utils/*": ["./src/utils/*"],
      "@contexts/*": ["./src/contexts/*"],
      "@hooks/*": ["./src/hooks/*"]
    },
    
    /* Additional options */
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": [
    "src",
    "vite.config.ts"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.test.ts",
    "**/*.test.tsx"
  ],
  "references": [
    { "path": "./tsconfig.node.json" }
  ]
}
```

### tailwind.config.js - Configuración Tailwind CSS
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'hard': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 4px 25px -5px rgba(0, 0, 0, 0.1)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
```

### jest.config.js - Configuración Testing
```javascript
module.exports = {
  // Entorno de testing
  testEnvironment: 'jsdom',
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  
  // Transformaciones
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  
  // Extensiones de archivos
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // Patrones de archivos de test
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(ts|tsx|js|jsx)',
    '<rootDir>/src/**/*.(test|spec).(ts|tsx|js|jsx)',
  ],
  
  // Archivos a ignorar
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
  ],
  
  // Mapeo de módulos
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@types/(.*)$': '<rootDir>/src/types/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@contexts/(.*)$': '<rootDir>/src/contexts/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  
  // Coverage
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/setupTests.ts',
  ],
  
  // Umbrales de coverage
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  
  // Reportes de coverage
  coverageReporters: ['text', 'lcov', 'html'],
  
  // Directorio de coverage
  coverageDirectory: 'coverage',
  
  // Configuración adicional
  verbose: true,
  clearMocks: true,
  restoreMocks: true,
  
  // Timeout para tests
  testTimeout: 10000,
  
  // Configuración para TypeScript
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
};
```

---

**Estos ejemplos de código proporcionan una implementación completa y detallada de todos los componentes principales del sistema, desde el frontend hasta el backend, incluyendo configuraciones, middleware, validaciones y testing.**