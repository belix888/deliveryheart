-- ADD MISSING COLUMNS TO ORDERS TABLE
-- Run this if columns don't exist

-- Add delivery_price if not exists
DO $$ 
BEGIN
   IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'delivery_price') THEN
      ALTER TABLE orders ADD COLUMN delivery_price NUMERIC(10,2) DEFAULT 0;
   END IF;
END $$;

-- Add delivery_address_id if not exists
DO $$ 
BEGIN
   IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'delivery_address_id') THEN
      ALTER TABLE orders ADD COLUMN delivery_address_id UUID REFERENCES addresses(id);
   END IF;
END $$;

-- Add comment if not exists
DO $$ 
BEGIN
   IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'comment') THEN
      ALTER TABLE orders ADD COLUMN comment TEXT;
   END IF;
END $$;

-- Verify the table structure
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'orders' ORDER BY ordinal_position;