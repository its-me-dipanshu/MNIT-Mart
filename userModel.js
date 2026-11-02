
const pool = require("../config/db");

// Find user using email
async function findUserByEmail(email) {
    const [rows] = await pool.execute(
        `SELECT id, name, email, password, role
         FROM users
         WHERE email = ?`,
        [email]
    );

    return rows[0] || null;
}

// Find user using ID
async function findUserById(id) {
    const [rows] = await pool.execute(
        `SELECT id, name, email, role, created_at
         FROM users
         WHERE id = ?`,
        [id]
    );

    return rows[0] || null;
}

// Create a new user
async function createUser({ name, email, passwordHash }) {
    const [result] = await pool.execute(
        `INSERT INTO users (name, email, password)
         VALUES (?, ?, ?)`,
        [name, email, passwordHash]
    );

    return findUserById(result.insertId);
}

// Export user model functions
module.exports = {
    findUserByEmail,
    findUserById,
    createUser
};
