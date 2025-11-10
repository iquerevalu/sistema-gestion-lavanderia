const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 Building frontend for AWS Lambda...');

try {
  // Paso 1: Build del frontend con Vite
  console.log('📦 Building React app...');
  execSync('npx vite build --mode production', { stdio: 'inherit' });

  // Paso 2: Crear directorio dist si no existe
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
  }

  // Paso 3: Compilar el servidor TypeScript
  console.log('🔧 Compiling server...');
  execSync('npx tsc src/server.ts --outDir dist --target es2020 --module commonjs --moduleResolution node --esModuleInterop true --allowSyntheticDefaultImports true --strict false --skipLibCheck true', { stdio: 'inherit' });

  // Paso 4: Los archivos ya están en dist/ desde el build de Vite
  console.log('📋 Build files are already in place...');
  
  // No necesitamos copiar nada, los archivos ya están donde deben estar

  // Paso 5: Crear package.json para Lambda
  console.log('📄 Creating package.json...');
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  const lambdaPackageJson = {
    name: packageJson.name + '-lambda',
    version: packageJson.version,
    main: 'server.js',
    dependencies: {
      '@types/aws-lambda': '^8.10.0'
    }
  };
  
  fs.writeFileSync('dist/package.json', JSON.stringify(lambdaPackageJson, null, 2));

  console.log('✅ Frontend build completed successfully!');
  console.log('📁 Files created in dist/:');
  
  const distFiles = fs.readdirSync('dist');
  distFiles.forEach(file => {
    const stats = fs.statSync(path.join('dist', file));
    console.log(`   ${stats.isDirectory() ? '📁' : '📄'} ${file}`);
  });

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}