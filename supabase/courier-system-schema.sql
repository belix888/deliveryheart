-- =====================================================
-- COURIER SYSTEM - Database Schema
-- Phase P0: Core Tables
-- =====================================================

-- 1. COURIERS - Профили курьеров
CREATE TABLE IF NOT EXISTS couriers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    avatar_url TEXT,
    status VARCHAR(20) DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'busy')),
    current_city VARCHAR(100) DEFAULT 'Москва',
    vehicle_type VARCHAR(50) DEFAULT 'bike' CHECK (vehicle_type IN ('bike', 'car', 'walk', 'scooter')),
    rating DECIMAL(3,2) DEFAULT 5.00 CHECK (rating >= 0 AND rating <= 5),
    total_deliveries INTEGER DEFAULT 0,
    total_earnings DECIMAL(10,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. COURIER_ORDERS - Связь курьеров с заказами
CREATE TABLE IF NOT EXISTS courier_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    courier_id UUID NOT NULL REFERENCES couriers(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN (
        'pending', 'assigned', 'accepted', 'picked_up', 'in_delivery', 'delivered', 'cancelled', 'failed'
    )),
    earnings DECIMAL(10,2) DEFAULT 0,
    distance_km DECIMAL(10,2),
    pickup_time TIMESTAMP WITH TIME ZONE,
    delivery_time TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(courier_id, order_id)
);

