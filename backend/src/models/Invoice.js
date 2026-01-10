const { pool } = require('../config/database');

class Invoice {
    static async findAll() {
        const result = await pool.query(
            `SELECT i.*, u.username as cashier_name, os.table_identifier 
             FROM invoices i 
             LEFT JOIN users u ON i.cashier_id = u.id 
             LEFT JOIN order_sessions os ON i.session_id = os.id 
             ORDER BY i.created_at DESC`
        );
        return result.rows;
    }

    static async findById(id) {
        const result = await pool.query(
            `SELECT i.*, u.username as cashier_name, os.table_identifier 
             FROM invoices i 
             LEFT JOIN users u ON i.cashier_id = u.id 
             LEFT JOIN order_sessions os ON i.session_id = os.id 
             WHERE i.id = $1`,
            [id]
        );
        return result.rows[0];
    }

    static async findBySession(session_id) {
        const result = await pool.query(
            'SELECT * FROM invoices WHERE session_id = $1',
            [session_id]
        );
        return result.rows[0];
    }

    static async create(invoiceData) {
        const { session_id, cashier_id, total_amount, payment_method } = invoiceData;
        const result = await pool.query(
            'INSERT INTO invoices (session_id, cashier_id, total_amount, payment_method, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
            [session_id, cashier_id, total_amount, payment_method]
        );
        return result.rows[0];
    }

    static async delete(id) {
        await pool.query('DELETE FROM invoices WHERE id = $1', [id]);
        return { message: 'Invoice deleted successfully' };
    }

    static async getTotalsByDateRange(startDate, endDate) {
        const result = await pool.query(
            `SELECT DATE(created_at) as date, 
                    COUNT(*) as invoice_count, 
                    SUM(total_amount) as total_sales,
                    payment_method
             FROM invoices 
             WHERE created_at BETWEEN $1 AND $2 
             GROUP BY DATE(created_at), payment_method 
             ORDER BY date DESC`,
            [startDate, endDate]
        );
        return result.rows;
    }
}

module.exports = Invoice;
