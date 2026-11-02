# MNIT Mart – Full-Stack E-Commerce Application

## 1. Introduction

MNIT Mart is a full-stack e-commerce web application developed as part of the Full-Stack E-Commerce Lab Assignment at Malaviya National Institute of Technology, Jaipur.

The application allows users to browse grocery products, view product information, search products, and filter products by category.

The application uses HTML, CSS, and JavaScript for the frontend, Node.js and Express.js for the backend, and MySQL for storing product information.

## 2. Objectives

- Develop a functional product listing website.
- Display product names, descriptions, prices, and images.
- Provide an individual product details page.
- Implement product search and filtering.
- Store product information in a relational database.
- Retrieve product information through backend API endpoints.
- Integrate the frontend, backend, and database into a single application.

## 3. Technologies Used

| Component             | Technology              |
| --------------------- | ----------------------- |
| Frontend              | HTML5, CSS3, JavaScript |
| Backend               | Node.js, Express.js     |
| Database              | MySQL                   |
| Database Connectivity | mysql2                  |
| API Communication     | HTTP, JSON, Fetch API   |
| Development Server    | Nodemon                 |

## 4. Project Structure

```text
commerce/
│
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── logger.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   └── productController.js
│   │
│   ├── middleware/
│   │   ├── authenticate.js
│   │   ├── authorize.js
│   │   ├── errorHandler.js
│   │   └── rateLimiter.js
│   │
│   ├── models/
│   │   ├── productModel.js
│   │   └── userModel.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── productRoutes.js
│   │
│   ├── scripts/
│   │   └── migrate.js
│   │
│   ├── logs/
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── database/
│   ├── migrations/
│   │   ├── 001_create_migrations_table.sql
│   │   └── 002_create_users_table.sql
│   ├── schema.sql
│   └── seed.sql
│
├── frontend/
│   ├── images/
│   ├── index.html
│   ├── product.html
│   ├── cart.html
│   ├── login.html
│   ├── register.html
│   ├── script.js
│   ├── auth.js
│   └── style.css
│
└── README.md
```

## 5. Application Architecture

The application consists of three main layers.

### 5.1 Frontend

The frontend is developed using HTML, CSS, and JavaScript.

It provides:

- Product listing interface.
- Product name, description, price, and image.
- Product details view.
- Product search functionality.
- Category-based filtering.

The frontend communicates with the backend using JavaScript Fetch API.

### 5.2 Backend

The backend is implemented using Node.js and Express.js.

It handles HTTP requests, processes product-related operations, communicates with the database, and returns JSON responses.

The backend is organized into routes, controllers, models, and middleware.

### 5.3 Database

MySQL is used to store product information.

The frontend retrieves product information through backend API endpoints. It does not directly access the database.

### 5.4 Data Flow

```text
       Frontend
           |
           | HTTP Request
           v
      Express Server
           |
           v
         Routes
           |
           v
       Controllers
           |
           v
         Models
           |
           | SQL Queries
           v
       MySQL Database
           |
           | Query Results
           v
         Backend
           |
           | JSON Response
           v
        Frontend
           |
           v
     Display Products
```

## 6. Database Design

**Database Name:** `mnit_mart`

### Products Table

The products table stores the information required to display products.

| Column      | Data Type     | Description          |
| ----------- | ------------- | -------------------- |
| id          | INT           | Primary key          |
| name        | VARCHAR(120)  | Product name         |
| description | TEXT          | Product description  |
| price       | DECIMAL(10,2) | Product price        |
| image       | VARCHAR(255)  | Product image path   |
| category    | VARCHAR(80)   | Product category     |
| stock       | INT           | Available stock      |
| created_at  | TIMESTAMP     | Record creation time |

The table includes constraints to prevent negative product prices and stock quantities.

### Sample Product Data

The database contains the following sample products:

| ID | Product Name  | Category            | Price |
| -- | ------------- | ------------------- | ----: |
| 1  | Fresh Apples  | Fruits & Vegetables | ₹120 |
| 2  | Fresh Bananas | Fruits & Vegetables |  ₹60 |
| 3  | Fresh Milk    | Dairy               |  ₹30 |
| 4  | Fresh Bread   | Snacks              |  ₹40 |

