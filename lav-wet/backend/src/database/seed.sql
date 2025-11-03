-- Datos semilla para el sistema de lavandería
USE db_lavanderia;

-- Insertar perfiles (roles)
INSERT INTO lv_perfil (nombre_perfil, descripcion) VALUES
('Administrador', 'Acceso completo al sistema'),
('Recepcionista Hotel', 'Registra guías de lavandería del hotel'),
('Chofer', 'Recoge y entrega ropa'),
('Operario Lavandería', 'Procesa cantidades de ropa limpia'),
('Encargado Hotel', 'Supervisa guías del hotel');

-- Insertar hoteles de ejemplo
INSERT INTO lv_hotel (ruc, razon_social, nombre_comercial, direccion, correo_contacto, telefono) VALUES
('20123456789', 'Hotel Paradise S.A.C.', 'Hotel Paradise', 'Av. Principal 123, Lima', 'contacto@hotelparadise.com', '01-234-5678'),
('20987654321', 'Hospedaje Los Andes E.I.R.L.', 'Los Andes Hotel', 'Jr. Comercio 456, Cusco', 'info@losandes.com', '084-123-456'),
('20555666777', 'Gran Hotel Lima S.A.', 'Gran Hotel Lima', 'Av. Arequipa 789, Lima', 'reservas@granhotellima.com', '01-987-6543');

-- Insertar categorías de prendas
INSERT INTO lv_categoria (nombre_categoria, descripcion) VALUES
('Ropa de Cama', 'Sábanas, fundas, cobertores'),
('Toallas', 'Toallas de baño, mano y pies'),
('Mantelería', 'Manteles, servilletas de tela'),
('Uniformes', 'Uniformes del personal del hotel'),
('Cortinas', 'Cortinas y elementos decorativos');

-- Insertar prendas
INSERT INTO lv_prenda (categoria_id, nombre_prenda, descripcion) VALUES
-- Ropa de Cama
(1, 'Sábana Individual', 'Sábana para cama individual'),
(1, 'Sábana Matrimonial', 'Sábana para cama matrimonial'),
(1, 'Funda de Almohada', 'Funda para almohada estándar'),
(1, 'Cobertor Individual', 'Cobertor para cama individual'),
(1, 'Cobertor Matrimonial', 'Cobertor para cama matrimonial'),
-- Toallas
(2, 'Toalla de Baño', 'Toalla grande para baño'),
(2, 'Toalla de Mano', 'Toalla mediana para manos'),
(2, 'Toalla de Pies', 'Toalla pequeña para pies'),
-- Mantelería
(3, 'Mantel Mesa 4', 'Mantel para mesa de 4 personas'),
(3, 'Mantel Mesa 6', 'Mantel para mesa de 6 personas'),
(3, 'Servilleta de Tela', 'Servilleta de tela para restaurante');

-- Insertar precios por hotel para las prendas (Hotel Paradise)
INSERT INTO lv_hotel_prenda (hotel_id, prenda_id, precio_unitario) VALUES
-- Hotel Paradise - Ropa de Cama
(1, 1, 3.50), -- Sábana Individual
(1, 2, 4.00), -- Sábana Matrimonial
(1, 3, 1.50), -- Funda de Almohada
(1, 4, 5.00), -- Cobertor Individual
(1, 5, 6.00), -- Cobertor Matrimonial
-- Hotel Paradise - Toallas
(1, 6, 2.50), -- Toalla de Baño
(1, 7, 1.50), -- Toalla de Mano
(1, 8, 1.00), -- Toalla de Pies
-- Hotel Paradise - Mantelería
(1, 9, 4.50),  -- Mantel Mesa 4
(1, 10, 5.50), -- Mantel Mesa 6
(1, 11, 0.75); -- Servilleta de Tela

-- Insertar precios para Los Andes Hotel
INSERT INTO lv_hotel_prenda (hotel_id, prenda_id, precio_unitario) VALUES
-- Los Andes - Ropa de Cama
(2, 1, 3.00), -- Sábana Individual
(2, 2, 3.50), -- Sábana Matrimonial
(2, 3, 1.25), -- Funda de Almohada
(2, 4, 4.50), -- Cobertor Individual
(2, 5, 5.50), -- Cobertor Matrimonial
-- Los Andes - Toallas
(2, 6, 2.25), -- Toalla de Baño
(2, 7, 1.25), -- Toalla de Mano
(2, 8, 0.90); -- Toalla de Pies

-- Insertar usuarios de ejemplo
INSERT INTO lv_usuario (nombre_completo, correo, password, telefono, perfil_id, hotel_id) VALUES
-- Administrador general
('Juan Carlos Admin', 'admin@lavanderia.com', '$2b$10$rQZ8kJxH.fKGHvJ8vQZ8kOxH.fKGHvJ8vQZ8kOxH.fKGHvJ8vQZ8kO', '999-888-777', 1, NULL),
-- Personal Hotel Paradise
('María González', 'maria.gonzalez@hotelparadise.com', '$2b$10$rQZ8kJxH.fKGHvJ8vQZ8kOxH.fKGHvJ8vQZ8kOxH.fKGHvJ8vQZ8kO', '999-111-222', 2, 1),
('Carlos Mendoza', 'carlos.mendoza@hotelparadise.com', '$2b$10$rQZ8kJxH.fKGHvJ8vQZ8kOxH.fKGHvJ8vQZ8kOxH.fKGHvJ8vQZ8kO', '999-333-444', 3, 1),
('Ana Rodríguez', 'ana.rodriguez@hotelparadise.com', '$2b$10$rQZ8kJxH.fKGHvJ8vQZ8kOxH.fKGHvJ8vQZ8kOxH.fKGHvJ8vQZ8kO', '999-555-666', 5, 1),
-- Personal Los Andes
('Pedro Quispe', 'pedro.quispe@losandes.com', '$2b$10$rQZ8kJxH.fKGHvJ8vQZ8kOxH.fKGHvJ8vQZ8kOxH.fKGHvJ8vQZ8kO', '984-111-222', 2, 2),
('Luis Mamani', 'luis.mamani@losandes.com', '$2b$10$rQZ8kJxH.fKGHvJ8vQZ8kOxH.fKGHvJ8vQZ8kOxH.fKGHvJ8vQZ8kO', '984-333-444', 3, 2),
-- Operarios de lavandería
('Roberto Silva', 'roberto.silva@lavanderia.com', '$2b$10$rQZ8kJxH.fKGHvJ8vQZ8kOxH.fKGHvJ8vQZ8kOxH.fKGHvJ8vQZ8kO', '999-777-888', 4, NULL),
('Carmen López', 'carmen.lopez@lavanderia.com', '$2b$10$rQZ8kJxH.fKGHvJ8vQZ8kOxH.fKGHvJ8vQZ8kOxH.fKGHvJ8vQZ8kO', '999-999-000', 4, NULL);

-- Inicializar contadores de guías para cada hotel
INSERT INTO lv_hotel_contador (hotel_id, ultimo_numero_guia) VALUES
(1, 0), -- Hotel Paradise
(2, 0), -- Los Andes Hotel
(3, 0); -- Gran Hotel Lima

-- Nota: Las contraseñas están hasheadas con bcrypt
-- Contraseña para todos los usuarios de ejemplo: "123456"