"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Heart, User } from "lucide-react";

const MobileNav: React.FC = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const navItems = [
    { path: "/", icon: Home, label: "Главная" },
    { path: "/catalog", icon: Search, label: "Поиск" },
    { path: "/favorites", icon: Heart, label: "Избранное" },
    { path: "/profile", icon: User, label: "Профиль" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#FFF9F5] dark:bg-[#1A1918] border-t border-[#F5F3F0] dark:border-[#2D2A26] md:hidden z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                active
                  ? "text-primary dark:text-primary-dark"
                  : "text-[#2D2A26]/60 dark:text-[#E8E6E3]/60"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;