"use client";

import React from "react";
import { Package, DollarSign, Star } from "lucide-react";

// =====================================================
// TYPES
// =====================================================

interface CourierStatsProps {
  stats: {
    orders_completed: number;
    total_earnings: number;
    total_distance_km: number;
  };
  label: string;
}

// =====================================================
// COURIER STATS COMPONENT
// =====================================================

export function CourierStats({ stats, label }: CourierStatsProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU").format(price || 0) + " ₽";
  };

  return (
    <div className="bg-[#F5F3F0] dark:bg-[#2D2A26] rounded-2xl p-6">
      <h3 className="text-sm font-medium text-[#2D2A26]/60 dark:text-[#E8E6E3]/60 mb-4">
        {label}
      </h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[#2D2A26]/60 dark:text-[#E8E6E3]/60 flex items-center gap-2">
            <Package className="w-4 h-4" />
            Заказов
          </span>
          <span className="font-semibold text-[#2D2A26] dark:text-[#E8E6E3]">
            {stats.orders_completed || 0}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#2D2A26]/60 dark:text-[#E8E6E3]/60 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Заработок
          </span>
          <span className="font-semibold text-green-500">
            {formatPrice(stats.total_earnings || 0)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#2D2A26]/60 dark:text-[#E8E6E3]/60 flex items-center gap-2">
            <Star className="w-4 h-4" />
            Км
          </span>
          <span className="font-semibold text-[#2D2A26] dark:text-[#E8E6E3]">
            {stats.total_distance_km?.toFixed(1) || "0.0"} км
          </span>
        </div>
      </div>
    </div>
  );
}

export default CourierStats;