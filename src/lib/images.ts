// src/lib/images.ts
// Локальные изображения - работают без интернета!

import Image from 'next/image';

// Базовые цвета для категорий
export const categoryColors: Record<string, string> = {
  'Завтраки': '#FFF3E0',
  'Обеды': '#FFE0B2', 
  'Ужины': '#FFCC80',
  'Напитки': '#E3F2FD',
  'Роллы': '#FCE4EC',
  'Суши': '#F8BBD0',
  'Закуски': '#E8F5E9',
  'Пицца': '#FFEBEE',
};

// Эмодзи для категорий
export const categoryEmojis: Record<string, string> = {
  'Завтраки': '🍳',
  'Обеды': '🍲',
  'Ужины': '🍽️',
  'Напитки': '☕',
  'Роллы': '🍣',
  'Суши': '🍱',
  'Закуски': '🥗',
  'Пицца': '🍕',
};

// Эмодзи для блюд по названию
export const dishEmojis: Record<string, string> = {
  // Пельмени
  'пельмен': '🥟',
  'блин': '🥞',
  'омлет': '🍳',
  'каша': '🥣',
  'вареник': '🥟',
  'борщ': '🍲',
  'щи': '🥬',
  'солянка': '🍜',
  'котлета': '🥩',
  'голубец': '🥙',
  'компот': '🍎',
  'чай': '☕',
  
  // Суши
  'филадельфия': '🍣',
  'калифорния': '🍣',
  'ролл': '🍣',
  'суши': '🍱',
  'салат': '🥗',
  'темпура': '🍤',
  
  // Пицца
  'пицца': '🍕',
  'маргарита': '🍕',
  'пепперони': '🍕',
  'гайская': '🍕',
  'чесночн': '🥖',
  'картофел': '🍟',
  'капучин': '☕',
  'лимонад': '🥤',
};

// Получить цвет категории
export function getCategoryColor(category: string): string {
  return categoryColors[category] || '#F5F5F5';
}

// Получить эмодзи категории
export function getCategoryEmoji(category: string): string {
  return categoryEmojis[category] || '🍽️';
}

// Получить эмодзи блюда по названию
export function getDishEmoji(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, emoji] of Object.entries(dishEmojis)) {
    if (lower.includes(key)) return emoji;
  }
  return '🍴';
}

// Компонент для отображения изображения блюда
interface DishImageProps {
  name: string;
  category?: string;
  size?: number;
}

export function DishPlaceholder({ name, category, size = 200 }: DishImageProps) {
  const emoji = getDishEmoji(name) || getCategoryEmoji(category || '');
  const color = getCategoryColor(category || '');
  
  return (
    <div 
      className="flex items-center justify-center"
      style={{
        width: size,
        height: size * 0.75,
        backgroundColor: color,
        borderRadius: '12px',
        fontSize: size * 0.4,
      }}
    >
      {emoji}
    </div>
  );
}

// Компонент для логотипа ресторана
interface RestaurantLogoProps {
  name: string;
  size?: number;
}

const restaurantEmojis: Record<string, string> = {
  'Пельменная': '🥟',
  'Sushi': '🍣',
  'Pizza': '🍕',
  ' Napoli': '🍕',
};

export function RestaurantLogo({ name, size = 80 }: RestaurantLogoProps) {
  let emoji = '🍽️';
  for (const [key, e] of Object.entries(restaurantEmojis)) {
    if (name.toLowerCase().includes(key.toLowerCase())) {
      emoji = e;
      break;
    }
  }
  
  return (
    <div 
      className="flex items-center justify-center bg-white rounded-xl shadow-sm"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.5,
      }}
    >
      {emoji}
    </div>
  );
}

// Дефолтное изображение для ресторана
export function getDefaultRestaurantImage(slug: string): string {
  // Используем эмодзи как дефолтное изображение
  // В реальном приложении здесь будет URL на Supabase Storage
  return ''; // Пустая строка - будет использован placeholder
}

// Функция для получения URL изображения
export function getImageUrl(table: 'restaurants' | 'menu_items', id: string, field: string = 'image'): string | null {
  // Позже добавим загрузку в Supabase Storage
  // Пока возвращает null и используется placeholder
  return null;
}

export default {
  getCategoryColor,
  getCategoryEmoji,
  getDishEmoji,
  DishPlaceholder,
  RestaurantLogo,
};