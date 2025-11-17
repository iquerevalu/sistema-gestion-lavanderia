import { executeQuery, executeTransaction } from '../database/connection.js';
import { GuiaLavanderia, DetalleGuia, HistorialEstado } from '../types/index.js';
import { getEstadoId, isEstadoValido, type EstadoGuia } from '../constants/estados.js';

export interface CreateGuiaRequest {
  hotel_id: number;
  chofer_recojo_id: number;
  recepcionista_recojo_id?: number; // Opcional, se usa el usuario logueado si no se especifica
  fecha_recoleccion: string; // YYYY-MM-DD
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
  observaciones?: string;
  estado?: string;
  estado_id?: number;
}

// Obtener todas las guías con filtros
export const getAllGuias = async (
  page: number = 1, 
  limit: number = 10,
  filters: {
    hotel_id?: number;
    estado?: string;
    numero_guia?: number;
    fecha_desde?: string;
    fecha_hasta?: string;
  } = {}
): Promise<{ guias: GuiaLavanderia[]; total: number }> => {
  try {
    const offset = (page - 1) * limit;
    
    // Construir WHERE clause dinámicamente
    let whereConditions = ['1=1'];
    let queryParams: any[] = [];
    
    if (filters.hotel_id) {
      whereConditions.push('g.hotel_id = ?');
      queryParams.push(filters.hotel_id);
    }
    
    if (filters.estado) {
      // Convertir nombre de estado a ID si es un string válido
      if (typeof filters.estado === 'string' && isEstadoValido(filters.estado)) {
        const estadoId = getEstadoId(filters.estado as EstadoGuia);
        whereConditions.push('g.estado = ?');
        queryParams.push(estadoId);
      } else if (typeof filters.estado === 'number') {
        // Si ya es un número, usarlo directamente
        whereConditions.push('g.estado = ?');
        queryParams.push(filters.estado);
      }
    }
    
    if (filters.numero_guia) {
      whereConditions.push('g.numero_guia = ?');
      queryParams.push(filters.numero_guia);
    }
    
    if (filters.fecha_desde) {
      whereConditions.push('g.fecha_recoleccion >= ?');
      queryParams.push(filters.fecha_desde);
    }
    
    if (filters.fecha_hasta) {
      whereConditions.push('g.fecha_recoleccion <= ?');
      queryParams.push(filters.fecha_hasta);
    }
    
    const whereClause = whereConditions.join(' AND ');
    
    // Asegurar que limit y offset son números válidos
    const safeLimit = Number(limit) || 10;
    const safeOffset = Number(offset) || 0;
    
    // Consulta para obtener guías (usando interpolación segura para LIMIT/OFFSET)
    const guiasQuery = `
      SELECT 
        g.id_guia,
        g.numero_guia,
        g.hotel_id,
        g.chofer_recojo_id,
        g.chofer_entrega_id,
        g.recepcionista_recojo_id,
        g.recepcionista_entrega_id,
        g.estado as estado_id,
        eg.nombre_estado as estado,
        g.fecha_recoleccion,
        g.fecha_entrega,
        g.observaciones,
        g.fecha_creacion,
        g.fecha_actualizacion,
        h.nombre_comercial,
        cr.nombre_completo as chofer_recojo_nombre,
        ce.nombre_completo as chofer_entrega_nombre,
        rr.nombre_completo as recepcionista_recojo_nombre,
        re.nombre_completo as recepcionista_entrega_nombre
      FROM lv_guia g
      INNER JOIN lv_hotel h ON g.hotel_id = h.id_hotel
      INNER JOIN lv_estado_guia eg ON g.estado = eg.id_estado
      INNER JOIN lv_usuario cr ON g.chofer_recojo_id = cr.id_usuario
      LEFT JOIN lv_usuario ce ON g.chofer_entrega_id = ce.id_usuario
      INNER JOIN lv_usuario rr ON g.recepcionista_recojo_id = rr.id_usuario
      LEFT JOIN lv_usuario re ON g.recepcionista_entrega_id = re.id_usuario
      WHERE ${whereClause}
      ORDER BY g.fecha_creacion DESC, g.numero_guia DESC
      LIMIT ${safeLimit} OFFSET ${safeOffset}
    `;
    
    // Consulta para contar total
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM lv_guia g
      WHERE ${whereClause}
    `;
    
    const [guias, countResult] = await Promise.all([
      executeQuery<GuiaLavanderia>(guiasQuery, queryParams),
      executeQuery<{ total: number }>(countQuery, queryParams)
    ]);
    
    // Obtener prendas para cada guía
    if (guias.length > 0) {
      const guiaIds = guias.map(g => g.id_guia);
      const prendasQuery = `
        SELECT 
          dg.id_detalle,
          dg.guia_id,
          dg.hotel_prenda_id,
          dg.cantidad_sucia,
          dg.cantidad_limpia,
          dg.es_devuelta,
          p.nombre_prenda,
          hp.precio_unitario
        FROM lv_detalle_guia dg
        INNER JOIN lv_hotel_prenda hp ON dg.hotel_prenda_id = hp.id_hotel_prenda
        INNER JOIN lv_prenda p ON hp.prenda_id = p.id_prenda
        WHERE dg.guia_id IN (${guiaIds.join(',')})
        ORDER BY dg.id_detalle
      `;
      
      const prendas = await executeQuery(prendasQuery);
      
      // Obtener historial para cada guía
      const historialQuery = `
        SELECT 
          h.id_historial,
          h.guia_id,
          h.estado_anterior,
          h.estado_nuevo,
          h.usuario_id,
          h.fecha_cambio,
          h.observaciones,
          u.nombre_completo as nombre_usuario
        FROM lv_historial_estado h
        INNER JOIN lv_usuario u ON h.usuario_id = u.id_usuario
        WHERE h.guia_id IN (${guiaIds.join(',')})
        ORDER BY h.fecha_cambio ASC
      `;
      
      const historial = await executeQuery(historialQuery);
      
      // Agrupar prendas e historial por guía
      guias.forEach(guia => {
        guia.prendas = prendas.filter((p: any) => p.guia_id === guia.id_guia);
        guia.historial = historial.filter((h: any) => h.guia_id === guia.id_guia);
      });
    }
    
    return {
      guias,
      total: countResult[0]?.total || 0
    };
  } catch (error) {
    console.error('Error obteniendo guías:', error);
    throw new Error('Error interno del servidor');
  }
};

// Obtener guía por ID con detalles
export const getGuiaById = async (id: number): Promise<GuiaLavanderia & { prendas: DetalleGuia[]; historial: HistorialEstado[] } | null> => {
  try {
    // Obtener guía principal
    const guiaQuery = `
      SELECT 
        g.id_guia,
        g.numero_guia,
        g.hotel_id,
        g.chofer_recojo_id,
        g.chofer_entrega_id,
        g.recepcionista_recojo_id,
        g.recepcionista_entrega_id,
        g.estado as estado_id,
        eg.nombre_estado as estado,
        g.fecha_recoleccion,
        g.fecha_entrega,
        g.observaciones,
        g.fecha_creacion,
        g.fecha_actualizacion,
        h.nombre_comercial,
        cr.nombre_completo as chofer_recojo_nombre,
        ce.nombre_completo as chofer_entrega_nombre,
        rr.nombre_completo as recepcionista_recojo_nombre,
        re.nombre_completo as recepcionista_entrega_nombre
      FROM lv_guia g
      INNER JOIN lv_hotel h ON g.hotel_id = h.id_hotel
      INNER JOIN lv_estado_guia eg ON g.estado = eg.id_estado
      INNER JOIN lv_usuario cr ON g.chofer_recojo_id = cr.id_usuario
      LEFT JOIN lv_usuario ce ON g.chofer_entrega_id = ce.id_usuario
      INNER JOIN lv_usuario rr ON g.recepcionista_recojo_id = rr.id_usuario
      LEFT JOIN lv_usuario re ON g.recepcionista_entrega_id = re.id_usuario
      WHERE g.id_guia = ?
    `;
    
    const guias = await executeQuery<GuiaLavanderia>(guiaQuery, [id]);
    if (guias.length === 0) return null;
    
    const guia = guias[0];
    
    // Obtener detalles de prendas
    const prendasQuery = `
      SELECT 
        dg.id_detalle,
        dg.guia_id,
        dg.hotel_prenda_id,
        dg.cantidad_sucia,
        dg.cantidad_limpia,
        dg.es_devuelta,
        p.nombre_prenda,
        hp.precio_unitario
      FROM lv_detalle_guia dg
      INNER JOIN lv_hotel_prenda hp ON dg.hotel_prenda_id = hp.id_hotel_prenda
      INNER JOIN lv_prenda p ON hp.prenda_id = p.id_prenda
      WHERE dg.guia_id = ?
      ORDER BY p.nombre_prenda ASC
    `;
    
    const prendas = await executeQuery<DetalleGuia>(prendasQuery, [id]);
    
    // Obtener historial de estados
    const historialQuery = `
      SELECT 
        h.id_historial,
        h.guia_id,
        h.estado_anterior,
        h.estado_nuevo,
        h.usuario_id,
        h.fecha_cambio,
        h.observaciones,
        u.nombre_completo as nombre_usuario
      FROM lv_historial_estado h
      INNER JOIN lv_usuario u ON h.usuario_id = u.id_usuario
      WHERE h.guia_id = ?
      ORDER BY h.fecha_cambio ASC
    `;
    
    const historial = await executeQuery<HistorialEstado>(historialQuery, [id]);
    
    return {
      ...guia,
      prendas,
      historial
    };
  } catch (error) {
    console.error('Error obteniendo guía:', error);
    throw new Error('Error interno del servidor');
  }
};

// Crear nueva guía
export const createGuia = async (guiaData: CreateGuiaRequest, usuarioId: number): Promise<GuiaLavanderia> => {
  try {
    // Si no se especifica recepcionista, usar el usuario logueado
    const recepcionistaId = guiaData.recepcionista_recojo_id || usuarioId;
    
    // Verificar que el hotel existe
    const hotelQuery = `
      SELECT id_hotel, nombre_comercial 
      FROM lv_hotel 
      WHERE id_hotel = ? AND estado = 1
    `;
    const hotel = await executeQuery(hotelQuery, [guiaData.hotel_id]);
    if (hotel.length === 0) {
      throw new Error('El hotel especificado no existe');
    }
    
    // Verificar que los usuarios existen y tienen los roles correctos
    const usuariosQuery = `
      SELECT u.id_usuario, u.nombre_completo, p.nombre_perfil
      FROM lv_usuario u
      INNER JOIN lv_perfil p ON u.perfil_id = p.id_perfil
      WHERE u.id_usuario IN (?, ?) AND u.estado = 1
    `;
    const usuarios = await executeQuery(usuariosQuery, [guiaData.chofer_recojo_id, recepcionistaId]);
    
    if (usuarios.length !== 2) {
      throw new Error('Uno o más usuarios especificados no existen');
    }
    
    // Verificar que las prendas del hotel existen
    if (guiaData.prendas.length === 0) {
      throw new Error('Debe especificar al menos una prenda');
    }
    
    const hotelPrendasIds = guiaData.prendas.map(p => p.hotel_prenda_id);
    const hotelPrendasQuery = `
      SELECT hp.id_hotel_prenda, p.nombre_prenda
      FROM lv_hotel_prenda hp
      INNER JOIN lv_prenda p ON hp.prenda_id = p.id_prenda
      WHERE hp.id_hotel_prenda IN (${hotelPrendasIds.map(() => '?').join(',')}) 
        AND hp.hotel_id = ? AND hp.estado = 1
    `;
    const hotelPrendas = await executeQuery(hotelPrendasQuery, [...hotelPrendasIds, guiaData.hotel_id]);
    
    if (hotelPrendas.length !== guiaData.prendas.length) {
      throw new Error('Una o más prendas no están configuradas para este hotel');
    }
    
    // Obtener y actualizar el número de guía secuencial
    const getCounterQuery = `
      SELECT ultimo_numero_guia 
      FROM lv_hotel_contador 
      WHERE hotel_id = ?
    `;
    const counterResult = await executeQuery<{ ultimo_numero_guia: number }>(getCounterQuery, [guiaData.hotel_id]);
    
    let numeroGuia = 1;
    if (counterResult.length > 0) {
      numeroGuia = counterResult[0].ultimo_numero_guia + 1;
    }
    
    // Ejecutar en transacción
    const queries = [
      // Actualizar contador
      {
        query: `
          INSERT INTO lv_hotel_contador (hotel_id, ultimo_numero_guia) 
          VALUES (?, ?) 
          ON DUPLICATE KEY UPDATE ultimo_numero_guia = ?
        `,
        params: [guiaData.hotel_id, numeroGuia, numeroGuia]
      },
      // Insertar guía
      {
        query: `
          INSERT INTO lv_guia (
            numero_guia,
            hotel_id,
            chofer_recojo_id,
            recepcionista_recojo_id,
            fecha_recoleccion,
            observaciones,
            estado
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        params: [
          numeroGuia,
          guiaData.hotel_id,
          guiaData.chofer_recojo_id,
          recepcionistaId, // Usar el recepcionista calculado (usuario logueado si no se especifica)
          guiaData.fecha_recoleccion,
          guiaData.observaciones || null,
          1 // Estado inicial: Registrado (id=1)
        ]
      }
    ];
    
    const results = await executeTransaction(queries);
    const guiaId = (results[1] as any).insertId;
    
    // Insertar detalles de prendas
    const detalleQueries = guiaData.prendas.map(prenda => ({
      query: `
        INSERT INTO lv_detalle_guia (
          guia_id,
          hotel_prenda_id,
          cantidad_sucia,
          es_devuelta
        ) VALUES (?, ?, ?, ?)
      `,
      params: [
        guiaId,
        prenda.hotel_prenda_id,
        prenda.cantidad_sucia,
        prenda.es_devuelta ? 1 : 0
      ]
    }));
    
    await executeTransaction(detalleQueries);
    
    // Registrar en historial
    await executeQuery(`
      INSERT INTO lv_historial_estado (
        guia_id,
        estado_anterior,
        estado_nuevo,
        usuario_id,
        observaciones
      ) VALUES (?, NULL, 'REGISTRADO', ?, 'Guía creada')
    `, [guiaId, usuarioId]);
    
    // Obtener la guía creada
    const createdGuia = await getGuiaById(guiaId);
    if (!createdGuia) {
      throw new Error('Error al crear la guía');
    }
    
    return createdGuia;
  } catch (error: any) {
    console.error('Error creando guía:', error);
    throw new Error(error.message || 'Error interno del servidor');
  }
};

