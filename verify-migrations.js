#!/usr/bin/env node

/**
 * Script de Verificación de Migraciones
 * Verifica que el sistema esté correctamente configurado
 * Uso: node verify-migrations.js
 */

const fs = require('fs');
const path = require('path');

console.log('\n📋 Verificando Configuración de Migraciones\n');
console.log('='.repeat(50));

let passedChecks = 0;
let totalChecks = 0;

function check(name, condition, errorMsg = '') {
    totalChecks++;
    if (condition) {
        console.log(`✅ ${name}`);
        passedChecks++;
    } else {
        console.log(`❌ ${name}`);
        if (errorMsg) console.log(`   → ${errorMsg}`);
    }
}

// Verificar archivos
console.log('\n📁 Verificando Archivos:');
check('migrations.sql existe', fs.existsSync('backend/database/migrations.sql'), 'Falta backend/database/migrations.sql');
check('migrations.js existe', fs.existsSync('backend/database/migrations.js'), 'Falta backend/database/migrations.js');
check('runMigrations.js existe', fs.existsSync('backend/database/runMigrations.js'), 'Falta backend/database/runMigrations.js');
check('app.js actualizado', 
    fs.readFileSync('backend/src/app.js', 'utf8').includes('runMigrations'),
    'app.js no tiene la importación de runMigrations');

// Verificar .env
console.log('\n🔧 Verificando Configuración:');
const envExists = fs.existsSync('.env');
check('.env existe', envExists, 'Copia .env.example a .env');
check('.env.example existe', fs.existsSync('.env.example'), 'Falta .env.example');

if (envExists) {
    const envContent = fs.readFileSync('.env', 'utf8');
    check('DB_HOST configurado', envContent.includes('DB_HOST'), 'Falta DB_HOST en .env');
    check('DB_USER configurado', envContent.includes('DB_USER'), 'Falta DB_USER en .env');
    check('DB_PASSWORD configurado', envContent.includes('DB_PASSWORD'), 'Falta DB_PASSWORD en .env');
    check('DB_NAME configurado', envContent.includes('DB_NAME'), 'Falta DB_NAME en .env');
}

// Verificar Docker
console.log('\n🐳 Verificando Docker:');
check('docker-compose.yml existe', fs.existsSync('docker-compose.yml'), 'Falta docker-compose.yml');
check('Dockerfile existe (backend)', fs.existsSync('Dockerfile'), 'Falta Dockerfile en backend');
check('Dockerfile existe (React)', fs.existsSync('React/Dockerfile'), 'Falta Dockerfile en React/');

// Verificar documentación
console.log('\n📚 Verificando Documentación:');
check('DEPLOYMENT.md existe', fs.existsSync('DEPLOYMENT.md'), 'Falta DEPLOYMENT.md');
check('README.md en database/', fs.existsSync('backend/database/README.md'), 'Falta backend/database/README.md');

// Verificar scripts de setup
console.log('\n🚀 Verificando Scripts:');
check('setup.sh existe', fs.existsSync('setup.sh'), 'Falta setup.sh');
check('setup.bat existe', fs.existsSync('setup.bat'), 'Falta setup.bat');

// Verificar package.json
console.log('\n📦 Verificando package.json:');
const packageJson = fs.readFileSync('backend/package.json', 'utf8');
const pkg = JSON.parse(packageJson);
check('Script "migrate" en package.json', pkg.scripts && pkg.scripts.migrate, 'Añade "migrate" script en package.json');

// Resultado final
console.log('\n' + '='.repeat(50));
const percentage = Math.round((passedChecks / totalChecks) * 100);
console.log(`\n📊 Resultado: ${passedChecks}/${totalChecks} verificaciones pasadas (${percentage}%)\n`);

if (passedChecks === totalChecks) {
    console.log('🎉 ¡Todo está perfectamente configurado!');
    console.log('\n🚀 Próximos pasos:');
    console.log('1. Asegúrate de tener PostgreSQL corriendo');
    console.log('2. Ejecuta: cd backend && npm start');
    console.log('3. Las migraciones se ejecutarán automáticamente');
    console.log('\n✅ Sistema listo para usar!\n');
    process.exit(0);
} else {
    console.log('⚠️  Hay verificaciones que fallaron.');
    console.log('Por favor revisa los errores arriba.\n');
    process.exit(1);
}
