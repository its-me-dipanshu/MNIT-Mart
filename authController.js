
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userModel = require("../models/userModel");

// Generate JWT token
function generateToken(user) {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "1d"
        }
    );
}

// User Registration
async function register(req, res, next) {
    try {
        const { name, email, password } = req.body;

        // Validate required fields
        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required."
            });
        }

        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();

        if (!cleanName || cleanName.length > 100) {
            return res.status(400).json({
                success: false,
                message: "Name must contain 1 to 100 characters."
            });
        }

        if (
            cleanEmail.length > 150 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address."
            });
        }

        if (password.length < 8 || password.length > 72) {
            return res.status(400).json({
                success: false,
                message: "Password must contain 8 to 72 characters."
            });
        }

        // Check whether email already exists
        const existingUser = await userModel.findUserByEmail(cleanEmail);

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists."
            });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 12);

        // Create user (default role is customer)
        const user = await userModel.createUser({
            name: cleanName,
            email: cleanEmail,
            passwordHash
        });

        // Generate token
        const token = generateToken(user);

        return res.status(201).json({
            success: true,
            message: "User registered successfully.",
            token,
            data: user
        });

    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists."
            });
        }

        next(error);
    }
}

// User Login
async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        const cleanEmail = email.trim().toLowerCase();

        if (cleanEmail.length > 150 || password.length > 72) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Find user
        const user = await userModel.findUserByEmail(cleanEmail);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Compare password with stored hash
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Generate JWT token
        const token = generateToken(user);

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        next(error);
    }
}

// Get logged-in user's profile
async function getProfile(req, res, next) {
    try {
        const user = await userModel.findUserById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        return res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {
        next(error);
    }
}

module.exports = {
    register,
    login,
    getProfile
};
