const { pool } = require('../config/database');

class Inventory {
    static async findAll() {
        const result = await pool.query(
            `SELECT i.*, s.name as supplier_name 
             FROM inventory i 
             LEFT JOIN suppliers s ON i.suppliers_id = s.id 
             ORDER BY i.name`
        );
        return result.rows;
    }

    static async findById(id) {
        const result = await pool.query(
            `SELECT i.*, s.name as supplier_name 
             FROM inventory i 
             LEFT JOIN suppliers s ON i.suppliers_id = s.id 
             WHERE i.id = $1`,
            [id]
        );
        return result.rows[0];
    }

    static async findLowStock(threshold = 10) {
        const result = await pool.query(
            'SELECT * FROM inventory WHERE stock <= $1 ORDER BY stock ASC',
            [threshold]
        );
        return result.rows;
    }

    static async create(inventoryData) {
        const { name, categories, price, stock, suppliers_id } = inventoryData;
        const result = await pool.query(
            'INSERT INTO inventory (name, categories, price, stock, suppliers_id, create_date, update_date) VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *',
            [name, categories, price, stock, suppliers_id]
        );
        return result.rows[0];
    }

    static async update(id, inventoryData) {
        const { name, categories, price, stock, suppliers_id } = inventoryData;
        const result = await pool.query(
            'UPDATE inventory SET name = $1, categories = $2, price = $3, stock = $4, suppliers_id = $5, update_date = NOW() WHERE id = $6 RETURNING *',
            [name, categories, price, stock, suppliers_id, id]
        );
        return result.rows[0];
    }

    static async updateStock(id, quantity) {
        const result = await pool.query(
            'UPDATE inventory SET stock = stock + $1, update_date = NOW() WHERE id = $2 RETURNING *',
            [quantity, id]
        );
        return result.rows[0];
    }

    static async delete(id) {
        await pool.query('DELETE FROM inventory WHERE id = $1', [id]);
        return { message: 'Inventory item deleted successfully' };
    }
}

module.exports = Inventory;
