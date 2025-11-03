const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function resetAdminPassword() {
  try {
    // Crear conexión a la base de datos
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'X',
      database: 'db_lavanderia'
    });

    // Generar hash de la contraseña
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Actualizar la contraseña
    await connection.execute(
      'UPDATE lv_usuario SET password = ? WHERE correo = ?',
      [hashedPassword, 'admin@lavanderia.com']
    );
    
    console.log('✅ Contraseña actualizada exitosamente');
    console.log('📧 Email: admin@lavanderia.com');
    console.log('🔑 Password: admin123');
    
    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

resetAdminPassword();