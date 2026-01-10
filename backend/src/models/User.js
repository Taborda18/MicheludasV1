const { pool } = require('../config/database');

class User {
    static async findAll() {
        const result = await pool.query(
            'SELECT u.id, u.username, u.role_id, r.name as role_name FROM users u LEFT JOIN roles r ON u.role_id = r.id'
        );
        return result.rows;
    }

    static async findById(id) {
        const result = await pool.query(
            'SELECT u.id, u.username, u.role_id, r.name as role_name FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.id = $1',
            [id]
        );
        return result.rows[0];
    }

    static async findByUsername(username) {
        const result = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );
        return result.rows[0];
    }

    static async create(userData) {
        const { username, password_hash, role_id } = userData;
        const result = await pool.query(
            'INSERT INTO users (username, password_hash, role_id) VALUES ($1, $2, $3) RETURNING id, username, role_id',
            [username, password_hash, role_id]
        );
        return result.rows[0];
    }

    static async update(id, userData) {
        const { username, password_hash, role_id } = userData;
        
        // Si no hay password_hash, no actualizar ese campo
        let query;
        let params;
        
        if (password_hash) {
            query = 'UPDATE users SET username = $1, password_hash = $2, role_id = $3 WHERE id = $4 RETURNING id, username, role_id';
            params = [username, password_hash, role_id, id];
        } else {
            query = 'UPDATE users SET username = $1, role_id = $2 WHERE id = $3 RETURNING id, username, role_id';
            params = [username, role_id, id];
        }
        
        const result = await pool.query(query, params);
        return result.rows[0];
    }

    static async delete(id) {
        await pool.query('DELETE FROM users WHERE id = $1', [id]);
        return { message: 'User deleted successfully' };
    }
}

module.exports = User;
