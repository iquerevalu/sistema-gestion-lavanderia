const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    console.log('Intentando conectar a MySQL...');
    console.log('Host: localhost');
    console.log('Port: 3306');
    console.log('User: root');
    console.log('Password: 1234');
    console.log('Database: db_lavanderia');
    
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '1234',
      database: 'db_lavanderia'
    });
    
    console.log('✅ Conexión exitosa!');
    
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM lv_usuario');
    console.log('✅ Usuarios en la base de datos:', rows[0].count);
    
    await connection.end();
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.error('Código de error:', error.code);
  }
}

testConnection();