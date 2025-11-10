-- Insertar perfiles y usuarios de ejemplo para pruebas
USE db_lavanderia;

-- Insertar perfiles (roles)
INSERT INTO lv_perfil (nombre_perfil, descripcion) VALUES
('Administrador', 'Acceso completo al sistema'),
('Operador', 'Operador de hotel - gestión de guías'),
('Supervisor', 'Supervisor de hotel - revisión y aprobación'),
('Chofer', 'Chofer de lavandería - recojo y entrega');

-- Insertar usuarios de ejemplo
-- Nota: Las contraseñas están hasheadas con bcrypt (password: "123456")
INSERT INTO lv_usuario (nombre_completo, correo, password, telefono, perfil_id, hotel_id) VALUES
-- Administradores
('Juan Carlos Admin', 'admin@lavanderia.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '999-888-777', 1, NULL),
('María Administradora', 'maria.admin@lavanderia.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '999-888-778', 1, NULL),

-- Operadores de hoteles
('Ana García Operador', 'ana@hotelplaza.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '999-777-666', 2, 1),
('Carlos López Operador', 'carlos@hotelcosta.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '999-666-555', 2, 2),
('Laura Martínez Operador', 'laura@hotelecutivo.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '999-555-444', 2, 3),
('Pedro Sánchez Operador', 'pedro@hotelboutique.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '999-444-333', 2, 4),
('Carmen Fernández Operador', 'carmen@hotelbusiness.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '999-333-222', 2, 5),

-- Supervisores de hoteles
('Roberto Silva Supervisor', 'roberto@hotelplaza.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '999-222-111', 3, 1),
('Sofía Vega Supervisor', 'sofia@hotelcosta.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '999-111-000', 3, 2),
('Diego Torres Supervisor', 'diego@hotelecutivo.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '999-000-999', 3, 3),

-- Choferes (sin hotel asignado)
('Miguel Herrera Chofer', 'miguel@lavanderia.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '999-777-000', 4, NULL),
('Valeria Castro Chofer', 'valeria@lavanderia.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '999-666-000', 4, NULL),
('Andrés Ramírez Chofer', 'andres@lavanderia.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '999-555-000', 4, NULL);

-- Verificar los usuarios insertados con sus perfiles y hoteles
SELECT 
    u.id_usuario,
    u.nombre_completo,
    u.correo,
    u.telefono,
    p.nombre_perfil,
    h.nombre_comercial,
    u.estado
FROM lv_usuario u
LEFT JOIN lv_perfil p ON u.perfil_id = p.id_perfil
LEFT JOIN lv_hotel h ON u.hotel_id = h.id_hotel
WHERE u.estado = 1
ORDER BY p.nombre_perfil, u.nombre_completo;