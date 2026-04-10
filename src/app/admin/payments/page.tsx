"use client";

import React, { useState } from "react";
import { Search, Filter, Download, Eye, RefreshCw, CreditCard, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const payments = [
  { id: "pay_1", orderId: "#2847", user: "Анна К.", amount: 730, method: "Карта", status: "success", date: "10.04.2026 14:35", restaurant: "Пельменная №1" },
  { id: "pay_2", orderId: "#2846", user: "Иван П.", amount: 1280, method: "Apple Pay", status: "success", date: "10.04.2026 13:50", restaurant: "Sushi Master" },
  { id: "pay_3", orderId: "#2845", user: "Мария С.", amount: 1280, method: "Карта", status: "success", date: "09.04.2026 18:25", restaurant: "Pizza Napoli" },
  { id: "pay_4", orderId: "#2844", user: "Алексей Д.", amount: 1070, method: "Карта", status: "refunded", date: "09.04.2026 17:15", restaurant: "Burger House" },
  { id: "pay_5", orderId: "#2843", user: "Елена В.", amount: 560, method: "СБП", status: "pending", date: "09.04.2026 16:05", restaurant: "Пельменная №1" },
];

const PaymentsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div><h1 className="text-2xl font-display font-bold">Платежи</h1><p className="text-[#2D2A26]/60">История платежей</p></div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#F5F3F0] rounded-xl"><Download className="w-4 h-4" />Экспорт</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border"><p className="text-sm text-[#2D2A26]/60">Всего платежей</p><p className="text-2xl font-bold">{payments.length}</p></div>
        <div className="bg-white p-4 rounded-xl border"><p className="text-sm text-green-600">Успешно</p><p className="text-2xl font-bold text-green-600">{payments.filter(p => p.status === "success").length}</p></div>
        <div className="bg-white p-4 rounded-xl border"><p className="text-sm text-orange-600">Ожидают</p><p className="text-2xl font-bold text-orange-600">{payments.filter(p => p.status === "pending").length}</p></div>
        <div className="bg-white p-4 rounded-xl border"><p className="text-sm text-blue-600">Сумма</p><p className="text-2xl font-bold text-blue-600">{payments.reduce((a, p) => a + p.amount, 0).toLocaleString()} ₽</p></div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" /><input type="text" placeholder="Поиск..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border" /></div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-3 rounded-xl bg-white border">
          <option value="">Все статусы</option>
          <option value="success">Успешно</option>
          <option value="pending">Ожидание</option>
          <option value="refunded">Возврат</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#F5F3F0]"><tr><th className="px-4 py-3 text-left">ID</th><th className="px-4 py-3 text-left">Заказ</th><th className="px-4 py-3 text-left">Клиент</th><th className="px-4 py-3 text-left">Сумма</th><th className="px-4 py-3 text-left">Способ</th><th className="px-4 py-3 text-left">Статус</th><th className="px-4 py-3 text-left">Дата</th></tr></thead>
          <tbody className="divide-y">
            {payments.map(payment => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-sm">{payment.id}</td>
                <td className="px-4 py-3">{payment.orderId}</td>
                <td className="px-4 py-3">{payment.user}</td>
                <td className="px-4 py-3 font-semibold">{payment.amount} ₽</td>
                <td className="px-4 py-3">{payment.method}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${payment.status === "success" ? "bg-green-100 text-green-700" : payment.status === "pending" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"}`}>
                    {payment.status === "success" && <CheckCircle className="w-3 h-3" />}
                    {payment.status === "pending" && <AlertCircle className="w-3 h-3" />}
                    {payment.status === "refunded" && <RefreshCw className="w-3 h-3" />}
                    {payment.status === "success" && "Успешно"}
                    {payment.status === "pending" && "Ожидание"}
                    {payment.status === "refunded" && "Возврат"}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">{payment.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentsPage;