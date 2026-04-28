-- Fix RLS for order creation
-- Run in Supabase SQL Editor

-- Allow INSERT for orders (authenticated users only)
DROP POLICY IF EXISTS "orders_insert" ON orders;
CREATE POLICY "orders_insert" ON orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow INSERT for addresses (authenticated users only)  
DROP POLICY IF EXISTS "addresses_insert" ON addresses;
CREATE POLICY "addresses_insert" ON addresses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow order_items INSERT
DROP POLICY IF EXISTS "order_items_insert" ON order_items;
CREATE POLICY "order_items_insert" ON order_items
    FOR INSERT WITH CHECK (true);