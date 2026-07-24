-- Create inventory schema
CREATE SCHEMA IF NOT EXISTS inventory;

-- Inventory items (one per product per warehouse)
CREATE TABLE inventory.inventory_items (
    id                      VARCHAR(36) PRIMARY KEY,
    product_id              VARCHAR(36) NOT NULL,
    warehouse_id            VARCHAR(36) NOT NULL,
    available_qty           INTEGER NOT NULL DEFAULT 0,
    reserved_qty            INTEGER NOT NULL DEFAULT 0,
    damaged_qty             INTEGER NOT NULL DEFAULT 0,
    incoming_qty            INTEGER NOT NULL DEFAULT 0,
    low_stock_threshold     INTEGER NOT NULL DEFAULT 10,
    reorder_point           INTEGER NOT NULL DEFAULT 5,
    version                 BIGINT NOT NULL DEFAULT 0,
    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (product_id, warehouse_id)
);

-- Inventory reservations (holds against available_qty)
CREATE TABLE inventory.inventory_reservations (
    id                  VARCHAR(36) PRIMARY KEY,
    inventory_item_id   VARCHAR(36) NOT NULL REFERENCES inventory.inventory_items(id),
    reference_id        VARCHAR(255) NOT NULL,
    quantity            INTEGER NOT NULL,
    reason              VARCHAR(50) NOT NULL,
    released            BOOLEAN NOT NULL DEFAULT FALSE,
    released_at         TIMESTAMP,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stock audit log (immutable ledger)
CREATE TABLE inventory.stock_audit_log (
    id                  VARCHAR(36) PRIMARY KEY,
    inventory_item_id   VARCHAR(36) NOT NULL,
    product_id          VARCHAR(36) NOT NULL,
    warehouse_id        VARCHAR(36) NOT NULL,
    action              VARCHAR(50) NOT NULL,
    quantity_before     INTEGER NOT NULL,
    quantity_after      INTEGER NOT NULL,
    delta               INTEGER NOT NULL,
    reference_id        VARCHAR(255),
    performed_by        VARCHAR(255),
    notes               TEXT,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_inventory_product_warehouse ON inventory.inventory_items(product_id, warehouse_id);
CREATE INDEX idx_inventory_reservations_ref ON inventory.inventory_reservations(reference_id);
CREATE INDEX idx_audit_item_id ON inventory.stock_audit_log(inventory_item_id);
CREATE INDEX idx_audit_product ON inventory.stock_audit_log(product_id);
