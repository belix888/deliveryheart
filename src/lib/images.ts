// src/lib/images.ts
// Локальные изображения - работают без интернета!
// Используем только функции, без JSX компонентов

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

// Эмодзи для ресторанов
const restaurantEmojis: Record<string, string> = {
  'Пельменная': '🥟',
  'Sushi': '🍣',
  'Pizza': '🍕',
  'Napoli': '🍕',
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

// Получить эмодзи ресторана
export function getRestaurantEmoji(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, emoji] of Object.entries(restaurantEmojis)) {
    if (lower.includes(key.toLowerCase())) return emoji;
  }
  return '🍽️';
}

// Функция для получения стилей placeholder блюда
export function getDishPlaceholderStyle(size: number) {
  return {
    width: size,
    height: size * 0.75,
    backgroundColor: '#F5F5F5',
    borderRadius: '12px',
    fontSize: size * 0.4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
}

// Функция для получения стилей placeholder ресторана
export function getRestaurantPlaceholderStyle(size: number) {
  return {
    width: size,
    height: size,
    backgroundColor: '#FFF3E0',
    borderRadius: '12px',
    fontSize: size * 0.5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
}

export default {
  getCategoryColor,
  getCategoryEmoji,
  getDishEmoji,
  getRestaurantEmoji,
  getDishPlaceholderStyle,
  getRestaurantPlaceholderStyle,
};