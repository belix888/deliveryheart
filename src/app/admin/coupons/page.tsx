"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Percent,
  DollarSign,
  Calendar,
  Users,
  ShoppingBag,
  Copy,
  CheckCircle,
  XCircle,
} from "lucide-react";

const coupons = [
  {
    id: "1",
    code: "PIZZA20",
    type: "percent",
    value: 20,
    minOrder: 500,
    maxUses: 100,
    usedCount: 45,
    validFrom: "01.04.2026",
    validTo: "30.04.2026",
    isActive: true,
    restaurants: ["Pizza Napoli"],
    categories: [],
    description: "Скидка 20% на пиццу",
  },
  {
    id: "2",
    code: "SUSHI100",
    type: "fixed",
    value: 100,
    minOrder: 800,
    maxUses: 50,
    usedCount: 23,
    validFrom: "05.04.2026",
    validTo: "15.05.2026",
    isActive: true,
    restaurants: ["Sushi Master"],
    categories: ["Роллы", "Суши"],
    description: "100 ₽ скидка на заказ от 800 ₽",
  },
  {
    id: "3",
    code: "WELCOME50",
    type: "fixed",
    value: 50,
    minOrder: 300,
    maxUses: 200,
    usedCount: 156,
    validFrom: "01.01.2026",
    validTo: "31.12.2026",
    isActive: true,
    restaurants: [],
    categories: [],
    description: "Промокод для новых пользователей",
  },
  {
    id: "4",
    code: "BURGER10",
    type: "percent",
    value: 10,
    minOrder: 400,
    maxUses: 30,
    usedCount: 30,
    validFrom: "01.03.2026",
    validTo: "31.03.2026",
    isActive: false,
    restaurants: ["Burger House"],
    categories: [],
    description: "10% скидка на бургеры",
  },
  {
    id: "5",
    code: "FREE30",
    type: "fixed",
    value: 30,
    minOrder: 0,
    maxUses: 500,
    usedCount: 500,
    validFrom: "01.02.2026",
    validTo: "28.02.2026",
    isActive: false,
    restaurants: [],
    categories: [],
    description: "Бесплатная доставка",
  },
];

const CouponsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<typeof coupons[0] | null>(null);
  const [copiedCode, setCopiedCode] = useState("");

  const filteredCoupons = coupons.filter(
    (c) =>
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  const toggleActive = (id: string) => {
    console.log(`Toggle coupon ${id}`);
  };

  const openEdit = (coupon: typeof coupons[0]) => {
    setEditingCoupon(coupon);
    setShowModal(true);
  };

  const openCreate = () => {
    setEditingCoupon(null);
    setShowModal(true);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Промокоды</h1>
          <p className="text-[#2D2A26]/60 dark:text-[#E8E6E3]/60">Управление скидочными промокодами</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary dark:bg-primary-dark text-white rounded-xl hover:opacity-90"
        >
          <Plus className="w-4 h-4" />
          Создать промокод
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-[#2D2A26] rounded-xl p-4 border border-[#F5F3F0] dark:border-[#3D3A36]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 dark:bg-primary-dark/10 rounded-xl">
              <Percent className="w-5 h-5 text-primary dark:text-primary-dark" />
            </div>
            <div>
              <p className="text-2xl font-bold">{coupons.length}</p>
              <p className="text-sm text-[#2D2A26]/60">Всего промокодов</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-[#2D2A26] rounded-xl p-4 border border-[#F5F3F0] dark:border-[#3D3A36]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{coupons.filter(c => c.isActive).length}</p>
              <p className="text-sm text-[#2D2A26]/60">Активных</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-[#2D2A26] rounded-xl p-4 border border-[#F5F3F0] dark:border-[#3D3A36]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{coupons.reduce((a, c) => a + c.usedCount, 0)}</p>
              <p className="text-sm text-[#2D2A26]/60">Использовано</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-[#2D2A26] rounded-xl p-4 border border-[#F5F3F0] dark:border-[#3D3A36]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
              <ShoppingBag className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{coupons.reduce((a, c) => a + c.maxUses, 0) - coupons.reduce((a, c) => a + c.usedCount, 0)}</p>
              <p className="text-sm text-[#2D2A26]/60">Осталось</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2D2A26]/40" />
        <input
          type="text"
          placeholder="Поиск по коду или описанию..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-[#2D2A26] border border-[#F5F3F0] dark:border-[#3D3A36] focus:border-primary dark:focus:border-primary-dark focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#2D2A26] rounded-2xl border border-[#F5F3F0] dark:border-[#3D3A36] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F5F3F0] dark:bg-[#3D3A36]">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Код</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Тип</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Значение</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Мин. заказ</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Использовано</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Срок</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Статус</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F3F0] dark:divide-[#3D3A36]">
              {filteredCoupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-[#F5F3F0]/50 dark:hover:bg-[#3D3A36]/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <code className="px-3 py-1.5 bg-[#F5F3F0] dark:bg-[#3D3A36] rounded-lg font-mono font-semibold">
                        {coupon.code}
                      </code>
                      <button
                        onClick={() => copyCode(coupon.code)}
                        className="p-1.5 rounded-lg hover:bg-[#F5F3F0] dark:hover:bg-[#3D3A36]"
                        title="Копировать"
                      >
                        {copiedCode === coupon.code ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-[#2D2A26]/50" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-[#2D2A26]/50 dark:text-[#E8E6E3]/50 mt-1">{coupon.description}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      coupon.type === "percent" ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300" : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    }`}>
                      {coupon.type === "percent" ? <Percent className="w-3 h-3" /> : <DollarSign className="w-3 h-3" />}
                      {coupon.type === "percent" ? "Процент" : "Фикс. сумма"}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    {coupon.type === "percent" ? `${coupon.value}%` : `${coupon.value} ₽`}
                  </td>
                  <td className="px-4 py-3">{coupon.minOrder} ₽</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-[#F5F3F0] dark:bg-[#3D3A36] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary dark:bg-primary-dark rounded-full"
                          style={{ width: `${(coupon.usedCount / coupon.maxUses) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm">{coupon.usedCount}/{coupon.maxUses}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-[#2D2A26]/50" />
                      {coupon.validTo}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      coupon.isActive ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    }`}>
                      {coupon.isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {coupon.isActive ? "Активен" : "Неактивен"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleActive(coupon.id)}
                        className={`p-2 rounded-lg ${coupon.isActive ? "text-orange-600 hover:bg-orange-50" : "text-green-600 hover:bg-green-50"}`}
                        title={coupon.isActive ? "Деактивировать" : "Активировать"}
                      >
                        {coupon.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => openEdit(coupon)}
                        className="p-2 rounded-lg hover:bg-[#F5F3F0] dark:hover:bg-[#3D3A36]"
                        title="Редактировать"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-[#2D2A26] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#F5F3F0] dark:border-[#3D3A36]">
              <h2 className="text-xl font-display font-bold">
                {editingCoupon ? "Редактирование промокода" : "Создание промокода"}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Код промокода *</label>
                  <input
                    type="text"
                    defaultValue={editingCoupon?.code}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F3F0] dark:bg-[#3D3A36] border-0 focus:ring-2 focus:ring-primary font-mono uppercase"
                    placeholder="PIZZA20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Тип скидки *</label>
                  <select className="w-full px-4 py-2.5 rounded-xl bg-[#F5F3F0] dark:bg-[#3D3A36] border-0 focus:ring-2 focus:ring-primary">
                    <option value="percent">Процент (%)</option>
                    <option value="fixed">Фиксированная сумма (₽)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Значение скидки *</label>
                  <input
                    type="number"
                    defaultValue={editingCoupon?.value}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F3F0] dark:bg-[#3D3A36] border-0 focus:ring-2 focus:ring-primary"
                    placeholder="20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Мин. сумма заказа (₽)</label>
                  <input
                    type="number"
                    defaultValue={editingCoupon?.minOrder}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F3F0] dark:bg-[#3D3A36] border-0 focus:ring-2 focus:ring-primary"
                    placeholder="500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Макс. использований</label>
                  <input
                    type="number"
                    defaultValue={editingCoupon?.maxUses}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F3F0] dark:bg-[#3D3A36] border-0 focus:ring-2 focus:ring-primary"
                    placeholder="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Описание</label>
                  <input
                    type="text"
                    defaultValue={editingCoupon?.description}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F3F0] dark:bg-[#3D3A36] border-0 focus:ring-2 focus:ring-primary"
                    placeholder="Скидка на пиццу"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Дата начала *</label>
                  <input
                    type="date"
                    defaultValue={editingCoupon?.validFrom}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F3F0] dark:bg-[#3D3A36] border-0 focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Дата окончания *</label>
                  <input
                    type="date"
                    defaultValue={editingCoupon?.validTo}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F3F0] dark:bg-[#3D3A36] border-0 focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Привязка к ресторанам (необязательно)</label>
                <select multiple className="w-full px-4 py-2.5 rounded-xl bg-[#F5F3F0] dark:bg-[#3D3A36] border-0 focus:ring-2 focus:ring-primary h-24">
                  <option value="">Все рестораны</option>
                  <option value="1">Пельменная №1</option>
                  <option value="2">Sushi Master</option>
                  <option value="3">Pizza Napoli</option>
                  <option value="4">Burger House</option>
                </select>
                <p className="text-xs text-[#2D2A26]/50 mt-1">Оставьте пустым для всех ресторанов</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Привязка к категориям (необязательно)</label>
                <select multiple className="w-full px-4 py-2.5 rounded-xl bg-[#F5F3F0] dark:bg-[#3D3A36] border-0 focus:ring-2 focus:ring-primary h-24">
                  <option value="">Все категории</option>
                  <option value="1">Завтраки</option>
                  <option value="2">Обеды</option>
                  <option value="3">Ужины</option>
                  <option value="4">Напитки</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-[#F5F3F0] dark:border-[#3D3A36] flex gap-3 justify-end">
              <button onClick={() => setShowModal(false)} className="px-6 py-2.5 bg-[#F5F3F0] dark:bg-[#3D3A36] rounded-xl">
                Отмена
              </button>
              <button className="px-6 py-2.5 bg-primary dark:bg-primary-dark text-white rounded-xl hover:opacity-90">
                {editingCoupon ? "Сохранить" : "Создать"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponsPage;