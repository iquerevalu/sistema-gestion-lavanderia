-- Insertar hoteles de ejemplo para pruebas
USE db_lavanderia;

-- Insertar hoteles de ejemplo
INSERT INTO lv_hotel (ruc, razon_social, nombre_comercial, direccion, correo_contacto, telefono) VALUES
('20123456789', 'Hotel Plaza Mayor S.A.C.', 'Hotel Plaza Mayor', 'Av. Principal 123, Lima Centro', 'info@hotelplazamayor.com', '01-234-5678'),
('20987654321', 'Inversiones Costa Verde S.R.L.', 'Hotel Costa Verde', 'Malecón Costa Verde 456, Miraflores', 'contacto@hotelcostaverde.com', '01-987-6543'),
('20555666777', 'Hotel Ejecutivo Lima S.A.', 'Hotel Ejecutivo', 'Jr. Ejecutivo 789, San Isidro', 'reservas@hotelecutivo.com', '01-555-6677'),
('20444333222', 'Boutique Hotels Peru S.A.C.', 'Hotel Boutique', 'Av. Boutique 321, Barranco', 'info@hotelboutique.com', '01-444-3322'),
('20111222333', 'Business Hotels Group S.R.L.', 'Hotel Business', 'Av. Business 654, La Molina', 'contacto@hotelbusiness.com', '01-111-2233'),
('20666777888', 'Luxury Hotels International S.A.', 'Hotel Luxury', 'Av. Luxury 987, San Borja', 'info@hotelluxury.com', '01-666-7788'),
('20777888999', 'Metropolitan Hotels Group S.A.C.', 'Hotel Metropolitan', 'Jr. Metropolitan 147, Surco', 'reservas@hotelmetropolitan.com', '01-777-8899'),
('20888999000', 'Garden Hotels Peru S.R.L.', 'Hotel Garden', 'Av. Garden 258, Pueblo Libre', 'contacto@hotelgarden.com', '01-888-9900'),
('20999000111', 'Panorama Hotels S.A.', 'Hotel Panorama', 'Av. Panorama 369, Chorrillos', 'info@hotelpanorama.com', '01-999-0011'),
('20000111222', 'Sunrise Hospitality S.A.C.', 'Hotel Sunrise', 'Jr. Sunrise 741, Jesús María', 'reservas@hotelsunrise.com', '01-000-1122');

-- Inicializar contadores para cada hotel
INSERT INTO lv_hotel_contador (hotel_id, ultimo_numero_guia)
SELECT id_hotel, 0 FROM lv_hotel WHERE id_hotel NOT IN (SELECT hotel_id FROM lv_hotel_contador);

-- Verificar los hoteles insertados
SELECT 
    id_hotel,
    ruc,
    razon_social,
    nombre_comercial,
    telefono,
    correo_contacto,
    estado
FROM lv_hotel 
WHERE estado = 1
ORDER BY nombre_comercial;