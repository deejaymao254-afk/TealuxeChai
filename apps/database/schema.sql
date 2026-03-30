-- ===============================
-- DATABASE CLEAN SETUP
-- ===============================

-- (RUN ONLY IF YOU WANT A RESET)
-- DROP DATABASE IF EXISTS "Admin";
-- CREATE DATABASE "Admin";

-- Connect to DB manually before running the rest:
-- \c Admin

-- ===============================
-- SCHEMA
-- ===============================

CREATE SCHEMA IF NOT EXISTS public;

-- ===============================
-- USERS TABLE
-- ===============================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(15) UNIQUE NOT NULL,
    pin VARCHAR(255) NOT NULL,

    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50),
    id_no VARCHAR(20) UNIQUE,

    shop_name VARCHAR(100),
    shop_address VARCHAR(200),

    role VARCHAR(20) NOT NULL DEFAULT 'user'
        CHECK (role IN ('user', 'admin', 'superadmin')),

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ===============================
-- ORDERS TABLE
-- ===============================
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    checkout_request_id VARCHAR(100) UNIQUE NOT NULL,

    user_id INT REFERENCES users(id) ON DELETE SET NULL,

    items JSONB,
    amount NUMERIC(12,2) DEFAULT 0,

    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',

    mpesa_response JSONB,
    result_desc TEXT,
    callback_meta JSONB,
    message TEXT,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ===============================
-- PRODUCTS TABLE
-- ===============================
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    active BOOLEAN DEFAULT TRUE,
    units_per_carton INT DEFAULT 48,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ===============================
-- VARIATIONS
-- ===============================

CREATE TABLE IF NOT EXISTS product_variations (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,

    flavour VARCHAR(100) NOT NULL,
    image_url TEXT,

    created_at TIMESTAMP DEFAULT NOW()
);

-- ===============================
-- WEIGHTS
-- ===============================
CREATE TABLE IF NOT EXISTS product_weights (
    id SERIAL PRIMARY KEY,
    variation_id INT REFERENCES product_variations(id) ON DELETE CASCADE,

    weight VARCHAR(20) NOT NULL,
    price NUMERIC(10,2) NOT NULL,

    created_at TIMESTAMP DEFAULT NOW()
);

-- ===============================
-- INDEXES
-- ===============================
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);

-- ===============================
-- AUTO UPDATE FUNCTION
-- ===============================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ===============================
-- TRIGGERS
-- ===============================
DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_orders_updated_at ON orders;
CREATE TRIGGER trg_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
ALTER TABLE users ALTER COLUMN phone TYPE VARCHAR(20);