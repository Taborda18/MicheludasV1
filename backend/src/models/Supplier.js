const { pool } = require('../config/database');

class Supplier {
    static async findAll() {
        const result = await pool.query('SELECT * FROM suppliers ORDER BY name');
        return result.rows;
    }

    static async findById(id) {
        const result = await pool.query('SELECT * FROM suppliers WHERE id = $1', [id]);
        return result.rows[0];
    }

    static async create(supplierData) {
        const { name, phone, address } = supplierData;
        const result = await pool.query(
            'INSERT INTO suppliers (name, phone, address) VALUES ($1, $2, $3) RETURNING *',
            [name, phone, address]
        );
        return result.rows[0];
    }

    static async update(id, supplierData) {
        const { name, phone, address } = supplierData;
        const result = await pool.query(
            'UPDATE suppliers SET name = $1, phone = $2, address = $3 WHERE id = $4 RETURNING *',
            [name, phone, address, id]
        );
        return result.rows[0];
    }

    static async delete(id) {
        await pool.query('DELETE FROM suppliers WHERE id = $1', [id]);
        return { message: 'Supplier deleted successfully' };
    }
}

module.exports = Supplier;
