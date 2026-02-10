#!/usr/bin/env node

/**
 * Script para ejecutar migraciones de base de datos manualmente
 * Uso: node database/runMigrations.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { pool } = require('../src/config/database');
const { runMigrations } = require('./migrations');

/**
 * Ejecuta las migraciones y cierra la conexión
 */
async function main() {
    try {
        console.log('🔄 Ejecutando migraciones manualmente...\n');
        
        // Verificar conexión
        const client = await pool.connect();
        console.log('✅ Conexión a la base de datos exitosa');
        console.log(`📊 Base de datos: ${process.env.DB_NAME}`);
        client.release();
        
        // Ejecutar migraciones
        await runMigrations();
        
        console.log('\n✅ ¡Migraciones completadas exitosamente!');
        console.log('🎉 La base de datos está lista para usar\n');
        
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error(error);
        process.exit(1);
    } finally {
        // Cerrar la conexión
        await pool.end();
    }
}

main();
