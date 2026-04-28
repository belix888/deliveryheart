"use client";

import React from "react";

type OrderStatus = 
  | "pending" 
  | "assigned" 
  | "accepted" 
  | "picked_up" 
  | "in_delivery" 
  | "delivered" 
  | "cancelled" 
  | "failed";

interface StatusBadgeProps {
  status: OrderStatus;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const statusConfig: Record<OrderStatus, {
  label: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  dotColor: string;
}> = {
  pending: {
    label: "Ожидает",
    bgColor: "bg-neutral-500/15",
    textColor: "text-neutral-400",
    borderColor: "border-neutral-500/30",
    dotColor: "bg-neutral-500",
  },
  assigned: {
    label: "Принят",
    bgColor: "bg-blue-500/15",
    textColor: "text-blue-400",
    borderColor: "border-blue-500/30",
    dotColor: "bg-blue-500",
  },
  accepted: {
    label: "Подтверждён",
    bgColor: "bg-cyan-500/15",
    textColor: "text-cyan-400",
    borderColor: "border-cyan-500/30",
    dotColor: "bg-cyan-500",
  },
  picked_up: {
    label: "Забран",
    bgColor: "bg-amber-500/15",
    textColor: "text-amber-400",
    borderColor: "border-amber-500/30",
    dotColor: "bg-amber-500",
  },
  in_delivery: {
    label: "В пути",
    bgColor: "bg-primary/15",
    textColor: "text-primary",
    borderColor: "border-primary/30",
    dotColor: "bg-primary",
  },
  delivered: {
    label: "Доставлен",
    bgColor: "bg-emerald-500/15",
    textColor: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    dotColor: "bg-emerald-500",
  },
  cancelled: {
    label: "Отменён",
    bgColor: "bg-red-500/15",
    textColor: "text-red-400",
    borderColor: "border-red-500/30",
    dotColor: "bg-red-500",
  },
  failed: {
    label: "Неудача",
    bgColor: "bg-rose-500/15",
    textColor: "text-rose-400",
    borderColor: "border-rose-500/30",
    dotColor: "bg-rose-500",
  },
};

const sizeClasses = {
  sm: "px-2 py-0.5 text-xs gap-1",
  md: "px-2.5 py-1 text-sm gap-1.5",
  lg: "px-3 py-1.5 text-base gap-2",
};

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "md",
  showLabel = true,
}) => {
  const config = statusConfig[status];

  return (
    <div
      className={`inline-flex items-center rounded-full border ${config.bgColor} ${config.textColor} ${config.borderColor} ${sizeClasses[size]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor} ${size === "lg" ? "w-2 h-2" : ""}`} />
      {showLabel && <span className="font-medium">{config.label}</span>}
    </div>
  );
};

export default StatusBadge;