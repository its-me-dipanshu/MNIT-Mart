
const express = require("express");

const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const router = express.Router();

// Public routes - Anyone can view products
router.get("/", getProducts);
router.get("/:id", getProduct);

// Admin-only routes - Authentication + Authorization required
router.post("/", authenticate, authorize("admin"), createProduct);
router.put("/:id", authenticate, authorize("admin"), updateProduct);
router.delete("/:id", authenticate, authorize("admin"), deleteProduct);

module.exports = router;
