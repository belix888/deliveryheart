"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  Truck,
  Home,
  RefreshCw,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        restaurants (name),
        users (full_name, phone)
      `)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOrders(data);
    }
    setLoading(false);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    await supabase
      .from('orders')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', orderId);
    
    loadOrders();
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = {
      pending: Clock,
      confirmed: CheckCircle,
      preparing: Package,
      ready: CheckCircle,
      delivering: Truck,
      delivered: Home,
      cancelled: XCircle,
    };
    return icons[status] || Clock;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "Новый",
      confirmed: "Подтверждён",
      preparing: "Готовится",
      ready: "Готов",
      delivering: "В пути",
      delivered: "Доставлен",
      cancelled: "Отменён",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      preparing: "bg-orange-100 text-orange-800",
      ready: "bg-green-100 text-green-800",
      delivering: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price || 0) + ' ₽';
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      !searchQuery ||
      order.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.restaurants?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.users?.full_name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Заказы</h1>
          <p className="text-[#2D2A26]/60">{orders.length} заказов</p>
        </div>
        <button
          onClick={loadOrders}
          className="p-3 rounded-xl bg-[#F5F3F0] dark:bg-[#2D2A26] hover:bg-[#E8E6E3] dark:hover:bg-[#3D3A36] transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-4 py-2 rounded-xl whitespace-nowrap ${
            statusFilter === "all"
              ? "bg-primary dark:bg-primary-dark text-white"
              : "bg-[#F5F3F0] dark:bg-[#2D2A26]"
          }`}
        >
          Все ({orders.length})
        </button>
        {['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-xl whitespace-nowrap ${
              statusFilter === status
                ? "bg-primary dark:bg-primary-dark text-white"
                : "bg-[#F5F3F0] dark:bg-[#2D2A26]"
            }`}
          >
            {getStatusLabel(status)} ({statusCounts[status] || 0})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2D2A26]/40" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск по номеру заказа, ресторану или клиенту"
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#F5F3F0] dark:bg-[#2D2A26] outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const StatusIcon = getStatusIcon(order.status);
          
          return (
            <div
              key={order.id}
              className="bg-[#F5F3F0] dark:bg-[#2D2A26] rounded-2xl p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-lg">#{order.order_number}</p>
                  <p className="text-sm text-[#2D2A26]/60">
                    {formatDate(order.created_at)}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${getStatusColor(order.status)}`}>
                  <StatusIcon className="w-4 h-4" />
                  {getStatusLabel(order.status)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-sm text-[#2D2A26]/60">Ресторан</p>
                  <p className="font-medium">{order.restaurants?.name || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-[#2D2A26]/60">Клиент</p>
                  <p className="font-medium">{order.users?.full_name || 'Гость'}</p>
                  <p className="text-sm text-[#2D2A26]/60">{order.users?.phone || ''}</p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-[#2D2A26]/10">
                <div>
                  <p className="text-lg font-semibold">{formatPrice(order.final_amount)}</p>
                </div>
                
                <div className="flex gap-2">
                  {/* Quick Status Actions */}
                  {order.status === 'pending' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'confirmed')}
                      className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                    >
                      Подтвердить
                    </button>
                  )}
                  {order.status === 'confirmed' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                      className="px-3 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600"
                    >
                      Готовить
                    </button>
                  )}
                  {order.status === 'preparing' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                      className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                    >
                      Готов
                    </button>
                  )}
                  {order.status === 'ready' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'delivering')}
                      className="px-3 py-2 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600"
                    >
                      В доставку
                    </button>
                  )}
                  {order.status === 'delivering' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'delivered')}
                      className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                    >
                      Доставлен
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#2D2A26]/60">Заказов не найдено</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;