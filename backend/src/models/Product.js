const { pool } = require('../config/database');

class Product {
    static async findAll() {
        const result = await pool.query('SELECT * FROM products ORDER BY name');
        return result.rows;
    }

    static async findActive() {
        const result = await pool.query('SELECT * FROM products WHERE is_active = true ORDER BY name');
        return result.rows;
    }

    static async findById(id) {
        const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
        return result.rows[0];
    }

    static async create(productData) {
        const { name, sale_price, is_active = true } = productData;
        const result = await pool.query(
            'INSERT INTO products (name, sale_price, is_active) VALUES ($1, $2, $3) RETURNING *',
            [name, sale_price, is_active]
        );
        return result.rows[0];
    }

    static async update(id, productData) {
        const { name, sale_price, is_active } = productData;
        const result = await pool.query(
            'UPDATE products SET name = $1, sale_price = $2, is_active = $3 WHERE id = $4 RETURNING *',
            [name, sale_price, is_active, id]
        );
        return result.rows[0];
    }

    static async delete(id) {
        await pool.query('DELETE FROM products WHERE id = $1', [id]);
        return { message: 'Product deleted successfully' };
    }

    static async toggleActive(id) {
        const result = await pool.query(
            'UPDATE products SET is_active = NOT is_active WHERE id = $1 RETURNING *',
            [id]
        );
        return result.rows[0];
    }
}

module.exports = Product;
