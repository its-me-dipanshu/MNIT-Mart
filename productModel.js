
const pool = require("../config/db");

// Get all products with optional search and category filter
async function getAllProducts({ search, category } = {}) {
    let sql = `
        SELECT id, name, description, price, image, category, stock
        FROM products
    `;

    const conditions = [];
    const values = [];

    if (search) {
        conditions.push("(name LIKE ? OR description LIKE ?)");
        values.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
        conditions.push("category = ?");
        values.push(category);
    }

    if (conditions.length) {
        sql += " WHERE " + conditions.join(" AND ");
    }

    sql += " ORDER BY id";

    const [rows] = await pool.execute(sql, values);
    return rows;
}

// Get product by ID
async function getProductById(id) {
    const [rows] = await pool.execute(
        `SELECT id, name, description, price, image, category, stock
         FROM products
         WHERE id = ?`,
        [id]
    );

    return rows[0] || null;
}

// Create a new product
async function createProduct(product) {
    const { name, description, price, image, category, stock } = product;

    const [result] = await pool.execute(
        `INSERT INTO products
         (name, description, price, image, category, stock)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [name, description, price, image, category, stock]
    );

    return getProductById(result.insertId);
}

// Update an existing product
async function updateProduct(id, product) {
    const { name, description, price, image, category, stock } = product;

    const [result] = await pool.execute(
        `UPDATE products
         SET name = ?, description = ?, price = ?,
             image = ?, category = ?, stock = ?
         WHERE id = ?`,
        [name, description, price, image, category, stock, id]
    );

    if (result.affectedRows === 0) {
        return null;
    }

    return getProductById(id);
}

// Delete a product
async function deleteProduct(id) {
    const [result] = await pool.execute(
        "DELETE FROM products WHERE id = ?",
        [id]
    );

    return result.affectedRows > 0;
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
