const { pool } = require('../config/database');

class OrderSession {
    static async findAll() {
        const result = await pool.query('SELECT * FROM order_sessions ORDER BY created_at DESC');
        return result.rows;
    }

    static async findOpen() {
        const result = await pool.query(
            "SELECT * FROM order_sessions WHERE status = 'Open' ORDER BY table_identifier"
        );
        return result.rows;
    }

    static async findClosed() {
        const result = await pool.query(
            "SELECT * FROM order_sessions WHERE status = 'Closed' ORDER BY table_identifier"
        );
        return result.rows;
    }

    static async findById(id) {
        const result = await pool.query('SELECT * FROM order_sessions WHERE id = $1', [id]);
        return result.rows[0];
    }

    static async findByTableIdentifier(table_identifier) {
        const result = await pool.query(
            "SELECT * FROM order_sessions WHERE table_identifier = $1 AND status = 'Open'",
            [table_identifier]
        );
        return result.rows[0];
    }

    static async create(sessionData) {
        const { table_identifier, tag, status = 'Open' } = sessionData;
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
        let query, params;
        if (status === 'Closed') {
            // Al cerrar, limpiar la etiqueta/tag para no arrastrarla a la próxima sesión
            query = 'UPDATE order_sessions SET status = $1, tag = NULL WHERE id = $2 RETURNING *';
            params = [status, id];
        } else {
            query = 'UPDATE order_sessions SET status = $1 WHERE id = $2 RETURNING *';
            params = [status, id];
        }
        const result = await pool.query(query, params);
        return result.rows[0];
    }

    static async delete(id) {
        await pool.query('DELETE FROM order_sessions WHERE id = $1', [id]);
        return { message: 'Order session deleted successfully' };
    }

    static async getSessionsWithPendingTickets() {
        const result = await pool.query(
            `SELECT os.id,
                    os.table_identifier,
                    os.tag,
                    os.status,
                    os.created_at,
                    COALESCE(pending_stats.pending_count, 0)::integer as pending_tickets_count,
                    COALESCE(pending_stats.pending_amount, 0)::numeric as pending_amount,
                    COALESCE(total_stats.total_amount, 0)::numeric as total_amount
             FROM order_sessions os
             LEFT JOIN (
                SELECT t.session_id,
                       COUNT(DISTINCT t.id)::integer as pending_count,
                       COALESCE(SUM(td.quantity * td.unit_price_at_sale), 0)::numeric as pending_amount
                FROM tickets t
                LEFT JOIN ticket_details td ON t.id = td.ticket_id
                WHERE t.status = 'Pending'
                GROUP BY t.session_id
             ) pending_stats ON os.id = pending_stats.session_id
             LEFT JOIN (
                SELECT t.session_id,
                       COALESCE(SUM(td.quantity * td.unit_price_at_sale), 0)::numeric as total_amount
                FROM tickets t
                LEFT JOIN ticket_details td ON t.id = td.ticket_id
                GROUP BY t.session_id
             ) total_stats ON os.id = total_stats.session_id
             WHERE os.status = 'Open'
             ORDER BY os.table_identifier`
        );
        return result.rows;
    }
}

module.exports = OrderSession;
