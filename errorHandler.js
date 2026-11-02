
const logger = require("../config/logger");

// Handle unknown routes
function notFound(req, res) {
    logger.warn(`Route not found: ${req.method} ${req.originalUrl}`);

    return res.status(404).json({
        success: false,
        message: "API endpoint not found."
    });
}

// Global error handler
function errorHandler(error, req, res, next) {
    logger.error("Application error", {
        method: req.method,
        url: req.originalUrl,
        message: error.message,
        stack: error.stack
    });

    return res.status(500).json({
        success: false,
        message: "Internal server error."
    });
}

module.exports = {
    notFound,
    errorHandler
};
