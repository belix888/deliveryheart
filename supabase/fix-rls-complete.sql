-- COMPLETE RLS DISABLE - Run this to completely disable RLS for tables
-- This is a last resort fix

ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE addresses DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;

-- Or if you want to keep RLS but open everything:
-- DROP ALL POLICIES and recreate open ones

-- Drop all policies on orders
DROP POLICY IF EXISTS "orders_user_select" ON orders;
DROP POLICY IF EXISTS "orders_user_insert" ON orders;
DROP POLICY IF EXISTS "orders_user_update" ON orders;
DROP POLICY IF EXISTS "orders_restaurant_admin_select" ON orders;
DROP POLICY IF EXISTS "orders_restaurant_admin_update" ON orders;
DROP POLICY IF EXISTS "orders_insert_any" ON orders;
DROP POLICY IF EXISTS "orders_insert" ON orders;

-- Create completely open policy
CREATE POLICY "orders_open_insert" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "orders_open_select" ON orders FOR SELECT USING (true);
CREATE POLICY "orders_open_update" ON orders FOR UPDATE USING (true);
CREATE POLICY "orders_open_delete" ON orders FOR DELETE USING (true);

-- Drop all policies on addresses
DROP POLICY IF EXISTS "addresses_select_own" ON addresses;
DROP POLICY IF EXISTS "addresses_insert_own" ON addresses;
DROP POLICY IF EXISTS "addresses_update_own" ON addresses;
DROP POLICY IF EXISTS "addresses_delete_own" ON addresses;
DROP POLICY IF EXISTS "addresses_insert_any" ON addresses;
DROP POLICY IF EXISTS "addresses_insert" ON addresses;

CREATE POLICY "addresses_open_insert" ON addresses FOR INSERT WITH CHECK (true);
CREATE POLICY "addresses_open_select" ON addresses FOR SELECT USING (true);
CREATE POLICY "addresses_open_update" ON addresses FOR UPDATE USING (true);
CREATE POLICY "addresses_open_delete" ON addresses FOR DELETE USING (true);

-- Drop all policies on order_items
DROP POLICY IF EXISTS "order_items_select" ON order_items;
DROP POLICY IF EXISTS "order_items_insert_any" ON order_items;
DROP POLICY IF EXISTS "order_items_insert" ON order_items;

CREATE POLICY "order_items_open_insert" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "order_items_open_select" ON order_items FOR SELECT USING (true);
CREATE POLICY "order_items_open_update" ON order_items FOR UPDATE USING (true);
CREATE POLICY "order_items_open_delete" ON order_items FOR DELETE USING (true);