-- Обновление изображений в БД для использования локальных/Storage ссылок

-- Обновляем рестораны - убираем Unsplash ссылки
UPDATE restaurants SET 
  logo_url = CASE 
    WHEN slug = 'pelmennaya-1' THEN '/images/restaurants/pelmennaya-logo.png'
    WHEN slug = 'sushi-master' THEN '/images/restaurants/sushi-logo.png'
    WHEN slug = 'pizza-napoli' THEN '/images/restaurants/pizza-logo.png'
    ELSE logo_url
  END,
  cover_url = CASE 
    WHEN slug = 'pelmennaya-1' THEN '/images/restaurants/pelmennaya-cover.jpg'
    WHEN slug = 'sushi-master' THEN '/images/restaurants/sushi-cover.jpg'
    WHEN slug = 'pizza-napoli' THEN '/images/restaurants/pizza-cover.jpg'
    ELSE cover_url
  END
WHERE slug IN ('pelmennaya-1', 'sushi-master', 'pizza-napoli');

-- Создаём папку для изображений если не существует
-- Это загрузишь в Supabase Storage позже

SELECT 'Изображения обновлены!' as result;