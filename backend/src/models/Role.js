const { pool } = require('../config/database');

class Role {
    static async findAll() {
        const result = await pool.query('SELECT * FROM roles');
        return result.rows;
    }

    static async findById(id) {
        const result = await pool.query('SELECT * FROM roles WHERE id = $1', [id]);
        return result.rows[0];
    }

    static async create(roleData) {
        const { name } = roleData;
        const result = await pool.query(
            'INSERT INTO roles (name) VALUES ($1) RETURNING *',
            [name]
        );
        return result.rows[0];
    }

    static async update(id, roleData) {
        const { name } = roleData;
        const result = await pool.query(
            'UPDATE roles SET name = $1 WHERE id = $2 RETURNING *',
            [name, id]
        );
        return result.rows[0];
    }

    static async delete(id) {
        await pool.query('DELETE FROM roles WHERE id = $1', [id]);
        return { message: 'Role deleted successfully' };
    }
}

module.exports = Role;
