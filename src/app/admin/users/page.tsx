"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Shield, User, X, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface UserRecord {
  id: string;
  email: string;
  phone: string;
  full_name: string;
  role: string;
  is_verified: boolean;
  created_at: string;
}

export default function UsersAdminPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [newRole, setNewRole] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setUsers(data);
    setLoading(false);
  };

  const updateRole = async (userId: string, role: string) => {
    await supabase
      .from("users")
      .update({ role })
      .eq("id", userId);
    loadUsers();
    setEditingUser(null);
  };

  const deleteUser = async (userId: string) => {
    if (confirm("Удалить этого пользователя?")) {
      await supabase.from("users").delete().eq("id", userId);
      loadUsers();
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      !searchQuery ||
      u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone?.includes(searchQuery)
  );

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold">Пользователи</h1>
        <p className="text-[#2D2A26]/60">{users.length} пользователей</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2D2A26]/40" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск по имени, email или телефону"
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#F5F3F0] dark:bg-[#2D2A26] outline-none"
        />
      </div>

      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="bg-[#F5F3F0] dark:bg-[#2D2A26] rounded-2xl p-4"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{user.full_name || "Без имени"}</p>
                  <p className="text-sm text-[#2D2A26]/60">
                    {user.email || user.phone || "Нет контактов"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.role === "admin"
                      ? "bg-red-100 text-red-700"
                      : user.role === "moderator"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {user.role === "admin"
                    ? "Админ"
                    : user.role === "moderator"
                    ? "Модератор"
                    : "Пользователь"}
                </span>
                {user.is_verified && (
                  <Check className="w-4 h-4 text-green-500" />
                )}
              </div>
            </div>

            <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#2D2A26]/10">
              <span className="text-sm text-[#2D2A26]/60">
                Регистрация: {formatDate(user.created_at)}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingUser(user);
                    setNewRole(user.role);
                  }}
                  className="p-2 text-[#2D2A26]/60 hover:text-[#2D2A26]"
                >
                  <Shield className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteUser(user.id)}
                  className="p-2 text-red-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12 text-[#2D2A26]/60">
          Пользователи не найдены
        </div>
      )}

      {/* Modal для изменения роли */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-[#2D2A26] rounded-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Изменить роль</h2>
            <p className="text-[#2D2A26]/60 mb-4">
              Пользователь: {editingUser.full_name}
            </p>

            <div className="space-y-2 mb-6">
              {[
                { value: "user", label: "Пользователь" },
                { value: "moderator", label: "Модератор" },
                { value: "admin", label: "Админ" },
              ].map((role) => (
                <button
                  key={role.value}
                  onClick={() => setNewRole(role.value)}
                  className={`w-full p-3 rounded-xl text-left flex items-center justify-between ${
                    newRole === role.value
                      ? "bg-primary/10 border-2 border-primary"
                      : "bg-[#F5F3F0] dark:bg-[#3D3A36]"
                  }`}
                >
                  <span>{role.label}</span>
                  {newRole === role.value && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setEditingUser(null)}
                className="flex-1 py-3 bg-[#F5F3F0] dark:bg-[#3D3A36] rounded-xl"
              >
                Отмена
              </button>
              <button
                onClick={() => updateRole(editingUser.id, newRole)}
                className="flex-1 py-3 bg-primary dark:bg-primary-dark text-white rounded-xl"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}