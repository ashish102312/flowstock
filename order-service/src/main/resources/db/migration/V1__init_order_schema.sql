-- Create orders schema
CREATE SCHEMA IF NOT EXISTS orders;

-- Orders
CREATE TABLE orders.orders (
    id                  VARCHAR(36) PRIMARY KEY,
    customer_id         VARCHAR(255) NOT NULL, -- Subject ID from JWT auth
    total_amount        DECIMAL(12, 2) NOT NULL,
    status              VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    payment_status      VARCHAR(30) NOT NULL DEFAULT 'UNPAID',
    shipping_address    TEXT,
    notes               TEXT,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items
CREATE TABLE orders.order_items (
    id                  VARCHAR(36) PRIMARY KEY,
    order_id            VARCHAR(36) NOT NULL REFERENCES orders.orders(id),
    product_id          VARCHAR(36) NOT NULL,
    warehouse_id        VARCHAR(36) NOT NULL,
    inventory_reservation_id VARCHAR(36), -- Captured from inventory service
    product_name        VARCHAR(255) NOT NULL, -- Snapshot
    quantity            INTEGER NOT NULL,
    unit_price          DECIMAL(12, 2) NOT NULL,
    total_price         DECIMAL(12, 2) NOT NULL,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_customer ON orders.orders(customer_id);
CREATE INDEX idx_orders_status ON orders.orders(status);
CREATE INDEX idx_order_items_order ON orders.order_items(order_id);
