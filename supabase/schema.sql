-- =====================================================
-- СХЕМА БАЗЫ ДАННЫХ "Доставка от души"
-- Supabase / PostgreSQL
-- =====================================================

-- Включаем расширение для генерации UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ТАБЛИЦЫ
-- =====================================================

-- 0. Города (NEW!)
CREATE TABLE IF NOT EXISTS cities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    region VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 0. Промокоды (NEW!)
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('fixed', 'percent')),
    discount_value NUMERIC(10,2) NOT NULL,
    min_order_amount NUMERIC(10,2) DEFAULT 0,
    max_uses INTEGER,
    used_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    valid_to TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1. Пользователи
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    full_name VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Адреса доставки
CREATE TABLE IF NOT EXISTS addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    address_text TEXT NOT NULL,
    apartment VARCHAR(50),
    entrance VARCHAR(20),
    floor VARCHAR(20),
    comment TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Рестораны
CREATE TABLE IF NOT EXISTS restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    logo_url TEXT,
    cover_url TEXT,
    address TEXT NOT NULL,
    phone VARCHAR(20),
    working_hours JSONB DEFAULT '{"monday": "09:00-21:00", "tuesday": "09:00-21:00", "wednesday": "09:00-21:00", "thursday": "09:00-21:00", "friday": "09:00-22:00", "saturday": "10:00-22:00", "sunday": "10:00-21:00"}',
    rating NUMERIC(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    delivery_time_min INTEGER DEFAULT 30,
    delivery_time_max INTEGER DEFAULT 45,
    delivery_price NUMERIC(10,2) DEFAULT 0,
    min_order NUMERIC(10,2) DEFAULT 500,
    is_active BOOLEAN DEFAULT TRUE,
    city VARCHAR(100) DEFAULT 'Сураж',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Категории меню
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

-- 5. Блюда в меню
CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    image_url TEXT,
    weight VARCHAR(50),
    is_available BOOLEAN DEFAULT TRUE,
    is_special BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Заказы
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled');

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(20) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id),
    status order_status DEFAULT 'pending',
    delivery_address_id UUID REFERENCES addresses(id),
    total_amount NUMERIC(10,2) DEFAULT 0,
    delivery_price NUMERIC(10,2) DEFAULT 0,
    final_amount NUMERIC(10,2) DEFAULT 0,
    comment TEXT,
    estimated_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 7. Позиции заказа
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id UUID NOT NULL REFERENCES menu_items(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    price NUMERIC(10,2) NOT NULL,
    total_price NUMERIC(10,2) NOT NULL,
    note TEXT
);

-- 8. Отзывы
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id),
    user_id UUID NOT NULL REFERENCES users(id),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Избранное
CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, restaurant_id)
);

-- 10. Админы ресторанов
CREATE TYPE admin_role AS ENUM ('admin', 'manager');

CREATE TABLE IF NOT EXISTS restaurant_admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    role admin_role DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, restaurant_id)
);

-- =====================================================
-- ИНДЕКСЫ
-- =====================================================

-- Индексы для заказов
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_restaurant_id ON orders(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Индексы для меню
CREATE INDEX IF NOT EXISTS idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_is_available ON menu_items(is_available);

-- Индексы для отзывов
CREATE INDEX IF NOT EXISTS idx_reviews_restaurant_id ON reviews(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- Индексы для категорий
CREATE INDEX IF NOT EXISTS idx_categories_restaurant_id ON categories(restaurant_id);

-- Индексы для адресов
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);

-- =====================================================
-- RLS (ROW LEVEL SECURITY)
-- =====================================================

-- Включаем RLS для всех таблиц
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_admins ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- ПОЛИТИКИ RLS
-- =====================================================

-- USERS: пользователь читает/обновляет только свой профиль
CREATE POLICY "users_select_own" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_update_own" ON users
    FOR UPDATE USING (auth.uid() = id);

-- ADDRESSES: пользователь читает/создаёт только свои адреса
CREATE POLICY "addresses_select_own" ON addresses
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "addresses_insert_own" ON addresses
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "addresses_update_own" ON addresses
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "addresses_delete_own" ON addresses
    FOR DELETE USING (user_id = auth.uid());

-- RESTAURANTS: все читают активные рестораны, админы управляют своими
CREATE POLICY "restaurants_select_active" ON restaurants
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "restaurants_admins_manage" ON restaurants
    FOR ALL USING (
        id IN (
            SELECT restaurant_id FROM restaurant_admins 
            WHERE user_id = auth.uid()
        )
    );

-- CATEGORIES: все читают, админы управляют
CREATE POLICY "categories_select" ON categories
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "categories_admins_manage" ON categories
    FOR ALL USING (
        restaurant_id IN (
            SELECT restaurant_id FROM restaurant_admins 
            WHERE user_id = auth.uid()
        )
    );

-- MENU_ITEMS: все читают доступные блюда, админы управляют
CREATE POLICY "menu_items_select_available" ON menu_items
    FOR SELECT USING (is_available = TRUE);

CREATE POLICY "menu_items_admins_manage" ON menu_items
    FOR ALL USING (
        category_id IN (
            SELECT c.id FROM categories c
            JOIN restaurant_admins ra ON c.restaurant_id = ra.restaurant_id
            WHERE ra.user_id = auth.uid()
        )
    );

-- ORDERS: пользователь читает только свои заказы, админы читают заказы своего ресторана
CREATE POLICY "orders_user_select" ON orders
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "orders_user_insert" ON orders
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "orders_user_update" ON orders
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "orders_restaurant_admin_select" ON orders
    FOR SELECT USING (
        restaurant_id IN (
            SELECT restaurant_id FROM restaurant_admins 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "orders_restaurant_admin_update" ON orders
    FOR UPDATE USING (
        restaurant_id IN (
            SELECT restaurant_id FROM restaurant_admins 
            WHERE user_id = auth.uid()
        )
    );

-- ORDER_ITEMS: пользователь видит свои, админы видят заказы ресторана
CREATE POLICY "order_items_select" ON order_items
    FOR SELECT USING (
        order_id IN (
            SELECT id FROM orders 
            WHERE user_id = auth.uid()
            OR restaurant_id IN (
                SELECT restaurant_id FROM restaurant_admins 
                WHERE user_id = auth.uid()
            )
        )
    );

-- REVIEWS: все читают, пользователь создаёт после заказа
CREATE POLICY "reviews_select" ON reviews
    FOR SELECT USING (TRUE);

CREATE POLICY "reviews_insert_own" ON reviews
    FOR INSERT WITH CHECK (
        user_id = auth.uid() 
        AND order_id IN (
            SELECT id FROM orders WHERE user_id = auth.uid() AND status = 'delivered'
        )
    );

-- FAVORITES: пользователь управляет только своими
CREATE POLICY "favorites_select_own" ON favorites
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "favorites_insert_own" ON favorites
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "favorites_delete_own" ON favorites
    FOR DELETE USING (user_id = auth.uid());

-- RESTAURANT_ADMINS: пользователь управляет своими
CREATE POLICY "restaurant_admins_manage" ON restaurant_admins
    FOR ALL USING (user_id = auth.uid());

-- =====================================================
-- ФУНКЦИИ И ТРИГГЕРЫ
-- =====================================================

-- Функция для обновления рейтинга ресторана
CREATE OR REPLACE FUNCTION update_restaurant_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE restaurants
    SET 
        rating = (
            SELECT COALESCE(AVG(rating), 0)
            FROM reviews
            WHERE restaurant_id = NEW.restaurant_id
        ),
        review_count = (
            SELECT COUNT(*)
            FROM reviews
            WHERE restaurant_id = NEW.restaurant_id
        ),
        updated_at = NOW()
    WHERE id = NEW.restaurant_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Тригер для обновления рейтинса при новом отзыве
CREATE TRIGGER trigger_update_restaurant_rating
    AFTER INSERT ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_restaurant_rating();

-- Функция для генерации номера заказа
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
    year_month TEXT;
    sequence_num INTEGER;
    new_number TEXT;
BEGIN
    year_month := TO_CHAR(NOW(), 'YYMM');
    
    SELECT COALESCE(MAX(
        CAST(
            SUBSTRING(order_number FROM 5 FOR 6) AS INTEGER
        )
    ), 0) + 1
    INTO sequence_num
    FROM orders
    WHERE order_number LIKE year_month || '%';
    
    new_number := year_month || LPAD(sequence_num::TEXT, 6, '0');
    NEW.order_number := new_number;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггер для генерации номера заказа
CREATE TRIGGER trigger_generate_order_number
    BEFORE INSERT ON orders
    FOR EACH ROW
    WHEN (NEW.order_number IS NULL)
    EXECUTE FUNCTION generate_order_number();

-- Функция для автоматического подтверждения заказа (простой сценарий)
CREATE OR REPLACE FUNCTION auto_confirm_order()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'confirmed' AND OLD.status = 'pending' THEN
        NEW.estimated_time := NOW() + INTERVAL '40 minutes';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_confirm_order
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION auto_confirm_order();

-- =====================================================
-- REALTIME (для отслеживания статусов заказов)
-- =====================================================

-- Включаем logical replication для таблицы orders
ALTER TABLE orders REPLICA IDENTITY FULL;

-- Создаем публикацию для realtime (раскомментируйте если нужен realtime)
-- CREATE PUBLICATION IF NOT EXISTS orders_realtime FOR TABLE orders;

-- =====================================================
-- НАЧАЛЬНЫЕ ДАННЫЕ (SEED DATA)
-- =====================================================

-- Добавляем тестовые рестораны для Суража
INSERT INTO restaurants (name, slug, description, address, phone, city, delivery_time_min, delivery_time_max, delivery_price, min_order)
VALUES 
    ('Пельменная №1', 'pelmennaya-1', 'Уютное место с домашними пельменями и варениками', 'ул. Ленина, 25', '+7 (48336) 2-12-34', 'Сураж', 25, 35, 50, 300),
    ('Sushi Master', 'sushi-master', 'Свежие роллы и суши от лучших поваров', 'ул. Пушкина, 10', '+7 (48336) 2-56-78', 'Сураж', 30, 40, 70, 500),
    ('Pizza Napoli', 'pizza-napoli', 'Итальянская пицца из настоящей печи', 'ул. Советская, 15', '+7 (48336) 2-90-12', 'Сураж', 20, 30, 40, 400)
ON CONFLICT (slug) DO NOTHING;

-- Добавляем категории для первого ресторана
INSERT INTO categories (restaurant_id, name, sort_order)
SELECT id, category_name, sort_num
FROM restaurants
CROSS JOIN LATERAL (
    VALUES 
        ('Завтраки', 1),
        ('Обеды', 2),
        ('Ужины', 3),
        ('Напитки', 4),
        ('Выпечка', 5)
    ) AS t(category_name, sort_num)
WHERE name = 'Пельменная №1';

-- Добавляем категории для второго ресторана
INSERT INTO categories (restaurant_id, name, sort_order)
SELECT id, category_name, sort_num
FROM restaurants
CROSS JOIN LATERAL (
    VALUES 
        ('Роллы', 1),
        ('Суши', 2),
        ('Супы', 3),
        ('Напитки', 4)
    ) AS t(category_name, sort_num)
WHERE name = 'Sushi Master';

-- Добавляем категории для третьего ресторана
INSERT INTO categories (restaurant_id, name, sort_order)
SELECT id, category_name, sort_num
FROM restaurants
CROSS JOIN LATERAL (
    VALUES 
        ('Пицца', 1),
        ('Закуски', 2),
        ('Напитки', 3)
    ) AS t(category_name, sort_num)
WHERE name = 'Pizza Napoli';

-- =====================================================
-- ПРИМЕЧАНИЯ ДЛЯ РАЗРАБОТЧИКА
-- =====================================================

/*
-- Для работы с Auth в Supabase нужно:
-- 1. Создать проект на supabase.com
-- 2. Включить Auth в настройках
-- 3. Настроить провайдеры (email, phone)
-- 4. Использовать Supabase JS Client для аутентификации

-- Для подключения к базе:
-- 1. Получить URL проекта и anon key из настроек
-- 2. Добавить в .env:
--    NEXT_PUBLIC_SUPABASE_URL=your_project_url
--    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

-- Для realtime подписки:
-- const channel = supabase
--   .channel('orders')
--   .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, (payload) => {
--     console.log('Order status changed:', payload.new);
--   })
--   .subscribe();
*/

-- =====================================================
-- КОНЕЦ СХЕМЫ
-- =====================================================