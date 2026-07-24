-- Create supplier schema
CREATE SCHEMA IF NOT EXISTS supplier;

-- Suppliers
CREATE TABLE supplier.suppliers (
    id              VARCHAR(36) PRIMARY KEY,
    code            VARCHAR(50) UNIQUE NOT NULL,
    name            VARCHAR(255) NOT NULL,
    contact_person  VARCHAR(255),
    email           VARCHAR(255) NOT NULL,
    phone           VARCHAR(50),
    website         VARCHAR(255),
    address_line1   VARCHAR(255),
    city            VARCHAR(100),
    country         VARCHAR(100),
    status          VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Purchase Orders
CREATE TABLE supplier.purchase_orders (
    id                      VARCHAR(36) PRIMARY KEY,
    order_number            VARCHAR(100) UNIQUE NOT NULL,
    supplier_id             VARCHAR(36) NOT NULL REFERENCES supplier.suppliers(id),
    product_id              VARCHAR(36) NOT NULL,
    quantity                INTEGER NOT NULL,
    unit_price              DECIMAL(12, 2) NOT NULL,
    total_amount            DECIMAL(14, 2) NOT NULL,
    expected_delivery_date  DATE,
    warehouse_id            VARCHAR(36),
    status                  VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    notes                   TEXT,
    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_suppliers_status      ON supplier.suppliers(status);
CREATE INDEX idx_purchase_orders_supplier ON supplier.purchase_orders(supplier_id);
CREATE INDEX idx_purchase_orders_status   ON supplier.purchase_orders(status);

-- Seed suppliers
INSERT INTO supplier.suppliers (id, code, name, contact_person, email, phone, city, country, status)
VALUES
    ('sup-001', 'SUP-TATA', 'Tata Consumer Products', 'Rajesh Sharma', 'rajesh@tata.com', '+91-9876543210', 'Mumbai', 'India', 'ACTIVE'),
    ('sup-002', 'SUP-ITC', 'ITC Limited', 'Priya Nair', 'priya.nair@itc.in', '+91-9123456789', 'Kolkata', 'India', 'ACTIVE'),
    ('sup-003', 'SUP-HUL', 'Hindustan Unilever Ltd', 'Arjun Mehta', 'arjun@hul.com', '+91-9988776655', 'Mumbai', 'India', 'ACTIVE');
