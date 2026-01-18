const { pool } = require('../config/database');

class TicketDetail {
    static async findByTicket(ticket_id) {
        const result = await pool.query(
            `SELECT td.*, p.name as product_name 
             FROM ticket_details td 
             LEFT JOIN products p ON td.product_id = p.id 
             WHERE td.ticket_id = $1`,
            [ticket_id]
        );
        return result.rows;
    }

    static async findById(id) {
        const result = await pool.query('SELECT * FROM ticket_details WHERE id = $1', [id]);
        return result.rows[0];
    }

    static async create(detailData) {
        const { ticket_id, product_id, quantity, unit_price_at_sale } = detailData;
        const result = await pool.query(
            'INSERT INTO ticket_details (ticket_id, product_id, quantity, unit_price_at_sale) VALUES ($1, $2, $3, $4) RETURNING *',
            [ticket_id, product_id, quantity, unit_price_at_sale]
        );
        return result.rows[0];
    }

    static async update(id, detailData) {
        const { quantity, unit_price_at_sale } = detailData;
        const result = await pool.query(
            'UPDATE ticket_details SET quantity = $1, unit_price_at_sale = $2 WHERE id = $3 RETURNING *',
            [quantity, unit_price_at_sale, id]
        );
        return result.rows[0];
    }

    static async updateQuantity(id, quantity) {
        const result = await pool.query(
            'UPDATE ticket_details SET quantity = $1 WHERE id = $2 RETURNING *',
            [quantity, id]
        );
        return result.rows[0];
    }

    static async delete(id) {
        await pool.query('DELETE FROM ticket_details WHERE id = $1', [id]);
        return { message: 'Ticket detail deleted successfully' };
    }

    static async calculateTicketTotal(ticket_id) {
        const result = await pool.query(
            'SELECT SUM(quantity * unit_price_at_sale) as total FROM ticket_details WHERE ticket_id = $1',
            [ticket_id]
        );
        return result.rows[0].total || 0;
    }
}

module.exports = TicketDetail;
