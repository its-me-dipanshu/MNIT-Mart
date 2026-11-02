
const productModel = require("../models/productModel");

// Validate product input
function validateProduct(data) {
    const { name, description, price, image, category, stock } = data;

    if (
        typeof name !== "string" || !name.trim() ||
        typeof description !== "string" || !description.trim() ||
        typeof image !== "string" || !image.trim() ||
        typeof category !== "string" || !category.trim() ||
        price === undefined || price === "" ||
        !Number.isFinite(Number(price)) ||
        Number(price) < 0 ||
        !Number.isInteger(Number(stock)) ||
        Number(stock) < 0
    ) {
        return false;
    }

    return (
        name.trim().length <= 120 &&
        image.trim().length <= 255 &&
        category.trim().length <= 80
    );
}

// Get all products
async function getProducts(req, res, next) {
    try {
        const search = typeof req.query.search === "string"
            ? req.query.search.trim()
            : "";

        const category = typeof req.query.category === "string"
            ? req.query.category.trim()
            : "";

        const products = await productModel.getAllProducts({
            search,
            category
        });

        return res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        next(error);
    }
}

// Get product by ID
async function getProduct(req, res, next) {
    try {
        const idText = req.params.id;

        if (!/^[1-9]\d*$/.test(idText)) {
            return res.status(400).json({
                success: false,
                message: "Product ID must be a positive integer."
            });
        }

        const product = await productModel.getProductById(Number(idText));

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        return res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
}

// Create product (Admin only)
async function createProduct(req, res, next) {
    try {
        if (!validateProduct(req.body)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product data."
            });
        }

        const product = await productModel.createProduct({
            name: req.body.name.trim(),
            description: req.body.description.trim(),
            price: Number(req.body.price),
            image: req.body.image.trim(),
            category: req.body.category.trim(),
            stock: Number(req.body.stock)
        });

        return res.status(201).json({
            success: true,
            message: "Product created successfully.",
            data: product
        });
    } catch (error) {
        next(error);
    }
}

// Update product (Admin only)
async function updateProduct(req, res, next) {
    try {
        const idText = req.params.id;

        if (!/^[1-9]\d*$/.test(idText)) {
            return res.status(400).json({
                success: false,
                message: "Product ID must be a positive integer."
            });
        }

        if (!validateProduct(req.body)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product data."
            });
        }

        const product = await productModel.updateProduct(
            Number(idText),
            {
                name: req.body.name.trim(),
                description: req.body.description.trim(),
                price: Number(req.body.price),
                image: req.body.image.trim(),
                category: req.body.category.trim(),
                stock: Number(req.body.stock)
            }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product updated successfully.",
            data: product
        });
    } catch (error) {
        next(error);
    }
}

// Delete product (Admin only)
async function deleteProduct(req, res, next) {
    try {
        const idText = req.params.id;

        if (!/^[1-9]\d*$/.test(idText)) {
            return res.status(400).json({
                success: false,
                message: "Product ID must be a positive integer."
            });
        }

        const deleted = await productModel.deleteProduct(Number(idText));

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully."
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
};
