// Interfaces TypeScript para el backend del sistema de guías de lavandería

export interface Usuario {
  id_usuario: number;
  nombre_completo: string;
  correo: string;
  telefono?: string;
  perfil_id: number;
  hotel_id?: number;
  estado: number;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
  nombre_perfil?: string;
  nombre_comercial?: string;
}

export interface Hotel {
  id_hotel: number;
  ruc: string;
  nombre_comercial: string;
  razon_social: string;
  telefono: string;
  correo: string;
  direccion: string;
  estado: number;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
}

export interface GuiaLavanderia {
  id_guia: number;
  numero_guia: number;
  hotel_id: number;
  chofer_recojo_id: number;
  chofer_entrega_id?: number;
  recepcionista_recojo_id: number;
  recepcionista_entrega_id?: number;
  estado: 'Registrado' | 'Pendiente' | 'Procesandose' | 'Lista para Entregar' | 'En Ruta' | 'Entregado';
  fecha_recoleccion: string;
  fecha_entrega?: string;
  observaciones?: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
  nombre_comercial?: string;
  chofer_recojo_nombre?: string;
  chofer_entrega_nombre?: string;
  recepcionista_recojo_nombre?: string;
  recepcionista_entrega_nombre?: string;
}

export interface DetalleGuia {
  id_detalle: number;
  guia_id: number;
  hotel_prenda_id: number;
  cantidad_sucia: number;
  cantidad_limpia: number;
  es_devuelta: boolean;
  nombre_prenda: string;
  precio_unitario: number;
}

export interface HistorialEstado {
  id_historial: number;
  guia_id: number;
  estado_anterior?: string;
  estado_nuevo: string;
  usuario_id: number;
  fecha_cambio: string;
  observaciones?: string;
  nombre_usuario: string;
}

export interface Prenda {
  id_prenda: number;
  nombre_prenda: string;
  descripcion?: string;
  categoria_id: number;
  estado: number;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
  nombre_categoria?: string;
}

export interface Categoria {
  id_categoria: number;
  nombre_categoria: string;
  descripcion?: string;
  estado: number;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
}

export interface HotelPrenda {
  id_hotel_prenda: number;
  hotel_id: number;
  prenda_id: number;
  precio_unitario: number;
  estado: number;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
  nombre_prenda?: string;
  descripcion?: string;
  nombre_categoria?: string;
}

export interface Perfil {
  id_perfil: number;
  nombre_perfil: string;
  descripcion?: string;
  estado: number;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
  };
}

// Interfaces para requests
export interface CreateGuiaRequest {
  hotel_id: number;
  chofer_recojo_id: number;
  recepcionista_recojo_id: number;
  fecha_recoleccion: string;
  observaciones?: string;
  prendas: {
    hotel_prenda_id: number;
    cantidad_sucia: number;
    es_devuelta: boolean;
  }[];
}

export interface UpdateGuiaRequest {
  id_guia: number;
  chofer_entrega_id?: number;
  recepcionista_entrega_id?: number;
  fecha_entrega?: string;
  observaciones?: string;
}

export interface UpdateCantidadesRequest {
  id_guia: number;
  prendas: {
    id_detalle: number;
    cantidad_limpia: number;
  }[];
}

// Extensiones de Express Request
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        correo: string;
        perfil: string;
        hotelId?: number;
      };
      hotelFilter?: number;
    }
  }
}