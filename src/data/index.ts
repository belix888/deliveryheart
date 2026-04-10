import { Restaurant, Dish, Category } from "@/types";

export const categories: Category[] = [
  "Завтраки",
  "Обеды",
  "Ужины",
  "Напитки",
  "Выпечка",
];

export const restaurants: Restaurant[] = [
  {
    id: "1",
    name: "Пельменная №1",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a446ae?w=400&h=300&fit=crop",
    rating: 4.8,
    reviewCount: 234,
    deliveryTime: "25-35 мин",
    cuisines: ["Русская", "Домашняя"],
    isPromoted: true,
    priceRange: "₽₽",
  },
  {
    id: "2",
    name: "Sushi Master",
    image:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop",
    rating: 4.9,
    reviewCount: 567,
    deliveryTime: "30-40 мин",
    cuisines: ["Японская", "Суши"],
    isPromoted: false,
    priceRange: "₽₽₽",
  },
  {
    id: "3",
    name: "Pizza Napoli",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a446ae?w=400&h=300&fit=crop",
    rating: 4.7,
    reviewCount: 189,
    deliveryTime: "20-30 мин",
    cuisines: ["Итальянская", "Пицца"],
    isPromoted: true,
    priceRange: "₽₽",
  },
  {
    id: "4",
    name: "Burger House",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    rating: 4.6,
    reviewCount: 412,
    deliveryTime: "15-25 мин",
    cuisines: ["Американская", "Бургеры"],
    isPromoted: false,
    priceRange: "₽₽",
  },
  {
    id: "5",
    name: "Шаурма Кинг",
    image:
      "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&h=300&fit=crop",
    rating: 4.5,
    reviewCount: 892,
    deliveryTime: "15-20 мин",
    cuisines: ["Кавказская", "Шаурма"],
    isPromoted: true,
    priceRange: "₽",
  },
  {
    id: "6",
    name: "Вкус Китая",
    image:
      "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=300&fit=crop",
    rating: 4.7,
    reviewCount: 321,
    deliveryTime: "35-45 мин",
    cuisines: ["Китайская", "Азиатская"],
    isPromoted: false,
    priceRange: "₽₽",
  },
];

export const dishes: Dish[] = [
  {
    id: "d1",
    restaurantId: "1",
    name: "Пельмени классические",
    description: "Сочная домашняя начинка из свинины и говядины, тонкое тесто",
    price: 250,
    image:
      "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=300&h=200&fit=crop",
    category: "Обеды",
  },
  {
    id: "d2",
    restaurantId: "1",
    name: "Вареники с картошкой",
    description: "Нежные вареники с золотистой картошкой и шкварками",
    price: 220,
    image:
      "https://images.unsplash.com/photo-1595303099727-39d6938c3f2f?w=300&h=200&fit=crop",
    category: "Обеды",
  },
  {
    id: "d3",
    restaurantId: "1",
    name: "Блины со сметаной",
    description: "Ажурные блины с домашней сметаной и сливочным маслом",
    price: 180,
    image:
      "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=300&h=200&fit=crop",
    category: "Завтраки",
  },
  {
    id: "d4",
    restaurantId: "1",
    name: "Солянка",
    description: "Наваристый суп с колбасой, огурцами и маслинами",
    price: 290,
    image:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&h=200&fit=crop",
    category: "Обеды",
  },
  {
    id: "d5",
    restaurantId: "2",
    name: "Филадельфия",
    description: "Лосось, сливочный сыр, огурец - классический ролл",
    price: 450,
    image:
      "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=200&fit=crop",
    category: "Обеды",
  },
  {
    id: "d6",
    restaurantId: "2",
    name: "Калифорния",
    description: "Краб (имитация), авокадо, икра тобико",
    price: 380,
    image:
      "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=300&h=200&fit=crop",
    category: "Обеды",
  },
  {
    id: "d7",
    restaurantId: "2",
    name: "Мисо суп",
    description:
      "Традиционный японский суп с тофу, водорослями и зеленым луком",
    price: 180,
    image:
      "https://images.unsplash.com/photo-1560672641-237c66a735aa?w=300&h=200&fit=crop",
    category: "Напитки",
  },
  {
    id: "d8",
    restaurantId: "3",
    name: "Маргарита",
    description:
      "Томатный соус, моцарелла, базилик - классика итальянской пиццы",
    price: 590,
    image:
      "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=300&h=200&fit=crop",
    category: "Обеды",
  },
  {
    id: "d9",
    restaurantId: "3",
    name: "Пепперони",
    description: "Острая колбаса пепперони, моцарелла, томатный соус",
    price: 650,
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&h=200&fit=crop",
    category: "Обеды",
  },
  {
    id: "d10",
    restaurantId: "3",
    name: "Четыре сыра",
    description: "Моцарелла, пармезан, чеддер, дорблю",
    price: 750,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=200&fit=crop",
    category: "Ужины",
  },
  {
    id: "d11",
    restaurantId: "4",
    name: "Классический бургер",
    description: "Сочная говяжья котлета, сыр, лук, помидор, зелень",
    price: 320,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop",
    category: "Обеды",
  },
  {
    id: "d12",
    restaurantId: "4",
    name: "Чизбургер",
    description: "Двойная котлета, двойной сыр, хрустящий лук",
    price: 380,
    image:
      "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=300&h=200&fit=crop",
    category: "Обеды",
  },
  {
    id: "d13",
    restaurantId: "5",
    name: "Шаурма классическая",
    description: "Сочное мясо, свежие овощи, фирменный соус в лаваше",
    price: 250,
    image:
      "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=300&h=200&fit=crop",
    category: "Обеды",
  },
  {
    id: "d14",
    restaurantId: "5",
    name: "Шаурма двойная",
    description: "Увеличенная порция с двойной порцией мяса",
    price: 350,
    image:
      "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=300&h=200&fit=crop",
    category: "Ужины",
  },
  {
    id: "d15",
    restaurantId: "6",
    name: "Курица в кисло-сладком соусе",
    description: "Нежная курица с овощами в фирменном соусе",
    price: 340,
    image:
      "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=300&h=200&fit=crop",
    category: "Обеды",
  },
  {
    id: "d16",
    restaurantId: "6",
    name: "Удон с говядиной",
    description: "Пшеничная лапша с сочной говядиной и овощами",
    price: 360,
    image:
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300&h=200&fit=crop",
    category: "Ужины",
  },
];

export const getDishesByRestaurant = (restaurantId: string): Dish[] => {
  return dishes.filter((dish) => dish.restaurantId === restaurantId);
};

export const getRestaurantById = (id: string): Restaurant | undefined => {
  return restaurants.find((r) => r.id === id);
};