const path = require('path');
const fs = require('fs');
const { pool } = require('../src/config/database');

/**
 * Ejecuta el script de migración de la base de datos
 * Crea todas las tablas necesarias si no existen
 */
async function runMigrations() {
    try {
        console.log('🔄 Iniciando migraciones de base de datos...');
        
        // Leer el archivo SQL de migraciones
        const migrationPath = path.join(__dirname, 'migrations.sql');
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
        
        // Ejecutar el script SQL completo
        await pool.query(migrationSQL);
        
        console.log('✅ Migraciones completadas exitosamente');
        
        // Ejecutar seed de datos si no existen
        await seedDefaultData();
        
        return true;
    } catch (error) {
        console.error('❌ Error en migraciones de base de datos:', error);
        throw error;
    }
}

/**
 * Inserta datos por defecto si la tabla está vacía
 */
async function seedDefaultData() {
    try {
        // Verificar si hay roles
        const rolesResult = await pool.query('SELECT COUNT(*) FROM roles');
        
        if (parseInt(rolesResult.rows[0].count) === 0) {
            console.log('📊 Insertando roles por defecto...');
            
            const roles = ['Admin', 'Cajero', 'Mesero', 'Cocinero'];
            
            for (const role of roles) {
                await pool.query(
                    'INSERT INTO roles (name) VALUES ($1) ON CONFLICT DO NOTHING',
                    [role]
                );
            }
            
            console.log('✅ Roles insertados correctamente');
        }
        
        // Verificar si hay usuario admin
        const usersResult = await pool.query('SELECT COUNT(*) FROM users');
        
        if (parseInt(usersResult.rows[0].count) === 0) {
            console.log('📊 Insertando usuario admin por defecto...');
            
            const bcrypt = require('bcrypt');
            
            // Obtener el role_id de admin
            const roleResult = await pool.query(
                'SELECT id FROM roles WHERE name = $1',
                ['Admin']
            );
            
            if (roleResult.rows[0]) {
                const adminRoleId = roleResult.rows[0].id;
                const hashedPassword = await bcrypt.hash('admin123', 10);
                
                await pool.query(
                    'INSERT INTO users (username, password_hash, role_id) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
                    ['admin', hashedPassword, adminRoleId]
                );
                
                console.log('✅ Usuario admin creado: admin / admin123');
                console.log('⚠️  IMPORTANTE: Cambia esta contraseña en la primera oportunidad');
            }
        }
        
    } catch (error) {
        console.error('⚠️  Error insertando datos por defecto:', error.message);
        // No lanzar error aquí, solo advertencia
    }
}

/**
 * Funcion para ejecutar una migración manual si es necesario
 */
async function executeSQLFile(filePath) {
    try {
        const sql = fs.readFileSync(filePath, 'utf8');
        await pool.query(sql);
        console.log(`✅ Script SQL ejecutado: ${path.basename(filePath)}`);
    } catch (error) {
        console.error(`❌ Error ejecutando SQL: ${error.message}`);
        throw error;
    }
}

module.exports = {
    runMigrations,
    seedDefaultData,
    executeSQLFile
};
