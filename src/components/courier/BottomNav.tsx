"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ClipboardList, Wallet, User } from "lucide-react";

interface BottomNavProps {
  courierName?: string;
}

const BottomNav: React.FC<BottomNavProps> = ({ courierName }) => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/courier") return pathname === "/courier";
    return pathname.startsWith(path);
  };

  const navItems = [
    {
      path: "/courier",
      icon: Home,
      label: "Главная",
    },
    {
      path: "/courier/orders",
      icon: ClipboardList,
      label: "Заказы",
    },
    {
      path: "/courier/earnings",
      icon: Wallet,
      label: "Заработок",
    },
    {
      path: "/courier/profile",
      icon: User,
      label: "Профиль",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1A1918] border-t border-[#2D2A26] md:hidden z-50">
      <div className="flex items-center justify-around py-2 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 ${
                active
                  ? "text-primary"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {active && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </div>
              <span className={`text-xs font-medium ${active ? "text-primary" : "text-neutral-500"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;