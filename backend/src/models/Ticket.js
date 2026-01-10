const { pool } = require('../config/database');

class Ticket {
    static async findAll() {
        const result = await pool.query(
            `SELECT t.*, u.username as waiter_name, os.table_identifier 
             FROM tickets t 
             LEFT JOIN users u ON t.waiter_id = u.id 
             LEFT JOIN order_sessions os ON t.session_id = os.id 
             ORDER BY t.created_at DESC`
        );
        return result.rows;
    }

    static async findById(id) {
        const result = await pool.query(
            `SELECT t.*, u.username as waiter_name, os.table_identifier 
             FROM tickets t 
             LEFT JOIN users u ON t.waiter_id = u.id 
             LEFT JOIN order_sessions os ON t.session_id = os.id 
             WHERE t.id = $1`,
            [id]
        );
        return result.rows[0];
    }

    static async findBySession(session_id) {
        const result = await pool.query(
            `SELECT t.*, u.username as waiter_name 
             FROM tickets t 
             LEFT JOIN users u ON t.waiter_id = u.id 
             WHERE t.session_id = $1 
             ORDER BY t.created_at DESC`,
            [session_id]
        );
        return result.rows;
    }

    static async create(ticketData) {
        const { session_id, waiter_id, status = 'pending' } = ticketData;
        const result = await pool.query(
            'INSERT INTO tickets (session_id, waiter_id, status, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
            [session_id, waiter_id, status]
        );
        return result.rows[0];
    }

    static async updateStatus(id, status) {
        const result = await pool.query(
            'UPDATE tickets SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );
        return result.rows[0];
    }

    static async delete(id) {
        await pool.query('DELETE FROM tickets WHERE id = $1', [id]);
        return { message: 'Ticket deleted successfully' };
    }

    static async getWithDetails(id) {
        const ticket = await this.findById(id);
        const details = await pool.query(
            `SELECT td.*, p.name as product_name 
             FROM ticket_details td 
             LEFT JOIN products p ON td.product_id = p.id 
             WHERE td.ticket_id = $1`,
            [id]
        );
        return { ...ticket, details: details.rows };
    }
}

module.exports = Ticket;
