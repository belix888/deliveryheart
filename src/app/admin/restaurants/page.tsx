"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  ToggleLeft,
  ToggleRight,
  Star,
  Clock,
  MapPin,
  Phone,
  Image,
  DollarSign,
} from "lucide-react";

const restaurants = [
  {
    id: "1",
    name: "Пельменная №1",
    slug: "pelmennaya-1",
    description: "Уютное место с домашними пельменями и варениками",
    logo: "https://images.unsplash.com/photo-1565299624946-b28f40a446ae?w=100&h=100&fit=crop",
    cover: "https://images.unsplash.com/photo-1565299624946-b28f40a446ae?w=800&h=300&fit=crop",
    address: "ул. Ленина, 25",
    phone: "+7 (48336) 2-12-34",
    city: "Сураж",
    rating: 4.8,
    reviewCount: 234,
    ordersCount: 145,
    revenue: 125600,
    deliveryTimeMin: 25,
    deliveryTimeMax: 35,
    deliveryPrice: 50,
    minOrder: 300,
    isActive: true,
    workingHours: { monday: "09:00-21:00", tuesday: "09:00-21:00", wednesday: "09:00-21:00", thursday: "09:00-21:00", friday: "09:00-22:00", saturday: "10:00-22:00", sunday: "10:00-21:00" },
  },
  {
    id: "2",
    name: "Sushi Master",
    slug: "sushi-master",
    description: "Свежие роллы и суши от лучших поваров",
    logo: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=100&h=100&fit=crop",
    cover: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&h=300&fit=crop",
    address: "ул. Пушкина, 10",
    phone: "+7 (48336) 2-56-78",
    city: "Сураж",
    rating: 4.9,
    reviewCount: 567,
    ordersCount: 98,
    revenue: 189400,
    deliveryTimeMin: 30,
    deliveryTimeMax: 40,
    deliveryPrice: 70,
    minOrder: 500,
    isActive: true,
    workingHours: { monday: "10:00-22:00", tuesday: "10:00-22:00", wednesday: "10:00-22:00", thursday: "10:00-22:00", friday: "10:00-23:00", saturday: "11:00-23:00", sunday: "11:00-22:00" },
  },
  {
    id: "3",
    name: "Pizza Napoli",
    slug: "pizza-napoli",
    description: "Итальянская пицца из настоящей печи",
    logo: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop",
    cover: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=300&fit=crop",
    address: "ул. Советская, 15",
    phone: "+7 (48336) 2-90-12",
    city: "Сураж",
    rating: 4.7,
    reviewCount: 189,
    ordersCount: 87,
    revenue: 98700,
    deliveryTimeMin: 20,
    deliveryTimeMax: 30,
    deliveryPrice: 40,
    minOrder: 400,
    isActive: true,
    workingHours: { monday: "11:00-21:00", tuesday: "11:00-21:00", wednesday: "11:00-21:00", thursday: "11:00-21:00", friday: "11:00-22:00", saturday: "12:00-22:00", sunday: "12:00-21:00" },
  },
  {
    id: "4",
    name: "Burger House",
    slug: "burger-house",
    description: "Сочные бургеры и картофель фри",
    logo: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop",
    cover: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=300&fit=crop",
    address: "ул. Гагарина, 8",
    phone: "+7 (48336) 2-34-56",
    city: "Сураж",
    rating: 4.6,
    reviewCount: 412,
    ordersCount: 76,
    revenue: 65400,
    deliveryTimeMin: 15,
    deliveryTimeMax: 25,
    deliveryPrice: 30,
    minOrder: 250,
    isActive: false,
    workingHours: { monday: "10:00-22:00", tuesday: "10:00-22:00", wednesday: "10:00-22:00", thursday: "10:00-22:00", friday: "10:00-23:00", saturday: "11:00-23:00", sunday: "11:00-22:00" },
  },
];

const RestaurantsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<typeof restaurants[0] | null>(null);

  const filteredRestaurants = restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleActive = (id: string) => {
    console.log(`Toggle restaurant ${id}`);
  };

  const openEdit = (restaurant: typeof restaurants[0]) => {
    setEditingRestaurant(restaurant);
    setShowModal(true);
  };

  const openCreate = () => {
    setEditingRestaurant(null);
    setShowModal(true);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Рестораны</h1>
          <p className="text-[#2D2A26]/60 dark:text-[#E8E6E3]/60">Управление заведениями</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary dark:bg-primary-dark text-white rounded-xl hover:opacity-90"
        >
          <Plus className="w-4 h-4" />
          Добавить ресторан
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2D2A26]/40" />
        <input
          type="text"
          placeholder="Поиск по названию или адресу..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-[#2D2A26] border border-[#F5F3F0] dark:border-[#3D3A36] focus:border-primary dark:focus:border-primary-dark focus:outline-none"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRestaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className={`bg-white dark:bg-[#2D2A26] rounded-2xl border border-[#F5F3F0] dark:border-[#3D3A36] overflow-hidden ${!restaurant.isActive ? "opacity-60" : ""}`}
          >
            {/* Cover */}
            <div className="relative h-32 bg-[#F5F3F0] dark:bg-[#3D3A36]">
              <img
                src={restaurant.cover}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                <button
                  onClick={() => toggleActive(restaurant.id)}
                  className={`p-2 rounded-full ${restaurant.isActive ? "bg-green-500" : "bg-gray-400"}`}
                >
                  {restaurant.isActive ? (
                    <ToggleRight className="w-5 h-5 text-white" />
                  ) : (
                    <ToggleLeft className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>
              <div className="absolute -bottom-8 left-4">
                <img
                  src={restaurant.logo}
                  alt={restaurant.name}
                  className="w-16 h-16 rounded-xl border-4 border-white dark:border-[#2D2A26] object-cover"
                />
              </div>
            </div>

            {/* Content */}
            <div className="pt-10 p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-display font-semibold text-lg">{restaurant.name}</h3>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" fill="#FFD700" />
                  <span className="font-semibold">{restaurant.rating}</span>
                </div>
              </div>
              
              <p className="text-sm text-[#2D2A26]/60 dark:text-[#E8E6E3]/60 mb-3 line-clamp-2">
                {restaurant.description}
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-[#2D2A26]/70 dark:text-[#E8E6E3]/70">
                  <MapPin className="w-4 h-4" />
                  {restaurant.address}
                </div>
                <div className="flex items-center gap-2 text-[#2D2A26]/70 dark:text-[#E8E6E3]/70">
                  <Phone className="w-4 h-4" />
                  {restaurant.phone}
                </div>
                <div className="flex items-center gap-2 text-[#2D2A26]/70 dark:text-[#E8E6E3]/70">
                  <Clock className="w-4 h-4" />
                  {restaurant.deliveryTimeMin}-{restaurant.deliveryTimeMax} мин
                </div>
                <div className="flex items-center gap-2 text-[#2D2A26]/70 dark:text-[#E8E6E3]/70">
                  <DollarSign className="w-4 h-4" />
                  доставка: {restaurant.deliveryPrice} ₽, мин: {restaurant.minOrder} ₽
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#F5F3F0] dark:border-[#3D3A36]">
                <div className="text-center">
                  <p className="text-lg font-bold text-primary dark:text-primary-dark">{restaurant.ordersCount}</p>
                  <p className="text-xs text-[#2D2A26]/50">заказов</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-green-600">{restaurant.revenue.toLocaleString()} ₽</p>
                  <p className="text-xs text-[#2D2A26]/50">выручка</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold">{restaurant.reviewCount}</p>
                  <p className="text-xs text-[#2D2A26]/50">отзывов</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-4">
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#F5F3F0] dark:bg-[#3D3A36] rounded-lg hover:opacity-80">
                  <Eye className="w-4 h-4" />
                  Меню
                </button>
                <button
                  onClick={() => openEdit(restaurant)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#F5F3F0] dark:bg-[#3D3A36] rounded-lg hover:opacity-80"
                >
                  <Edit className="w-4 h-4" />
                  Изменить
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-[#2D2A26] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#F5F3F0] dark:border-[#3D3A36]">
              <h2 className="text-xl font-display font-bold">
                {editingRestaurant ? "Редактирование ресторана" : "Добавление ресторана"}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Название</label>
                  <input
                    type="text"
                    defaultValue={editingRestaurant?.name}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F3F0] dark:bg-[#3D3A36] border-0 focus:ring-2 focus:ring-primary"
                    placeholder="Название ресторана"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Slug (URL)</label>
                  <input
                    type="text"
                    defaultValue={editingRestaurant?.slug}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F3F0] dark:bg-[#3D3A36] border-0 focus:ring-2 focus:ring-primary"
                    placeholder="pelmennaya-1"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Описание</label>
                <textarea
                  defaultValue={editingRestaurant?.description}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F5F3F0] dark:bg-[#3D3A36] border-0 focus:ring-2 focus:ring-primary"
                  placeholder="Описание ресторана"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Адрес</label>
                  <input
                    type="text"
                    defaultValue={editingRestaurant?.address}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F3F0] dark:bg-[#3D3A36] border-0 focus:ring-2 focus:ring-primary"
                    placeholder="ул. Ленина, 25"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Телефон</label>
                  <input
                    type="text"
                    defaultValue={editingRestaurant?.phone}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F3F0] dark:bg-[#3D3A36] border-0 focus:ring-2 focus:ring-primary"
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Мин. время (мин)</label>
                  <input
                    type="number"
                    defaultValue={editingRestaurant?.deliveryTimeMin}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F3F0] dark:bg-[#3D3A36] border-0 focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Макс. время (мин)</label>
                  <input
                    type="number"
                    defaultValue={editingRestaurant?.deliveryTimeMax}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F3F0] dark:bg-[#3D3A36] border-0 focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Доставка (₽)</label>
                  <input
                    type="number"
                    defaultValue={editingRestaurant?.deliveryPrice}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F3F0] dark:bg-[#3D3A36] border-0 focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Мин. заказ (₽)</label>
                  <input
                    type="number"
                    defaultValue={editingRestaurant?.minOrder}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F3F0] dark:bg-[#3D3A36] border-0 focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">URL логотипа</label>
                <input
                  type="url"
                  defaultValue={editingRestaurant?.logo}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F5F3F0] dark:bg-[#3D3A36] border-0 focus:ring-2 focus:ring-primary"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">URL обложки</label>
                <input
                  type="url"
                  defaultValue={editingRestaurant?.cover}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F5F3F0] dark:bg-[#3D3A36] border-0 focus:ring-2 focus:ring-primary"
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="p-6 border-t border-[#F5F3F0] dark:border-[#3D3A36] flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2.5 bg-[#F5F3F0] dark:bg-[#3D3A36] rounded-xl"
              >
                Отмена
              </button>
              <button className="px-6 py-2.5 bg-primary dark:bg-primary-dark text-white rounded-xl hover:opacity-90">
                {editingRestaurant ? "Сохранить" : "Создать"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantsPage;