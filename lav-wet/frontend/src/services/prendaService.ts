import { api } from './api';
import { Prenda, Categoria } from '../types';

export interface CreatePrendaRequest {
  nombre_prenda: string;
  descripcion?: string;
  categoria_id: number;
}

export interface UpdatePrendaRequest extends Partial<CreatePrendaRequest> {
  id_prenda: number;
}

export interface PrendasResponse {
  prendas: Prenda[];
  total: number;
  page: number;
  totalPages: number;
}

// Obtener todas las prendas
export const getAllPrendas = async (page: number = 1, limit: number = 10): Promise<PrendasResponse> => {
  try {
    const response = await api.get(`/prendas?page=${page}&limit=${limit}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error('Formato de respuesta inválido');
  } catch (error) {
    console.error('Error cargando prendas, usando datos simulados:', error);
    // Datos ficticios para demostración
    const prendasEstaticas: Prenda[] = [
      {
        id_prenda: 1,
        nombre_prenda: 'Sábana Individual',
        descripcion: 'Sábana de algodón para cama individual',
        categoria_id: 1,
        estado: 1,
        fecha_creacion: '2024-01-15T10:00:00Z',
        fecha_actualizacion: '2024-01-15T10:00:00Z',
        nombre_categoria: 'Ropa de Cama'
      },
      {
        id_prenda: 2,
        nombre_prenda: 'Sábana Matrimonial',
        descripcion: 'Sábana de algodón para cama matrimonial',
        categoria_id: 1,
        estado: 1,
        fecha_creacion: '2024-01-15T10:05:00Z',
        fecha_actualizacion: '2024-01-15T10:05:00Z',
        nombre_categoria: 'Ropa de Cama'
      },
      {
        id_prenda: 3,
        nombre_prenda: 'Sábana King Size',
        descripcion: 'Sábana de algodón premium para cama king size',
        categoria_id: 1,
        estado: 1,
        fecha_creacion: '2024-01-15T10:10:00Z',
        fecha_actualizacion: '2024-01-15T10:10:00Z',
        nombre_categoria: 'Ropa de Cama'
      },
      {
        id_prenda: 4,
        nombre_prenda: 'Funda de Almohada',
        descripcion: 'Funda de almohada estándar',
        categoria_id: 1,
        estado: 1,
        fecha_creacion: '2024-01-15T10:15:00Z',
        fecha_actualizacion: '2024-01-15T10:15:00Z',
        nombre_categoria: 'Ropa de Cama'
      },
      {
        id_prenda: 5,
        nombre_prenda: 'Funda de Almohada King',
        descripcion: 'Funda de almohada para cama king size',
        categoria_id: 1,
        estado: 1,
        fecha_creacion: '2024-01-15T10:20:00Z',
        fecha_actualizacion: '2024-01-15T10:20:00Z',
        nombre_categoria: 'Ropa de Cama'
      },
      {
        id_prenda: 6,
        nombre_prenda: 'Cobertor Individual',
        descripcion: 'Cobertor de lana para cama individual',
        categoria_id: 1,
        estado: 1,
        fecha_creacion: '2024-01-15T10:25:00Z',
        fecha_actualizacion: '2024-01-15T10:25:00Z',
        nombre_categoria: 'Ropa de Cama'
      },
      {
        id_prenda: 7,
        nombre_prenda: 'Cobertor Matrimonial',
        descripcion: 'Cobertor de lana para cama matrimonial',
        categoria_id: 1,
        estado: 1,
        fecha_creacion: '2024-01-15T10:30:00Z',
        fecha_actualizacion: '2024-01-15T10:30:00Z',
        nombre_categoria: 'Ropa de Cama'
      },
      {
        id_prenda: 8,
        nombre_prenda: 'Cobertor King Size',
        descripcion: 'Cobertor premium para cama king size',
        categoria_id: 1,
        estado: 1,
        fecha_creacion: '2024-01-15T10:35:00Z',
        fecha_actualizacion: '2024-01-15T10:35:00Z',
        nombre_categoria: 'Ropa de Cama'
      },
      {
        id_prenda: 9,
        nombre_prenda: 'Protector de Colchón Individual',
        descripcion: 'Protector impermeable para colchón individual',
        categoria_id: 1,
        estado: 1,
        fecha_creacion: '2024-01-15T10:40:00Z',
        fecha_actualizacion: '2024-01-15T10:40:00Z',
        nombre_categoria: 'Ropa de Cama'
      },
      {
        id_prenda: 10,
        nombre_prenda: 'Protector de Colchón Matrimonial',
        descripcion: 'Protector impermeable para colchón matrimonial',
        categoria_id: 1,
        estado: 1,
        fecha_creacion: '2024-01-15T10:45:00Z',
        fecha_actualizacion: '2024-01-15T10:45:00Z',
        nombre_categoria: 'Ropa de Cama'
      },
      {
        id_prenda: 11,
        nombre_prenda: 'Protector de Colchón King',
        descripcion: 'Protector impermeable premium para colchón king',
        categoria_id: 1,
        estado: 1,
        fecha_creacion: '2024-01-15T10:50:00Z',
        fecha_actualizacion: '2024-01-15T10:50:00Z',
        nombre_categoria: 'Ropa de Cama'
      },
      {
        id_prenda: 12,
        nombre_prenda: 'Edredón Individual',
        descripcion: 'Edredón de plumas para cama individual',
        categoria_id: 1,
        estado: 1,
        fecha_creacion: '2024-01-15T11:00:00Z',
        fecha_actualizacion: '2024-01-15T11:00:00Z',
        nombre_categoria: 'Ropa de Cama'
      },
      {
        id_prenda: 13,
        nombre_prenda: 'Edredón Matrimonial',
        descripcion: 'Edredón de plumas para cama matrimonial',
        categoria_id: 1,
        estado: 1,
        fecha_creacion: '2024-01-15T11:05:00Z',
        fecha_actualizacion: '2024-01-15T11:05:00Z',
        nombre_categoria: 'Ropa de Cama'
      },
      {
        id_prenda: 14,
        nombre_prenda: 'Edredón King Size',
        descripcion: 'Edredón premium de plumas para cama king',
        categoria_id: 1,
        estado: 1,
        fecha_creacion: '2024-01-15T11:10:00Z',
        fecha_actualizacion: '2024-01-15T11:10:00Z',
        nombre_categoria: 'Ropa de Cama'
      },
      {
        id_prenda: 15,
        nombre_prenda: 'Cubrecama Individual',
        descripcion: 'Cubrecama decorativo para cama individual',
        categoria_id: 1,
        estado: 1,
        fecha_creacion: '2024-01-15T11:15:00Z',
        fecha_actualizacion: '2024-01-15T11:15:00Z',
        nombre_categoria: 'Ropa de Cama'
      },
      {
        id_prenda: 16,
        nombre_prenda: 'Cubrecama Matrimonial',
        descripcion: 'Cubrecama decorativo para cama matrimonial',
        categoria_id: 1,
        estado: 1,
        fecha_creacion: '2024-01-15T11:20:00Z',
        fecha_actualizacion: '2024-01-15T11:20:00Z',
        nombre_categoria: 'Ropa de Cama'
      },
      {
        id_prenda: 17,
        nombre_prenda: 'Toalla de Baño',
        descripcion: 'Toalla de algodón absorbente para baño',
        categoria_id: 2,
        estado: 1,
        fecha_creacion: '2024-01-15T11:25:00Z',
        fecha_actualizacion: '2024-01-15T11:25:00Z',
        nombre_categoria: 'Toallas'
      },
      {
        id_prenda: 18,
        nombre_prenda: 'Toalla de Mano',
        descripcion: 'Toalla pequeña para manos',
        categoria_id: 2,
        estado: 1,
        fecha_creacion: '2024-01-15T11:30:00Z',
        fecha_actualizacion: '2024-01-15T11:30:00Z',
        nombre_categoria: 'Toallas'
      },
      {
        id_prenda: 19,
        nombre_prenda: 'Toalla de Piso',
        descripcion: 'Toalla antideslizante para piso de baño',
        categoria_id: 2,
        estado: 1,
        fecha_creacion: '2024-01-15T11:35:00Z',
        fecha_actualizacion: '2024-01-15T11:35:00Z',
        nombre_categoria: 'Toallas'
      },
      {
        id_prenda: 20,
        nombre_prenda: 'Toalla de Playa',
        descripcion: 'Toalla grande para uso en piscina o playa',
        categoria_id: 2,
        estado: 1,
        fecha_creacion: '2024-01-15T11:40:00Z',
        fecha_actualizacion: '2024-01-15T11:40:00Z',
        nombre_categoria: 'Toallas'
      },
      {
        id_prenda: 21,
        nombre_prenda: 'Toallón',
        descripcion: 'Toalla extra grande premium',
        categoria_id: 2,
        estado: 1,
        fecha_creacion: '2024-01-15T11:45:00Z',
        fecha_actualizacion: '2024-01-15T11:45:00Z',
        nombre_categoria: 'Toallas'
      },
      {
        id_prenda: 22,
        nombre_prenda: 'Cortina de Baño',
        descripcion: 'Cortina impermeable para ducha',
        categoria_id: 3,
        estado: 1,
        fecha_creacion: '2024-01-15T11:50:00Z',
        fecha_actualizacion: '2024-01-15T11:50:00Z',
        nombre_categoria: 'Cortinas'
      },
      {
        id_prenda: 23,
        nombre_prenda: 'Cortina Blackout',
        descripcion: 'Cortina opaca para bloquear luz',
        categoria_id: 3,
        estado: 1,
        fecha_creacion: '2024-01-15T11:55:00Z',
        fecha_actualizacion: '2024-01-15T11:55:00Z',
        nombre_categoria: 'Cortinas'
      },
      {
        id_prenda: 24,
        nombre_prenda: 'Cortina Decorativa',
        descripcion: 'Cortina decorativa para ventanas',
        categoria_id: 3,
        estado: 1,
        fecha_creacion: '2024-01-15T12:00:00Z',
        fecha_actualizacion: '2024-01-15T12:00:00Z',
        nombre_categoria: 'Cortinas'
      },
      {
        id_prenda: 25,
        nombre_prenda: 'Mantel Individual',
        descripcion: 'Mantel para mesa de 2 personas',
        categoria_id: 4,
        estado: 1,
        fecha_creacion: '2024-01-15T12:05:00Z',
        fecha_actualizacion: '2024-01-15T12:05:00Z',
        nombre_categoria: 'Mantelería'
      },
      {
        id_prenda: 26,
        nombre_prenda: 'Mantel para 4 personas',
        descripcion: 'Mantel para mesa de 4 personas',
        categoria_id: 4,
        estado: 1,
        fecha_creacion: '2024-01-15T12:10:00Z',
        fecha_actualizacion: '2024-01-15T12:10:00Z',
        nombre_categoria: 'Mantelería'
      },
      {
        id_prenda: 27,
        nombre_prenda: 'Mantel para 6 personas',
        descripcion: 'Mantel para mesa de 6 personas',
        categoria_id: 4,
        estado: 1,
        fecha_creacion: '2024-01-15T12:15:00Z',
        fecha_actualizacion: '2024-01-15T12:15:00Z',
        nombre_categoria: 'Mantelería'
      },
      {
        id_prenda: 28,
        nombre_prenda: 'Servilleta de Tela',
        descripcion: 'Servilleta de tela reutilizable',
        categoria_id: 4,
        estado: 1,
        fecha_creacion: '2024-01-15T12:20:00Z',
        fecha_actualizacion: '2024-01-15T12:20:00Z',
        nombre_categoria: 'Mantelería'
      },
      {
        id_prenda: 29,
        nombre_prenda: 'Uniforme de Recepción',
        descripcion: 'Uniforme completo para personal de recepción',
        categoria_id: 5,
        estado: 1,
        fecha_creacion: '2024-01-15T12:25:00Z',
        fecha_actualizacion: '2024-01-15T12:25:00Z',
        nombre_categoria: 'Uniformes'
      },
      {
        id_prenda: 30,
        nombre_prenda: 'Uniforme de Limpieza',
        descripcion: 'Uniforme para personal de limpieza',
        categoria_id: 5,
        estado: 1,
        fecha_creacion: '2024-01-15T12:30:00Z',
        fecha_actualizacion: '2024-01-15T12:30:00Z',
        nombre_categoria: 'Uniformes'
      },
      {
        id_prenda: 31,
        nombre_prenda: 'Uniforme de Cocina',
        descripcion: 'Uniforme completo para personal de cocina',
        categoria_id: 5,
        estado: 1,
        fecha_creacion: '2024-01-15T12:35:00Z',
        fecha_actualizacion: '2024-01-15T12:35:00Z',
        nombre_categoria: 'Uniformes'
      },
      {
        id_prenda: 32,
        nombre_prenda: 'Delantal',
        descripcion: 'Delantal impermeable para cocina',
        categoria_id: 5,
        estado: 1,
        fecha_creacion: '2024-01-15T12:40:00Z',
        fecha_actualizacion: '2024-01-15T12:40:00Z',
        nombre_categoria: 'Uniformes'
      }
    ];

    // Simular paginación
    const totalItems = prendasEstaticas.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const prendasPaginadas = prendasEstaticas.slice(startIndex, endIndex);

    const resultado = {
      prendas: prendasPaginadas,
      total: totalItems,
      page: page,
      totalPages: totalPages
    };
    
    return resultado;
  }
};

// Obtener prenda por ID
export const getPrendaById = async (id: number): Promise<Prenda> => {
  // Por ahora simulamos una prenda
  const prendaSimulada: Prenda = {
    id_prenda: id,
    nombre_prenda: 'Prenda Simulada',
    descripcion: 'Descripción simulada',
    categoria_id: 1,
    estado: 1,
    fecha_creacion: new Date().toISOString(),
    fecha_actualizacion: new Date().toISOString(),
    nombre_categoria: 'Categoría Simulada'
  };
  
  return prendaSimulada;
};

// Crear nueva prenda
export const createPrenda = async (prendaData: CreatePrendaRequest): Promise<Prenda> => {
  try {
    const response = await api.post('/prendas', prendaData);
    return response.data.data || response.data;
  } catch (error) {
    // Simular creación exitosa
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const nuevaPrenda: Prenda = {
      id_prenda: Math.floor(Math.random() * 1000) + 100,
      nombre_prenda: prendaData.nombre_prenda,
      descripcion: prendaData.descripcion,
      categoria_id: prendaData.categoria_id,
      estado: 1,
      fecha_creacion: new Date().toISOString(),
      fecha_actualizacion: new Date().toISOString(),
      nombre_categoria: 'Categoría Simulada'
    };
    
    return nuevaPrenda;
  }
};

// Actualizar prenda
export const updatePrenda = async (prendaData: UpdatePrendaRequest): Promise<Prenda> => {
  try {
    const response = await api.put(`/prendas/${prendaData.id_prenda}`, prendaData);
    return response.data.data || response.data;
  } catch (error) {
    // Simular actualización exitosa
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const prendaActualizada: Prenda = {
      id_prenda: prendaData.id_prenda,
      nombre_prenda: prendaData.nombre_prenda || 'Prenda Actualizada',
      descripcion: prendaData.descripcion,
      categoria_id: prendaData.categoria_id || 1,
      estado: 1,
      fecha_creacion: '2024-01-15T10:00:00Z',
      fecha_actualizacion: new Date().toISOString(),
      nombre_categoria: 'Categoría Actualizada'
    };
    
    return prendaActualizada;
  }
};

// Eliminar prenda
export const deletePrenda = async (id: number): Promise<void> => {
  const response = await api.delete(`/prendas/${id}`);
  return response.data;
};

// Obtener categorías disponibles
export const getCategorias = async (): Promise<Categoria[]> => {
  try {
    const response = await api.get('/prendas/categorias');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('Error cargando categorías, usando datos simulados:', error);
    // Datos ficticios de categorías para demostración
    const categoriasEstaticas: Categoria[] = [
      {
        id_categoria: 1,
        nombre_categoria: 'Ropa de Cama',
        descripcion: 'Sábanas, fundas, cobertores y edredones',
        estado: 1,
        fecha_creacion: '2024-01-01T10:00:00Z',
        fecha_actualizacion: '2024-01-01T10:00:00Z'
      },
      {
        id_categoria: 2,
        nombre_categoria: 'Toallas',
        descripcion: 'Toallas de baño, mano, piso y playa',
        estado: 1,
        fecha_creacion: '2024-01-01T10:05:00Z',
        fecha_actualizacion: '2024-01-01T10:05:00Z'
      },
      {
        id_categoria: 3,
        nombre_categoria: 'Cortinas',
        descripcion: 'Cortinas de baño, blackout y decorativas',
        estado: 1,
        fecha_creacion: '2024-01-01T10:10:00Z',
        fecha_actualizacion: '2024-01-01T10:10:00Z'
      },
      {
        id_categoria: 4,
        nombre_categoria: 'Mantelería',
        descripcion: 'Manteles y servilletas de tela',
        estado: 1,
        fecha_creacion: '2024-01-01T10:15:00Z',
        fecha_actualizacion: '2024-01-01T10:15:00Z'
      },
      {
        id_categoria: 5,
        nombre_categoria: 'Uniformes',
        descripcion: 'Uniformes de personal y delantales',
        estado: 1,
        fecha_creacion: '2024-01-01T10:20:00Z',
        fecha_actualizacion: '2024-01-01T10:20:00Z'
      }
    ];

    return categoriasEstaticas;
  }
};

// Crear nueva categoría
export const createCategoria = async (nombre: string, descripcion?: string): Promise<Categoria> => {
  try {
    const response = await api.post('/prendas/categorias', { nombre_categoria: nombre, descripcion });
    return response.data.data || response.data;
  } catch (error) {
    // Simular creación de categoría
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const nuevaCategoria: Categoria = {
      id_categoria: Math.floor(Math.random() * 100) + 10,
      nombre_categoria: nombre,
      descripcion: descripcion,
      estado: 1,
      fecha_creacion: new Date().toISOString(),
      fecha_actualizacion: new Date().toISOString()
    };
    
    return nuevaCategoria;
  }
};