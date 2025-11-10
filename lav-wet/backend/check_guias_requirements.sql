-- Verificación rápida de requisitos para crear guías
USE db_lavanderia;

-- Ver todos los perfiles disponibles
SELECT '=== PERFILES DISPONIBLES ===' as info;
SELECT id_perfil, nombre_perfil, descripcion FROM lv_perfil;

-- Verificación de requisitos
SELECT '=== VERIFICACIÓN DE REQUISITOS ===' as info;

SELECT 'Hoteles activos' as verificacion, COUNT(*) as cantidad
FROM lv_hotel WHERE estado = 1
UNION ALL
-- ¿Hay choferes activos?
SELECT 'Choferes activos', COUNT(*)
FROM lv_usuario u
INNER JOIN lv_perfil p ON u.perfil_id = p.id_perfil
WHERE p.nombre_perfil LIKE '%Chofer%' AND u.estado = 1
UNION ALL
-- ¿Hay operadores/recepcionistas activos? (busca cualquier perfil que no sea Admin o Chofer)
SELECT 'Operadores/Recepcionistas activos', COUNT(*)
FROM lv_usuario u
INNER JOIN lv_perfil p ON u.perfil_id = p.id_perfil
WHERE p.nombre_perfil NOT IN ('Administrador', 'Chofer') AND u.estado = 1
UNION ALL
-- ¿Hay prendas configuradas en hoteles?
SELECT 'Prendas configuradas en hoteles', COUNT(*)
FROM lv_hotel_prenda WHERE estado = 1
UNION ALL
-- ¿Hay guías registradas?
SELECT 'Guías registradas', COUNT(*)
FROM lv_guia_lavanderia;

-- Ver usuarios por perfil
SELECT '=== USUARIOS POR PERFIL ===' as info;
SELECT 
    p.nombre_perfil,
    COUNT(u.id_usuario) as total,
    SUM(CASE WHEN u.estado = 1 THEN 1 ELSE 0 END) as activos
FROM lv_perfil p
LEFT JOIN lv_usuario u ON p.id_perfil = u.perfil_id
GROUP BY p.id_perfil, p.nombre_perfil
ORDER BY p.nombre_perfil;
