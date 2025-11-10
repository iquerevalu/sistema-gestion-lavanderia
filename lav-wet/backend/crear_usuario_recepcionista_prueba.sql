-- Crear usuario de prueba: Recepcionista
USE db_lavanderia;

-- Ver hoteles disponibles para asignar
SELECT id_hotel, nombre_comercial FROM lv_hotel WHERE estado = 1;

-- Crear usuario recepcionista de prueba
-- IMPORTANTE: Cambia el hotel_id por el ID de tu hotel
INSERT INTO lv_usuario (
    nombre_completo,
    correo,
    password,
    telefono,
    perfil_id,
    hotel_id,
    estado
) VALUES (
    'María Recepcionista',
    'recepcionista@hotel.com',
    '$2a$10$YourHashedPasswordHere', -- Necesitas hashear la contraseña
    '999-111-222',
    2, -- perfil_id = 2 (Recepcionista Hotel)
    1, -- CAMBIA ESTO al ID de tu hotel
    1
);

-- Verificar que se creó correctamente
SELECT 
    u.id_usuario,
    u.nombre_completo,
    u.correo,
    p.nombre_perfil,
    h.nombre_comercial as hotel,
    u.estado
FROM lv_usuario u
INNER JOIN lv_perfil p ON u.perfil_id = p.id_perfil
LEFT JOIN lv_hotel h ON u.hotel_id = h.id_hotel
WHERE u.correo = 'recepcionista@hotel.com';

-- ============================================
-- NOTA IMPORTANTE:
-- La contraseña está hasheada con bcrypt.
-- Para crear el hash, puedes usar el endpoint de registro
-- o usar una herramienta online de bcrypt.
-- 
-- Ejemplo de contraseña: "recepcionista123"
-- Hash bcrypt: $2a$10$...
-- ============================================
