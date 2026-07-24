-- Create warehouse schema
CREATE SCHEMA IF NOT EXISTS warehouse;

-- Warehouses table
CREATE TABLE warehouse.warehouses (
    id              VARCHAR(36) PRIMARY KEY,
    code            VARCHAR(50) UNIQUE NOT NULL,
    name            VARCHAR(255) NOT NULL,
    description     TEXT,

    -- Address
    address_line1   VARCHAR(255) NOT NULL,
    address_line2   VARCHAR(255),
    city            VARCHAR(100) NOT NULL,
    state           VARCHAR(100) NOT NULL,
    country         VARCHAR(100) NOT NULL,
    postal_code     VARCHAR(20)  NOT NULL,

    -- Geo-coordinates
    latitude        DECIMAL(10, 8),
    longitude       DECIMAL(11, 8),

    -- Capacity
    total_capacity  INTEGER NOT NULL DEFAULT 0,
    used_capacity   INTEGER NOT NULL DEFAULT 0,

    -- Status & soft-delete
    status          VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,

    -- Audit
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_warehouses_status  ON warehouse.warehouses(status);
CREATE INDEX idx_warehouses_city    ON warehouse.warehouses(city);
CREATE INDEX idx_warehouses_country ON warehouse.warehouses(country);

-- Seed data
INSERT INTO warehouse.warehouses (id, code, name, description, address_line1, city, state, country, postal_code, latitude, longitude, total_capacity, status)
VALUES
    ('wh-001', 'WH-DELHI-001', 'Delhi North Hub', 'Primary fulfillment hub for North India', 'Plot 45, Industrial Area', 'New Delhi', 'Delhi', 'India', '110001', 28.6139, 77.2090, 10000, 'ACTIVE'),
    ('wh-002', 'WH-MUMBAI-001', 'Mumbai West Depot', 'Western India distribution center', 'Unit 12, Andheri Kurla Road', 'Mumbai', 'Maharashtra', 'India', '400059', 19.0760, 72.8777, 8000, 'ACTIVE'),
    ('wh-003', 'WH-BENGALURU-001', 'Bengaluru Tech Park Warehouse', 'South India returns and dispatch hub', 'Survey 88, Whitefield', 'Bengaluru', 'Karnataka', 'India', '560066', 12.9716, 77.5946, 6000, 'ACTIVE');
