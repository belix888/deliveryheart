"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCourierOrders, updateOrderStatus, acceptOrder } from "@/lib/api/couriers";
import OrderCard from "@/components/courier/OrderCard";
import StatusBadge from "@/components/courier/StatusBadge";
import BottomNav from "@/components/courier/BottomNav";
import { ArrowLeft, Package, CheckCircle2, Clock, Truck } from "lucide-react";

interface MyOrder {
  id: string;
  order_id: string;
  status: "assigned" | "accepted" | "picked_up" | "in_delivery" | "delivered";
  earnings: number;
  distance_km?: number;
  pickup_time?: string;
  delivery_time?: string;
  created_at: string;
  updated_at: string;
  order?: {
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
    customer_name?: string;
    customer_phone?: string;
  };
}

const mockActiveOrders: MyOrder[] = [
  {
    id: "co-1",
    order_id: "order-1",
    status: "accepted",
    earnings: 150,
    distance_km: 1.2,
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    order: {
      id: "order-1",
      order_number: " №1247",
      address: "ул. Ленина, 25, кв. 14",
      total_amount: 2450,
      delivery_distance: 1.2,
      created_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      restaurants: { name: "Суши Wok", address: "ул. Пушкина, 10" },
      customer_name: "Иван",
      customer_phone: "+7 999 123-45-67",
    },
  },
  {
    id: "co-2",
    order_id: "order-2",
    status: "picked_up",
    earnings: 200,
    distance_km: 2.5,
    pickup_time: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    order: {
      id: "order-2",
      order_number: " №1248",
      address: "пр. Мира, 42, офис 305",
      total_amount: 1890,
      delivery_distance: 2.5,
      created_at: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
      restaurants: { name: "Pizza Hut", address: "ТЦ Европа" },
      customer_name: "Мария",
      customer_phone: "+7 999 987-65-43",
    },
  },
];

const mockCompletedOrders: MyOrder[] = [
  {
    id: "co-3",
    order_id: "order-3",
    status: "delivered",
    earnings: 180,
    distance_km: 0.8,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
    order: {
      id: "order-3",
      order_number: " №1245",
      address: "ул. Дворцовая, 8",
      total_amount: 3200,
      delivery_distance: 0.8,
      created_at: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
      restaurants: { name: "Burger King", address: "ул. Садовая, 3" },
      customer_name: "Алексей",
      customer_phone: "+7 999 111-22-33",
    },
  },
  {
    id: "co-4",
    order_id: "order-4",
    status: "delivered",
    earnings: 220,
    distance_km: 3.1,
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    order: {
      id: "order-4",
      order_number: " №1242",
      address: "ул. Новая, 15, подъезд 2",
      total_amount: 1650,
      delivery_distance: 3.1,
      created_at: new Date(Date.now() - 5.5 * 60 * 60 * 1000).toISOString(),
      restaurants: { name: "KFC", address: "ТЦ Грин" },
      customer_name: "Елена",
      customer_phone: "+7 999 444-55-66",
    },
  },
  {
    id: "co-5",
    order_id: "order-5",
    status: "delivered",
    earnings: 250,
    distance_km: 1.8,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
    order: {
      id: "order-5",
      order_number: " №1239",
      address: "пр. Победы, 78, кв. 45",
      total_amount: 4100,
      delivery_distance: 1.8,
      created_at: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
      restaurants: { name: "Якитория", address: "ул. Центральная, 12" },
      customer_name: "Сергей",
      customer_phone: "+7 999 777-88-99",
    },
  },
];

type TabType = "active" | "completed";

