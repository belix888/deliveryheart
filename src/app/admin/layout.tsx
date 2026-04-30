"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Store,
  Users,
  Tag,
  Image,
  Grid3X3,
  Star,
  MapPin,
  CreditCard,
  BarChart3,
  Bell,
  Settings,
  FileText,
  UserCog,
  MapPinned,
  Moon,
  Sun,
  ChevronRight,
  Package,
  Bike,
  LogOut,
  Lock,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { supabase } from "@/lib/supabase";

const menuItems = [
  { icon: LayoutDashboard, label: "Дашборд", href: "/admin" },
  { icon: ShoppingCart, label: "Заказы", href: "/admin/orders" },
  { icon: Bike, label: "Курьеры", href: "/admin/couriers" },
  { icon: Store, label: "Рестораны", href: "/admin/restaurants" },
  { icon: Users, label: "Пользователи", href: "/admin/users" },
  { icon: UserCog, label: "Админы ресторанов", href: "/admin/restaurant-admins" },
  { icon: Tag, label: "Промокоды", href: "/admin/coupons" },
  { icon: Image, label: "Баннеры", href: "/admin/banners" },
  { icon: Grid3X3, label: "Категории", href: "/admin/categories-global" },
  { icon: Star, label: "Отзывы", href: "/admin/reviews" },
  { icon: MapPin, label: "Города", href: "/admin/cities" },
  { icon: MapPinned, label: "Зоны доставки", href: "/admin/delivery-zones" },
  { icon: CreditCard, label: "Платежи", href: "/admin/payments" },
  { icon: BarChart3, label: "Аналитика", href: "/admin/analytics" },
  { icon: Bell, label: "Уведомления", href: "/admin/notifications" },
  { icon: Settings, label: "Настройки", href: "/admin/settings" },
  { icon: FileText, label: "Логи", href: "/admin/logs" },
];

// Dark theme colors
const colors = {
  bg: "bg-[#0a0a0a]",
  card: "bg-[#111111]",
  border: "border-[#222222]",
  text: "text-white",
  textMuted: "text-gray-400",
  input: "bg-[#1a1a1a] border-[#222222]",
  primary: "bg-primary hover:bg-primary/90",
};

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const { isDark, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      {/* Sidebar - Dark Theme */}
      <aside
        className={`fixed left-0 top-0 h-full bg-[#111111] border-r border-[#222222] transition-all duration-300 z-40 shadow-xl ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#222222]">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            {!collapsed && (
              <span className="text-lg font-bold text-white tracking-tight">
                Delivery
              </span>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-[#222222] transition-colors"
          >
            <ChevronRight
              className={`w-4 h-4 text-gray-400 transition-transform ${
                collapsed ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Menu */}
        <nav className="p-2 overflow-y-auto h-[calc(100vh-64px)]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || 
              (item.href !== "/admin" && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all ${
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-gray-400 hover:bg-[#1a1a1a] hover:text-white"
                }`}
                title={collapsed ? item.label : ""}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && (
                  <span className="text-sm font-medium truncate">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${collapsed ? "ml-16" : "ml-64"}`}>
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-[#222222]">
          <div className="h-full flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold text-white">
                Админ-панель
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-[#1a1a1a] transition-colors"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-400" />
                )}
              </button>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] rounded-full border border-[#222222]">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">A</span>
                </div>
                <span className="text-sm font-medium text-gray-300">Админ</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6 bg-[#0a0a0a] min-h-screen">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;