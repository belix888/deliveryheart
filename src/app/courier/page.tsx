"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getCourierProfile,
  setCourierStatus,
  getCourierStats,
} from "@/lib/api/couriers";
import type { Courier, CourierStatsSummary } from "@/lib/types/courier";
import StatusToggle from "@/components/courier/StatusToggle";
import QuickStats from "@/components/courier/QuickStats";
import BottomNav from "@/components/courier/BottomNav";
import { PackagePlus, ClipboardList, RefreshCw, Zap } from "lucide-react";

// Mock data for demo - in production, get from database
const mockCourier: Courier = {
  id: "courier-1",
  user_id: "user-1",
  name: "Александр",
  phone: "+7 999 123-45-67",
  status: "online",
  current_city: "Москва",
  vehicle_type: "bike",
  rating: 4.8,
  total_deliveries: 156,
  total_earnings: 45000,
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const mockStats: CourierStatsSummary = {
  today: {
    orders_completed: 5,
    total_earnings: 1850,
    total_distance_km: 12.5,
  },
  week: {
    orders_completed: 32,
    total_earnings: 12800,
    total_distance_km: 85,
  },
  month: {
    orders_completed: 156,
    total_earnings: 52000,
    total_distance_km: 420,
  },
};

export default function CourierPage() {
  const router = useRouter();
  const [courier, setCourier] = useState<Courier | null>(mockCourier);
  const [stats, setStats] = useState<CourierStatsSummary | null>(mockStats);
  const [isLoading, setIsLoading] = useState(true);
  const [isStatusLoading, setIsStatusLoading] = useState(false);

  // Polling for real-time updates (every 30 seconds)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In production: get real data
        // const profile = await getCourierProfile(userId);
        // const statsData = await getCourierStats(courierId);
        
        // For demo, use mock data
        setCourier(mockCourier);
        setStats(mockStats);
      } catch (error) {
        console.error("Error fetching courier data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Poll every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (newStatus: "online" | "offline") => {
    if (!courier) return;
    
    setIsStatusLoading(true);
    try {
      // In production: await setCourierStatus(courier.id, newStatus);
      setCourier({ ...courier, status: newStatus });
    } catch (error) {
      console.error("Error changing status:", error);
    } finally {
      setIsStatusLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Доброе утро";
    if (hour >= 12 && hour < 18) return "Добрый день";
    if (hour >= 18 && hour < 23) return "Добрый вечер";
    return "Доброй ночи";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-neutral-400">Загрузка...</p>
        </div>
      </div>
    );
  }

  const displayCourier = courier || mockCourier;
  const displayStats = stats || mockStats;

  return (
    <div className="p-4 space-y-6">
      {/* Greeting */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-white">
          {getGreeting()}, {displayCourier.name}!
        </h1>
        <p className="text-neutral-400">
          Работайте с нами и зарабатывайте
        </p>
      </div>

      {/* Status Toggle */}
      <section>
        <StatusToggle
          currentStatus={displayCourier.status}
          onStatusChange={handleStatusChange}
          isLoading={isStatusLoading}
        />
      </section>

      {/* Quick Stats */}
      <section>
        <QuickStats
          todayEarnings={displayStats.today.total_earnings}
          todayOrders={displayStats.today.orders_completed}
          weekEarnings={displayStats.week.total_earnings}
          weekOrders={displayStats.week.orders_completed}
          isLoading={isLoading}
          onViewEarnings={() => router.push("/courier/earnings")}
          onViewOrders={() => router.push("/courier/orders")}
        />
      </section>

      {/* Quick Actions */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Быстрый доступ</h2>
        
        <div className="grid grid-cols-2 gap-3">
          {/* New orders */}
          <Link
            href="/courier/orders/available"
            className="group relative overflow-hidden rounded-2xl border border-[#2D2A26] bg-[#1A1918] p-4 transition-all duration-200 hover:border-primary/50"
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:blur-xl transition-all" />
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mb-3">
                <PackagePlus className="w-5 h-5 text-primary" />
              </div>
              <p className="font-semibold text-white">Новые заказы</p>
              <p className="text-xs text-neutral-500 mt-1">Доступные для принятия</p>
            </div>
          </Link>
          
          {/* My orders */}
          <Link
            href="/courier/orders"
            className="group relative overflow-hidden rounded-2xl border border-[#2D2A26] bg-[#1A1918] p-4 transition-all duration-200 hover:border-blue-500/50"
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:blur-xl transition-all" />
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mb-3">
                <ClipboardList className="w-5 h-5 text-blue-400" />
              </div>
              <p className="font-semibold text-white">Мои заказы</p>
              <p className="text-xs text-neutral-500 mt-1">В работе и завершённые</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Earnings preview */}
      <section className="rounded-2xl border border-[#2D2A26] bg-[#1A1918] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-neutral-400">Общий заработок</p>
              <p className="text-xl font-bold text-white">
                {new Intl.NumberFormat("ru-RU", {
                  style: "currency",
                  currency: "RUB",
                  minimumFractionDigits: 0,
                }).format(displayStats.month.total_earnings)}
              </p>
            </div>
          </div>
          <Link
            href="/courier/earnings"
            className="px-4 py-2 rounded-xl bg-[#2D2A26] text-neutral-300 text-sm hover:bg-[#3D3A26] transition-colors"
          >
            Подробнее
          </Link>
        </div>
      </section>

      {/* Bottom Navigation */}
      <BottomNav courierName={displayCourier.name} />
    </div>
  );
}