// Actualizar cantidades procesadas
export const updateCantidadesProcesadas = async (data: UpdateCantidadesRequest, usuarioId: number): Promise<GuiaLavanderia> => {
  try {
    // Verificar que la guía existe
    const guia = await getGuiaById(data.id_guia);
    if (!guia) {
      throw new Error('Guía no encontrada');
    }
    
    // Verificar que la guía está en estado que permite actualizar cantidades
    // Usar IDs: 1=REGISTRADO, 2=PENDIENTE, 3=EN PROCESO, 6=ENTREGA PARCIAL
    const estadosPermitidosIds = [1, 2, 3, 6];
    
    if (!estadosPermitidosIds.includes(guia.estado_id || 0)) {
      throw new Error(`No se pueden actualizar cantidades en el estado actual (ID: ${guia.estado_id})`);
    }
    
    // Actualizar cantidades
    const updateQueries = data.prendas.map(prenda => ({
      query: `
        UPDATE lv_detalle_guia 
        SET cantidad_limpia = ?
        WHERE id_detalle = ? AND guia_id = ?
      `,
      params: [prenda.cantidad_limpia, prenda.id_detalle, data.id_guia]
    }));
    
    await executeTransaction(updateQueries);
    
    // SIEMPRE usar el estado proporcionado por el usuario (ahora por ID)
    let nuevoEstadoNombre: string;
    let nuevoEstadoId: number;
    let cambioEstado = false;
    
    if (data.estado_id) {
      // El usuario especificó el estado por ID - SIEMPRE usarlo
      nuevoEstadoId = data.estado_id;
      
      // VALIDACIÓN ESPECIAL: Si el estado es "LISTO PARA ENTREGA" (ID=4), 
      // verificar que NO haya prendas pendientes
      if (nuevoEstadoId === 4) {
        const pendientesQuery = `
          SELECT COUNT(*) as pendientes
          FROM lv_detalle_guia
          WHERE guia_id = ? AND cantidad_limpia < cantidad_sucia
        `;
        const pendientesResult = await executeQuery<{ pendientes: number }>(pendientesQuery, [data.id_guia]);
        
        if (pendientesResult[0]?.pendientes > 0) {
          throw new Error('No se puede marcar como "LISTO PARA ENTREGA" porque aún hay prendas pendientes');
        }
      }
      
      // Obtener el nombre del estado para el historial
      const estadoQuery = await executeQuery<{ nombre_estado: string }>(
        'SELECT nombre_estado FROM lv_estado_guia WHERE id_estado = ?',
        [nuevoEstadoId]
      );
      
      if (estadoQuery.length === 0) {
        throw new Error(`Estado con ID ${nuevoEstadoId} no encontrado`);
      }
      
      nuevoEstadoNombre = estadoQuery[0].nombre_estado;
      
      // Comparar case-insensitive para ver si cambió
      cambioEstado = guia.estado.trim().toLowerCase() !== nuevoEstadoNombre.toLowerCase();
      
      // Actualizar estado
      await executeQuery(`
        UPDATE lv_guia 
        SET estado = ?, fecha_actualizacion = CURRENT_TIMESTAMP
        WHERE id_guia = ?
      `, [nuevoEstadoId, data.id_guia]);
      
      // Registrar cambio de estado si hubo cambio
      if (cambioEstado) {
        const observacionesHistorial = data.observaciones 
          ? `Cantidades actualizadas. ${data.observaciones}` 
          : 'Cantidades actualizadas';
        
        await executeQuery(`
          INSERT INTO lv_historial_estado (
            guia_id,
            estado_anterior,
            estado_nuevo,
            usuario_id,
            observaciones
          ) VALUES (?, ?, ?, ?, ?)
        `, [data.id_guia, guia.estado, nuevoEstadoNombre, usuarioId, observacionesHistorial]);
      } else if (data.observaciones) {
        // Si no cambió el estado pero hay observaciones, registrarlas igual
        await executeQuery(`
          INSERT INTO lv_historial_estado (
            guia_id,
            estado_anterior,
            estado_nuevo,
            usuario_id,
            observaciones
          ) VALUES (?, ?, ?, ?, ?)
        `, [data.id_guia, guia.estado, nuevoEstadoNombre, usuarioId, data.observaciones]);
      }
    } else {
      // Si no se especificó estado_id, lanzar error (el frontend siempre debe enviar el estado)
      throw new Error('Debe especificar el ID del estado de la guía');
    }
    
    // Obtener la guía actualizada
    const updatedGuia = await getGuiaById(data.id_guia);
    if (!updatedGuia) {
      throw new Error('Error al actualizar la guía');
    }
    
    return updatedGuia;
  } catch (error: any) {
    console.error('Error actualizando cantidades:', error);
    throw new Error(error.message || 'Error interno del servidor');
  }
};

