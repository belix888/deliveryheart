"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAvailableOrders, acceptOrder } from "@/lib/api/couriers";
import OrderCard from "@/components/courier/OrderCard";
import BottomNav from "@/components/courier/BottomNav";
import { ArrowLeft, Filter, SlidersHorizontal, RefreshCw, Package } from "lucide-react";

interface AvailableOrder {
  id: string;
  order_number?: string;
  address: string;
  total_amount: number;
  delivery_distance?: number;
  created_at: string;
  restaurants?: {
    name: string;
    address: string;
  };
  status: string;
}

type FilterType = "all" | "nearby" | "expensive";

const mockOrders: AvailableOrder[] = [
  {
    id: "order-1",
    order_number: " №1247",
    address: "ул. Ленина, 25, кв. 14",
    total_amount: 2450,
    delivery_distance: 1.2,
    created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    restaurants: { name: "Суши Wok", address: "ул. Пушкина, 10" },
    status: "ready",
  },
  {
    id: "order-2",
    order_number: " №1248",
    address: "пр. Мира, 42, офис 305",
    total_amount: 1890,
    delivery_distance: 2.5,
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    restaurants: { name: "Pizza Hut", address: "ТЦ Европа" },
    status: "ready",
  },
  {
    id: "order-3",
    order_number: " №1249",
    address: "ул. Дворцовая, 8",
    total_amount: 3200,
    delivery_distance: 0.8,
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    restaurants: { name: "Burger King", address: "ул. Садовая, 3" },
    status: "ready",
  },
  {
    id: "order-4",
    order_number: " №1250",
    address: "ул. Новая, 15, подъезд 2",
    total_amount: 1650,
    delivery_distance: 3.1,
    created_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    restaurants: { name: "KFC", address: "ТЦ Грин" },
    status: "ready",
  },
  {
    id: "order-5",
    order_number: " №1251",
    address: "пр. Победы, 78, кв. 45",
    total_amount: 4100,
    delivery_distance: 1.8,
    created_at: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    restaurants: { name: "Якитория", address: "ул. Центральная, 12" },
    status: "ready",
  },
];

export default function AvailableOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<AvailableOrder[]>(mockOrders);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");
  const [acceptingOrderId, setAcceptingOrderId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Pull-to-refresh handler
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // In production: fetch from API
      // const data = await getAvailableOrders(city);
      // setOrders(data);
      
      // Simulate refresh
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Error refreshing orders:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Polling for new orders (every 30 seconds)
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // In production: get real data
        // const data = await getAvailableOrders(city);
        setOrders(mockOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();

    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAccept = async (orderId: string) => {
    setAcceptingOrderId(orderId);
    try {
      // In production: await acceptOrder(orderId, courierId);
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Remove from list after accepting
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      
      // Redirect to my orders
      router.push("/courier/orders");
    } catch (error) {
      console.error("Error accepting order:", error);
    } finally {
      setAcceptingOrderId(null);
    }
  };

  // Filter orders
  const filteredOrders = [...orders].sort((a, b) => {
    if (filter === "nearby") {
      return (a.delivery_distance || 0) - (b.delivery_distance || 0);
    }
    if (filter === "expensive") {
      return b.total_amount - a.total_amount;
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="min-h-screen bg-[#0A0A09]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0A0A09]/95 backdrop-blur-md border-b border-[#2D2A26]">
        <div className="flex items-center justify-between px-4 py-3">
          <Link
            href="/courier"
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Назад</span>
          </Link>
          
          <h1 className="text-lg font-semibold text-white">Доступные заказы</h1>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg transition-colors ${
              showFilters ? "bg-primary/20 text-primary" : "hover:bg-[#2D2A26] text-white"
            }`}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
        
        {/* Filters panel */}
        {showFilters && (
          <div className="px-4 pb-3 space-y-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-neutral-500" />
              <span className="text-sm text-neutral-500">Сортировка:</span>
            </div>
            <div className="flex gap-2">
              {(["all", "nearby", "expensive"] as FilterType[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    filter === f
                      ? "bg-primary text-white"
                      : "bg-[#2D2A26] text-neutral-400 hover:text-white"
                  }`}
                >
                  {f === "all" && "Все"}
                  {f === "nearby" && "Рядом"}
                  {f === "expensive" && "Дорогие"}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Content */}
      <main className="p-4 pb-20">
        {/* Refresh indicator */}
        {isRefreshing && (
          <div className="flex items-center justify-center py-4">
            <div className="flex items-center gap-2 text-neutral-400">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-sm">Об��овление...</span>
            </div>
          </div>
        )}

        {/* Orders count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-neutral-400">
            Найдено {filteredOrders.length} заказов
          </p>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1 text-sm text-primary hover:text-primary-dark transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Обновить
          </button>
        </div>

        {/* Orders list */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                variant="available"
                onAccept={handleAccept}
                isLoading={acceptingOrderId === order.id}
                actionLabel=" принять"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-[#2D2A26] flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-neutral-500" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Заказов нет</h3>
            <p className="text-sm text-neutral-500">
              Новые заказы появятся здесь
            </p>
            <button
              onClick={handleRefresh}
              className="mt-4 px-4 py-2 rounded-xl bg-primary text-white text-sm hover:bg-primary-dark transition-colors"
            >
              Обновить
            </button>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}