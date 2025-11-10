import React, { useState, useEffect } from 'react';
import { Usuario } from '../../types';
import { getPerfiles, getHotelesForUsers } from '../../services/userService';

interface UsuarioFormProps {
  usuario?: Usuario | null;
  onSave: (userData: any) => Promise<void>;
  onCancel: () => void;
}

const UsuarioForm: React.FC<UsuarioFormProps> = ({ usuario, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre_completo: '',
    correo: '',
    telefono: '',
    perfil_id: '',
    hotel_id: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [perfiles, setPerfiles] = useState<any[]>([]);
  const [hoteles, setHoteles] = useState<any[]>([]);
  const [filteredHoteles, setFilteredHoteles] = useState<any[]>([]);
  const [hotelSearch, setHotelSearch] = useState('');
  const [showHotelDropdown, setShowHotelDropdown] = useState(false);
  const [selectedPerfil, setSelectedPerfil] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [perfilesData, hotelesData] = await Promise.all([
          getPerfiles(),
          getHotelesForUsers()
        ]);
        setPerfiles(perfilesData);
        setHoteles(hotelesData);
        setFilteredHoteles(hotelesData);
      } catch (err) {
        console.error('Error cargando datos:', err);
      }
    };
    
    loadData();
  }, []);

  useEffect(() => {
    if (usuario) {
      setFormData({
        nombre_completo: usuario.nombre_completo || '',
        correo: usuario.correo || '',
        telefono: usuario.telefono || '',
        perfil_id: usuario.perfil_id?.toString() || '',
        hotel_id: usuario.hotel_id?.toString() || '',
        password: ''
      });
      
      if (usuario.hotel_id && usuario.nombre_comercial) {
        setHotelSearch(usuario.nombre_comercial);
      }
    }
  }, [usuario]);

  useEffect(() => {
    if (formData.perfil_id && perfiles.length > 0) {
      const perfil = perfiles.find(p => p.id_perfil === parseInt(formData.perfil_id));
      setSelectedPerfil(perfil);
    }
  }, [formData.perfil_id, perfiles]);

  // Filtrar hoteles cuando cambia la búsqueda
  useEffect(() => {
    if (hotelSearch.trim() === '') {
      setFilteredHoteles(hoteles);
    } else {
      const filtered = hoteles.filter(hotel =>
        hotel.nombre_comercial?.toLowerCase().includes(hotelSearch.toLowerCase()) ||
        hotel.razon_social?.toLowerCase().includes(hotelSearch.toLowerCase())
      );
      setFilteredHoteles(filtered);
    }
  }, [hotelSearch, hoteles]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Si cambia el perfil, actualizar el perfil seleccionado
    if (name === 'perfil_id') {
      const perfil = perfiles.find(p => p.id_perfil === parseInt(value));
      setSelectedPerfil(perfil);
      
      // Si el perfil no requiere hotel o está bloqueado, limpiar la selección
      if (perfil && (!requiresHotel(perfil.nombre_perfil) || isHotelBlocked(perfil.nombre_perfil))) {
        setFormData(prev => ({ ...prev, hotel_id: '' }));
        setHotelSearch('');
      }
    }
  };

  // Función para obtener el perfil actual
  const getCurrentPerfil = () => {
    if (selectedPerfil) return selectedPerfil;
    if (formData.perfil_id) {
      return perfiles.find(p => p.id_perfil === parseInt(formData.perfil_id));
    }
    return null;
  };

  // Función para determinar si un perfil requiere hotel
  const requiresHotel = (nombrePerfil: string): boolean => {
    return ['Operador', 'Supervisor'].includes(nombrePerfil);
  };

  // Función para determinar si un perfil NO debe tener hotel (bloqueado)
  const isHotelBlocked = (nombrePerfil: string): boolean => {
    return ['Administrador', 'Chofer', 'Operario Lavandería'].includes(nombrePerfil);
  };

  // Manejar búsqueda de hotel
  const handleHotelSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHotelSearch(value);
    setShowHotelDropdown(true);
    
    // Si se borra el texto, limpiar la selección
    if (value === '') {
      setFormData(prev => ({ ...prev, hotel_id: '' }));
    }
  };

  // Seleccionar hotel del dropdown
  const selectHotel = (hotel: any) => {
    setFormData(prev => ({ ...prev, hotel_id: hotel.id_hotel.toString() }));
    setHotelSearch(hotel.nombre_comercial);
    setShowHotelDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        perfil_id: parseInt(formData.perfil_id),
        hotel_id: formData.hotel_id ? parseInt(formData.hotel_id) : undefined
      };
      
      // Si es edición y no se cambió la contraseña, no enviarla
      if (usuario && (!formData.password || formData.password.trim() === '')) {
        const { password, ...dataWithoutPassword } = submitData;
        await onSave(dataWithoutPassword);
      } else {
        await onSave(submitData);
      }
    } catch (err: any) {
      console.error('❌ Error en formulario:', err);
      
      // Manejar errores de validación específicos
      if (err.response?.status === 400 && err.response?.data?.error?.details) {
        const validationErrors = err.response.data.error.details
          .map((detail: any) => `${detail.field}: ${detail.message}`)
          .join(', ');
        setError(`Errores de validación: ${validationErrors}`);
      } else {
        setError(err.message || err.response?.data?.error?.message || 'Error al guardar el usuario');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl transform transition-all">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {usuario ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}
              </h3>
              <p className="text-gray-600">
                {usuario ? 'Modifica la información del usuario' : 'Completa los datos del nuevo usuario'}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-all duration-300 hover:bg-gray-100 rounded-full p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <span className="text-red-500 mr-2">⚠️</span>
                <div className="text-sm text-red-700 font-medium">{error}</div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre Completo */}
            <div>
              <label htmlFor="nombre_completo" className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre Completo *
              </label>
              <input
                type="text"
                id="nombre_completo"
                name="nombre_completo"
                value={formData.nombre_completo}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white"
                placeholder="Juan Pérez García"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Correo */}
              <div>
                <label htmlFor="correo" className="block text-sm font-semibold text-gray-700 mb-2">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white"
                  placeholder="juan@ejemplo.com"
                />
              </div>

              {/* Teléfono */}
              <div>
                <label htmlFor="telefono" className="block text-sm font-semibold text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white"
                  placeholder="999-888-777"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Perfil/Rol */}
              <div>
                <label htmlFor="perfil_id" className="block text-sm font-semibold text-gray-700 mb-2">
                  Rol *
                </label>
                <select
                  id="perfil_id"
                  name="perfil_id"
                  value={formData.perfil_id}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white"
                >
                  <option value="">Seleccionar rol...</option>
                  {perfiles.map((perfil) => (
                    <option key={perfil.id_perfil} value={perfil.id_perfil}>
                      {perfil.nombre_perfil}
                    </option>
                  ))}
                </select>
              </div>

              {/* Hotel - Autocompletable */}
              <div className="relative">
                <label htmlFor="hotel_search" className="block text-sm font-semibold text-gray-700 mb-2">
                  Hotel {getCurrentPerfil() && requiresHotel(getCurrentPerfil()?.nombre_perfil || '') ? '*' : '(Opcional)'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="hotel_search"
                    value={hotelSearch}
                    onChange={handleHotelSearch}
                    onFocus={() => setShowHotelDropdown(true)}
                    onBlur={() => setTimeout(() => setShowHotelDropdown(false), 200)}
                    required={getCurrentPerfil() && requiresHotel(getCurrentPerfil()?.nombre_perfil || '')}
                    disabled={getCurrentPerfil() && isHotelBlocked(getCurrentPerfil()?.nombre_perfil || '')}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                      getCurrentPerfil() && isHotelBlocked(getCurrentPerfil()?.nombre_perfil || '')
                        ? 'bg-gray-100 border-gray-200 cursor-not-allowed'
                        : 'border-gray-200 bg-gray-50 hover:bg-white'
                    }`}
                    placeholder={
                      getCurrentPerfil() && isHotelBlocked(getCurrentPerfil()?.nombre_perfil || '')
                        ? 'No puede tener hotel asignado'
                        : 'Buscar hotel...'
                    }
                  />
                  
                  {/* Dropdown de hoteles */}
                  {showHotelDropdown && hotelSearch && filteredHoteles.length > 0 && !isHotelBlocked(getCurrentPerfil()?.nombre_perfil || '') && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredHoteles.map((hotel) => (
                        <div
                          key={hotel.id_hotel}
                          onClick={() => selectHotel(hotel)}
                          className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-semibold text-gray-900">{hotel.nombre_comercial}</div>
                          <div className="text-sm text-gray-600">{hotel.razon_social}</div>
                          {hotel.ruc && (
                            <div className="text-xs text-gray-500">RUC: {hotel.ruc}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Mensaje cuando no hay resultados */}
                  {showHotelDropdown && hotelSearch && filteredHoteles.length === 0 && !isHotelBlocked(getCurrentPerfil()?.nombre_perfil || '') && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500">
                      No se encontraron hoteles
                    </div>
                  )}
                </div>
                

              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Contraseña {usuario ? '(Dejar vacío para mantener actual)' : '*'}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required={!usuario}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white"
                placeholder={usuario ? "Nueva contraseña (opcional)" : "Contraseña"}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
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
                    Guardando...
                  </span>
                ) : (
                  <span>{usuario ? 'Actualizar Usuario' : 'Crear Usuario'}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UsuarioForm;