// Cambiar estado de guía
export const changeGuiaEstado = async (guiaId: number, nuevoEstado: string, usuarioId: number, observaciones?: string): Promise<GuiaLavanderia> => {
  try {
    const guia = await getGuiaById(guiaId);
    if (!guia) {
      throw new Error('Guía no encontrada');
    }
    
    // Validar que el nuevo estado es válido
    if (!isEstadoValido(nuevoEstado)) {
      throw new Error(`Estado inválido: ${nuevoEstado}`);
    }
    
    // Validar transiciones de estado permitidas
    const transicionesPermitidas: { [key: string]: string[] } = {
      'REGISTRADO': ['PENDIENTE', 'EN PROCESO'],
      'PENDIENTE': ['EN PROCESO', 'LISTO PARA ENTREGA'],
      'EN PROCESO': ['PENDIENTE', 'LISTO PARA ENTREGA'],
      'LISTO PARA ENTREGA': ['EN RUTA', 'PENDIENTE'],
      'EN RUTA': ['ENTREGADO', 'ENTREGA PARCIAL'],
      'ENTREGA PARCIAL': ['EN PROCESO', 'PENDIENTE']
    };
    
    if (!transicionesPermitidas[guia.estado]?.includes(nuevoEstado)) {
      throw new Error(`No se puede cambiar de ${guia.estado} a ${nuevoEstado}`);
    }
    
    // Convertir nombre de estado a ID
    const nuevoEstadoId = getEstadoId(nuevoEstado as EstadoGuia);
    
    // Actualizar estado
    await executeQuery(`
      UPDATE lv_guia 
      SET estado = ?, fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE id_guia = ?
    `, [nuevoEstadoId, guiaId]);
    
    // Registrar en historial
    await executeQuery(`
      INSERT INTO lv_historial_estado (
        guia_id,
        estado_anterior,
        estado_nuevo,
        usuario_id,
        observaciones
      ) VALUES (?, ?, ?, ?, ?)
    `, [guiaId, guia.estado, nuevoEstado, usuarioId, observaciones || null]);
    
    // Obtener la guía actualizada
    const updatedGuia = await getGuiaById(guiaId);
    if (!updatedGuia) {
      throw new Error('Error al actualizar el estado de la guía');
    }
    
    return updatedGuia;
  } catch (error: any) {
    console.error('Error cambiando estado de guía:', error);
    throw new Error(error.message || 'Error interno del servidor');
  }
};

