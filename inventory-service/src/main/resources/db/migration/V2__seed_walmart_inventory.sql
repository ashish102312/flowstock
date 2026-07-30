-- Seed Walmart Inventory Items
INSERT INTO inventory_items (id, product_id, warehouse_id, available_qty, reserved_qty, low_stock_threshold) VALUES
('inv-001', 'p-001', 'wh-001', 500, 50, 100),
('inv-002', 'p-001', 'wh-002', 300, 20, 100),
('inv-003', 'p-002', 'wh-001', 1000, 100, 200),
('inv-004', 'p-002', 'wh-003', 80, 10, 100), -- low stock
('inv-005', 'p-003', 'wh-002', 450, 0, 50),
('inv-006', 'p-004', 'wh-001', 40, 5, 50), -- low stock
('inv-007', 'p-004', 'wh-003', 600, 100, 50),
('inv-008', 'p-005', 'wh-002', 25, 2, 10);
