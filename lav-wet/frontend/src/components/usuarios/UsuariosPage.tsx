import React, { useState, useEffect } from 'react';
import { Usuario } from '../../types';
import UsuariosList from './UsuariosList.tsx';
import UsuarioForm from './UsuarioForm.tsx';
import { getAllUsers, createUser, updateUser, deleteUser } from '../../services/userService';

const UsuariosPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // Cargar usuarios
  const loadUsuarios = async (page: number = currentPage) => {
    try {
      setLoading(true);
      setError('');
      const response = await getAllUsers(page, itemsPerPage);
      setUsuarios(response.users || []);
      setTotalPages(response.totalPages || 1);
      setTotalItems(response.total || 0);
      setCurrentPage(page);
    } catch (err: any) {
      setError(err.message || 'Error al cargar usuarios');
      setUsuarios([]); // Asegurar que siempre sea un array
      console.error('Error cargando usuarios:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsuarios();
  }, []);

  const handleAdd = () => {
    setEditingUsuario(null);
    setShowForm(true);
  };

  const handleEdit = (usuario: Usuario) => {
    setEditingUsuario(usuario);
    setShowForm(true);
  };

  const handleSave = async (userData: any) => {
    try {
      if (editingUsuario) {
        // Actualizar usuario existente
        await updateUser({
          id_usuario: editingUsuario.id_usuario,
          ...userData
        });
      } else {
        // Crear nuevo usuario
        await createUser(userData);
      }
      
      setShowForm(false);
      setEditingUsuario(null);
      await loadUsuarios(currentPage); // Recargar la lista
    } catch (err: any) {
      throw new Error(err.message || 'Error al guardar usuario');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      // Si estamos en la última página y solo queda un elemento, ir a la página anterior
      const newPage = usuarios.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
      await loadUsuarios(newPage); // Recargar la lista
    } catch (err: any) {
      setError(err.message || 'Error al eliminar usuario');
    }
  };

  const handlePageChange = (page: number) => {
    loadUsuarios(page);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingUsuario(null);
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <UsuariosList
            usuarios={usuarios}
            loading={loading}
            error={error}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRefresh={() => loadUsuarios(currentPage)}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />

          {showForm && (
            <UsuarioForm
              usuario={editingUsuario}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UsuariosPage;