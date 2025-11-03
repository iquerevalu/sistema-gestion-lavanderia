import React, { useState, useEffect } from 'react';
import { Hotel } from '../../types';

interface HotelFormProps {
  hotel?: Hotel | null;
  onSave: (hotelData: any) => Promise<void>;
  onCancel: () => void;
}

const HotelForm: React.FC<HotelFormProps> = ({ hotel, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    ruc: '',
    razon_social: '',
    nombre_comercial: '',
    direccion: '',
    telefono: '',
    correo_contacto: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (hotel) {
      setFormData({
        ruc: hotel.ruc || '',
        razon_social: hotel.razon_social || '',
        nombre_comercial: hotel.nombre_comercial || '',
        direccion: hotel.direccion || '',
        telefono: hotel.telefono || '',
        correo_contacto: hotel.correo_contacto || ''
      });
    }
  }, [hotel]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSave(formData);
    } catch (err: any) {
      setError(err.message || 'Error al guardar el hotel');
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
                {hotel ? 'Editar Hotel' : 'Agregar Nuevo Hotel'}
              </h3>
              <p className="text-gray-600">
                {hotel ? 'Modifica la información del hotel' : 'Completa los datos del nuevo hotel'}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* RUC */}
              <div>
                <label htmlFor="ruc" className="block text-sm font-semibold text-gray-700 mb-2">
                  RUC
                </label>
                <input
                  type="text"
                  id="ruc"
                  name="ruc"
                  value={formData.ruc}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white"
                  placeholder="20123456789"
                />
              </div>

              {/* Nombre Comercial */}
              <div>
                <label htmlFor="nombre_comercial" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre Comercial *
                </label>
                <input
                  type="text"
                  id="nombre_comercial"
                  name="nombre_comercial"
                  value={formData.nombre_comercial}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white"
                  placeholder="Hotel Paradise"
                />
              </div>
            </div>

            {/* Razón Social */}
            <div>
              <label htmlFor="razon_social" className="block text-sm font-semibold text-gray-700 mb-2">
                🏢 Razón Social *
              </label>
              <input
                type="text"
                id="razon_social"
                name="razon_social"
                value={formData.razon_social}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white"
                placeholder="Hotel Paradise S.A.C."
              />
            </div>

            {/* Dirección */}
            <div>
              <label htmlFor="direccion" className="block text-sm font-semibold text-gray-700 mb-2">
                Dirección *
              </label>
              <textarea
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white resize-none"
                placeholder="Av. Principal 123, Lima"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Teléfono */}
              <div>
                <label htmlFor="telefono" className="block text-sm font-semibold text-gray-700 mb-2">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white"
                  placeholder="01-234-5678"
                />
              </div>

              {/* Correo */}
              <div>
                <label htmlFor="correo_contacto" className="block text-sm font-semibold text-gray-700 mb-2">
                  Correo de Contacto *
                </label>
                <input
                  type="email"
                  id="correo_contacto"
                  name="correo_contacto"
                  value={formData.correo_contacto}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white"
                  placeholder="contacto@hotel.com"
                />
              </div>
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
                  <span>{hotel ? 'Actualizar Hotel' : 'Crear Hotel'}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HotelForm;