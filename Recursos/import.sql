
-- -----------------------------------------------------
-- Crear la base de datos
-- -----------------------------------------------------
DROP DATABASE IF EXISTS mydb;
CREATE DATABASE IF NOT EXISTS mydb DEFAULT CHARACTER SET utf8;
USE mydb;

-- -----------------------------------------------------
-- Tabla: Usuario
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS usuario (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(45) NOT NULL UNIQUE,
  contrasena VARCHAR(100) NOT NULL,
  correo VARCHAR(100) NOT NULL UNIQUE,
  telefono VARCHAR(25),
  PRIMARY KEY (id)
);

-- -----------------------------------------------------
-- Tabla: Producto_surtitiendas
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Producto_surtitiendas (
  id_producto VARCHAR(45) NOT NULL,
  nombre VARCHAR(45) NOT NULL UNIQUE,
  precio DECIMAL(10,2) NOT NULL,
  imagen_url VARCHAR(255),
  tamano VARCHAR(45) NOT NULL,
  PRIMARY KEY (id_producto)
);

-- -----------------------------------------------------
-- Tabla: Factura_surtitiendas
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Factura_surtitiendas (
  id_factura INT AUTO_INCREMENT,
  total DECIMAL(10,2),
  id INT NOT NULL,
  fecha varchar(16),
  PRIMARY KEY (id_factura),
  FOREIGN KEY (id)
    REFERENCES Usuario (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);


-- -----------------------------------------------------
-- Tabla PUENTE: Productos_surtitiendas_factura
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Productos_surtitiendas_factura (
  id_producto VARCHAR(45) NOT NULL,
  id_factura INT,
  cantidad INT NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  precio_base DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (id_producto, id_factura),
  FOREIGN KEY (id_producto)
    REFERENCES Producto_surtitiendas (id_producto)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  FOREIGN KEY (id_factura)
    REFERENCES Factura_surtitiendas (id_factura)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
);

-- -----------------------------------------------------
-- Tabla: Producto_alqueria
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Producto_alqueria (
  id_producto_alqueria VARCHAR(45) NOT NULL,
  nombre VARCHAR(45) NOT NULL UNIQUE,
  precio DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (id_producto_alqueria)
);

-- -----------------------------------------------------
-- Tabla: Factura_alqueria
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Factura_alqueria (
  idFactura INT AUTO_INCREMENT,
  total DECIMAL(10,2),
  id_usuario INT NOT NULL,
  fecha varchar (16),
  PRIMARY KEY (idFactura),
  FOREIGN KEY (id_usuario)  
    REFERENCES usuario (id) 
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);
-- -----------------------------------------------------
-- Tabla: Producto_factura_alqueria
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Producto_factura_alqueria (
  id_factura INT NOT NULL,
  id_producto VARCHAR(45) NOT NULL,
  precio_base DECIMAL(10,2) NOT NULL,
  cantidad INT NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (id_factura, id_producto),
  FOREIGN KEY (id_factura)
    REFERENCES Factura_alqueria (idFactura)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  FOREIGN KEY (id_producto)
    REFERENCES Producto_alqueria (id_producto_alqueria)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);



-- -----------------------------------------------------
-- Tabla: Reseña
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Reseña (
  comentario TEXT,
  usuario text
  
);


-- -----------------------------------------------------
-- Tabla: Contacto
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Contacto (
  
  Nombre VARCHAR(45),
  Apellido VARCHAR(45),
  Correo VARCHAR(45),
  Direccion VARCHAR(45),
  Telefono VARCHAR(45),
  tipoFacturacion VARCHAR(45),
  comentarios text
  
);

-- ============================
-- USUARIOS
-- ============================
INSERT INTO usuario (nombre, contrasena, correo, telefono) VALUES
('daniel', '1234', 'daniel.tobon@example.com', '3001234567'),
('carlos', 'abcd', 'carlos.aguilar@example.com', '3159876543'),
('andrea', '12345', 'andrea.lopez@example.com', '3105558899'),
('maria', 'maria', 'maria.gomez@example.com', '3105558349'),
('juan', 'juan123', 'juan.perez@example.com', '3013344556');


-- ============================
-- PRODUCTOS SURTITIENDAS
-- ============================
INSERT INTO Producto_surtitiendas (id_producto, nombre, precio, imagen_url, tamano) VALUES
('P000', 'Leche', 4500, 'imagenes/leche.jpg', '1 Litro'),
('P001', 'Yogurt', 2500, 'imagenes/yogurt.webp', '140gr'),
('P002', 'Activia', 2500, 'imagenes/activia.webp', '150gr'),
('P003', 'M-M', 1000, 'imagenes/M-M.webp', '100gr'),
('P004', 'Avena', 2500, 'imagenes/avena.jpg', '180gr'),
('P005', 'Jugo Tangelo', 5000, 'imagenes/tangelo.webp', '2 Litros'),
('P006', 'ChocoLeche', 5000, 'imagenes/chocoleche.jpg', '200gr'),
('P007', 'Arequipe', 5000, 'imagenes/arequipe.webp', '50gr');


-- ============================
-- PRODUCTOS ALQUERÍA
-- ============================
INSERT INTO Producto_alqueria (id_producto_alqueria, nombre, precio) VALUES
('A000', 'Leche', 4500.00),
('A001', 'Yogurt', 2500.00),
('A002', 'Activia', 2500.00),
('A003', 'M-M', 1000.00),
('A004', 'Avena', 2500.00),
('A005', 'Jugo Tangelo', 5000.00),
('A006', 'ChocoLeche', 5000.00),
('A007', 'Arequipe', 5000.00);


-- ============================
-- FACTURAS SURTITIENDAS
-- (para usuarios existentes)
-- ============================
INSERT INTO Factura_surtitiendas (total, id, fecha) VALUES
(12000, 1, '2025-01-10'),
(8000, 1, '2025-01-15'),
(15000, 2, '2025-01-20'),
(5000, 3, '2025-01-21');


-- ============================
-- PRODUCTOS EN FACTURAS SURTITIENDAS
-- ============================
INSERT INTO Productos_surtitiendas_factura (id_producto, id_factura, cantidad, subtotal, precio_base) VALUES
('P000', 1, 2, 9000, 4500),
('P003', 1, 3, 3000, 1000),
('P007', 2, 2, 10000, 5000),
('P001', 3, 4, 10000, 2500),
('P006', 4, 1, 5000, 5000);


-- ============================
-- FACTURAS ALQUERÍA
-- ============================
INSERT INTO Factura_alqueria (total, id_usuario, fecha) VALUES
(9500, 1, '2025-02-01'),
(20000, 2, '2025-02-05'),
(7500, 3, '2025-02-07');


-- ============================
-- PRODUCTOS EN FACTURAS ALQUERÍA
-- ============================
INSERT INTO Producto_factura_alqueria (id_factura, id_producto, precio_base, cantidad, subtotal) VALUES
(1, 'A000', 4500, 1, 4500),
(1, 'A001', 2500, 2, 5000),

(2, 'A005', 5000, 2, 10000),
(2, 'A007', 5000, 2, 10000),

(3, 'A003', 1000, 3, 3000),
(3, 'A002', 2500, 1, 2500),
(3, 'A004', 2500, 1, 2500);






show tables;

select * from Usuario;
select * from Producto_alqueria;
select * from  Factura_alqueria;
select * from Producto_factura_alqueria;
select * from Productos_surtitiendas_factura;

select * from Producto_surtitiendas;





