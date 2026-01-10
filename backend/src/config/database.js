const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });
const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'postgres',
});

const connectDB = async () => {
    try {
        const client = await pool.connect();
        console.log('✅ PostgreSQL connected successfully');
        console.log(`📊 Database: ${process.env.DB_NAME}`);
        client.release();
    } catch (error) {
        console.error('❌ PostgreSQL connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = { pool, connectDB };