const { pool } = require('../config/database');

class ProductIngredient {
    // Obtener todos los ingredientes de productos
    static async findAll() {
        const result = await pool.query(
            `SELECT pi.*, 
                    p.name as product_name, 
                    i.name as inventory_name,
                    i.stock as inventory_stock,
                    i.categories as inventory_category
             FROM product_ingredients pi
             LEFT JOIN products p ON pi.product_id = p.id
             LEFT JOIN inventory i ON pi.inventory_id = i.id
             ORDER BY pi.product_id, pi.id`
        );
        return result.rows;
    }

    // Obtener ingredientes por producto
    static async findByProductId(productId) {
        const result = await pool.query(
            `SELECT pi.*, 
                    i.name as inventory_name,
                    i.stock as inventory_stock,
                    i.categories as inventory_category,
                    i.price as inventory_price
             FROM product_ingredients pi
             LEFT JOIN inventory i ON pi.inventory_id = i.id
             WHERE pi.product_id = $1
             ORDER BY pi.id`,
            [productId]
        );
        return result.rows;
    }

    // Obtener ingrediente por ID
    static async findById(id) {
        const result = await pool.query(
            `SELECT pi.*, 
                    p.name as product_name, 
                    i.name as inventory_name,
                    i.stock as inventory_stock
             FROM product_ingredients pi
             LEFT JOIN products p ON pi.product_id = p.id
             LEFT JOIN inventory i ON pi.inventory_id = i.id
             WHERE pi.id = $1`,
            [id]
        );
        return result.rows[0];
    }

    // Crear ingrediente
    static async create(ingredientData) {
        const { product_id, inventory_id, quantity_required, unit_measure } = ingredientData;
        const result = await pool.query(
            `INSERT INTO product_ingredients (product_id, inventory_id, quantity_required, unit_measure) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [product_id, inventory_id, quantity_required, unit_measure]
        );
        return result.rows[0];
    }

    // Actualizar ingrediente
    static async update(id, ingredientData) {
        const { inventory_id, quantity_required, unit_measure } = ingredientData;
        const result = await pool.query(
            `UPDATE product_ingredients 
             SET inventory_id = $1, quantity_required = $2, unit_measure = $3 
             WHERE id = $4 RETURNING *`,
            [inventory_id, quantity_required, unit_measure, id]
        );
        return result.rows[0];
    }

    // Eliminar ingrediente
    static async delete(id) {
        await pool.query('DELETE FROM product_ingredients WHERE id = $1', [id]);
        return { message: 'Ingredient deleted successfully' };
    }

    // Eliminar todos los ingredientes de un producto
    static async deleteByProductId(productId) {
        await pool.query('DELETE FROM product_ingredients WHERE product_id = $1', [productId]);
        return { message: 'All ingredients deleted successfully' };
    }

    // Descontar ingredientes del inventario cuando se vende un producto
    static async deductFromInventory(productId, quantity = 1) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Obtener los ingredientes del producto
            const ingredientsResult = await client.query(
                `SELECT pi.*, i.stock, i.name as inventory_name
                 FROM product_ingredients pi
                 JOIN inventory i ON pi.inventory_id = i.id
                 WHERE pi.product_id = $1`,
                [productId]
            );

            const ingredients = ingredientsResult.rows;
            const deductedItems = [];

            for (const ingredient of ingredients) {
                const amountToDeduct = ingredient.quantity_required * quantity;
                
                // Verificar si hay suficiente stock
                if (ingredient.stock < amountToDeduct) {
                    await client.query('ROLLBACK');
                    return {
                        success: false,
                        message: `Stock insuficiente de ${ingredient.inventory_name}. Disponible: ${ingredient.stock}, Requerido: ${amountToDeduct}`
                    };
                }

                // Descontar del inventario
                await client.query(
                    `UPDATE inventory SET stock = stock - $1, update_date = NOW() WHERE id = $2`,
                    [amountToDeduct, ingredient.inventory_id]
                );

                deductedItems.push({
                    inventory_id: ingredient.inventory_id,
                    inventory_name: ingredient.inventory_name,
                    deducted: amountToDeduct,
                    unit_measure: ingredient.unit_measure
                });
            }

            await client.query('COMMIT');
            return {
                success: true,
                message: 'Stock descontado correctamente',
                deductedItems
            };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    // Verificar si hay stock suficiente para un producto
    static async checkStock(productId, quantity = 1) {
        const result = await pool.query(
            `SELECT pi.*, i.stock, i.name as inventory_name
             FROM product_ingredients pi
             JOIN inventory i ON pi.inventory_id = i.id
             WHERE pi.product_id = $1`,
            [productId]
        );

        const ingredients = result.rows;
        const insufficientStock = [];

        for (const ingredient of ingredients) {
            const amountRequired = ingredient.quantity_required * quantity;
            if (ingredient.stock < amountRequired) {
                insufficientStock.push({
                    inventory_name: ingredient.inventory_name,
                    available: ingredient.stock,
                    required: amountRequired,
                    unit_measure: ingredient.unit_measure
                });
            }
        }

        return {
            hasStock: insufficientStock.length === 0,
            insufficientStock
        };
    }
}

module.exports = ProductIngredient;
