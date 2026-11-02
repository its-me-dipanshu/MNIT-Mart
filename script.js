
// ==========================================
// MNIT MART - MAIN FRONTEND SCRIPT
// ==========================================

// API URLs
const API_URL = "/api/products";
const AUTH_API_URL = "/api/auth";

// Local Storage Keys
const CART_KEY = "mnitMartCart";
const TOKEN_KEY = "mnitMartToken";
const USER_KEY = "mnitMartUser";

// Products
let products = [];

// Shopping Cart
let cart = [];

try {
    cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

    if (!Array.isArray(cart)) {
        cart = [];
    }
} catch (error) {
    cart = [];
}


// ==========================================
// AUTHENTICATION / TOKEN MANAGEMENT
// ==========================================

// Get saved JWT token
function getAuthToken() {
    return localStorage.getItem(TOKEN_KEY);
}

// Get saved user information
function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem(USER_KEY));
    } catch (error) {
        return null;
    }
}

// Save authentication information after login/register
function saveAuthData(token, user) {
    if (!token || !user) {
        throw new Error("Invalid authentication response.");
    }

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// Clear authentication information
function clearAuthData() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

// Common API request function
async function apiRequest(url, options = {}) {

    const headers = {
        ...options.headers
    };

    const token = getAuthToken();

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    if (options.body && !headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
    }

    const response = await fetch(url, {
        ...options,
        headers
    });

    return response;
}

// Update navbar according to login status
function updateAuthNavigation() {

    const authNav = document.getElementById("authNav");
    const userNav = document.getElementById("userNav");
    const userGreeting = document.getElementById("userGreeting");
    const logoutBtn = document.getElementById("logoutBtn");

    if (!authNav || !userNav) {
        return;
    }

    const user = getCurrentUser();
    const token = getAuthToken();

    if (token && user) {

        authNav.hidden = true;
        userNav.hidden = false;

        if (userGreeting) {
            userGreeting.textContent = `Hi, ${user.name}`;
        }

    } else {

        authNav.hidden = false;
        userNav.hidden = true;
    }

    if (logoutBtn && !logoutBtn.dataset.listenerAdded) {

        logoutBtn.addEventListener("click", logout);

        logoutBtn.dataset.listenerAdded = "true";
    }
}

// Logout
function logout() {

    clearAuthData();

    updateAuthNavigation();

    alert("You have been logged out successfully.");

    window.location.href = "index.html";
}


// ==========================================
// HOME PAGE ELEMENTS
// ==========================================

const productContainer = document.getElementById("productContainer");

const searchInput = document.getElementById("searchInput");

const categoryFilter = document.getElementById("categoryFilter");

const categoryButtons = document.querySelectorAll(".category-card");

const emptyMessage = document.getElementById("emptyMessage");


// ==========================================
// PRICE FORMATTING
// ==========================================

function formatPrice(price) {

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR"
    }).format(Number(price));
}


// ==========================================
// FETCH PRODUCTS FROM BACKEND
// ==========================================

async function fetchProducts(search = "", category = "") {

    try {

        const params = new URLSearchParams();

        if (search) {
            params.append("search", search);
        }

        if (category) {
            params.append("category", category);
        }

        const queryString = params.toString();

        const url = queryString
            ? `${API_URL}?${queryString}`
            : API_URL;

        const response = await apiRequest(url);

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Unable to fetch products.");
        }

        products = result.data;

        return products;

    } catch (error) {

        console.error("Product API Error:", error);

        throw error;
    }
}


// ==========================================
// SHOPPING CART MANAGEMENT
// ==========================================

// Save cart in localStorage
function saveCart() {

    localStorage.setItem(CART_KEY, JSON.stringify(cart));

    updateCartCount();
}

// Update cart count in navbar
function updateCartCount() {

    const cartCount = document.getElementById("cartCount");

    if (cartCount) {

        const totalItems = cart.reduce(
            (total, item) => total + item.quantity,
            0
        );

        cartCount.textContent = totalItems;
    }
}


// ==========================================
// DISPLAY PRODUCTS
// ==========================================

function displayProducts(productList) {

    if (!productContainer) return;

    productContainer.innerHTML = "";

    if (productList.length === 0) {

        if (emptyMessage) {
            emptyMessage.hidden = false;
        }

        return;
    }

    if (emptyMessage) {
        emptyMessage.hidden = true;
    }

    productList.forEach(product => {

        const card = document.createElement("div");

        card.className = "product-card";

        const image = document.createElement("img");

        image.src = product.image;

        image.alt = product.name;

        image.loading = "lazy";

        image.addEventListener("error", () => {

            image.alt = "Product image unavailable";

            image.classList.add("image-error");
        });

        const content = document.createElement("div");

        content.className = "product-card-content";

        const name = document.createElement("h3");

        name.textContent = product.name;

        const description = document.createElement("p");

        description.textContent = product.description;

        const price = document.createElement("span");

        price.className = "product-price";

        price.textContent = formatPrice(product.price);

        const button = document.createElement("a");

        button.className = "primary-btn";

        button.href = `product.html?id=${product.id}`;

        button.textContent = "View Details";

        content.appendChild(name);

        content.appendChild(description);

        content.appendChild(price);

        content.appendChild(button);

        card.appendChild(image);

        card.appendChild(content);

        productContainer.appendChild(card);
    });
}