-- 3. COURIER_EARNINGS - История заработка
CREATE TABLE IF NOT EXISTS courier_earnings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    courier_id UUID NOT NULL REFERENCES couriers(id) ON DELETE CASCADE,
    courier_order_id UUID REFERENCES courier_orders(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    order_number VARCHAR(20),
    period_type VARCHAR(20) DEFAULT 'daily' CHECK (period_type IN ('daily', 'weekly', 'monthly')),
    period_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. COURIER_STATS - Агрегированная статистика
CREATE TABLE IF NOT EXISTS courier_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    courier_id UUID NOT NULL REFERENCES couriers(id) ON DELETE CASCADE,
    stat_date DATE NOT NULL,
    orders_completed INTEGER DEFAULT 0,
    orders_cancelled INTEGER DEFAULT 0,
    total_earnings DECIMAL(10,2) DEFAULT 0,
    total_distance_km DECIMAL(10,2) DEFAULT 0,
    avg_delivery_time_minutes INTEGER,
    avg_rating DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(courier_id, stat_date)
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_couriers_status ON couriers(status);
CREATE INDEX IF NOT EXISTS idx_couriers_city ON couriers(current_city);
CREATE INDEX IF NOT EXISTS idx_couriers_user_id ON couriers(user_id);

CREATE INDEX IF NOT EXISTS idx_courier_orders_courier_id ON courier_orders(courier_id);
CREATE INDEX IF NOT EXISTS idx_courier_orders_order_id ON courier_orders(order_id);
CREATE INDEX IF NOT EXISTS idx_courier_orders_status ON courier_orders(status);
CREATE INDEX IF NOT EXISTS idx_courier_orders_created ON courier_orders(created_at);

CREATE INDEX IF NOT EXISTS idx_courier_earnings_courier_id ON courier_earnings(courier_id);
CREATE INDEX IF NOT EXISTS idx_courier_earnings_period ON courier_earnings(period_date);
CREATE INDEX IF NOT EXISTS idx_courier_earnings_courier_period ON courier_earnings(courier_id, period_date);

CREATE INDEX IF NOT EXISTS idx_courier_stats_courier_id ON courier_stats(courier_id);
CREATE INDEX IF NOT EXISTS idx_courier_stats_date ON courier_stats(stat_date);

-- =====================================================
-- RLS POLICIES
-- =====================================================
ALTER TABLE couriers ENABLE ROW LEVEL SECURITY;
ALTER TABLE courier_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE courier_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE courier_stats ENABLE ROW LEVEL SECURITY;

-- Couriers: Couriers see own profile, Admins see all
CREATE POLICY "couriers_select_own" ON couriers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "couriers_insert_own" ON couriers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "couriers_update_own" ON couriers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "couriers_admin_all" ON couriers FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Courier Orders: Couriers see own orders, Admins see all
CREATE POLICY "courier_orders_select_own" ON courier_orders FOR SELECT USING (
    courier_id IN (SELECT id FROM couriers WHERE user_id = auth.uid())
);
CREATE POLICY "courier_orders_courier_insert" ON courier_orders FOR INSERT WITH CHECK (
    courier_id IN (SELECT id FROM couriers WHERE user_id = auth.uid())
);
CREATE POLICY "courier_orders_update_own" ON courier_orders FOR UPDATE USING (
    courier_id IN (SELECT id FROM couriers WHERE user_id = auth.uid())
);
CREATE POLICY "courier_orders_admin_all" ON courier_orders FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Courier Earnings: Couriers see own, Admins see all
CREATE POLICY "courier_earnings_select_own" ON courier_earnings FOR SELECT USING (
    courier_id IN (SELECT id FROM couriers WHERE user_id = auth.uid())
);
CREATE POLICY "courier_earnings_admin_all" ON courier_earnings FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Courier Stats: Couriers see own, Admins see all
CREATE POLICY "courier_stats_select_own" ON courier_stats FOR SELECT USING (
    courier_id IN (SELECT id FROM couriers WHERE user_id = auth.uid())
);
CREATE POLICY "courier_stats_admin_all" ON courier_stats FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to update courier stats
CREATE OR REPLACE FUNCTION update_courier_stats()
RETURNS TRIGGER AS $$
DECLARE
    v_courier_id UUID;
    v_stat_date DATE;
BEGIN
    IF TG_OP = 'INSERT' THEN
        v_courier_id := NEW.courier_id;
        v_stat_date := CURRENT_DATE;
    ELSIF TG_OP = 'UPDATE' THEN
        v_courier_id := COALESCE(NEW.courier_id, OLD.courier_id);
        v_stat_date := CURRENT_DATE;
    ELSE
        v_courier_id := OLD.courier_id;
        v_stat_date := CURRENT_DATE;
    END IF;
    
    -- Upsert daily stats
    INSERT INTO courier_stats (courier_id, stat_date, orders_completed, total_earnings)
    VALUES (v_courier_id, v_stat_date, 1, COALESCE(NEW.earnings, 0))
    ON CONFLICT (courier_id, stat_date) DO UPDATE SET
        orders_completed = courier_stats.orders_completed + 1,
        total_earnings = courier_stats.total_earnings + COALESCE(NEW.earnings, 0),
        updated_at = NOW();
    
    -- Update courier total stats
    UPDATE couriers SET
        total_deliveries = total_deliveries + 1,
        total_earnings = total_earnings + COALESCE(NEW.earnings, 0),
        updated_at = NOW()
    WHERE id = v_courier_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for courier_orders
CREATE OR REPLACE TRIGGER tr_courier_orders_update
    AFTER INSERT OR UPDATE OF status ON courier_orders
    FOR EACH ROW
    WHEN (NEW.status = 'delivered')
    EXECUTE FUNCTION update_courier_stats();

-- Function to update courier status
CREATE OR REPLACE FUNCTION set_courier_online()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE couriers SET status = 'online', updated_at = NOW() WHERE id = NEW.courier_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- UPDATED ORDERS TABLE - Add courier relation
-- =====================================================
ALTER TABLE orders ADD COLUMN IF NOT EXISTS courier_id UUID REFERENCES couriers(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS courier_order_id UUID REFERENCES courier_orders(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS pickup_address TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_address_full TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_lat DECIMAL(10,7);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_lng DECIMAL(10,7);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS courier_earnings DECIMAL(10,2) DEFAULT 0;

-- =====================================================
-- INSERT SAMPLE COURIERS (for testing)
-- =====================================================
-- Uncomment when needed:
-- INSERT INTO couriers (name, phone, status, current_city, vehicle_type) VALUES
-- ('Александр Петров', '+7 999 123-45-67', 'offline', 'Москва', 'bike'),
-- ('Михаил Сидоров', '+7 999 765-43-21', 'offline', 'Москва', 'car'),
-- ('Дмитрий Козлов', '+7 999 111-22-33', 'offline', 'Москва', 'scooter');

-- =====================================================
-- VERIFY
-- =====================================================
SELECT 'couriers' as table_name, COUNT(*) as row_count FROM couriers
UNION ALL
SELECT 'courier_orders', COUNT(*) FROM courier_orders
UNION ALL
SELECT 'courier_earnings', COUNT(*) FROM courier_earnings
UNION ALL
SELECT 'courier_stats', COUNT(*) FROM courier_stats;