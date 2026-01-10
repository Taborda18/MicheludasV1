const { pool } = require('../config/database');

class OrderSession {
    static async findAll() {
        const result = await pool.query('SELECT * FROM order_sessions ORDER BY created_at DESC');
        return result.rows;
    }

    static async findActive() {
        const result = await pool.query(
            "SELECT * FROM order_sessions WHERE status = 'active' ORDER BY table_identifier"
        );
        return result.rows;
    }

    static async findById(id) {
        const result = await pool.query('SELECT * FROM order_sessions WHERE id = $1', [id]);
        return result.rows[0];
    }

    static async findByTableIdentifier(table_identifier) {
        const result = await pool.query(
            "SELECT * FROM order_sessions WHERE table_identifier = $1 AND status = 'active'",
            [table_identifier]
        );
        return result.rows[0];
    }

    static async create(sessionData) {
        const { table_identifier, tag, status = 'active' } = sessionData;
        const result = await pool.query(
            'INSERT INTO order_sessions (table_identifier, tag, status, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
            [table_identifier, tag, status]
        );
        return result.rows[0];
    }

    static async update(id, sessionData) {
        const { table_identifier, tag, status } = sessionData;
        const result = await pool.query(
            'UPDATE order_sessions SET table_identifier = $1, tag = $2, status = $3 WHERE id = $4 RETURNING *',
            [table_identifier, tag, status, id]
        );
        return result.rows[0];
    }

    static async updateStatus(id, status) {
        const result = await pool.query(
            'UPDATE order_sessions SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );
        return result.rows[0];
    }

    static async delete(id) {
        await pool.query('DELETE FROM order_sessions WHERE id = $1', [id]);
        return { message: 'Order session deleted successfully' };
    }
}

module.exports = OrderSession;