// Obtener prendas disponibles para un hotel
export const getHotelPrendas = async (hotelId: number): Promise<any[]> => {
  try {
    const query = `
      SELECT 
        hp.id_hotel_prenda,
        hp.prenda_id,
        hp.precio_unitario,
        p.nombre_prenda,
        p.descripcion,
        c.nombre_categoria
      FROM lv_hotel_prenda hp
      INNER JOIN lv_prenda p ON hp.prenda_id = p.id_prenda
      INNER JOIN lv_categoria c ON p.categoria_id = c.id_categoria
      WHERE hp.hotel_id = ? AND hp.estado = 1
      ORDER BY c.nombre_categoria ASC, p.nombre_prenda ASC
    `;
    
    return await executeQuery(query, [hotelId]);
  } catch (error) {
    console.error('Error obteniendo prendas del hotel:', error);
    throw new Error('Error interno del servidor');
  }
};

// Obtener siguiente número de guía para un hotel
export const getNextNumeroGuia = async (hotelId: number): Promise<number> => {
  try {
    // Obtener el último número de guía para este hotel
    const query = `
      SELECT MAX(numero_guia) as ultimo_numero
      FROM lv_guia
      WHERE hotel_id = ?
    `;
    
    const result = await executeQuery<{ ultimo_numero: number | null }>(query, [hotelId]);
    
    const ultimoNumero = result[0]?.ultimo_numero || 0;
    const siguienteNumero = ultimoNumero + 1;
    
    return siguienteNumero;
  } catch (error) {
    console.error('Error obteniendo siguiente número de guía:', error);
    return 1; // Si hay error, devolver 1 por defecto
  }
};


