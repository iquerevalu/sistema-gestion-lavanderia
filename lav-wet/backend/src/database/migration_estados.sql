-- =====================================================
-- MIGRACIÓN: Tabla de Estados para Guías
-- =====================================================
-- Este script crea la tabla de estados y REEMPLAZA la columna estado VARCHAR por estado_id INT

-- Desactivar safe update mode temporalmente
SET SQL_SAFE_UPDATES = 0;

-- 1. Crear tabla de estados
CREATE TABLE IF NOT EXISTS lv_estado_guia (
  id_estado INT PRIMARY KEY AUTO_INCREMENT,
  nombre_estado VARCHAR(50) NOT NULL UNIQUE,
  estado TINYINT DEFAULT 1,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Insertar estados iniciales
INSERT INTO lv_estado_guia (nombre_estado) VALUES
('Registrado'),
('Pendiente'),
('Procesándose'),
('Lista para Entregar'),
('En Ruta'),
('Entregado Parcial'),
('Entregado');

-- 3. Agregar columna temporal estado_id a lv_guia
ALTER TABLE lv_guia 
ADD COLUMN estado_id INT AFTER estado;

-- 4. Migrar datos existentes de estado VARCHAR a estado_id
UPDATE lv_guia g
INNER JOIN lv_estado_guia e ON g.estado = e.nombre_estado
SET g.estado_id = e.id_estado;

-- 5. Verificar que todos los registros se migraron
SELECT 
  'Verificación: Guías sin estado_id' as paso,
  COUNT(*) as cantidad
FROM lv_guia 
WHERE estado_id IS NULL;

-- 6. Eliminar la columna estado VARCHAR antigua
ALTER TABLE lv_guia 
DROP COLUMN estado;

-- 7. Renombrar estado_id a estado
ALTER TABLE lv_guia 
CHANGE COLUMN estado_id estado INT NOT NULL;

-- 8. Agregar foreign key
ALTER TABLE lv_guia 
ADD CONSTRAINT fk_guia_estado 
FOREIGN KEY (estado) REFERENCES lv_estado_guia(id_estado);

-- =====================================================
-- VERIFICACIÓN FINAL
-- =====================================================
-- Ver distribución de estados
SELECT 
  'Distribución de estados' as verificacion,
  e.nombre_estado,
  COUNT(g.id_guia) as cantidad_guias
FROM lv_estado_guia e
LEFT JOIN lv_guia g ON e.id_estado = g.estado
GROUP BY e.id_estado, e.nombre_estado
ORDER BY e.id_estado;

-- Verificar estructura de la tabla
DESCRIBE lv_guia;

-- Reactivar safe update mode
SET SQL_SAFE_UPDATES = 1;

-- =====================================================
-- ROLLBACK (solo si es necesario deshacer cambios)
-- =====================================================
-- IMPORTANTE: Ejecutar ANTES de hacer cambios en el código
-- 
-- ALTER TABLE lv_guia DROP FOREIGN KEY fk_guia_estado;
-- ALTER TABLE lv_guia CHANGE COLUMN estado estado_old INT;
-- ALTER TABLE lv_guia ADD COLUMN estado VARCHAR(50);
-- UPDATE lv_guia g
-- INNER JOIN lv_estado_guia e ON g.estado_old = e.id_estado
-- SET g.estado = e.nombre_estado;
-- ALTER TABLE lv_guia DROP COLUMN estado_old;
-- DROP TABLE lv_estado_guia;
