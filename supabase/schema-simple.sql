-- =====================================================
-- ПРОСТАЯ СХЕМА БД "Доставка от души"
-- =====================================================

-- Включаем расширение UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Города
CREATE TABLE IF NOT EXISTS cities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    region VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Промокоды
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

-- 3. Пользователи
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    full_name VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Адреса доставки
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

-- 5. Рестораны
CREATE TABLE IF NOT EXISTS restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    logo_url TEXT,
    cover_url TEXT,
    address TEXT NOT NULL,
    phone VARCHAR(20),
    rating NUMERIC(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    delivery_time_min INTEGER DEFAULT 30,
    delivery_time_max INTEGER DEFAULT 45,
    delivery_price NUMERIC(10,2) DEFAULT 0,
    min_order NUMERIC(10,2) DEFAULT 500,
    is_active BOOLEAN DEFAULT TRUE,
    city VARCHAR(100) DEFAULT 'Сураж',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Категории меню
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

-- 7. Блюда в меню
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Заказы (без ENUM для простоты)
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(20) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id),
    status VARCHAR(20) DEFAULT 'pending',
    delivery_address_id UUID REFERENCES addresses(id),
    total_amount NUMERIC(10,2) DEFAULT 0,
    delivery_price NUMERIC(10,2) DEFAULT 0,
    final_amount NUMERIC(10,2) DEFAULT 0,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Позиции заказа
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id UUID NOT NULL REFERENCES menu_items(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    price NUMERIC(10,2) NOT NULL,
    total_price NUMERIC(10,2) NOT NULL,
    note TEXT
);

-- 10. Отзывы
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id),
    user_id UUID NOT NULL REFERENCES users(id),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Избранное
CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, restaurant_id)
);

-- =====================================================
-- НАЧАЛЬНЫЕ ДАННЫЕ
-- =====================================================

-- Добавляем города
INSERT INTO cities (name, region) VALUES 
    ('Сураж', 'Брянская область'),
    ('Брянск', 'Брянская область'),
    ('Клинцы', 'Брянская область')
ON CONFLICT DO NOTHING;

-- Добавляем рестораны
INSERT INTO restaurants (name, slug, description, address, phone, rating, delivery_time_min, delivery_time_max, delivery_price, min_order, city)
VALUES 
    ('Пельменная №1', 'pelmennaya-1', 'Уютное заведение с домашними пельменями и варениками', 'ул. Ленина 25', '+7(48336)2-12-34', 4.8, 25, 35, 50, 300, 'Сураж'),
    ('Sushi Master', 'sushi-master', 'Свежие роллы и суши от лучших поваров', 'ул. Пушкина 10', '+7(48336)2-56-78', 4.9, 30, 40, 70, 500, 'Сураж'),
    ('Pizza Napoli', 'pizza-napoli', 'Итальянская пицца из настоящей печи', 'ул. Советская 15', '+7(48336)2-90-12', 4.7, 20, 30, 40, 400, 'Сураж')
ON CONFLICT (slug) DO NOTHING;

-- Добавляем категории для Пельменная №1
INSERT INTO categories (restaurant_id, name, sort_order)
SELECT id, 'Завтраки', 1 FROM restaurants WHERE slug = 'pelmennaya-1';
INSERT INTO categories (restaurant_id, name, sort_order)
SELECT id, 'Обеды', 2 FROM restaurants WHERE slug = 'pelmennaya-1';
INSERT INTO categories (restaurant_id, name, sort_order)
SELECT id, 'Ужины', 3 FROM restaurants WHERE slug = 'pelmennaya-1';
INSERT INTO categories (restaurant_id, name, sort_order)
SELECT id, 'Напитки', 4 FROM restaurants WHERE slug = 'pelmennaya-1';

-- Добавляем категории для Sushi Master
INSERT INTO categories (restaurant_id, name, sort_order)
SELECT id, 'Роллы', 1 FROM restaurants WHERE slug = 'sushi-master';
INSERT INTO categories (restaurant_id, name, sort_order)
SELECT id, 'Суши', 2 FROM restaurants WHERE slug = 'sushi-master';
INSERT INTO categories (restaurant_id, name, sort_order)
SELECT id, 'Закуски', 3 FROM restaurants WHERE slug = 'sushi-master';

-- Добавляем категории для Pizza Napoli
INSERT INTO categories (restaurant_id, name, sort_order)
SELECT id, 'Пицца', 1 FROM restaurants WHERE slug = 'pizza-napoli';
INSERT INTO categories (restaurant_id, name, sort_order)
SELECT id, 'Закуски', 2 FROM restaurants WHERE slug = 'pizza-napoli';

-- Добавляем тестового пользователя
INSERT INTO users (email, full_name, phone)
VALUES ('demo@example.com', 'Тестовый Пользователь', '+79001234567')
ON CONFLICT (email) DO NOTHING;

-- Добавляем промокоды
INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount, max_uses, is_active)
VALUES 
    ('WELCOME50', 'Скидка 50 руб на первый заказ', 'fixed', 50, 300, 100, true),
    ('PIZZA20', 'Скидка 20% на пиццу', 'percent', 20, 500, 50, true)
ON CONFLICT (code) DO NOTHING;

SELECT 'Готово! Создано:' as result;
SELECT (SELECT COUNT(*) FROM restaurants) as restaurants_count;
SELECT (SELECT COUNT(*) FROM categories) as categories_count;
SELECT (SELECT COUNT(*) FROM users) as users_count;