// ==========================================
// SEARCH AND CATEGORY FILTERING
// ==========================================

async function filterProducts() {

    if (!searchInput || !categoryFilter) return;

    const searchValue = searchInput.value.trim();

    const selectedCategory = categoryFilter.value;

    try {

        const filteredProducts = await fetchProducts(
            searchValue,
            selectedCategory
        );

        displayProducts(filteredProducts);

    } catch (error) {

        productContainer.innerHTML =
            "<p>Unable to load products. Please try again.</p>";
    }
}

// Update active category button
function updateActiveCategory(category) {

    categoryButtons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.category === category
        );
    });
}

// Search input event
if (searchInput) {

    searchInput.addEventListener("input", filterProducts);
}

// Category dropdown event
if (categoryFilter) {

    categoryFilter.addEventListener("change", () => {

        updateActiveCategory(categoryFilter.value);

        filterProducts();
    });
}

// Category card events
categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        const category = button.dataset.category;

        if (categoryFilter) {
            categoryFilter.value = category;
        }

        updateActiveCategory(category);

        filterProducts();
    });
});


// ==========================================
// PRODUCT DETAILS PAGE
// ==========================================

async function fetchProductDetails() {

    const productDetails = document.getElementById("productDetails");

    if (!productDetails) return;

    const params = new URLSearchParams(window.location.search);

    const productId = params.get("id");

    if (!productId || !/^[1-9]\d*$/.test(productId)) {

        showProductError();

        return;
    }

    try {

        const response = await apiRequest(`${API_URL}/${productId}`);

        const result = await response.json();

        if (!response.ok || !result.success) {

            showProductError();

            return;
        }

        const product = result.data;

        products = [product];

        const productImage = document.getElementById("productImage");

        productImage.src = product.image;

        productImage.alt = product.name;

        document.getElementById("productCategory").textContent =
            product.category;

        document.getElementById("productName").textContent =
            product.name;

        document.getElementById("productDescription").textContent =
            product.description;

        document.getElementById("productPrice").textContent =
            formatPrice(product.price);

        document.getElementById("productId").textContent =
            product.id;

        document.getElementById("detailCategory").textContent =
            product.category;

        document.getElementById("productStock").textContent =
            product.stock;

        document.getElementById("productAvailability").textContent =
            product.stock > 0
                ? "Available in Stock"
                : "Currently Out of Stock";

        document.title = `${product.name} | MNIT Mart`;

        productDetails.hidden = false;

        const productError = document.getElementById("productError");

        if (productError) {
            productError.hidden = true;
        }

        const addButton = document.getElementById("addToCartButton");

        if (addButton) {

            addButton.disabled = Number(product.stock) <= 0;

            addButton.addEventListener("click", () => {
                addToCart(product.id);
            });
        }

    } catch (error) {

        console.error("Product Details API Error:", error);

        showProductError();
    }
}

// Show product not found message
function showProductError() {

    const productDetails = document.getElementById("productDetails");

    const productError = document.getElementById("productError");

    if (productDetails) {
        productDetails.hidden = true;
    }

    if (productError) {
        productError.hidden = false;
    }
}


// ==========================================
// ADD PRODUCT TO CART
// ==========================================

function addToCart(productId) {

    const product = products.find(
        item => Number(item.id) === Number(productId)
    );

    if (!product) return;

    const existingItem = cart.find(
        item => Number(item.id) === Number(productId)
    );

    if (existingItem) {

        if (existingItem.quantity >= Number(product.stock)) {

            alert("Maximum available stock reached.");

            return;
        }

        existingItem.quantity++;

    } else {

        cart.push({
            id: Number(product.id),
            quantity: 1
        });
    }

    saveCart();

    renderCart();

    const cartMessage = document.getElementById("cartMessage");

    if (cartMessage) {

        cartMessage.textContent = "Product added to cart successfully.";

        cartMessage.hidden = false;
    }
}


// ==========================================
// DISPLAY SHOPPING CART
// ==========================================

