"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Bell, Settings, ChevronDown, Phone } from "lucide-react";

interface CourierLayoutProps {
  children: React.ReactNode;
  courierName?: string;
  status?: "online" | "offline" | "busy";
}

const CourierLayout: React.FC<CourierLayoutProps> = ({
  children,
  courierName = "Курьер",
  status = "offline",
}) => {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);

  const isActive = (path: string) => {
    if (path === "/courier") return pathname === "/courier";
    return pathname.startsWith(path);
  };

  const statusConfig = {
    online: { label: "Онлайн", color: "bg-emerald-500" },
    offline: { label: "Офлайн", color: "bg-neutral-500" },
    busy: { label: "Занят", color: "bg-amber-500" },
  };

  const config = statusConfig[status];

  return (
    <div className="min-h-screen bg-[#0A0A09]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0A0A09]/95 backdrop-blur-md border-b border-[#2D2A26]">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: Menu + Name */}
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg hover:bg-[#2D2A26] transition-colors lg:hidden">
              <Menu className="w-5 h-5 text-white" />
            </button>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {courierName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-white">{courierName}</p>
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${config.color}`} />
                  <span className="text-xs text-neutral-400">{config.label}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/courier/orders/available"
              className={`relative p-2 rounded-lg transition-colors ${
                isActive("/courier/orders/available")
                  ? "bg-primary/20 text-primary"
                  : "hover:bg-[#2D2A26] text-white"
              }`}
            >
              <Bell className="w-5 h-5" />
              {/* Notification dot */}
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
            </Link>
            
            <Link
              href="/courier/profile"
              className="p-2 rounded-lg hover:bg-[#2D2A26] transition-colors"
            >
              <Settings className="w-5 h-5 text-white" />
            </Link>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="pb-20">
        {children}
      </main>
    </div>
  );
};

export default CourierLayout;