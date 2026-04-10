"use client";

import React, { useState } from "react";
import { BarChart3, TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Package } from "lucide-react";

const AnalyticsPage: React.FC = () => {
  const [period, setPeriod] = useState("month");

  const stats = [
    { label: "Заказы", value: "1 234", change: "+12%", positive: true, icon: ShoppingCart },
    { label: "Выручка", value: "856 780 ₽", change: "+8%", positive: true, icon: DollarSign },
    { label: "Средний чек", value: "694 ₽", change: "-3%", positive: false, icon: TrendingDown },
    { label: "Новые пользователи", value: "156", change: "+25%", positive: true, icon: Users },
  ];

  const ordersByRestaurant = [
    { name: "Пельменная №1", orders: 456, percent: 37 },
    { name: "Sushi Master", orders: 312, percent: 25 },
    { name: "Pizza Napoli", orders: 278, percent: 23 },
    { name: "Burger House", orders: 188, percent: 15 },
  ];

  const topUsers = [
    { name: "Елена В.", orders: 15, spent: 22450 },
    { name: "Анна К.", orders: 12, spent: 15680 },
    { name: "Иван П.", orders: 8, spent: 9840 },
    { name: "Мария С.", orders: 5, spent: 4320 },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div><h1 className="text-2xl font-display font-bold">Аналитика</h1><p className="text-[#2D2A26]/60">Статистика и отчёты</p></div>
        <select value={period} onChange={e => setPeriod(e.target.value)} className="px-4 py-2.5 rounded-xl bg-white border">
          <option value="week">За неделю</option>
          <option value="month">За месяц</option>
          <option value="year">За год</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white dark:bg-[#2D2A26] rounded-2xl p-5 border">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 bg-primary/10 rounded-xl"><Icon className="w-5 h-5 text-primary" /></div>
                <span className={`flex items-center gap-1 text-sm ${stat.positive ? "text-green-600" : "text-red-600"}`}>
                  {stat.positive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}{stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-[#2D2A26]/60">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#2D2A26] rounded-2xl p-5 border">
          <h3 className="font-display font-semibold text-lg mb-4">Заказы по ресторанам</h3>
          <div className="space-y-4">
            {ordersByRestaurant.map((r, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{r.name}</span>
                  <span className="text-sm text-[#2D2A26]/60">{r.orders} заказов</span>
                </div>
                <div className="h-3 bg-[#F5F3F0] rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${r.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-[#2D2A26] rounded-2xl p-5 border">
          <h3 className="font-display font-semibold text-lg mb-4">Топ пользователей</h3>
          <div className="space-y-3">
            {topUsers.map((u, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-[#F5F3F0] rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">{i + 1}</span>
                  <span className="font-medium">{u.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{u.orders} заказов</p>
                  <p className="text-sm text-green-600">{u.spent.toLocaleString()} ₽</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white dark:bg-[#2D2A26] rounded-2xl p-5 border">
        <h3 className="font-display font-semibold text-lg mb-4">Выручка по дням</h3>
        <div className="h-48 flex items-end justify-between gap-2">
          {[45, 62, 38, 75, 58, 82, 69, 55, 78, 45, 62, 88].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-green-100 rounded-t-lg relative group cursor-pointer" style={{ height: `${h * 2}px` }}>
                <div className="absolute bottom-0 left-0 right-0 bg-green-500 rounded-t-lg" style={{ height: `${h * 1.5}px` }} />
              </div>
              <span className="text-xs text-[#2D2A26]/50">{i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;