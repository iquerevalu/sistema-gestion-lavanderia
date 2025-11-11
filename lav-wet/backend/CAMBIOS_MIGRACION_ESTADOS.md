# Cambios Realizados - Migración a Tabla de Estados

## ✅ Archivos Creados

### 1. `backend/src/database/migration_estados.sql`
Script SQL que:
- Crea tabla `lv_estado_guia` con 7 estados
- Migra datos de `estado` VARCHAR a `estado` INT
- Agrega foreign key para validación

### 2. `backend/src/constants/estados.ts`
Constantes de TypeScript:
- `ESTADOS_GUIA` - Nombres de estados
- `ESTADOS_GUIA_IDS` - IDs de estados (1-7)
- `getEstadoId()` - Convierte nombre → ID
- `getEstadoNombre()` - Convierte ID → nombre
- `isEstadoValido()` - Valida si un estado es válido

### 3. `backend/src/database/debug_migracion.sql`
Script para debuggear y corregir problemas de migración

### 4. `backend/src/database/README_MIGRACION_ESTADOS.md`
Documentación completa del proceso de migración

## 🔧 Archivos Modificados

### `backend/src/services/guiaService.ts`
**Cambios principales:**

1. **Import de constantes:**
   ```typescript
   import { getEstadoId, isEstadoValido, type EstadoGuia } from '../constants/estados.js';
   ```

2. **getAllGuias():**
   - Agrega JOIN con `lv_estado_guia`
   - Convierte filtros de nombre a ID
   - Retorna `estado` (nombre) y `estado_id` (número)

3. **getGuiaById():**
   - Agrega JOIN con `lv_estado_guia`
   - Retorna ambos campos: `estado` y `estado_id`

4. **createGuia():**
   - Inserta `estado = 1` (Registrado) al crear guía

5. **updateCantidadesProcesadas():**
   - Convierte nombre de estado a ID antes de UPDATE
   - Valida estados con `isEstadoValido()`
   - Usa `getEstadoId()` para conversión

6. **changeGuiaEstado():**
   - Valida estado con `isEstadoValido()`
   - Actualiza transiciones permitidas (incluye 'Procesándose' y 'Entregado Parcial')
   - Convierte nombre a ID antes de UPDATE

7. **marcarGuiaComoEntregada():**
   - Convierte 'Entregado' y 'Entregado Parcial' a IDs
   - Usa `getEstadoId()` para conversión

### `backend/src/types/index.ts`
**Cambios:**
- Agregado `estado_id?: number` a interfaz `GuiaLavanderia`
- Actualizado tipo de `estado` para incluir 'Procesándose' y 'Entregado Parcial'

## 📊 Estados Definidos

| ID | Nombre Estado | Uso |
|----|---------------|-----|
| 1 | Registrado | Guía recién creada |
| 2 | Pendiente | Tiene prendas pendientes |
| 3 | Procesándose | En proceso de lavado |
| 4 | Lista para Entregar | Todas las prendas listas |
| 5 | En Ruta | Chofer en camino |
| 6 | Entregado Parcial | Entrega incompleta |
| 7 | Entregado | Entrega completada |

## 🔄 Flujo de Estados

```
Registrado → Pendiente → Procesándose → Lista para Entregar → En Ruta → Entregado
                ↑            ↓                                      ↓
                └────────────┘                              Entregado Parcial
                                                                    ↓
                                                            Procesándose
```

## ✅ Compatibilidad

### Frontend
- ✅ **No requiere cambios** - El backend sigue retornando `estado` como string
- ✅ El campo `estado_id` está disponible si se necesita en el futuro

### Backend
- ✅ Todas las queries usan JOINs para obtener nombres
- ✅ Todas las inserciones/actualizaciones usan IDs
- ✅ Validación automática con foreign key

## 🧪 Testing

### Verificar que funciona:
1. Crear una guía nueva → debe tener `estado = 1` (Registrado)
2. Procesar guía → debe cambiar a ID correcto
3. Entregar guía → debe cambiar a ID 7 (Entregado) o 6 (Entregado Parcial)
4. Ver historial → debe mostrar nombres de estados correctos

### Queries de verificación:
```sql
-- Ver todas las guías con sus estados
SELECT 
  g.id_guia,
  g.numero_guia,
  g.estado as estado_id,
  e.nombre_estado
FROM lv_guia g
INNER JOIN lv_estado_guia e ON g.estado = e.id_estado;

-- Ver distribución de estados
SELECT 
  e.nombre_estado,
  COUNT(g.id_guia) as cantidad
FROM lv_estado_guia e
LEFT JOIN lv_guia g ON e.id_estado = g.estado
GROUP BY e.id_estado, e.nombre_estado;
```

## 🚨 Notas Importantes

1. **La columna `estado` ahora es INT**, no VARCHAR
2. **Siempre usar constantes** de `estados.ts` en lugar de strings hardcodeados
3. **El frontend no se ve afectado** porque el backend hace la conversión
4. **Historial de estados** sigue usando nombres (VARCHAR) para legibilidad

## 📝 Próximos pasos opcionales

1. Agregar tabla `lv_transicion_estado` para validar transiciones en BD
2. Agregar campos metadata a estados (color, icono, orden)
3. Crear endpoint `/api/estados` para obtener lista de estados disponibles
4. Agregar triggers para mantener sincronizado el historial
