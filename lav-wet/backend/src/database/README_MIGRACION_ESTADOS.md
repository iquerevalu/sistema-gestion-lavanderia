# Migración: Tabla de Estados

## 📋 Descripción
Esta migración crea una tabla `lv_estado_guia` para normalizar los estados de las guías y evitar inconsistencias por mayúsculas/minúsculas o errores de tipeo.

## 🎯 Objetivo
- Crear tabla maestra de estados
- Migrar datos existentes de `estado` VARCHAR a `estado_id` INT
- Mantener compatibilidad con código existente

## 📝 Pasos para ejecutar la migración

### 1. Hacer backup de la base de datos
```bash
mysqldump -u root -p lav_wet > backup_antes_migracion_estados.sql
```

### 2. Ejecutar el script de migración
```bash
mysql -u root -p lav_wet < backend/src/database/migration_estados.sql
```

O desde MySQL Workbench:
- Abrir el archivo `migration_estados.sql`
- Ejecutar todo el script

### 3. Verificar la migración
El script incluye queries de verificación al final que mostrarán:
- Cantidad de guías sin estado_id (debe ser 0)
- Distribución de guías por estado

### 4. Actualizar el código (opcional - fase 2)
Por ahora, el código seguirá usando la columna `estado` VARCHAR para compatibilidad.
En una fase posterior, se puede migrar completamente a usar `estado_id`.

## 🔄 Cambios en la estructura
- ❌ La columna `estado` VARCHAR se ELIMINA
- ✅ Se REEMPLAZA por `estado` INT con foreign key
- ⚠️ El código backend necesita actualizarse para usar IDs en lugar de nombres

## 🚨 Rollback
Si necesitas deshacer la migración (ANTES de cambiar el código):
```sql
ALTER TABLE lv_guia DROP FOREIGN KEY fk_guia_estado;
ALTER TABLE lv_guia CHANGE COLUMN estado estado_old INT;
ALTER TABLE lv_guia ADD COLUMN estado VARCHAR(50);
UPDATE lv_guia g
INNER JOIN lv_estado_guia e ON g.estado_old = e.id_estado
SET g.estado = e.nombre_estado;
ALTER TABLE lv_guia DROP COLUMN estado_old;
DROP TABLE lv_estado_guia;
```

## 📊 Estados definidos
1. Registrado
2. Pendiente
3. Procesándose
4. Lista para Entregar
5. En Ruta
6. Entregado Parcial
7. Entregado

## 🔮 Próximos pasos (REQUERIDOS)
Después de ejecutar la migración SQL, debes actualizar el código backend:

1. **Actualizar queries SQL** - Usar `estado` INT en lugar de VARCHAR
2. **Usar constantes** - Importar `ESTADOS_GUIA_IDS` de `backend/src/constants/estados.ts`
3. **Joins con lv_estado_guia** - Para obtener el nombre del estado en las consultas
4. **Actualizar servicios** - Convertir nombres a IDs antes de guardar

### Ejemplo de cambio en queries:
```typescript
// ANTES:
WHERE g.estado = 'Registrado'

// DESPUÉS:
WHERE g.estado = 1  // o usar ESTADOS_GUIA_IDS.REGISTRADO
```

### Ejemplo de JOIN para obtener nombre:
```sql
SELECT 
  g.*,
  e.nombre_estado as estado_nombre
FROM lv_guia g
INNER JOIN lv_estado_guia e ON g.estado = e.id_estado
```
