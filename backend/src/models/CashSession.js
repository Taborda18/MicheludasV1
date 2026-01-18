const { pool } = require('../config/database');

class CashSession {
    static async findAll() {
        const result = await pool.query(
            'SELECT * FROM cash_sessions ORDER BY opened_at DESC'
        );
        return result.rows;
    }

    static async findById(id) {
        const result = await pool.query(
            'SELECT * FROM cash_sessions WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }

    static async findOpenByUser(user_id) {
        const result = await pool.query(
            "SELECT * FROM cash_sessions WHERE user_id = $1 AND status = 'Open' ORDER BY opened_at DESC",
            [user_id]
        );
        return result.rows;
    }

    static async create(sessionData) {
        const { user_id, opening_balance } = sessionData;
        const result = await pool.query(
            'INSERT INTO cash_sessions (user_id, opening_balance, status, opened_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
            [user_id, opening_balance, 'Open']
        );
        return result.rows[0];
    }

    static async computeTotalExpected(id) {
        const result = await pool.query(
            "SELECT COALESCE(SUM(total_amount), 0)::numeric AS total_expected FROM invoices WHERE cash_session_id = $1 AND payment_method = 'cash'",
            [id]
        );
        return result.rows[0]?.total_expected || 0;
    }

    static async close(id, closing_balance, total_expected = null) {
        const expected = total_expected !== null ? total_expected : await this.computeTotalExpected(id);
        const result = await pool.query(
            `UPDATE cash_sessions
             SET status = 'Closed',
                 closing_balance = $1,
                 total_expected = $2,
                 closed_at = NOW()
             WHERE id = $3
             RETURNING *`,
            [closing_balance, expected, id]
        );
        return result.rows[0];
    }
}

module.exports = CashSession;