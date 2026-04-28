"use client";

import React from "react";
import { Wallet, Package, Clock, TrendingUp, Calendar } from "lucide-react";

interface QuickStatsProps {
  todayEarnings: number;
  todayOrders: number;
  weekEarnings?: number;
  weekOrders?: number;
  isLoading?: boolean;
  onViewEarnings?: () => void;
  onViewOrders?: () => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const QuickStats: React.FC<QuickStatsProps> = ({
  todayEarnings,
  todayOrders,
  weekEarnings,
  weekOrders,
  isLoading = false,
  onViewEarnings,
  onViewOrders,
}) => {
  return (
    <div className="space-y-4">
      {/* Main stats - Today */}
      <div className="grid grid-cols-2 gap-3">
        {/* Today's earnings */}
        <button
          onClick={onViewEarnings}
          disabled={isLoading}
          className="relative overflow-hidden rounded-2xl border border-[#2D2A26] bg-[#1A1918] p-4 text-left transition-all duration-200 hover:border-primary/50 disabled:opacity-70"
        >
          {/* Background glow */}
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Wallet className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs text-neutral-500 uppercase tracking-wider">Сегодня</span>
            </div>
            
            <p className="text-2xl font-bold text-white">
              {formatCurrency(todayEarnings)}
            </p>
            <p className="text-xs text-neutral-500 mt-1">заработано</p>
          </div>
        </button>
        
        {/* Today's orders */}
        <button
          onClick={onViewOrders}
          disabled={isLoading}
          className="relative overflow-hidden rounded-2xl border border-[#2D2A26] bg-[#1A1918] p-4 text-left transition-all duration-200 hover:border-blue-500/50 disabled:opacity-70"
        >
          {/* Background glow */}
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Package className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-xs text-neutral-500 uppercase tracking-wider">Сегодня</span>
            </div>
            
            <p className="text-2xl font-bold text-white">
              {todayOrders}
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              {todayOrders === 1 ? "заказ" : todayOrders >= 2 && todayOrders <= 4 ? "заказа" : "заказов"}
            </p>
          </div>
        </button>
      </div>
      
      {/* Week stats (optional) */}
      {weekEarnings !== undefined && weekOrders !== undefined && (
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-[#2D2A26] bg-[#1A1918] p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-neutral-500" />
              <span className="text-xs text-neutral-500 uppercase tracking-wider">Эта неделя</span>
            </div>
            <p className="text-xl font-bold text-white">
              {formatCurrency(weekEarnings)}
            </p>
          </div>
          
          <div className="rounded-2xl border border-[#2D2A26] bg-[#1A1918] p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-neutral-500" />
              <span className="text-xs text-neutral-500 uppercase tracking-wider">За неделю</span>
            </div>
            <p className="text-xl font-bold text-white">
              {weekOrders} заказов
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Add missing import

export default QuickStats;