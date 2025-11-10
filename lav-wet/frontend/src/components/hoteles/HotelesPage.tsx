import React, { useState, useEffect } from 'react';
import { Hotel } from '../../types';
import HotelesList from './HotelesList';
import HotelForm from './HotelForm';
import { getAllHoteles, createHotel, updateHotel, deleteHotel } from '../../services/hotelService';

const HotelesPage: React.FC = () => {
  const [hoteles, setHoteles] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // Cargar hoteles
  const loadHoteles = async (page: number = currentPage) => {
    console.log('🔄 HotelesPage: Iniciando carga de hoteles, página:', page);
    try {
      setLoading(true);
      setError('');
      const response = await getAllHoteles(page, itemsPerPage);
      console.log('📦 HotelesPage: Respuesta recibida:', response);
      setHoteles(response.hotels || []);
      setTotalPages(response.totalPages || 1);
      setTotalItems(response.total || 0);
      setCurrentPage(page);
      console.log('✅ HotelesPage: Estado actualizado - hoteles:', response.hotels?.length || 0);
    } catch (err: any) {
      console.error('❌ HotelesPage: Error cargando hoteles:', err);
      setError(err.message || 'Error al cargar hoteles');
      setHoteles([]);
    } finally {
      setLoading(false);
      console.log('🏁 HotelesPage: Carga finalizada');
    }
  };

  useEffect(() => {
    loadHoteles();
  }, []);

  const handleAdd = () => {
    setEditingHotel(null);
    setShowForm(true);
  };

  const handleEdit = (hotel: Hotel) => {
    setEditingHotel(hotel);
    setShowForm(true);
  };

  const handleSave = async (hotelData: any) => {
    try {
      if (editingHotel) {
        // Actualizar hotel existente
        await updateHotel({
          id_hotel: editingHotel.id_hotel,
          ...hotelData
        });
      } else {
        // Crear nuevo hotel
        await createHotel(hotelData);
      }
      
      setShowForm(false);
      setEditingHotel(null);
      await loadHoteles(currentPage); // Recargar la lista
    } catch (err: any) {
      throw new Error(err.message || 'Error al guardar hotel');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteHotel(id);
      // Si estamos en la última página y solo queda un elemento, ir a la página anterior
      const newPage = hoteles.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
      await loadHoteles(newPage); // Recargar la lista
    } catch (err: any) {
      setError(err.message || 'Error al eliminar hotel');
    }
  };

  const handlePageChange = (page: number) => {
    loadHoteles(page);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingHotel(null);
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HotelesList
            hoteles={hoteles}
            loading={loading}
            error={error}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRefresh={() => loadHoteles(currentPage)}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />

          {showForm && (
            <HotelForm
              hotel={editingHotel}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelesPage;