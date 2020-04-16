CREATE TABLE IF NOT EXISTS usertable(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT, 
    apellido TEXT,
    telefono TEXT,
    correo TEXT,
    fecha_nacimiento TEXT,
    genero TEXT
);

INSERT or IGNORE INTO usertable(id, nombre, apellido, telefono, correo, fecha_nacimiento, genero) VALUES (1, 'Luis', 'Castellon', '4756161', 'luis@gmail.com', '06/11/1997', 'Masculino');