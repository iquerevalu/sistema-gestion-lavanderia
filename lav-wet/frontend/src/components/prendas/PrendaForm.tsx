import React, { useState, useEffect } from 'react';
import { Prenda, Categoria } from '../../types';
import { getCategorias } from '../../services/prendaService';

interface PrendaFormProps {
  prenda?: Prenda | null;
  onSave: (prendaData: any) => Promise<void>;
  onCancel: () => void;
}

const PrendaForm: React.FC<PrendaFormProps> = ({ prenda, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre_prenda: '',
    descripcion: '',
    categoria_id: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    // Cargar categorías
    const loadCategorias = async () => {
      try {
        const categoriasData = await getCategorias();
        setCategorias(categoriasData);
      } catch (err) {
        console.error('Error cargando categorías:', err);
      }
    };
    
    loadCategorias();

    // Llenar formulario si es edición
    if (prenda) {
      setFormData({
        nombre_prenda: prenda.nombre_prenda || '',
        descripcion: prenda.descripcion || '',
        categoria_id: prenda.categoria_id?.toString() || ''
      });
    }
  }, [prenda]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      const submitData = {
        ...formData,
        categoria_id: parseInt(formData.categoria_id)
      };
      
      await onSave(submitData);
    } catch (err: any) {
      setError(err.message || 'Error al guardar la prenda');
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
                {prenda ? 'Editar Prenda' : 'Agregar Nueva Prenda'}
              </h3>
              <p className="text-gray-600">
                {prenda ? 'Modifica la información de la prenda' : 'Completa los datos de la nueva prenda'}
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
            {/* Nombre de la Prenda */}
            <div>
              <label htmlFor="nombre_prenda" className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre de la Prenda *
              </label>
              <input
                type="text"
                id="nombre_prenda"
                name="nombre_prenda"
                value={formData.nombre_prenda}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white"
                placeholder="Ej: Sábana Individual, Toalla de Baño, Camisa"
              />
            </div>

            {/* Categoría */}
            <div>
              <label htmlFor="categoria_id" className="block text-sm font-semibold text-gray-700 mb-2">
                Categoría *
              </label>
              <select
                id="categoria_id"
                name="categoria_id"
                value={formData.categoria_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white"
              >
                <option value="">Seleccionar categoría...</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id_categoria} value={categoria.id_categoria}>
                    {categoria.nombre_categoria}
                  </option>
                ))}
              </select>
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="descripcion" className="block text-sm font-semibold text-gray-700 mb-2">
                Descripción (Opcional)
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white resize-none"
                placeholder="Descripción detallada de la prenda, materiales, cuidados especiales, etc."
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
                  <span>{prenda ? 'Actualizar Prenda' : 'Crear Prenda'}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PrendaForm;