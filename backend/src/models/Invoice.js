const { pool } = require('../config/database');
const Ticket = require('./Ticket');
const Inventory = require('./Inventory');

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
        const { session_id, cashier_id, total_amount, payment_method, cash_session_id = null } = invoiceData;
        const result = await pool.query(
            'INSERT INTO invoices (session_id, cashier_id, total_amount, payment_method, cash_session_id, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *',
            [session_id, cashier_id, total_amount, payment_method, cash_session_id]
        );
        return result.rows[0];
    }

    static async delete(id) {
        await pool.query('DELETE FROM invoices WHERE id = $1', [id]);
        return { message: 'Invoice deleted successfully' };
    }

    // Descontar inventario para todos los tickets aprobados de una sesión
    static async deductInventoryForSession(client, session_id) {
        try {
            // Obtener todos los detalles de tickets aprobados en la sesión
            const detailsQuery = `
                SELECT td.product_id, td.quantity
                FROM tickets t
                INNER JOIN ticket_details td ON t.id = td.ticket_id
                WHERE t.session_id = $1 AND t.status = 'Approved'
            `;

            const { rows: details } = await client.query(detailsQuery, [session_id]);

            // Descontar cada producto del inventario usando el id de inventory (coincide con product_id)
            for (const detail of details) {
                if (detail.product_id && detail.quantity > 0) {
                    await client.query(
                        'UPDATE inventory SET stock = stock - $1, update_date = NOW() WHERE id = $2',
                        [detail.quantity, detail.product_id]
                    );
                }
            }

            return { success: true, message: 'Inventory deducted successfully' };
        } catch (error) {
            throw new Error(`Error deducting inventory: ${error.message}`);
        }
    }

    static async createAndCloseSession(invoiceData) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const { session_id, cashier_id, total_amount, payment_method, cash_session_id = null } = invoiceData;

            // Paso 1: Crear factura (el inventario ya se descuenta al aprobar)
            const invoiceInsert = await client.query(
                'INSERT INTO invoices (session_id, cashier_id, total_amount, payment_method, cash_session_id, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) ON CONFLICT (session_id) DO NOTHING RETURNING *',
                [session_id, cashier_id, total_amount, payment_method, cash_session_id]
            );

            // Si ya existe, recuperar para retornar al final
            let existingInvoice = null;
            if (invoiceInsert.rowCount === 0) {
                const existing = await client.query('SELECT * FROM invoices WHERE session_id = $1', [session_id]);
                existingInvoice = existing.rows[0];
            }

            // Paso 2: Cerrar sesión y limpiar tag
            await client.query(
                "UPDATE order_sessions SET status = 'Closed', tag = NULL WHERE id = $1",
                [session_id]
            );

            await client.query('COMMIT');
            return invoiceInsert.rows[0] || existingInvoice;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
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

    static async getSalesByPeriod({ period = 'daily', startDate, endDate, businessDayStartHour = 14 } = {}) {
        const periodMap = {
            daily: `DATE_TRUNC('day', created_at - INTERVAL '${businessDayStartHour} hours')`,
            weekly: "DATE_TRUNC('week', created_at)",
            monthly: "DATE_TRUNC('month', created_at)"
        };

        const periodExpression = periodMap[period] || periodMap.daily;
        const filters = [];
        const params = [];

        if (startDate) {
            params.push(startDate);
            filters.push(`created_at::date >= $${params.length}`);
        }
        if (endDate) {
            params.push(endDate);
            filters.push(`created_at::date <= $${params.length}`);
        }

        const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

        const query = `
            SELECT ${periodExpression} AS period,
                   COUNT(*)::integer AS invoice_count,
                   SUM(total_amount)::numeric(12,2) AS total_sales
            FROM invoices
            ${whereClause}
            GROUP BY period
            ORDER BY period DESC
        `;

        const result = await pool.query(query, params);
        return result.rows;
    }
}

module.exports = Invoice;
