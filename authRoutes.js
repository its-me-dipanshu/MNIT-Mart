
const express = require("express");

const {
    register,
    login,
    getProfile
} = require("../controllers/authController");

const authenticate = require("../middleware/authenticate");
const authLimiter = require("../middleware/rateLimiter");

const router = express.Router();

// User Registration (Rate Limited)
router.post("/register", authLimiter, register);

// User Login (Rate Limited)
router.post("/login", authLimiter, login);

// Get logged-in user's profile
router.get("/me", authenticate, getProfile);

module.exports = router;
