const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 Building for AWS Lambda...');

try {
  // Crear directorio dist si no existe
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
  }

  // Compilar TypeScript
  console.log('📦 Compiling TypeScript...');
  execSync('npx tsc --outDir dist --target es2020 --module commonjs --moduleResolution node --esModuleInterop true --allowSyntheticDefaultImports true --strict false --skipLibCheck true src/lambda.ts src/simple-app.ts', { stdio: 'inherit' });

  // Copiar package.json
  console.log('📋 Copying package.json...');
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  // Crear package.json simplificado para Lambda
  const lambdaPackageJson = {
    name: packageJson.name,
    version: packageJson.version,
    main: 'lambda.js',
    dependencies: packageJson.dependencies
  };
  
  fs.writeFileSync('dist/package.json', JSON.stringify(lambdaPackageJson, null, 2));

  console.log('✅ Build completed successfully!');
  console.log('📁 Files created in dist/:');
  
  const distFiles = fs.readdirSync('dist');
  distFiles.forEach(file => {
    console.log(`   - ${file}`);
  });

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}