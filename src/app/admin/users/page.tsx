"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Ban,
  CheckCircle,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  ShoppingCart,
} from "lucide-react";

const users = [
  {
    id: "1",
    name: "Анна К.",
    email: "anna@example.com",
    phone: "+7 (999) 123-45-67",
    avatar: "",
    registrationDate: "15.01.2024",
    ordersCount: 12,
    totalSpent: 15680,
    isActive: true,
    role: "user",
    addresses: ["ул. Ленина, 42, кв. 15", "ул. Пушкина, 10, оф. 205"],
  },
  {
    id: "2",
    name: "Иван П.",
    email: "ivan@example.com",
    phone: "+7 (999) 234-56-78",
    avatar: "",
    registrationDate: "20.02.2024",
    ordersCount: 8,
    totalSpent: 9840,
    isActive: true,
    role: "user",
    addresses: ["ул. Гагарина, 5"],
  },
  {
    id: "3",
    name: "Мария С.",
    email: "maria@example.com",
    phone: "+7 (999) 345-67-89",
    avatar: "",
    registrationDate: "05.03.2024",
    ordersCount: 5,
    totalSpent: 4320,
    isActive: true,
    role: "user",
    addresses: ["ул. Советская, 25, кв. 8"],
  },
  {
    id: "4",
    name: "Алексей Д.",
    email: "alexey@example.com",
    phone: "+7 (999) 456-78-90",
    avatar: "",
    registrationDate: "10.04.2024",
    ordersCount: 3,
    totalSpent: 2100,
    isActive: false,
    role: "user",
    addresses: ["ул. Мира, 12"],
  },
  {
    id: "5",
    name: "Елена В.",
    email: "elena@example.com",
    phone: "+7 (999) 567-89-01",
    avatar: "",
    registrationDate: "25.04.2024",
    ordersCount: 15,
    totalSpent: 22450,
    isActive: true,
    role: "user",
    addresses: ["ул. Первомайская, 7, кв. 3", "ул. Кирова, 18"],
  },
];

const UsersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<typeof users[0] | null>(null);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery)
  );

  const toggleBan = (id: string) => {
    console.log(`Toggle ban for user ${id}`);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Пользователи</h1>
          <p className="text-[#2D2A26]/60 dark:text-[#E8E6E3]/60">Управление пользователями системы</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary dark:bg-primary-dark text-white rounded-xl hover:opacity-90">
          <Plus className="w-4 h-4" />
          Добавить пользователя
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2D2A26]/40" />
        <input
          type="text"
          placeholder="Поиск по имени, email, телефону..."
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
                <th className="px-4 py-3 text-left text-sm font-semibold">Пользователь</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Контакты</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Регистрация</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Заказы</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Потрачено</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Статус</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F3F0] dark:divide-[#3D3A36]">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[#F5F3F0]/50 dark:hover:bg-[#3D3A36]/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 dark:bg-primary-dark/20 flex items-center justify-center">
                        <span className="font-semibold text-primary dark:text-primary-dark">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-xs text-[#2D2A26]/50 dark:text-[#E8E6E3]/50">ID: {user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-3 h-3 text-[#2D2A26]/50" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-3 h-3 text-[#2D2A26]/50" />
                        {user.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{user.registrationDate}</td>
                  <td className="px-4 py-3">
                    <span className="font-semibold">{user.ordersCount}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-green-600">{user.totalSpent.toLocaleString()} ₽</span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.isActive
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {user.isActive ? <CheckCircle className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
                      {user.isActive ? "Активен" : "Заблокирован"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="p-2 rounded-lg hover:bg-[#F5F3F0] dark:hover:bg-[#3D3A36]"
                        title="Просмотр"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 rounded-lg hover:bg-[#F5F3F0] dark:hover:bg-[#3D3A36]"
                        title="Редактировать"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleBan(user.id)}
                        className={`p-2 rounded-lg ${user.isActive ? "text-red-600 hover:bg-red-50" : "text-green-600 hover:bg-green-50"}`}
                        title={user.isActive ? "Заблокировать" : "Разблокировать"}
                      >
                        {user.isActive ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-[#2D2A26] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#F5F3F0] dark:border-[#3D3A36]">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-display font-bold">Профиль пользователя</h2>
                <button onClick={() => setSelectedUser(null)} className="p-2 rounded-lg hover:bg-[#F5F3F0]">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* User Info */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-primary/20 dark:bg-primary-dark/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary dark:text-primary-dark">
                    {selectedUser.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold">{selectedUser.name}</h3>
                  <p className="text-[#2D2A26]/60 dark:text-[#E8E6E3]/60">ID: {selectedUser.id}</p>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mt-1 ${
                    selectedUser.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {selectedUser.isActive ? "Активен" : "Заблокирован"}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-[#F5F3F0] dark:bg-[#3D3A36] rounded-xl text-center">
                  <p className="text-2xl font-bold text-primary dark:text-primary-dark">{selectedUser.ordersCount}</p>
                  <p className="text-sm text-[#2D2A26]/60">заказов</p>
                </div>
                <div className="p-4 bg-[#F5F3F0] dark:bg-[#3D3A36] rounded-xl text-center">
                  <p className="text-2xl font-bold text-green-600">{selectedUser.totalSpent.toLocaleString()} ₽</p>
                  <p className="text-sm text-[#2D2A26]/60">потрачено</p>
                </div>
                <div className="p-4 bg-[#F5F3F0] dark:bg-[#3D3A36] rounded-xl text-center">
                  <p className="text-2xl font-bold">{selectedUser.addresses.length}</p>
                  <p className="text-sm text-[#2D2A26]/60">адресов</p>
                </div>
              </div>

              {/* Contacts */}
              <div className="space-y-3">
                <h4 className="font-semibold">Контакты</h4>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-[#2D2A26]/50" />
                  {selectedUser.email}
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-[#2D2A26]/50" />
                  {selectedUser.phone}
                </div>
              </div>

              {/* Addresses */}
              <div className="space-y-3">
                <h4 className="font-semibold">Адреса доставки</h4>
                <div className="space-y-2">
                  {selectedUser.addresses.map((addr, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-[#F5F3F0] dark:bg-[#3D3A36] rounded-xl">
                      <MapPin className="w-4 h-4 text-primary" />
                      {addr}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Orders */}
              <div className="space-y-3">
                <h4 className="font-semibold">Последние заказы</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-[#F5F3F0] dark:bg-[#3D3A36] rounded-xl">
                    <div className="flex items-center gap-3">
                      <ShoppingCart className="w-4 h-4 text-[#2D2A26]/50" />
                      <div>
                        <p className="font-medium">Заказ #2847</p>
                        <p className="text-xs text-[#2D2A26]/50">Пельменная №1</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">1 250 ₽</p>
                      <p className="text-xs text-green-600">Доставлен</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#F5F3F0] dark:bg-[#3D3A36] rounded-xl">
                    <div className="flex items-center gap-3">
                      <ShoppingCart className="w-4 h-4 text-[#2D2A26]/50" />
                      <div>
                        <p className="font-medium">Заказ #2834</p>
                        <p className="text-xs text-[#2D2A26]/50">Sushi Master</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">890 ₽</p>
                      <p className="text-xs text-green-600">Доставлен</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-[#F5F3F0] dark:border-[#3D3A36] flex gap-3">
              <button className="px-4 py-2.5 bg-[#F5F3F0] dark:bg-[#3D3A36] rounded-xl">Редактировать</button>
              <button className="px-4 py-2.5 bg-red-500 text-white rounded-xl hover:opacity-90">
                {selectedUser.isActive ? "Заблокировать" : "Разблокировать"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;