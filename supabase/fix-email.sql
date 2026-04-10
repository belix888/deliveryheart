-- Сделать email необязательным для регистрации по телефону
ALTER TABLE users ALTER COLUMN email DROP NOT NULL;

-- Также можно обновить существующие записи
UPDATE users SET email = CONCAT(phone, '@phone.local') WHERE email IS NULL AND phone IS NOT NULL;

SELECT 'Готово! Email теперь необязательный' as result;