## 7. Backend API Documentation

**Base URL:**

```text
http://localhost:3000
```

### Product Catalogue API

**Endpoint:**

```http
GET /api/products
```

**Description:** Retrieves the complete product catalogue from the MySQL database.

**Example Response:**

```json
{
  "success": true,
  "count": 4,
  "data": [
    {
      "id": 1,
      "name": "Fresh Apples",
      "description": "Fresh and juicy apples for everyday consumption.",
      "price": "120.00",
      "image": "images/apple.jpg",
      "category": "Fruits & Vegetables",
      "stock": 50
    }
  ]
}
```

The actual response contains all four products.

### Individual Product API

**Endpoint:**

```http
GET /api/products/:id
```

**Description:** Retrieves the details of an individual product using its unique ID.

**Example Request:**

```http
GET /api/products/1
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Fresh Apples",
    "description": "Fresh and juicy apples for everyday consumption.",
    "price": "120.00",
    "image": "images/apple.jpg",
    "category": "Fruits & Vegetables",
    "stock": 50
  }
}
```

## 8. Prerequisites

The following software is required:

- Node.js
- npm
- MySQL Server
- Visual Studio Code or another code editor

## 9. Installation and Setup

### Step 1: Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Navigate to the project directory:

```bash
cd commerce
```

### Step 2: Start MySQL Server

Ensure that the MySQL server is running.

Log in to MySQL:

```bash
mysql -u root -p
```

On macOS, if the MySQL command is not available in PATH:

```bash
/usr/local/mysql/bin/mysql -u root -p
```

### Step 3: Create and Initialize the Database

From the project root directory, execute:

```bash
mysql -u root -p < database/schema.sql
```

Insert the sample product data:

```bash
mysql -u root -p < database/seed.sql
```

On macOS, use the full MySQL executable path if required:

```bash
/usr/local/mysql/bin/mysql -u root -p < database/schema.sql
```

```bash
/usr/local/mysql/bin/mysql -u root -p < database/seed.sql
```

### Step 4: Install Backend Dependencies

Navigate to the backend directory:

```bash
cd backend
```

Install the required dependencies:

```bash
npm install
```

### Step 5: Configure Environment Variables

Create the `.env` file inside the backend directory using `.env.example` as the reference.

Configure the database connection and other required environment variables according to the project configuration.

Ensure that the MySQL credentials are correct.

### Step 6: Run Database Migrations

From the backend directory, execute:

```bash
node scripts/migrate.js
```

### Step 7: Start the Application

Run the backend server:

```bash
npm run dev
```

The application will run at:

```text
http://localhost:3000
```

### Step 8: Open the Website

Open the following URL in a web browser:

```text
http://localhost:3000/
```

The Express server serves the frontend files and handles backend API requests.

## 10. Testing

The following endpoints can be used to verify the application.

| Test               | URL                     | Expected Result       |
| ------------------ | ----------------------- | --------------------- |
| API Health Check   | `/api/health`         | API running response  |
| Product Catalogue  | `/api/products`       | Complete product list |
| Product Details    | `/api/products/1`     | Fresh Apples details  |
| Invalid Product ID | `/api/products/99999` | 404 Not Found         |

### Database Verification

Execute the following SQL queries:

```sql
USE mnit_mart;

SELECT * FROM products;
```

This query displays the products stored in the database.

## 11. Screenshots

The project submission includes screenshots demonstrating:

- Product listing page.
- Individual product details page.

## 12. Conclusion

MNIT Mart demonstrates the development of a full-stack product listing website using HTML, CSS, JavaScript, Node.js, Express.js, and MySQL.

The application integrates the frontend, backend, and relational database to provide product listing, individual product details, search, and filtering functionality.

It demonstrates the implementation of REST APIs, database connectivity, and full-stack application integration.
note: kindly check the zip which is upload it has whole the code the set up of folder and all thing zip name is commerce
