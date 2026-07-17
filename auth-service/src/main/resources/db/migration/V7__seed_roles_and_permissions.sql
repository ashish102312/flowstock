-- V7: Seed default roles and permissions

-- ── Permissions ────────────────────────────────────────────────────────────────
INSERT INTO permissions (name, description) VALUES
-- User-level
('USER_READ',          'Read own profile'),
('USER_UPDATE',        'Update own profile'),
('USER_DELETE',        'Delete own account'),

-- Admin-level
('ADMIN_USER_READ',    'Read any user profile'),
('ADMIN_USER_UPDATE',  'Update any user'),
('ADMIN_USER_DELETE',  'Delete any user'),
('ADMIN_ROLE_MANAGE',  'Manage roles and permissions'),
('ADMIN_AUDIT_READ',   'Read audit logs'),

-- Inventory
('INVENTORY_READ',     'Read inventory data'),
('INVENTORY_WRITE',    'Write/update inventory'),
('INVENTORY_DELETE',   'Delete inventory records'),

-- Order
('ORDER_READ',         'Read orders'),
('ORDER_WRITE',        'Create and update orders'),
('ORDER_CANCEL',       'Cancel orders'),

-- Warehouse
('WAREHOUSE_READ',     'Read warehouse data'),
('WAREHOUSE_WRITE',    'Manage warehouse zones and bins'),

-- Supplier
('SUPPLIER_READ',      'Read supplier data'),
('SUPPLIER_WRITE',     'Create and update suppliers'),

-- Analytics
('ANALYTICS_READ',     'View analytics and reports'),
('ANALYTICS_EXPORT',   'Export reports');

-- ── Roles ──────────────────────────────────────────────────────────────────────
INSERT INTO roles (name, description) VALUES
('ROLE_USER',          'Standard authenticated user'),
('ROLE_MANAGER',       'Operations manager with elevated access'),
('ROLE_ADMIN',         'System administrator with full access'),
('ROLE_SUPER_ADMIN',   'Super administrator — unrestricted access');

-- ── Role → Permission Assignments ──────────────────────────────────────────────

-- ROLE_USER
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'ROLE_USER'
  AND p.name IN ('USER_READ', 'USER_UPDATE', 'INVENTORY_READ', 'ORDER_READ', 'ORDER_WRITE');

-- ROLE_MANAGER
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'ROLE_MANAGER'
  AND p.name IN (
    'USER_READ', 'USER_UPDATE',
    'INVENTORY_READ', 'INVENTORY_WRITE',
    'ORDER_READ', 'ORDER_WRITE', 'ORDER_CANCEL',
    'WAREHOUSE_READ', 'WAREHOUSE_WRITE',
    'SUPPLIER_READ', 'SUPPLIER_WRITE',
    'ANALYTICS_READ', 'ANALYTICS_EXPORT'
  );

-- ROLE_ADMIN
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'ROLE_ADMIN'
  AND p.name IN (
    'USER_READ', 'USER_UPDATE', 'USER_DELETE',
    'ADMIN_USER_READ', 'ADMIN_USER_UPDATE', 'ADMIN_USER_DELETE',
    'ADMIN_AUDIT_READ',
    'INVENTORY_READ', 'INVENTORY_WRITE', 'INVENTORY_DELETE',
    'ORDER_READ', 'ORDER_WRITE', 'ORDER_CANCEL',
    'WAREHOUSE_READ', 'WAREHOUSE_WRITE',
    'SUPPLIER_READ', 'SUPPLIER_WRITE',
    'ANALYTICS_READ', 'ANALYTICS_EXPORT'
  );

-- ROLE_SUPER_ADMIN → all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'ROLE_SUPER_ADMIN';
