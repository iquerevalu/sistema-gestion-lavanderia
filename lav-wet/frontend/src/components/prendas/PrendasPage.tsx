import React, { useState, useEffect } from 'react';
import { Prenda } from '../../types';
import PrendasList from './PrendasList.tsx';
import PrendaForm from './PrendaForm.tsx';
import { getAllPrendas, createPrenda, updatePrenda, deletePrenda } from '../../services/prendaService';

const PrendasPage: React.FC = () => {
  const [prendas, setPrendas] = useState<Prenda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPrenda, setEditingPrenda] = useState<Prenda | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // Cargar prendas
  const loadPrendas = async (page: number = currentPage) => {
    console.log('🚀 loadPrendas iniciado para página:', page);
    try {
      setLoading(true);
      setError('');
      console.log('📞 Llamando a getAllPrendas...');
      const response = await getAllPrendas(page, itemsPerPage);
      console.log('📦 Respuesta recibida:', response);
      setPrendas(response.prendas || []);
      setTotalPages(response.totalPages || 1);
      setTotalItems(response.total || 0);
      setCurrentPage(page);
      console.log('✅ Estado actualizado - prendas:', response.prendas?.length || 0);
    } catch (err: any) {
      console.error('❌ Error en loadPrendas:', err);
      setError(err.message || 'Error al cargar prendas');
      setPrendas([]); // Asegurar que siempre sea un array
      console.error('Error cargando prendas:', err);
    } finally {
      setLoading(false);
      console.log('🏁 loadPrendas finalizado');
    }
  };

  useEffect(() => {
    loadPrendas();
  }, []);

  const handleAdd = () => {
    setEditingPrenda(null);
    setShowForm(true);
  };

  const handleEdit = (prenda: Prenda) => {
    setEditingPrenda(prenda);
    setShowForm(true);
  };

  const handleSave = async (prendaData: any) => {
    try {
      if (editingPrenda) {
        // Actualizar prenda existente
        await updatePrenda({
          id_prenda: editingPrenda.id_prenda,
          ...prendaData
        });
      } else {
        // Crear nueva prenda
        await createPrenda(prendaData);
      }
      
      setShowForm(false);
      setEditingPrenda(null);
      await loadPrendas(currentPage); // Recargar la lista
    } catch (err: any) {
      throw new Error(err.message || 'Error al guardar prenda');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePrenda(id);
      // Si estamos en la última página y solo queda un elemento, ir a la página anterior
      const newPage = prendas.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
      await loadPrendas(newPage); // Recargar la lista
    } catch (err: any) {
      setError(err.message || 'Error al eliminar prenda');
    }
  };

  const handlePageChange = (page: number) => {
    loadPrendas(page);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPrenda(null);
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PrendasList
            prendas={prendas}
            loading={loading}
            error={error}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRefresh={() => loadPrendas(currentPage)}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />

          {showForm && (
            <PrendaForm
              prenda={editingPrenda}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PrendasPage;