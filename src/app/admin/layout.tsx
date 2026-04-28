"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

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

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const { isDark, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#FFF9F5] dark:bg-[#1A1918]">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-white dark:bg-[#2D2A26] border-r border-[#F5F3F0] dark:border-[#3D3A36] transition-all duration-300 z-40 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#F5F3F0] dark:border-[#3D3A36]">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-xl font-display font-bold text-primary dark:text-primary-dark">
              {collapsed ? "Д" : "ДУШИ"}
            </span>
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded hover:bg-[#F5F3F0] dark:hover:bg-[#3D3A36]"
          >
            <ChevronRight
              className={`w-5 h-5 text-[#2D2A26] dark:text-[#E8E6E3] transition-transform ${
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
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-colors ${
                  isActive
                    ? "bg-primary/10 dark:bg-primary-dark/10 text-primary dark:text-primary-dark"
                    : "text-[#2D2A26]/70 dark:text-[#E8E6E3]/70 hover:bg-[#F5F3F0] dark:hover:bg-[#3D3A36] hover:text-[#2D2A26] dark:hover:text-[#E8E6E3]"
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
        <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-[#1A1918]/80 backdrop-blur-md border-b border-[#F5F3F0] dark:border-[#3D3A36]">
          <div className="h-full flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-display font-semibold text-[#2D2A26] dark:text-[#E8E6E3]">
                Админ-панель
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-[#F5F3F0] dark:hover:bg-[#2D2A26] transition-colors"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-primary-dark" />
                ) : (
                  <Moon className="w-5 h-5 text-[#2D2A26] dark:text-[#E8E6E3]" />
                )}
              </button>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F5F3F0] dark:bg-[#2D2A26] rounded-full">
                <div className="w-8 h-8 rounded-full bg-primary/20 dark:bg-primary-dark/20 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary dark:text-primary-dark">A</span>
                </div>
                <span className="text-sm font-medium">Админ</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;