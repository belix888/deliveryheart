export interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  cuisines: string[];
  isPromoted: boolean;
  priceRange: string;
}

export interface Dish {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface CartItem {
  dish: Dish;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  address: string;
  createdAt: Date;
  estimatedTime: string;
}

export type OrderStatus = "accepted" | "preparing" | "onTheWay" | "delivered";

export type Category = "Завтраки" | "Обеды" | "Ужины" | "Напитки" | "Выпечка";

export interface User {
  id: string;
  name: string;
  email: string;
  addresses: string[];
  favorites: string[];
}