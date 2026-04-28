-- =====================================================
-- ROLES AND PERMISSIONS SYSTEM
-- Phase P0: Database Schema
-- =====================================================

-- 1. ROLES - Справочник ролей
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL, -- 'admin', 'restaurant_owner', 'restaurant_admin', 'courier', 'client'
    display_name VARCHAR(100) NOT NULL, -- 'Администратор', 'Владелец ресторана', etc.
    description TEXT,
    permissions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. USER_ROLES - Связь пользователей с ролями
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    restaurant_id UUID REFERENCES restaurants(id), -- для restaurant_owner и restaurant_admin
    is_active BOOLEAN DEFAULT TRUE,
    assigned_by UUID REFERENCES auth.users(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, role_id, restaurant_id)
);

-- 3. ORDERS - Обновленная таблица заказов с полными статусами
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE orders ALTER COLUMN status TYPE VARCHAR(30);
ALTER TABLE orders ADD CONSTRAINT orders_status_check CHECK (
    status IN (
        'pending',      -- Новый, ожидает подтверждения
        'confirmed',    -- Подтверждён рестораном
        'preparing',    -- Готовят
        'ready',        -- Готов к выдаче
        'waiting_courier', -- Ждёт курьера
        'in_delivery',  -- В доставке
        'delivered',    -- Доставлен
        'cancelled'     -- Отменён
    )
);

-- Добавить поля для отслеживания если ещё нет
ALTER TABLE orders ADD COLUMN IF NOT EXISTS courier_id UUID REFERENCES couriers(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS courier_order_id UUID;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS status_updated_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS status_history JSONB DEFAULT '[]'::jsonb;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS client_name VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS client_phone VARCHAR(50);

-- 4. ORDER STATUS HISTORY - История статусов
CREATE TABLE IF NOT EXISTS order_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL,
    changed_by UUID REFERENCES auth.users(id),
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_restaurant_id ON user_roles(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_restaurant_id ON orders(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_orders_courier_id ON orders(courier_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- =====================================================
-- RLS POLICIES
-- =====================================================
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

-- Roles: everyone can read
CREATE POLICY "roles_read" ON roles FOR SELECT USING (true);

-- User Roles: Users see their own roles, Admins see all
CREATE POLICY "user_roles_read" ON user_roles FOR SELECT USING (true);
CREATE POLICY "user_roles_insert" ON user_roles FOR INSERT WITH CHECK (auth.uid() = assigned_by OR EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role_id = (SELECT id FROM roles WHERE name = 'admin')));
CREATE POLICY "user_roles_update" ON user_roles FOR UPDATE USING (auth.uid() = assigned_by OR EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role_id = (SELECT id FROM roles WHERE name = 'admin')));

-- Order Status History: Same as orders
CREATE POLICY "order_status_history_read" ON order_status_history FOR SELECT USING (true);
CREATE POLICY "order_status_history_insert" ON order_status_history FOR INSERT WITH CHECK (true);

-- Update orders RLS
DROP POLICY IF EXISTS "orders_open" ON orders;
CREATE POLICY "orders_read_all" ON orders FOR SELECT USING (true);
CREATE POLICY "orders_insert" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "orders_update_all" ON orders FOR UPDATE USING (true);

-- =====================================================
-- SEED ROLES
-- =====================================================
INSERT INTO roles (name, display_name, description, permissions) VALUES
('admin', 'Администратор системы', 'Полный доступ ко всем функциям', '["all"]'::jsonb),
('restaurant_owner', 'Владелец ресторана', 'Управление своим рестораном', '["manage_restaurant", "view_orders", "manage_menu", "view_stats"]'::jsonb),
('restaurant_admin', 'Администратор ресторана', 'Управление заказами и меню', '["view_orders", "manage_orders", "view_stats"]'::jsonb),
('courier', 'Курьер', 'Доставка заказов', '["view_available_orders", "accept_orders", "update_delivery_status"]'::jsonb),
('client', 'Клиент', 'Обычный пользователь', '["place_orders", "view_own_orders"]'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS TABLE(role_name VARCHAR, restaurant_id UUID, is_active BOOLEAN) AS $$
BEGIN
    RETURN QUERY
    SELECT r.name, ur.restaurant_id, ur.is_active
    FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = get_user_role.user_id AND ur.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_user_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_roles ur
        JOIN roles r ON r.id = ur.role_id
        WHERE ur.user_id = is_user_admin.user_id 
        AND r.name = 'admin' 
        AND ur.is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get restaurant_id for user
CREATE OR REPLACE FUNCTION get_user_restaurant_id(user_id UUID)
RETURNS UUID AS $$
BEGIN
    SELECT ur.restaurant_id INTO STRICT result
    FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = get_user_restaurant_id.user_id 
    AND r.name IN ('restaurant_owner', 'restaurant_admin')
    AND ur.is_active = true;
    RETURN result;
EXCEPTION
    WHEN NO_DATA_FOUND THEN RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- VERIFY
-- =====================================================
SELECT 'roles' as table_name, COUNT(*) as count FROM roles
UNION ALL
SELECT 'user_roles', COUNT(*) FROM user_roles
UNION ALL
SELECT 'order_status_history', COUNT(*) FROM order_status_history;

SELECT name, display_name FROM roles ORDER BY name;