// Marcar guía como entregada (para choferes)
export const marcarGuiaComoEntregada = async (
  guiaId: number,
  choferEntregaId: number,
  recepcionistaEntregaId: number,
  entregado: boolean,
  observaciones?: string
): Promise<GuiaLavanderia> => {
  try {
    const guia = await getGuiaById(guiaId);
    if (!guia) {
      throw new Error('Guía no encontrada');
    }
    
    // Validar que la guía esté en estado válido para entrega
    // Usar IDs: 4=LISTO PARA ENTREGA, 2=PENDIENTE
    const estadosValidosEntregaIds = [4, 2];
    
    if (!estadosValidosEntregaIds.includes(guia.estado_id || 0)) {
      throw new Error(`La guía no está en estado válido para entrega (ID: ${guia.estado_id})`);
    }
    
    const nuevoEstadoNombre = entregado ? 'ENTREGADO' : 'ENTREGA PARCIAL';
    const nuevoEstadoId = getEstadoId(nuevoEstadoNombre as EstadoGuia);
    
    // Siempre guardar chofer, recepcionista y observaciones
    // Solo guardar fecha_entrega si se marca como entregado
    if (entregado) {
      await executeQuery(`
        UPDATE lv_guia 
        SET 
          estado = ?,
          chofer_entrega_id = ?,
          recepcionista_entrega_id = ?,
          observaciones = ?,
          fecha_entrega = CURRENT_DATE,
          fecha_actualizacion = CURRENT_TIMESTAMP
        WHERE id_guia = ?
      `, [nuevoEstadoId, choferEntregaId, recepcionistaEntregaId, observaciones || null, guiaId]);
    } else {
      // Si queda pendiente, guardar chofer, recepcionista y observaciones pero NO fecha_entrega
      await executeQuery(`
        UPDATE lv_guia 
        SET 
          estado = ?,
          chofer_entrega_id = ?,
          recepcionista_entrega_id = ?,
          observaciones = ?,
          fecha_actualizacion = CURRENT_TIMESTAMP
        WHERE id_guia = ?
      `, [nuevoEstadoId, choferEntregaId, recepcionistaEntregaId, observaciones || null, guiaId]);
    }
    
    // Registrar en historial
    const observacionesHistorial = observaciones 
      ? `Entrega procesada. ${observaciones}` 
      : 'Entrega procesada';
    
    await executeQuery(`
      INSERT INTO lv_historial_estado (
        guia_id,
        estado_anterior,
        estado_nuevo,
        usuario_id,
        observaciones
      ) VALUES (?, ?, ?, ?, ?)
    `, [guiaId, guia.estado, nuevoEstadoNombre, choferEntregaId, observacionesHistorial]);
    
    // Obtener la guía actualizada
    const updatedGuia = await getGuiaById(guiaId);
    if (!updatedGuia) {
      throw new Error('Error al actualizar la guía');
    }
    
    return updatedGuia;
  } catch (error: any) {
    console.error('Error marcando guía como entregada:', error);
    throw new Error(error.message || 'Error interno del servidor');
  }
};
