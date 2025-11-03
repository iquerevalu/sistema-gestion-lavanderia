const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = '123456';
  const hash = await bcrypt.hash(password, 10);
  console.log('Contraseña:', password);
  console.log('Hash:', hash);
  
  // Verificar que el hash funciona
  const isValid = await bcrypt.compare(password, hash);
  console.log('Verificación:', isValid);
}

generateHash();