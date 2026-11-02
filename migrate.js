
require("dotenv").config();

const fs = require("fs");
const path = require("path");
const pool = require("../config/db");

const MIGRATIONS_DIR = path.join(__dirname, "../../database/migrations");

async function runMigrations() {
    let connection;

    try {
        connection = await pool.getConnection();

        console.log("Connected to MySQL.");

        // Ensure migration tracking table exists
        await connection.query(`
            CREATE TABLE IF NOT EXISTS schema_migrations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                migration_name VARCHAR(255) NOT NULL UNIQUE,
                applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Read migration files in alphabetical order
        const files = fs.readdirSync(MIGRATIONS_DIR)
            .filter(file => file.endsWith(".sql"))
            .sort();

        for (const file of files) {

            const [existing] = await connection.execute(
                "SELECT id FROM schema_migrations WHERE migration_name = ?",
                [file]
            );

            if (existing.length > 0) {
                console.log(`Already applied: ${file}`);
                continue;
            }

            const filePath = path.join(MIGRATIONS_DIR, file);
            const sql = fs.readFileSync(filePath, "utf8");

            console.log(`Running migration: ${file}`);

            await connection.beginTransaction();

            try {
                await connection.query(sql);

                await connection.execute(
                    "INSERT INTO schema_migrations (migration_name) VALUES (?)",
                    [file]
                );

                await connection.commit();

                console.log(`Successfully applied: ${file}`);

            } catch (error) {
                await connection.rollback();
                throw error;
            }
        }

        console.log("All migrations completed.");

    } catch (error) {
        console.error("Migration failed:", error.message);
        process.exitCode = 1;

    } finally {
        if (connection) {
            connection.release();
        }

        await pool.end();
    }
}

runMigrations();
