"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LucideIcon } from "lucide-react";

interface StatusToggleProps {
  currentStatus: "online" | "offline" | "busy";
  onStatusChange: (status: "online" | "offline") => Promise<void>;
  isLoading?: boolean;
}

const statusConfig = {
  online: {
    label: "Онлайн",
    color: "bg-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    textColor: "text-emerald-400",
    icon: "●" as const,
  },
  offline: {
    label: "Офлайн",
    color: "bg-neutral-500",
    bgColor: "bg-neutral-500/10",
    borderColor: "border-neutral-500/30",
    textColor: "text-neutral-400",
    icon: "○" as const,
  },
  busy: {
    label: "Занят",
    color: "bg-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    textColor: "text-amber-400",
    icon: "◐" as const,
  },
};

const StatusToggle: React.FC<StatusToggleProps> = ({
  currentStatus,
  onStatusChange,
  isLoading = false,
}) => {
  const router = useRouter();
  const config = statusConfig[currentStatus];
  const isOnline = currentStatus === "online";

  const handleToggle = async () => {
    if (isLoading) return;
    
    const newStatus: "online" | "offline" = isOnline ? "offline" : "online";
    await onStatusChange(newStatus);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#2D2A26] bg-[#1A1918] p-1">
      {/* Glow effect for online */}
      {isOnline && (
        <div className="absolute inset-0 bg-emerald-500/5 animate-pulse pointer-events-none" />
      )}
      
      <button
        onClick={handleToggle}
        disabled={isLoading || currentStatus === "busy"}
        className={`relative w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
          isOnline
            ? "bg-emerald-500/20 border border-emerald-500/30"
            : "bg-[#2D2A26]/50 border border-[#3D3A26]"
        } ${currentStatus !== "busy" ? "hover:scale-[1.02] active:scale-[0.98]" : ""} ${
          isLoading ? "opacity-70 cursor-wait" : ""
        }`}
      >
        <div className="flex items-center gap-3">
          {/* Status indicator */}
          <div
            className={`w-3 h-3 rounded-full ${
              isOnline ? "bg-emerald-500 animate-pulse" : "bg-neutral-500"
            }`}
            style={{
              boxShadow: isOnline ? "0 0 12px rgba(16, 185, 129, 0.6)" : "none",
            }}
          />
          <span className={`text-base font-semibold ${isOnline ? "text-emerald-400" : "text-neutral-400"}`}>
            {config.label}
          </span>
        </div>
        
        {/* Toggle pill */}
        <div
          className={`w-12 h-6 rounded-full flex items-center transition-all duration-300 ${
            isOnline
              ? "bg-emerald-500 justify-end"
              : "bg-neutral-600 justify-start"
          }`}
        >
          <div className="w-5 h-5 rounded-full bg-white mx-0.5 shadow-lg" />
        </div>
      </button>
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl">
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export default StatusToggle;