"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  Clock,
  MapPin,
  Heart,
  Settings,
  LogOut,
  Moon,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const orders = [
  {
    id: "2847",
    date: "09.04.2026",
    status: "delivered",
    total: 1250,
    restaurant: "Пельменная №1",
  },
  {
    id: "2834",
    date: "07.04.2026",
    status: "delivered",
    total: 890,
    restaurant: "Sushi Master",
  },
  {
    id: "2819",
    date: "05.04.2026",
    status: "delivered",
    total: 1560,
    restaurant: "Pizza Napoli",
  },
];

const ProfilePage: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<
    "orders" | "favorites" | "addresses" | "settings"
  >("orders");

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      accepted: "Принят",
      preparing: "Готовится",
      onTheWay: "В пути",
      delivered: "Доставлен",
    };
    return labels[status] || status;
  };

  return (
    <div className="animate-fade-in">
      <div className="px-4 py-4">
        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 rounded-full bg-primary/20 dark:bg-primary-dark/20 flex items-center justify-center">
            <User className="w-10 h-10 text-primary dark:text-primary-dark" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold">Анна К.</h1>
            <p className="text-[#2D2A26]/60 dark:text-[#E8E6E3]/60">
              +7 (999) 123-45-67
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-6">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-sm whitespace-nowrap transition-all ${
              activeTab === "orders"
                ? "bg-primary dark:bg-primary-dark text-white"
                : "bg-[#F5F3F0] dark:bg-[#2D2A26] text-[#2D2A26] dark:text-[#E8E6E3] hover:bg-[#E8E6E3] dark:hover:bg-[#3D3A36]"
            }`}
          >
            <Clock className="w-4 h-4" />
            Заказы
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-sm whitespace-nowrap transition-all ${
              activeTab === "favorites"
                ? "bg-primary dark:bg-primary-dark text-white"
                : "bg-[#F5F3F0] dark:bg-[#2D2A26] text-[#2D2A26] dark:text-[#E8E6E3] hover:bg-[#E8E6E3] dark:hover:bg-[#3D3A36]"
            }`}
          >
            <Heart className="w-4 h-4" />
            Избранное
          </button>
          <button
            onClick={() => setActiveTab("addresses")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-sm whitespace-nowrap transition-all ${
              activeTab === "addresses"
                ? "bg-primary dark:bg-primary-dark text-white"
                : "bg-[#F5F3F0] dark:bg-[#2D2A26] text-[#2D2A26] dark:text-[#E8E6E3] hover:bg-[#E8E6E3] dark:hover:bg-[#3D3A36]"
            }`}
          >
            <MapPin className="w-4 h-4" />
            Адреса
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-sm whitespace-nowrap transition-all ${
              activeTab === "settings"
                ? "bg-primary dark:bg-primary-dark text-white"
                : "bg-[#F5F3F0] dark:bg-[#2D2A26] text-[#2D2A26] dark:text-[#E8E6E3] hover:bg-[#E8E6E3] dark:hover:bg-[#3D3A36]"
            }`}
          >
            <Settings className="w-4 h-4" />
            Настройки
          </button>
        </div>

        {/* Content */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-[#2D2A26] rounded-2xl p-4 border border-[#F5F3F0] dark:border-[#3D3A36]"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Заказ #{order.id}</span>
                  <span className="text-sm text-[#2D2A26]/50 dark:text-[#E8E6E3]/50">
                    {order.date}
                  </span>
                </div>
                <p className="text-sm text-[#2D2A26]/70 dark:text-[#E8E6E3]/70 mb-2">
                  {order.restaurant}
                </p>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                    {getStatusLabel(order.status)}
                  </span>
                  <span className="font-semibold">{order.total} ₽</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "favorites" && (
          <div className="text-center py-12">
            <Heart className="w-12 h-12 text-[#2D2A26]/30 dark:text-[#E8E6E3]/30 mx-auto mb-4" />
            <p className="text-[#2D2A26]/60 dark:text-[#E8E6E3]/60">
              У вас пока нет избранных заведений
            </p>
          </div>
        )}

        {activeTab === "addresses" && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-[#2D2A26] rounded-2xl p-4 border border-[#F5F3F0] dark:border-[#3D3A36]">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary dark:text-primary-dark" />
                <div>
                  <p className="font-semibold">Дом</p>
                  <p className="text-sm text-[#2D2A26]/60 dark:text-[#E8E6E3]/60">
                    ул. Ленина, 42, кв. 15
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-[#2D2A26] rounded-2xl p-4 border border-[#F5F3F0] dark:border-[#3D3A36]">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary dark:text-primary-dark" />
                <div>
                  <p className="font-semibold">Работа</p>
                  <p className="text-sm text-[#2D2A26]/60 dark:text-[#E8E6E3]/60">
                    ул. Пушкина, 10, офис 205
                  </p>
                </div>
              </div>
            </div>
            <button className="w-full py-3 text-primary dark:text-primary-dark font-medium text-center border-2 border-dashed border-primary/30 dark:border-primary-dark/30 rounded-xl hover:bg-primary/5 dark:hover:bg-primary-dark/5 transition-colors">
              + Добавить адрес
            </button>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-[#2D2A26] rounded-2xl p-4 border border-[#F5F3F0] dark:border-[#3D3A36]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Moon className="w-5 h-5 text-[#2D2A26] dark:text-[#E8E6E3]" />
                  <span className="font-medium">Тёмная тема</span>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    isDark
                      ? "bg-primary dark:bg-primary-dark"
                      : "bg-[#F5F3F0] dark:bg-[#3D3A36]"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      isDark ? "left-7" : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            <button className="w-full py-4 px-4 bg-white dark:bg-[#2D2A26] rounded-2xl border border-[#F5F3F0] dark:border-[#3D3A36] text-left font-medium hover:bg-[#F5F3F0] dark:hover:bg-[#3D3A36] transition-colors">
              Уведомления
            </button>
            <button className="w-full py-4 px-4 bg-white dark:bg-[#2D2A26] rounded-2xl border border-[#F5F3F0] dark:border-[#3D3A36] text-left font-medium hover:bg-[#F5F3F0] dark:hover:bg-[#3D3A36] transition-colors">
              Способ оплаты
            </button>
            <button className="w-full py-4 px-4 bg-white dark:bg-[#2D2A26] rounded-2xl border border-[#F5F3F0] dark:border-[#3D3A36] text-left font-medium hover:bg-[#F5F3F0] dark:hover:bg-[#3D3A36] transition-colors">
              Помощь
            </button>

            <button className="w-full py-4 px-4 bg-red-50 dark:bg-red-900/20 rounded-2xl text-red-600 dark:text-red-400 font-medium flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
              <LogOut className="w-5 h-5" />
              Выйти
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;