export default function MyOrdersPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("active");
  const [activeOrders, setActiveOrders] = useState<MyOrder[]>(mockActiveOrders);
  const [completedOrders, setCompletedOrders] = useState<MyOrder[]>(mockCompletedOrders);
  const [isLoading, setIsLoading] = useState(false);
  const [processingOrderId, setProcessingOrderId] = useState<string | null>(null);

  // Handle order actions
  const handleAction = async (order: MyOrder) => {
    if (!order.order) return;
    
    setProcessingOrderId(order.id);
    try {
      const newStatus = 
        order.status === "assigned" ? "accepted" :
        order.status === "accepted" ? "picked_up" :
        "in_delivery";
      
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Update local state
      if (newStatus === "accepted" || newStatus === "picked_up") {
        setActiveOrders((prev) =>
          prev.map((o) =>
            o.id === order.id ? { ...o, status: newStatus } : o
          )
        );
      } else if (newStatus === "in_delivery") {
        // Move to completed
        setActiveOrders((prev) => prev.filter((o) => o.id !== order.id));
        setCompletedOrders((prev) => [
          { ...order, status: "delivered" },
          ...prev,
        ]);
      }
    } catch (error) {
      console.error("Error updating order:", error);
    } finally {
      setProcessingOrderId(null);
    }
  };

  const getActionLabel = (status: MyOrder["status"]) => {
    switch (status) {
      case "assigned": return "Забрать";
      case "accepted": return "Взять";
      case "picked_up": return "Еду";
      case "in_delivery": return "Доставлен";
      default: return "Детали";
    }
  };

  const currentOrders = activeTab === "active" ? activeOrders : completedOrders;
  const totalEarnings = completedOrders.reduce((sum, o) => sum + o.earnings, 0);

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
          
          <h1 className="text-lg font-semibold text-white">Мои заказы</h1>
          
          <div className="w-10" />
        </div>
      </header>

      {/* Tabs */}
      <div className="px-4 py-3 border-b border-[#2D2A26]">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("active")}
            className={`flex-1 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === "active"
                ? "bg-primary text-white"
                : "bg-[#2D2A26] text-neutral-400 hover:text-white"
            }`}
          >
            <Clock className="w-4 h-4" />
            Активные ({activeOrders.length})
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`flex-1 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === "completed"
                ? "bg-primary text-white"
                : "bg-[#2D2A26] text-neutral-400 hover:text-white"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            Завершённые ({completedOrders.length})
          </button>
        </div>
      </div>

      {/* Summary for completed */}
      {activeTab === "completed" && (
        <div className="px-4 py-3 border-b border-[#2D2A26]">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-400">Завершено за сегодня:</span>
            <span className="text-lg font-bold text-white">
              {new Intl.NumberFormat("ru-RU", {
                style: "currency",
                currency: "RUB",
                minimumFractionDigits: 0,
              }).format(totalEarnings)}
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="p-4 pb-20">
        {currentOrders.length > 0 ? (
          <div className="space-y-4">
            {currentOrders.map((order) => (
              <div key={order.id} className="space-y-3">
                {/* Order header */}
                <div className="flex items-center justify-between">
                  <StatusBadge status={order.status} />
                  <span className="text-xs text-neutral-500">
                    {new Date(order.created_at).toLocaleTimeString("ru-RU", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                
                {/* Order card */}
                {order.order && (
                  <OrderCard
                    order={{
                      ...order.order,
                      created_at: order.order.created_at,
                      delivery_distance: order.distance_km,
                    }}
                    variant={activeTab === "active" ? "active" : "completed"}
                    onAction={() => handleAction(order)}
                    isLoading={processingOrderId === order.id}
                    actionLabel={getActionLabel(order.status)}
                  />
                )}
                
                {/* Earnings for completed */}
                {activeTab === "completed" && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">Заказ выполнен</span>
                    <span className="text-emerald-400 font-medium">
                      +{order.earnings} ₽
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-[#2D2A26] flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-neutral-500" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              {activeTab === "active" ? "Нет активных заказов" : "Нет завершённых заказов"}
            </h3>
            <p className="text-sm text-neutral-500">
              {activeTab === "active"
                ? "Примите новый заказ"
                : "Завершённые заказы появятся здесь"}
            </p>
            {activeTab === "active" && (
              <Link
                href="/courier/orders/available"
                className="mt-4 px-4 py-2 rounded-xl bg-primary text-white text-sm hover:bg-primary-dark transition-colors"
              >
                К доступным заказам
              </Link>
            )}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}