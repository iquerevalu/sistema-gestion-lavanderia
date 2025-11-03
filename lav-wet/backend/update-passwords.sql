-- Actualizar contraseñas con hash correcto para "123456"
USE db_lavanderia;

UPDATE lv_usuario 
SET password = '$2a$10$/7gk8kJxwq/uOgGNFFBsI.XtJPZQy8saVg6eWq7eOFsXpDr9xsh/6' 
WHERE correo IN (
    'admin@lavanderia.com',
    'maria.gonzalez@hotelparadise.com',
    'roberto.silva@lavanderia.com',
    'ana.rodriguez@hotelparadise.com',
    'pedro.quispe@losandes.com',
    'luis.mamani@losandes.com',
    'carmen.lopez@lavanderia.com'
);

-- Verificar que se actualizaron
SELECT correo, LEFT(password, 20) as password_hash FROM lv_usuario;