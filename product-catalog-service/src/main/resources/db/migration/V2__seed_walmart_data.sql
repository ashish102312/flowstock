-- Seed Walmart Categories
INSERT INTO categories (id, name, description) VALUES
('c-grocery', 'Groceries', 'Food and beverages'),
('c-household', 'Household Essentials', 'Cleaning and household items'),
('c-electronics', 'Electronics', 'TVs, computers, and gadgets');

-- Seed Walmart Brands
INSERT INTO brands (id, name, description) VALUES
('b-greatvalue', 'Great Value', 'Walmart private brand for groceries'),
('b-mainstays', 'Mainstays', 'Walmart private brand for home and bedding'),
('b-equate', 'Equate', 'Walmart private brand for health and beauty'),
('b-onn', 'Onn', 'Walmart private brand for electronics');

-- Seed Walmart Products
INSERT INTO products (id, name, description, sku, barcode, price, category_id, brand_id) VALUES
('p-001', 'Great Value Paper Towels, 6 Rolls', 'Ultra strong and absorbent paper towels.', 'SKU-GV-PT06', '078742352123', 9.98, 'c-household', 'b-greatvalue'),
('p-002', 'Great Value Purified Drinking Water', '40 Pack, 16.9 fl oz Bottles.', 'SKU-GV-W40', '078742223334', 5.36, 'c-grocery', 'b-greatvalue'),
('p-003', 'Mainstays Bath Towel, White', '100% Cotton soft bath towel.', 'SKU-MS-TWL-WHT', '022345678901', 3.98, 'c-household', 'b-mainstays'),
('p-004', 'Equate Hand Sanitizer with Aloe', 'Kills 99.99% of germs, 32 fl oz.', 'SKU-EQ-HS32', '033456789012', 4.98, 'c-household', 'b-equate'),
('p-005', 'Onn 50-inch 4K UHD LED Roku Smart TV', 'Stunning 4K resolution with Roku built-in.', 'SKU-ONN-TV50', '044567890123', 198.00, 'c-electronics', 'b-onn');