function renderCart() {

    const cartItems = document.getElementById("cartItems");

    if (!cartItems) return;

    cartItems.innerHTML = "";

    const cartEmptyMessage =
        document.getElementById("cartEmptyMessage");

    const validCart = cart.filter(item =>
        products.some(
            product => Number(product.id) === Number(item.id)
        )
    );

    if (validCart.length !== cart.length) {

        cart = validCart;

        saveCart();
    }

    if (cartEmptyMessage) {

        cartEmptyMessage.hidden = cart.length !== 0;
    }

    let subtotal = 0;

    let totalQuantity = 0;

    cart.forEach(item => {

        const product = products.find(
            product => Number(product.id) === Number(item.id)
        );

        if (!product) return;

        const itemTotal = Number(product.price) * item.quantity;

        subtotal += itemTotal;

        totalQuantity += item.quantity;

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        const image = document.createElement("img");

        image.src = product.image;

        image.alt = product.name;

        const details = document.createElement("div");

        const name = document.createElement("h3");

        name.textContent = product.name;

        const price = document.createElement("p");

        price.textContent = formatPrice(product.price);

        const actions = document.createElement("div");

        actions.className = "cart-item-actions";

        const decreaseButton = document.createElement("button");

        decreaseButton.className = "quantity-btn";

        decreaseButton.textContent = "-";

        decreaseButton.setAttribute("aria-label", "Decrease quantity");

        decreaseButton.addEventListener("click", () => {
            updateQuantity(product.id, -1);
        });

        const quantity = document.createElement("span");

        quantity.className = "quantity-value";

        quantity.textContent = item.quantity;

        const increaseButton = document.createElement("button");

        increaseButton.className = "quantity-btn";

        increaseButton.textContent = "+";

        increaseButton.setAttribute("aria-label", "Increase quantity");

        increaseButton.disabled =
            item.quantity >= Number(product.stock);

        increaseButton.addEventListener("click", () => {
            updateQuantity(product.id, 1);
        });

        const removeButton = document.createElement("button");

        removeButton.className = "remove-btn";

        removeButton.textContent = "Remove";

        removeButton.addEventListener("click", () => {
            removeFromCart(product.id);
        });

        actions.appendChild(decreaseButton);

        actions.appendChild(quantity);

        actions.appendChild(increaseButton);

        actions.appendChild(removeButton);

        details.appendChild(name);

        details.appendChild(price);

        details.appendChild(actions);

        const itemTotalElement = document.createElement("div");

        itemTotalElement.className = "cart-item-price";

        itemTotalElement.textContent = formatPrice(itemTotal);

        cartItem.appendChild(image);

        cartItem.appendChild(details);

        cartItem.appendChild(itemTotalElement);

        cartItems.appendChild(cartItem);
    });

    const cartItemCount = document.getElementById("cartItemCount");

    const cartSubtotal = document.getElementById("cartSubtotal");

    const cartTotal = document.getElementById("cartTotal");

    if (cartItemCount) {
        cartItemCount.textContent = `${totalQuantity} Items`;
    }

    if (cartSubtotal) {
        cartSubtotal.textContent = formatPrice(subtotal);
    }

    if (cartTotal) {
        cartTotal.textContent = formatPrice(subtotal);
    }

    updateCartCount();
}


// ==========================================
// UPDATE CART QUANTITY
// ==========================================

function updateQuantity(productId, change) {

    const item = cart.find(
        item => Number(item.id) === Number(productId)
    );

    const product = products.find(
        product => Number(product.id) === Number(productId)
    );

    if (!item || !product) return;

    const newQuantity = item.quantity + change;

    if (newQuantity <= 0) {

        removeFromCart(productId);

        return;
    }

    if (newQuantity > Number(product.stock)) {

        alert("Maximum available stock reached.");

        return;
    }

    item.quantity = newQuantity;

    saveCart();

    renderCart();
}


// ==========================================
// REMOVE PRODUCT FROM CART
// ==========================================

function removeFromCart(productId) {

    cart = cart.filter(
        item => Number(item.id) !== Number(productId)
    );

    saveCart();

    renderCart();
}


// ==========================================
// CHECKOUT DEMONSTRATION
// ==========================================

function checkout() {

    if (cart.length === 0) {

        alert("Your cart is empty.");

        return;
    }

    alert("Checkout feature will be available in a future update.");
}

const checkoutButton = document.getElementById("checkoutButton");

if (checkoutButton) {

    checkoutButton.addEventListener("click", checkout);
}


// ==========================================
// LOAD PRODUCTS ON HOME PAGE
// ==========================================

async function loadHomeProducts() {

    if (!productContainer) return;

    try {

        const productList = await fetchProducts();

        displayProducts(productList);

    } catch (error) {

        productContainer.innerHTML =
            "<p>Unable to connect to the server. Please check whether the backend is running.</p>";
    }
}


// ==========================================
// LOAD PRODUCTS ON CART PAGE
// ==========================================

async function loadCartProducts() {

    if (!document.getElementById("cartItems")) return;

    try {

        await fetchProducts();

        renderCart();

    } catch (error) {

        const cartItems = document.getElementById("cartItems");

        cartItems.innerHTML =
            "<p>Unable to load cart products. Please check the server connection.</p>";
    }
}


// ==========================================
// INITIALIZE APPLICATION
// ==========================================

// Update authentication navbar
updateAuthNavigation();

// Load products on home page
if (productContainer) {
    loadHomeProducts();
}

// Load individual product details
if (document.getElementById("productDetails")) {
    fetchProductDetails();
}

// Load cart page
if (document.getElementById("cartItems")) {
    loadCartProducts();
}

// Update cart count
updateCartCount();
