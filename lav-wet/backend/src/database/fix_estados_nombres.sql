-- Corregir nombres de estados (capitalización correcta con tildes)
-- IMPORTANTE: Ejecutar este script para que coincidan con el código

UPDATE lv_estado_guia SET nombre_estado = 'Registrado' WHERE id_estado = 1;
UPDATE lv_estado_guia SET nombre_estado = 'Pendiente' WHERE id_estado = 2;
UPDATE lv_estado_guia SET nombre_estado = 'Procesándose' WHERE id_estado = 3;
UPDATE lv_estado_guia SET nombre_estado = 'Lista para Entregar' WHERE id_estado = 4;
UPDATE lv_estado_guia SET nombre_estado = 'En Ruta' WHERE id_estado = 5;
UPDATE lv_estado_guia SET nombre_estado = 'Entregado Parcial' WHERE id_estado = 6;
UPDATE lv_estado_guia SET nombre_estado = 'Entregado' WHERE id_estado = 7;

-- Verificar que los nombres estén correctos
SELECT id_estado, nombre_estado FROM lv_estado_guia ORDER BY id_estado;
