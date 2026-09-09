-- ========================================
-- Tealuxe Chai Database Schema (Supabase)
-- ========================================

-- USERS
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'customer', -- admin/customer
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- PRODUCTS (TEA BLENDS)
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- Black Tea, Chamomile, etc.
    description TEXT,
    origin VARCHAR(100), -- e.g., Kericho, Nandi
    aroma_profile VARCHAR(100),
    caffeine_level VARCHAR(50),
    health_benefits TEXT,
    image_url TEXT,
    base_price NUMERIC(10,2) NOT NULL,
    stock INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- VARIATIONS (Optional flavors or packaging)
CREATE TABLE IF NOT EXISTS variations (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(50), -- e.g., Ginger infused, Cardamom infused
    extra_price NUMERIC(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- WEIGHTS / PACK SIZES
CREATE TABLE IF NOT EXISTS weights (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    size VARCHAR(50), -- e.g., 50g, 100g, 250g
    price NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ORDERS
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'pending', -- pending, paid, shipped, completed
    total NUMERIC(10,2),
    payment_method VARCHAR(50), -- e.g., M-PESA, Cash
    delivery_address TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ORDER ITEMS (link products to orders)
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id),
    variation_id INT REFERENCES variations(id),
    weight_id INT REFERENCES weights(id),
    quantity INT NOT NULL DEFAULT 1,
    price NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- TRANSACTIONS (MPESA / Payments)
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id),
    transaction_id VARCHAR(100),
    amount NUMERIC(10,2),
    status VARCHAR(50), -- success, failed, pending
    payment_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);