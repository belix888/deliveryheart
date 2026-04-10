"use client";

import React from "react";
import { BarChart3, TrendingUp, Users, DollarSign, Orders } from "lucide-react";

const AnalyticsPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-display font-bold mb-6">Аналитика</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Orders, label: "Заказы сегодня", value: "0", color: "bg-blue-100" },
          { icon: DollarSign, label: "Выручка", value: "0 ₽", color: "bg-green-100" },
          { icon: Users, label: "Новые клиенты", value: "0", color: "bg-purple-100" },
          { icon: TrendingUp, label: "Средний чек", value: "0 ₽", color: "bg-orange-100" },
        ].map((item, i) => (
          <div key={i} className={`${item.color} rounded-2xl p-6`}>
            <item.icon className="w-8 h-8 mb-2" />
            <p className="text-2xl font-bold">{item.value}</p>
            <p className="text-sm opacity-60">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#F5F3F0] dark:bg-[#2D2A26] rounded-2xl p-6 text-center opacity-60">
        <BarChart3 className="w-12 h-12 mx-auto mb-4" />
        <p>Аналитика скоро появится</p>
      </div>
    </div>
  );
};

export default AnalyticsPage;