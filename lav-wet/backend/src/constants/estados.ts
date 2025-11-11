// Constantes de estados de guías
// Estos valores deben coincidir exactamente con los de la tabla lv_estado_guia

export const ESTADOS_GUIA = {
  REGISTRADO: 'Registrado',
  PENDIENTE: 'Pendiente',
  PROCESANDOSE: 'Procesándose',
  LISTA_PARA_ENTREGAR: 'Lista para Entregar',
  EN_RUTA: 'En Ruta',
  ENTREGADO_PARCIAL: 'Entregado Parcial',
  ENTREGADO: 'Entregado'
} as const;

// IDs de estados (después de ejecutar la migración)
export const ESTADOS_GUIA_IDS = {
  REGISTRADO: 1,
  PENDIENTE: 2,
  PROCESANDOSE: 3,
  LISTA_PARA_ENTREGAR: 4,
  EN_RUTA: 5,
  ENTREGADO_PARCIAL: 6,
  ENTREGADO: 7
} as const;

// Tipo para TypeScript
export type EstadoGuia = typeof ESTADOS_GUIA[keyof typeof ESTADOS_GUIA];

// Función helper para obtener ID de estado por nombre
export const getEstadoId = (nombreEstado: EstadoGuia): number => {
  const mapping: Record<EstadoGuia, number> = {
    [ESTADOS_GUIA.REGISTRADO]: ESTADOS_GUIA_IDS.REGISTRADO,
    [ESTADOS_GUIA.PENDIENTE]: ESTADOS_GUIA_IDS.PENDIENTE,
    [ESTADOS_GUIA.PROCESANDOSE]: ESTADOS_GUIA_IDS.PROCESANDOSE,
    [ESTADOS_GUIA.LISTA_PARA_ENTREGAR]: ESTADOS_GUIA_IDS.LISTA_PARA_ENTREGAR,
    [ESTADOS_GUIA.EN_RUTA]: ESTADOS_GUIA_IDS.EN_RUTA,
    [ESTADOS_GUIA.ENTREGADO_PARCIAL]: ESTADOS_GUIA_IDS.ENTREGADO_PARCIAL,
    [ESTADOS_GUIA.ENTREGADO]: ESTADOS_GUIA_IDS.ENTREGADO
  };
  
  return mapping[nombreEstado];
};

// Función helper para obtener nombre de estado por ID
export const getEstadoNombre = (idEstado: number): EstadoGuia | null => {
  const mapping: Record<number, EstadoGuia> = {
    [ESTADOS_GUIA_IDS.REGISTRADO]: ESTADOS_GUIA.REGISTRADO,
    [ESTADOS_GUIA_IDS.PENDIENTE]: ESTADOS_GUIA.PENDIENTE,
    [ESTADOS_GUIA_IDS.PROCESANDOSE]: ESTADOS_GUIA.PROCESANDOSE,
    [ESTADOS_GUIA_IDS.LISTA_PARA_ENTREGAR]: ESTADOS_GUIA.LISTA_PARA_ENTREGAR,
    [ESTADOS_GUIA_IDS.EN_RUTA]: ESTADOS_GUIA.EN_RUTA,
    [ESTADOS_GUIA_IDS.ENTREGADO_PARCIAL]: ESTADOS_GUIA.ENTREGADO_PARCIAL,
    [ESTADOS_GUIA_IDS.ENTREGADO]: ESTADOS_GUIA.ENTREGADO
  };
  
  return mapping[idEstado] || null;
};

// Validar si un estado es válido
export const isEstadoValido = (estado: string): estado is EstadoGuia => {
  return Object.values(ESTADOS_GUIA).includes(estado as EstadoGuia);
};
