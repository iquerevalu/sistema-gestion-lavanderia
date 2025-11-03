-- Script de Creación Principal para Sistema de Lavandería
-- Crear base de datos
CREATE DATABASE IF NOT EXISTS db_lavanderia;
USE db_lavanderia;

-- Tabla perfiles (roles)
CREATE TABLE lv_perfil (
    id_perfil INT AUTO_INCREMENT PRIMARY KEY,
    nombre_perfil VARCHAR(50) NOT NULL,
    descripcion VARCHAR(200)
);

-- Tabla hoteles
CREATE TABLE lv_hotel (
    id_hotel INT AUTO_INCREMENT PRIMARY KEY,
    ruc VARCHAR(11),
    razon_social VARCHAR(100) NOT NULL,
    nombre_comercial VARCHAR(100),
    direccion VARCHAR(200),
    correo_contacto VARCHAR(100),
    telefono VARCHAR(20),
    estado TINYINT DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla usuarios
CREATE TABLE lv_usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    perfil_id INT NOT NULL,
    hotel_id INT NULL,
    estado TINYINT DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (perfil_id) REFERENCES lv_perfil(id_perfil),
    FOREIGN KEY (hotel_id) REFERENCES lv_hotel(id_hotel)
);

-- Tabla categorías de prendas
CREATE TABLE lv_categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(100) NOT NULL,
    descripcion VARCHAR(200)
);

-- Tabla prendas
CREATE TABLE lv_prenda (
    id_prenda INT AUTO_INCREMENT PRIMARY KEY,
    categoria_id INT NOT NULL,
    nombre_prenda VARCHAR(100) NOT NULL,
    descripcion VARCHAR(200),
    FOREIGN KEY (categoria_id) REFERENCES lv_categoria(id_categoria)
);

-- Tabla relación Hotel - Prenda (precio por hotel)
CREATE TABLE lv_hotel_prenda (
    id_hotel_prenda INT AUTO_INCREMENT PRIMARY KEY,
    hotel_id INT NOT NULL,
    prenda_id INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    estado TINYINT DEFAULT 1,
    FOREIGN KEY (hotel_id) REFERENCES lv_hotel(id_hotel),
    FOREIGN KEY (prenda_id) REFERENCES lv_prenda(id_prenda)
);

-- Tabla guías
CREATE TABLE lv_guia (
    id_guia INT AUTO_INCREMENT PRIMARY KEY,
    numero_guia INT NOT NULL,
    hotel_id INT NOT NULL,
    chofer_recojo_id INT NOT NULL,
    chofer_entrega_id INT NULL,
    recepcionista_recojo_id INT NOT NULL,
    recepcionista_entrega_id INT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'Registrado',
    fecha_recoleccion DATE NOT NULL,
    fecha_entrega DATE NULL,
    observaciones TEXT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES lv_hotel(id_hotel),
    FOREIGN KEY (chofer_recojo_id) REFERENCES lv_usuario(id_usuario),
    FOREIGN KEY (chofer_entrega_id) REFERENCES lv_usuario(id_usuario),
    FOREIGN KEY (recepcionista_recojo_id) REFERENCES lv_usuario(id_usuario),
    FOREIGN KEY (recepcionista_entrega_id) REFERENCES lv_usuario(id_usuario),
    UNIQUE KEY unique_guia_hotel (numero_guia, hotel_id)
);

-- Tabla detalle de guía
CREATE TABLE lv_detalle_guia (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    guia_id INT NOT NULL,
    hotel_prenda_id INT NOT NULL,
    cantidad_sucia INT NOT NULL,
    cantidad_limpia INT DEFAULT 0,
    es_devuelta TINYINT DEFAULT 0,
    FOREIGN KEY (guia_id) REFERENCES lv_guia(id_guia) ON DELETE CASCADE,
    FOREIGN KEY (hotel_prenda_id) REFERENCES lv_hotel_prenda(id_hotel_prenda)
);

-- Tabla historial de estados de guía
CREATE TABLE lv_historial_estado (
    id_historial INT AUTO_INCREMENT PRIMARY KEY,
    guia_id INT NOT NULL,
    estado_anterior VARCHAR(20),
    estado_nuevo VARCHAR(20) NOT NULL,
    usuario_id INT NOT NULL,
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observaciones TEXT,
    FOREIGN KEY (guia_id) REFERENCES lv_guia(id_guia) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES lv_usuario(id_usuario)
);

-- Tabla para manejar numeración secuencial por hotel
CREATE TABLE lv_hotel_contador (
    hotel_id INT PRIMARY KEY,
    ultimo_numero_guia INT DEFAULT 0,
    FOREIGN KEY (hotel_id) REFERENCES lv_hotel(id_hotel)
);

-- Índices para optimización
CREATE INDEX idx_usuario_correo ON lv_usuario(correo);
CREATE INDEX idx_guia_hotel ON lv_guia(hotel_id);
CREATE INDEX idx_guia_estado ON lv_guia(estado);
CREATE INDEX idx_guia_fecha ON lv_guia(fecha_recoleccion);
CREATE INDEX idx_detalle_guia ON lv_detalle_guia(guia_id);