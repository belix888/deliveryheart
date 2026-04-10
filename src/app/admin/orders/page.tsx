"use client";

import React, { useState } from "react";
import Link from "next/link";
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

const orders = [
  {
    id: "2847",
    number: "260410001",
    date: "10.04.2026 14:32",
    restaurant: "Пельменная №1",
    user: "Анна К.",
    phone: "+7 (999) 123-45-67",
    address: "ул. Ленина, 42, кв. 15",
    items: "Пельмени классические x2, Блины со сметаной x1",
    total: 680,
    deliveryPrice: 50,
    finalAmount: 730,
    status: "preparing",
    paymentStatus: "paid",
  },
  {
    id: "2846",
    number: "260410002",
    date: "10.04.2026 13:45",
    restaurant: "Sushi Master",
    user: "Иван П.",
    phone: "+7 (999) 234-56-78",
    address: "ул. Пушкина, 10, оф. 205",
    items: "Филадельфия x1, Калифорния x2",
    total: 1210,
    deliveryPrice: 70,
    finalAmount: 1280,
    status: "delivering",
    paymentStatus: "paid",
  },
  {
    id: "2845",
    number: "260409001",
    date: "09.04.2026 18:20",
    restaurant: "Pizza Napoli",
    user: "Мария С.",
    phone: "+7 (999) 345-67-89",
    address: "ул. Советская, 25, кв. 8",
    items: "Маргарита x1, Пепперони x1",
    total: 1240,
    deliveryPrice: 40,
    finalAmount: 1280,
    status: "delivered",
    paymentStatus: "paid",
  },
  {
    id: "2844",
    number: "260409002",
    date: "09.04.2026 17:10",
    restaurant: "Burger House",
    user: "Алексей Д.",
    phone: "+7 (999) 456-78-90",
    address: "ул. Гагарина, 5",
    items: "Классический бургер x2, Чизбургер x1",
    total: 1020,
    deliveryPrice: 50,
    finalAmount: 1070,
    status: "cancelled",
    paymentStatus: "refunded",
  },
  {
    id: "2843",
    number: "260409003",
    date: "09.04.2026 16:00",
    restaurant: "Пельменная №1",
    user: "Елена В.",
    phone: "+7 (999) 567-89-01",
    address: "ул. Мира, 12, кв. 3",
    items: "Вареники с картошкой x1, Солянка x1",
    total: 510,
    deliveryPrice: 50,
    finalAmount: 560,
    status: "pending",
    paymentStatus: "pending",
  },
];

const statusOptions = [
  { value: "", label: "Все статусы" },
  { value: "pending", label: "Новый" },
  { value: "confirmed", label: "Подтверждён" },
  { value: "preparing", label: "Готовится" },
  { value: "ready", label: "Готов" },
  { value: "delivering", label: "В доставке" },
  { value: "delivered", label: "Доставлен" },
  { value: "cancelled", label: "Отменён" },
];

const getStatusBadge = (status: string) => {
  const badges: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    pending: { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-700 dark:text-gray-300", icon: <Clock className="w-3 h-3" /> },
    confirmed: { bg: "bg-blue-100 dark:bg-blue-900", text: "text-blue-700 dark:text-blue-300", icon: <CheckCircle className="w-3 h-3" /> },
    preparing: { bg: "bg-orange-100 dark:bg-orange-900", text: "text-orange-700 dark:text-orange-300", icon: <Package className="w-3 h-3" /> },
    ready: { bg: "bg-green-100 dark:bg-green-900", text: "text-green-700 dark:text-green-300", icon: <CheckCircle className="w-3 h-3" /> },
    delivering: { bg: "bg-orange-100 dark:bg-orange-900", text: "text-orange-700 dark:text-orange-300", icon: <Truck className="w-3 h-3" /> },
    delivered: { bg: "bg-green-100 dark:bg-green-900", text: "text-green-700 dark:text-green-300", icon: <Home className="w-3 h-3" /> },
    cancelled: { bg: "bg-red-100 dark:bg-red-900", text: "text-red-700 dark:text-red-300", icon: <XCircle className="w-3 h-3" /> },
  };
  return badges[status] || badges.pending;
};

const OrdersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.restaurant.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateStatus = (orderId: string, newStatus: string) => {
    console.log(`Order ${orderId} status changed to ${newStatus}`);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Заказы</h1>
          <p className="text-[#2D2A26]/60 dark:text-[#E8E6E3]/60">Управление заказами</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#F5F3F0] dark:bg-[#2D2A26] rounded-xl hover:bg-[#E8E6E3] dark:hover:bg-[#3D3A36] transition-colors">
          <Download className="w-4 h-4" />
          Экспорт CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2D2A26]/40" />
          <input
            type="text"
            placeholder="Поиск по номеру, клиенту, ресторану..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-[#2D2A26] border border-[#F5F3F0] dark:border-[#3D3A36] focus:border-primary dark:focus:border-primary-dark focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 rounded-xl bg-white dark:bg-[#2D2A26] border border-[#F5F3F0] dark:border-[#3D3A36] focus:border-primary"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#2D2A26] rounded-2xl border border-[#F5F3F0] dark:border-[#3D3A36] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F5F3F0] dark:bg-[#3D3A36]">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">№ Заказа</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Дата</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Ресторан</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Клиент</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Сумма</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Статус</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F3F0] dark:divide-[#3D3A36]">
              {filteredOrders.map((order) => {
                const badge = getStatusBadge(order.status);
                return (
                  <tr key={order.id} className="hover:bg-[#F5F3F0]/50 dark:hover:bg-[#3D3A36]/50">
                    <td className="px-4 py-3">
                      <span className="font-semibold">{order.id}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#2D2A26]/70 dark:text-[#E8E6E3]/70">{order.date}</td>
                    <td className="px-4 py-3">{order.restaurant}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{order.user}</p>
                        <p className="text-xs text-[#2D2A26]/50 dark:text-[#E8E6E3]/50">{order.phone}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold">{order.finalAmount} ₽</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                        {badge.icon}
                        {order.status === "pending" && "Новый"}
                        {order.status === "confirmed" && "Подтверждён"}
                        {order.status === "preparing" && "Готовится"}
                        {order.status === "ready" && "Готов"}
                        {order.status === "delivering" && "В доставке"}
                        {order.status === "delivered" && "Доставлен"}
                        {order.status === "cancelled" && "Отменён"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 rounded-lg hover:bg-[#F5F3F0] dark:hover:bg-[#3D3A36]"
                          title="Просмотр"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {order.status === "pending" && (
                          <button
                            onClick={() => updateStatus(order.id, "confirmed")}
                            className="p-2 rounded-lg text-green-600 hover:bg-green-50"
                            title="Подтвердить"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {order.status === "confirmed" && (
                          <button
                            onClick={() => updateStatus(order.id, "preparing")}
                            className="p-2 rounded-lg text-orange-600 hover:bg-orange-50"
                            title="Начать готовить"
                          >
                            <Package className="w-4 h-4" />
                          </button>
                        )}
                        {(order.status === "preparing" || order.status === "ready") && (
                          <button
                            onClick={() => updateStatus(order.id, "delivering")}
                            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50"
                            title="В доставку"
                          >
                            <Truck className="w-4 h-4" />
                          </button>
                        )}
                        {order.status === "delivering" && (
                          <button
                            onClick={() => updateStatus(order.id, "delivered")}
                            className="p-2 rounded-lg text-green-600 hover:bg-green-50"
                            title="Доставлен"
                          >
                            <Home className="w-4 h-4" />
                          </button>
                        )}
                        {order.status !== "cancelled" && order.status !== "delivered" && (
                          <button
                            onClick={() => updateStatus(order.id, "cancelled")}
                            className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                            title="Отменить"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        {order.status === "delivered" && order.paymentStatus === "paid" && (
                          <button
                            onClick={() => updateStatus(order.id, "refunded")}
                            className="p-2 rounded-lg text-orange-600 hover:bg-orange-50"
                            title="Вернуть деньги"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-[#2D2A26] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#F5F3F0] dark:border-[#3D3A36]">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-display font-bold">Заказ #{selectedOrder.id}</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 rounded-lg hover:bg-[#F5F3F0] dark:hover:bg-[#3D3A36]"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#2D2A26]/60 dark:text-[#E8E6E3]/60">Ресторан</p>
                  <p className="font-semibold">{selectedOrder.restaurant}</p>
                </div>
                <div>
                  <p className="text-sm text-[#2D2A26]/60 dark:text-[#E8E6E3]/60">Дата</p>
                  <p className="font-semibold">{selectedOrder.date}</p>
                </div>
                <div>
                  <p className="text-sm text-[#2D2A26]/60 dark:text-[#E8E6E3]/60">Клиент</p>
                  <p className="font-semibold">{selectedOrder.user}</p>
                </div>
                <div>
                  <p className="text-sm text-[#2D2A26]/60 dark:text-[#E8E6E3]/60">Телефон</p>
                  <p className="font-semibold">{selectedOrder.phone}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-[#2D2A26]/60 dark:text-[#E8E6E3]/60">Адрес доставки</p>
                <p className="font-semibold">{selectedOrder.address}</p>
              </div>
              <div>
                <p className="text-sm text-[#2D2A26]/60 dark:text-[#E8E6E3]/60 mb-2">Заказанные блюда</p>
                <div className="p-4 bg-[#F5F3F0] dark:bg-[#3D3A36] rounded-xl">
                  <p>{selectedOrder.items}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-[#2D2A26]/60 dark:text-[#E8E6E3]/60">Сумма заказа</p>
                  <p className="font-semibold">{selectedOrder.total} ₽</p>
                </div>
                <div>
                  <p className="text-sm text-[#2D2A26]/60 dark:text-[#E8E6E3]/60">Доставка</p>
                  <p className="font-semibold">{selectedOrder.deliveryPrice} ₽</p>
                </div>
                <div>
                  <p className="text-sm text-[#2D2A26]/60 dark:text-[#E8E6E3]/60">Итого</p>
                  <p className="font-semibold text-primary dark:text-primary-dark">{selectedOrder.finalAmount} ₽</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-[#2D2A26]/60 dark:text-[#E8E6E3]/60">Статус</p>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium mt-1 ${getStatusBadge(selectedOrder.status).bg} ${getStatusBadge(selectedOrder.status).text}`}>
                  {getStatusBadge(selectedOrder.status).icon}
                  {selectedOrder.status === "pending" && "Новый"}
                  {selectedOrder.status === "preparing" && "Готовится"}
                  {selectedOrder.status === "delivering" && "В доставке"}
                  {selectedOrder.status === "delivered" && "Доставлен"}
                  {selectedOrder.status === "cancelled" && "Отменён"}
                </span>
              </div>
            </div>
            <div className="p-6 border-t border-[#F5F3F0] dark:border-[#3D3A36] flex gap-3">
              {selectedOrder.status === "pending" && (
                <button className="px-4 py-2 bg-green-500 text-white rounded-xl hover:opacity-90">Подтвердить</button>
              )}
              {selectedOrder.status === "confirmed" && (
                <button className="px-4 py-2 bg-orange-500 text-white rounded-xl hover:opacity-90">Начать готовить</button>
              )}
              {selectedOrder.status !== "cancelled" && selectedOrder.status !== "delivered" && (
                <button className="px-4 py-2 bg-red-500 text-white rounded-xl hover:opacity-90">Отменить заказ</button>
              )}
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-[#F5F3F0] dark:bg-[#3D3A36] rounded-xl"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;