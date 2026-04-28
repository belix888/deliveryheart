-- ADD ALL MISSING COLUMNS TO ORDERS TABLE
-- Run this to fix missing columns

-- Add all missing columns
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_price NUMERIC(10,2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_address_id UUID;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS final_amount NUMERIC(10,2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS comment TEXT;

-- Verify the complete table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;