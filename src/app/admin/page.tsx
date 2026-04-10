"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Star,
  Clock,
  Package,
  AlertCircle,
} from "lucide-react";

const stats = [
  {
    title: "Заказы сегодня",
    value: "47",
    change: "+12%",
    isPositive: true,
    icon: ShoppingCart,
    color: "primary",
  },
  {
    title: "Выручка сегодня",
    value: "32 450 ₽",
    change: "+8%",
    isPositive: true,
    icon: DollarSign,
    color: "green",
  },
  {
    title: "Новые пользователи",
    value: "12",
    change: "+25%",
    isPositive: true,
    icon: Users,
    color: "blue",
  },
  {
    title: "Средний чек",
    value: "690 ₽",
    change: "-3%",
    isPositive: false,
    icon: TrendingUp,
    color: "orange",
  },
];

const recentOrders = [
  { id: "#2847", restaurant: "Пельменная №1", user: "Анна К.", total: 1250, status: "preparing" },
  { id: "#2846", restaurant: "Sushi Master", user: "Иван П.", total: 2340, status: "delivering" },
  { id: "#2845", restaurant: "Pizza Napoli", user: "Мария С.", total: 890, status: "delivered" },
  { id: "#2844", restaurant: "Burger House", user: "Алексей Д.", total: 1560, status: "pending" },
  { id: "#2843", restaurant: "Пельменная №1", user: "Елена В.", total: 780, status: "delivered" },
];

const topRestaurants = [
  { name: "Пельменная №1", orders: 145, rating: 4.8 },
  { name: "Sushi Master", orders: 98, rating: 4.9 },
  { name: "Pizza Napoli", orders: 87, rating: 4.7 },
  { name: "Burger House", orders: 76, rating: 4.6 },
];

const topDishes = [
  { name: "Пельмени классические", restaurant: "Пельменная №1", orders: 234 },
  { name: "Филадельфия", restaurant: "Sushi Master", orders: 189 },
  { name: "Маргарита", restaurant: "Pizza Napoli", orders: 156 },
  { name: "Классический бургер", restaurant: "Burger House", orders: 134 },
];

const notifications = [
  { type: "order", text: "Новый заказ #2848 от Петра А.", time: "2 мин назад" },
  { type: "review", text: "Новый отзыв на ресторан Pizza Napoli", time: "15 мин назад" },
  { type: "alert", text: "Заканчиваются ингредиенты в Sushi Master", time: "1 час назад" },
];

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    confirmed: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    preparing: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
    ready: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    delivering: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
    delivered: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  };
  return colors[status] || colors.pending;
};

const AdminDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState("week");

  return (
    <div className="animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses: Record<string, string> = {
            primary: "bg-primary/10 dark:bg-primary-dark/10 text-primary dark:text-primary-dark",
            green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
            blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
            orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
          };
          
          return (
            <div
              key={index}
              className="bg-white dark:bg-[#2D2A26] rounded-2xl p-5 border border-[#F5F3F0] dark:border-[#3D3A36]"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${colorClasses[stat.color]}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className={`flex items-center gap-1 text-sm ${stat.isPositive ? "text-green-600" : "text-red-600"}`}>
                  {stat.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {stat.change}
                </div>
              </div>
              <p className="text-2xl font-bold text-[#2D2A26] dark:text-[#E8E6E3] mb-1">{stat.value}</p>
              <p className="text-sm text-[#2D2A26]/60 dark:text-[#E8E6E3]/60">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Orders Chart */}
        <div className="bg-white dark:bg-[#2D2A26] rounded-2xl p-5 border border-[#F5F3F0] dark:border-[#3D3A36]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-lg">Заказы</h3>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-[#F5F3F0] dark:bg-[#3D3A36] text-sm"
            >
              <option value="week">За неделю</option>
              <option value="month">За месяц</option>
              <option value="year">За год</option>
            </select>
          </div>
          <div className="h-48 flex items-end justify-between gap-2">
            {[65, 45, 78, 52, 89, 67, 75].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-primary/20 dark:bg-primary-dark/20 rounded-t-lg relative group cursor-pointer"
                  style={{ height: `${height * 2}px` }}
                >
                  <div className="absolute bottom-0 left-0 right-0 bg-primary dark:bg-primary-dark rounded-t-lg transition-all group-hover:opacity-80" style={{ height: `${height * 1.5}px` }} />
                </div>
                <span className="text-xs text-[#2D2A26]/50 dark:text-[#E8E6E3]/50">
                  {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white dark:bg-[#2D2A26] rounded-2xl p-5 border border-[#F5F3F0] dark:border-[#3D3A36]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-lg">Выручка</h3>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-[#F5F3F0] dark:bg-[#3D3A36] text-sm"
            >
              <option value="week">За неделю</option>
              <option value="month">За месяц</option>
              <option value="year">За год</option>
            </select>
          </div>
          <div className="h-48 flex items-end justify-between gap-2">
            {[45, 62, 38, 75, 58, 82, 69].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-green-100 dark:bg-green-900/30 rounded-t-lg relative group cursor-pointer"
                  style={{ height: `${height * 2}px` }}
                >
                  <div className="absolute bottom-0 left-0 right-0 bg-green-500 rounded-t-lg transition-all group-hover:opacity-80" style={{ height: `${height * 1.5}px` }} />
                </div>
                <span className="text-xs text-[#2D2A26]/50 dark:text-[#E8E6E3]/50">
                  {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="bg-white dark:bg-[#2D2A26] rounded-2xl p-5 border border-[#F5F3F0] dark:border-[#3D3A36]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-lg">Последние заказы</h3>
            <Link href="/admin/orders" className="text-sm text-primary dark:text-primary-dark hover:opacity-80">
              Все →
            </Link>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-[#F5F3F0] dark:border-[#3D3A36] last:border-0">
                <div>
                  <p className="font-semibold text-sm">{order.id}</p>
                  <p className="text-xs text-[#2D2A26]/60 dark:text-[#E8E6E3]/60">{order.restaurant}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                    {order.status === "pending" && "Новый"}
                    {order.status === "preparing" && "Готовится"}
                    {order.status === "delivering" && "В пути"}
                    {order.status === "delivered" && "Доставлен"}
                  </span>
                  <p className="text-sm font-semibold mt-1">{order.total} ₽</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Restaurants */}
        <div className="bg-white dark:bg-[#2D2A26] rounded-2xl p-5 border border-[#F5F3F0] dark:border-[#3D3A36]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-lg">Топ ресторанов</h3>
            <Link href="/admin/restaurants" className="text-sm text-primary dark:text-primary-dark hover:opacity-80">
              Все →
            </Link>
          </div>
          <div className="space-y-3">
            {topRestaurants.map((restaurant, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-[#F5F3F0] dark:border-[#3D3A36] last:border-0">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 dark:bg-primary-dark/10 flex items-center justify-center text-xs font-bold text-primary dark:text-primary-dark">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-sm">{restaurant.name}</p>
                    <p className="text-xs text-[#2D2A26]/60 dark:text-[#E8E6E3]/60">{restaurant.orders} заказов</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" fill="#FFD700" />
                  <span className="text-sm font-semibold">{restaurant.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-[#2D2A26] rounded-2xl p-5 border border-[#F5F3F0] dark:border-[#3D3A36]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-lg">Уведомления</h3>
          </div>
          <div className="space-y-3">
            {notifications.map((notification, index) => (
              <div key={index} className="flex items-start gap-3 py-2 border-b border-[#F5F3F0] dark:border-[#3D3A36] last:border-0">
                <div className={`p-2 rounded-lg ${
                  notification.type === "order" ? "bg-primary/10 text-primary" :
                  notification.type === "review" ? "bg-yellow-100 text-yellow-600" :
                  "bg-red-100 text-red-600"
                }`}>
                  {notification.type === "order" && <Package className="w-4 h-4" />}
                  {notification.type === "review" && <Star className="w-4 h-4" />}
                  {notification.type === "alert" && <AlertCircle className="w-4 h-4" />}
                </div>
                <div>
                  <p className="text-sm">{notification.text}</p>
                  <p className="text-xs text-[#2D2A26]/50 dark:text-[#E8E6E3]/50 mt-1">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Dishes */}
      <div className="mt-6 bg-white dark:bg-[#2D2A26] rounded-2xl p-5 border border-[#F5F3F0] dark:border-[#3D3A36]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-lg">Популярные блюда</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {topDishes.map((dish, index) => (
            <div key={index} className="p-4 bg-[#F5F3F0] dark:bg-[#3D3A36] rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-8 h-8 rounded-full bg-primary/20 dark:bg-primary-dark/20 flex items-center justify-center text-sm font-bold text-primary dark:text-primary-dark">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{dish.name}</p>
                  <p className="text-xs text-[#2D2A26]/60 dark:text-[#E8E6E3]/60 truncate">{dish.restaurant}</p>
                </div>
              </div>
              <p className="text-lg font-bold text-primary dark:text-primary-dark">{dish.orders} заказов</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;