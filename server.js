
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const helmet = require("helmet");

const pool = require("./config/db");
const logger = require("./config/logger");

const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");

const {
    notFound,
    errorHandler
} = require("./middleware/errorHandler");

const app = express();
const PORT = Number(process.env.PORT || 3000);

const frontendPath = path.resolve(__dirname, "../frontend");

if (!fs.existsSync(frontendPath)) {
    throw new Error(`Frontend directory not found: ${frontendPath}`);
}

console.log("Frontend directory:", frontendPath);
console.log("CSS file exists:", fs.existsSync(path.join(frontendPath, "style.css")));

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10kb" }));

app.use(express.static(frontendPath));

app.use("/api", (req, res, next) => {
    logger.info("API request received", {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip
    });

    next();
});

app.get("/api/health", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "MNIT Mart API is running."
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.get("/test-static", (req, res) => {
    res.send("Static file test route is working.");
});

app.use(notFound);
app.use(errorHandler);

async function startServer() {
    try {
        const connection = await pool.getConnection();

        await connection.ping();
        connection.release();

        app.listen(PORT, () => {
            logger.info(`MNIT Mart server started on port ${PORT}`);

            console.log(
                `MNIT Mart application running at http://localhost:${PORT}`
            );
        });

    } catch (error) {
        logger.error("MySQL connection failed", {
            message: error.message
        });

        console.error(
            "MySQL connection failed. Check backend/.env and ensure MySQL is running."
        );

        process.exit(1);
    }
}

startServer();
