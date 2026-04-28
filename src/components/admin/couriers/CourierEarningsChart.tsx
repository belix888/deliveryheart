"use client";

import React from "react";
import { DollarSign } from "lucide-react";

// =====================================================
// TYPES
// =====================================================

interface DailyEarnings {
  period_date: string;
  amount: number;
}

interface CourierEarningsChartProps {
  earnings: DailyEarnings[];
  title?: string;
}

// =====================================================
// COURIER EARNINGS CHART COMPONENT
// =====================================================

export function CourierEarningsChart({
  earnings,
  title = "Заработок по дням",
}: CourierEarningsChartProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU").format(price || 0) + " ₽";
  };

  const formatShortDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  // Generate chart data for last 7 days
  const generateChartData = () => {
    const days = [];
    const dayNames = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const dayName = dayNames[date.getDay()];

      const dayEarnings = earnings.find((e) => e.period_date === dateStr);

      days.push({
        day: dayName,
        date: dateStr,
        amount: dayEarnings?.amount || 0,
      });
    }

    return days;
  };

  const chartData = generateChartData();
  const maxEarnings = Math.max(...chartData.map((d) => d.amount), 1000);
  const totalEarnings = chartData.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="bg-[#F5F3F0] dark:bg-[#2D2A26] rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-[#2D2A26] dark:text-[#E8E6E3] mb-6">
        {title} (последние 7 дней)
      </h3>

      {/* Chart Bars */}
      <div className="flex items-end gap-2 h-40">
        {chartData.map((day, index) => (
          <div
            key={index}
            className="flex-1 flex flex-col items-center gap-2"
          >
            <div className="w-full flex items-end justify-center">
              <div
                className="w-full bg-primary dark:bg-primary-dark rounded-t-lg transition-all relative group"
                style={{
                  height: `${Math.max(
                    (day.amount / maxEarnings) * 100,
                    day.amount > 0 ? 4 : 0
                  )}%`,
                }}
              >
                {/* Tooltip */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#2D2A26] dark:bg-[#E8E6E3] text-white dark:text-[#2D2A26] px-2 py-1 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {formatPrice(day.amount)}
                </div>
              </div>
            </div>
            <span className="text-xs text-[#2D2A26]/60 dark:text-[#E8E6E3]/60">
              {day.day}
            </span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mt-6 flex items-center justify-center gap-2">
        <DollarSign className="w-5 h-5 text-green-500" />
        <span className="text-sm text-[#2D2A26]/60 dark:text-[#E8E6E3]/60">
          Всего за 7 дней:
        </span>
        <span className="font-semibold text-green-500">{formatPrice(totalEarnings)}</span>
      </div>
    </div>
  );
}

export default CourierEarningsChart;