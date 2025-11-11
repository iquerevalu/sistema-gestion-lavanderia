import { api } from './api';
import { GuiaLavanderia } from '../types';

export interface GuiasResponse {
  guias: GuiaLavanderia[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CreateGuiaData {
  hotel_id: number;
  fecha_recoleccion: string;
  chofer_recojo_id: number;
  observaciones?: string;
  prendas: {
    prenda_id: number;
    cantidad_sucia: number;
    es_devuelta: boolean;
  }[];
}

// Obtener todas las guías
export const getAllGuias = async (page: number = 1, limit: number = 10, filters?: any): Promise<GuiasResponse> => {
  let url = `/guias?page=${page}&limit=${limit}`;
  
  if (filters) {
    if (filters.numero_guia) url += `&numero_guia=${filters.numero_guia}`;
    if (filters.hotel_id) url += `&hotel_id=${filters.hotel_id}`;
    if (filters.estado) url += `&estado=${filters.estado}`;
  }
  
  const response = await api.get(url);
  return response.data.data || response.data;
};

// Obtener guía por ID
export const getGuiaById = async (id: number): Promise<GuiaLavanderia> => {
  const response = await api.get(`/guias/${id}`);
  return response.data.data || response.data;
};

// Crear nueva guía
export const createGuia = async (guiaData: CreateGuiaData): Promise<GuiaLavanderia> => {
  const response = await api.post('/guias', guiaData);
  return response.data.data || response.data;
};

// Actualizar guía
export const updateGuia = async (id: number, guiaData: any): Promise<GuiaLavanderia> => {
  const response = await api.put(`/guias/${id}`, guiaData);
  return response.data.data || response.data;
};

// Obtener siguiente número de guía para un hotel
export const getNextGuiaNumber = async (hotelId: number): Promise<number> => {
  try {
    const response = await api.get(`/guias/next-number/${hotelId}`);
    return response.data.data?.nextNumber || response.data.nextNumber || 1;
  } catch (error) {
    console.error('Error obteniendo número de guía:', error);
    return 1;
  }
};

// Obtener choferes disponibles
export const getChoferes = async (): Promise<any[]> => {
  try {
    const response = await api.get('/usuarios/choferes');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('Error cargando choferes:', error);
    return [];
  }
};

// Obtener prendas disponibles para un hotel
export const getPrendasByHotel = async (hotelId: number): Promise<any[]> => {
  try {
    const response = await api.get(`/guias/hotel/${hotelId}/prendas`);
    if (response.data.success && response.data.data) {
      const prendas = response.data.data;
      // Asegurar que precio_unitario sea número
      return prendas.map((p: any) => ({
        ...p,
        precio_unitario: parseFloat(p.precio_unitario || 0)
      }));
    }
    return [];
  } catch (error) {
    console.error('Error cargando prendas del hotel:', error);
    return [];
  }
};

// Obtener guías para procesar (solo Registrado y Pendiente)
export const getGuiasParaProcesar = async (page: number = 1, limit: number = 10, filters?: any): Promise<GuiasResponse> => {
  let url = `/guias/procesar?page=${page}&limit=${limit}`;
  
  if (filters) {
    if (filters.numero_guia) url += `&numero_guia=${filters.numero_guia}`;
    if (filters.hotel_id) url += `&hotel_id=${filters.hotel_id}`;
    if (filters.estado) url += `&estado=${filters.estado}`;
  }
  
  const response = await api.get(url);
  return response.data.data || response.data;
};

// Procesar guía (actualizar cantidades)
export const procesarGuia = async (
  idGuia: number,
  prendas: { id_detalle: number; cantidad_limpia: number }[],
  observaciones?: string,
  estadoId?: number
): Promise<GuiaLavanderia> => {
  const response = await api.put(`/guias/${idGuia}/cantidades`, { 
    prendas,
    observaciones,
    estado_id: estadoId
  });
  return response.data.data || response.data;
};

// Obtener guías para entregar (solo Lista para Entregar y Pendiente)
export const getGuiasParaEntregar = async (page: number = 1, limit: number = 10, filters?: any): Promise<GuiasResponse> => {
  let url = `/guias/entregar?page=${page}&limit=${limit}`;
  
  if (filters) {
    if (filters.numero_guia) url += `&numero_guia=${filters.numero_guia}`;
    if (filters.hotel_id) url += `&hotel_id=${filters.hotel_id}`;
  }
  
  const response = await api.get(url);
  return response.data.data || response.data;
};

// Marcar guía como entregada
export const marcarComoEntregada = async (
  idGuia: number,
  recepcionistaEntregaId: number,
  entregado: boolean,
  observaciones?: string
): Promise<GuiaLavanderia> => {
  const response = await api.put(`/guias/${idGuia}/entregar`, { 
    recepcionista_entrega_id: recepcionistaEntregaId,
    entregado,
    observaciones 
  });
  return response.data.data || response.data;
};

// Obtener recepcionistas de un hotel
export const getRecepcionistasByHotel = async (hotelId: number): Promise<any[]> => {
  try {
    // Obtener todos los usuarios y filtrar en el frontend
    const response = await api.get(`/usuarios?page=1&limit=100`);
    
    console.log('Response completa:', response.data);
    
    if (response.data.success && response.data.data) {
      const data = response.data.data;
      console.log('Data:', data);
      
      // Intentar obtener el array de usuarios de diferentes formas
      let usuarios = [];
      if (Array.isArray(data)) {
        usuarios = data;
      } else if (data.users && Array.isArray(data.users)) {
        usuarios = data.users;
      } else if (data.usuarios && Array.isArray(data.usuarios)) {
        usuarios = data.usuarios;
      } else if (data.data && Array.isArray(data.data)) {
        usuarios = data.data;
      }
      
      console.log('Usuarios array:', usuarios);
      console.log('Hotel ID buscado:', hotelId);
      
      if (!Array.isArray(usuarios)) {
        console.error('usuarios no es un array:', usuarios);
        return [];
      }
      
      // Filtrar recepcionistas del hotel específico
      const recepcionistas = usuarios.filter((u: any) => {
        console.log('Usuario:', u.nombre_completo, 'Perfil:', u.nombre_perfil, 'Hotel:', u.hotel_id);
        
        const esRecepcionista = u.nombre_perfil === 'Recepcionista Hotel' || 
                                u.perfil_nombre === 'Recepcionista Hotel';
        const esDelHotel = u.hotel_id === hotelId;
        const estaActivo = u.estado === 1;
        
        return esRecepcionista && esDelHotel && estaActivo;
      });
      
      console.log('Recepcionistas encontradas:', recepcionistas);
      return recepcionistas;
    }
    return [];
  } catch (error) {
    console.error('Error cargando recepcionistas:', error);
    return [];
  }
};