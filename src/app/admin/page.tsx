"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  Package,
  Store,
  Truck,
  Clock,
  Loader2,
  AlertCircle,
} from "lucide-react";

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    confirmed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    preparing: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    ready: "bg-green-500/20 text-green-400 border-green-500/30",
    waiting_courier: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    in_delivery: "bg-primary/20 text-primary border-primary/30",
    delivered: "bg-green-500/20 text-green-400 border-green-500/30",
    cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  };
  return colors[status] || "bg-gray-500/20 text-gray-400";
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: "Новый",
    confirmed: "Подтверждён",
    preparing: "Готовится",
    ready: "Готов",
    waiting_courier: "Ждёт курьера",
    in_delivery: "В доставке",
    delivered: "Доставлен",
    cancelled: "Отменён",
  };
  return labels[status] || status;
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [couriers, setCouriers] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const today = new Date().toISOString().split("T")[0];

      // Заказы за сегодня
      const { data: allOrders } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      // Рестораны
      const { data: allRestaurants } = await supabase
        .from("restaurants")
        .select("id, name, is_available")
        .order("created_at", { ascending: false });

      // Курьеры
      const { data: allCouriers } = await supabase
        .from("couriers")
        .select("id, name, status, total_deliveries");

      // Пользователи
      const { data: authUsers } = await supabase.auth.admin.listUsers();

      setOrders(allOrders || []);
      setRestaurants(allRestaurants || []);
      setCouriers(allCouriers || []);
      setUsers(authUsers?.users || []);
    } catch (err: any) {
      console.error("[Dashboard] Error:", err);
      setError(err.message || "Ошибка загрузки данных");
    } finally {
      setIsLoading(false);
    }
  };

  // Рассчитай статистику
  const today = new Date().toISOString().split("T")[0];
  const todayOrders = orders.filter((o) => o.created_at?.startsWith(today));
  const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.final_amount || 0), 0);
  const avgCheck = todayOrders.length > 0 ? Math.round(todayRevenue / todayOrders.length) : 0;

  const activeRestaurants = restaurants.filter((r) => r.is_available).length;
  const onlineCouriers = couriers.filter((c) => c.status === "online").length;

  const stats = [
    {
      title: "Заказы сегодня",
      value: todayOrders.length.toString(),
      change: "+12%",
      isPositive: true,
      icon: ShoppingCart,
      color: "from-primary to-primary/80",
      bg: "bg-primary/10",
    },
    {
      title: "Выручка сегодня",
      value: `${todayRevenue.toLocaleString("ru-RU")} ₽`,
      change: "+8%",
      isPositive: true,
      icon: DollarSign,
      color: "from-green-500 to-green-600",
      bg: "bg-green-500/10",
    },
    {
      title: "Новые пользователи",
      value: users.length.toString(),
      change: "+25%",
      isPositive: true,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bg: "bg-blue-500/10",
    },
    {
      title: "Средний чек",
      value: `${avgCheck.toLocaleString("ru-RU")} ₽`,
      change: "-3%",
      isPositive: false,
      icon: TrendingUp,
      color: "from-amber-500 to-orange-600",
      bg: "bg-amber-500/10",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="p-5 rounded-2xl bg-[#111111] border border-[#222222] hover:border-[#333333] transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    stat.isPositive
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-sm text-gray-400">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Быстрые действия */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/orders"
          className="p-5 rounded-2xl bg-[#111111] border border-[#222222] hover:border-[#333333] transition-all flex items-center gap-4"
        >
          <div className="p-3 rounded-xl bg-blue-500/10">
            <Package className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="text-lg font-semibold text-white">
              {orders.filter((o) => o.status === "pending").length}
            </p>
            <p className="text-sm text-gray-400">Новых заказов</p>
          </div>
        </Link>

        <Link
          href="/admin/restaurants"
          className="p-5 rounded-2xl bg-[#111111] border border-[#222222] hover:border-[#333333] transition-all flex items-center gap-4"
        >
          <div className="p-3 rounded-xl bg-green-500/10">
            <Store className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <p className="text-lg font-semibold text-white">
              {activeRestaurants}/{restaurants.length}
            </p>
            <p className="text-sm text-gray-400">Ресторанов</p>
          </div>
        </Link>

        <Link
          href="/admin/couriers"
          className="p-5 rounded-2xl bg-[#111111] border border-[#222222] hover:border-[#333333] transition-all flex items-center gap-4"
        >
          <div className="p-3 rounded-xl bg-purple-500/10">
            <Truck className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <p className="text-lg font-semibold text-white">{onlineCouriers}</p>
            <p className="text-sm text-gray-400">Курьеров онлайн</p>
          </div>
        </Link>
      </div>

      {/* Последние заказы */}
      <div className="rounded-2xl bg-[#111111] border border-[#222222] overflow-hidden">
        <div className="p-4 border-b border-[#222222] flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Последние заказы</h2>
          <Link href="/admin/orders" className="text-sm text-primary hover:underline">
            Смотреть все →
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Пока нет заказов</p>
          </div>
        ) : (
          <div className="divide-y divide-[#222222]">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="p-4 flex items-center justify-between hover:bg-[#1a1a1a] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] flex items-center justify-center">
                    <Package className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      #{order.order_number || order.id.slice(0, 8)}
                    </p>
                    <p className="text-sm text-gray-400">
                      {new Date(order.created_at).toLocaleString("ru-RU", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                  <span className="text-white font-semibold">
                    {order.final_amount?.toLocaleString("ru-RU") || 0} ₽
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Топ ресторанов */}
      <div className="rounded-2xl bg-[#111111] border border-[#222222] overflow-hidden">
        <div className="p-4 border-b border-[#222222] flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Рестораны</h2>
          <Link
            href="/admin/restaurants"
            className="text-sm text-primary hover:underline"
          >
            Смотреть все →
          </Link>
        </div>

        {restaurants.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <Store className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Пока нет ресторанов</p>
          </div>
        ) : (
          <div className="divide-y divide-[#222222]">
            {restaurants.slice(0, 5).map((restaurant) => (
              <div
                key={restaurant.id}
                className="p-4 flex items-center justify-between hover:bg-[#1a1a1a] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] flex items-center justify-center">
                    <Store className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{restaurant.name}</p>
                    <p className="text-sm text-gray-400">
                      ID: {restaurant.id.slice(0, 8)}
                    </p>
                  </div>
                </div>
                <div
                  className={`w-2 h-2 rounded-full ${
                    restaurant.is_available ? "bg-green-500" : "bg-gray-500"
                  }`}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}