-- Добавление поля role в таблицу users
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;

-- Роли: user, moderator, admin, restaurant_admin

-- Обновляем существующего демо-пользователя
UPDATE users SET role = 'admin' WHERE email = 'demo@example.com';

-- Создаём таблицу модераторов/админов
CREATE TABLE IF NOT EXISTS admin_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL DEFAULT 'moderator',
    level VARCHAR(20) DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- Добавляем права для admin_roles
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

-- Политики RLS для admin_roles
CREATE POLICY "admin_roles_select" ON admin_roles FOR SELECT USING (TRUE);
CREATE POLICY "admin_roles_insert" ON admin_roles FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "admin_roles_update" ON admin_roles FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "admin_roles_delete" ON admin_roles FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

SELECT 'Готово! Роли добавлены' as result;