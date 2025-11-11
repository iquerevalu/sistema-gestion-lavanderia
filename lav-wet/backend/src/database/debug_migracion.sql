-- Script para debuggear y corregir la migración

-- 1. Ver estructura actual de la tabla
DESCRIBE lv_guia;

-- 2. Ver qué guía tiene problema (si estado_id existe)
SELECT 
  id_guia,
  numero_guia,
  estado_id
FROM lv_guia 
WHERE estado_id IS NULL;

-- 3. Ver todos los estados en lv_guia
SELECT estado_id, COUNT(*) as cantidad
FROM lv_guia
GROUP BY estado_id;

-- 4. Ver los estados en la tabla lv_estado_guia
SELECT * FROM lv_estado_guia;

-- 5. SOLUCIÓN: Si hay guías con estado_id NULL, asignarles un estado por defecto
-- Asignar 'Registrado' (id=1) a las guías sin estado
UPDATE lv_guia 
SET estado_id = 1 
WHERE estado_id IS NULL;

-- 6. Verificar que ya no haya guías sin estado
SELECT 
  'Guías sin estado después de corrección' as verificacion,
  COUNT(*) as cantidad
FROM lv_guia 
WHERE estado_id IS NULL;
