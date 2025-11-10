-- Verificar qué perfiles existen en la base de datos
USE db_lavanderia;

-- Ver todos los perfiles
SELECT * FROM lv_perfil ORDER BY id_perfil;

-- Ver usuarios por perfil
SELECT 
    p.id_perfil,
    p.nombre_perfil,
    COUNT(u.id_usuario) as total_usuarios,
    SUM(CASE WHEN u.estado = 1 THEN 1 ELSE 0 END) as usuarios_activos
FROM lv_perfil p
LEFT JOIN lv_usuario u ON p.id_perfil = u.perfil_id
GROUP BY p.id_perfil, p.nombre_perfil
ORDER BY p.id_perfil;

-- Ver detalle de usuarios por perfil
SELECT 
    p.nombre_perfil,
    u.id_usuario,
    u.nombre_completo,
    u.correo,
    h.nombre_comercial as hotel,
    u.estado
FROM lv_usuario u
INNER JOIN lv_perfil p ON u.perfil_id = p.id_perfil
LEFT JOIN lv_hotel h ON u.hotel_id = h.id_hotel
ORDER BY p.nombre_perfil, u.nombre_completo;
