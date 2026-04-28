"use client";

import React from "react";
import { MapPin, Clock, Package, Navigation, ChevronRight, Copy } from "lucide-react";

interface OrderData {
  id: string;
  order_number?: string;
  address: string;
  total_amount: number;
  delivery_distance?: number;
  created_at?: string;
  restaurants?: {
    name: string;
    address: string;
  };
  status?: string;
  customer_name?: string;
  customer_phone?: string;
  notes?: string;
}

interface OrderCardProps {
  order: OrderData;
  variant?: "available" | "active" | "completed";
  onAccept?: (orderId: string) => Promise<void>;
  onAction?: (orderId: string) => Promise<void>;
  isLoading?: boolean;
  actionLabel?: string;
  showDistance?: boolean;
  showRestaurant?: boolean;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDistance = (km: number) => {
  if (km < 1) return `${Math.round(km * 1000)} м`;
  return `${km.toFixed(1)} км`;
};

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  variant = "available",
  onAccept,
  onAction,
  isLoading = false,
  actionLabel = "Принять",
  showDistance = true,
  showRestaurant = true,
}) => {
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(order.address);
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#2D2A26] bg-[#1A1918] transition-all duration-300 hover:border-[#3D3A26]">
      {/* Gradient overlay for hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      {/* Content */}
      <div className="relative p-4 space-y-3">
        {/* Header row */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {showRestaurant && order.restaurants && (
              <div className="flex items-center gap-1.5 text-neutral-400 text-sm mb-1">
                <Package className="w-3.5 h-3.5" />
                <span className="truncate">{order.restaurants.name}</span>
              </div>
            )}
            <h3 className="text-lg font-semibold text-white line-clamp-2">
              {order.address}
            </h3>
          </div>
          
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(order.total_amount)}
            </p>
            <p className="text-xs text-neutral-500">сумма заказа</p>
          </div>
        </div>
        
        {/* Details row */}
        <div className="flex flex-wrap gap-3">
          {showDistance && order.delivery_distance !== undefined && order.delivery_distance !== null && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#2D2A26]">
              <Navigation className="w-3.5 h-3.5 text-neutral-400" />
              <span className="text-sm text-neutral-300">
                {formatDistance(order.delivery_distance)}
              </span>
            </div>
          )}
          
          {order.created_at && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#2D2A26]">
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
              <span className="text-sm text-neutral-300">
                {formatTime(order.created_at)}
              </span>
            </div>
          )}
        </div>
        
        {/* Notes */}
        {order.notes && (
          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <p className="text-sm text-amber-300">📝 {order.notes}</p>
          </div>
        )}
        
        {/* Action button */}
        {variant === "available" && onAccept && (
          <button
            onClick={() => onAccept(order.id)}
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold transition-all duration-200 hover:bg-primary-dark hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Принятие...</span>
              </>
            ) : (
              <>
                <span>{actionLabel}</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        )}
        
        {variant === "active" && onAction && (
          <button
            onClick={() => onAction(order.id)}
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-emerald-500 text-white font-semibold transition-all duration-200 hover:bg-emerald-600 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Обработка...</span>
              </>
            ) : (
              <>
                <span>{actionLabel}</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        )}
        
        {variant === "completed" && onAction && (
          <button
            onClick={() => onAction(order.id)}
            className="w-full py-3 rounded-xl bg-[#2D2A26] text-neutral-300 font-medium transition-all duration-200 hover:bg-[#3D3A26] flex items-center justify-center gap-2"
          >
            <span>Подробнее</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderCard;