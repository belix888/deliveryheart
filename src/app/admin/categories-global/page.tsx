"use client";

import React, { useState } from "react";
import { Plus, Edit, Trash2, GripVertical, Eye, EyeOff } from "lucide-react";

const categories = [
  { id: "1", name: "Завтраки", icon: "🍳", isActive: true, sortOrder: 1 },
  { id: "2", name: "Обеды", icon: "🍱", isActive: true, sortOrder: 2 },
  { id: "3", name: "Ужины", icon: "🍽️", isActive: true, sortOrder: 3 },
  { id: "4", name: "Напитки", icon: "☕", isActive: true, sortOrder: 4 },
  { id: "5", name: "Выпечка", icon: "🥐", isActive: false, sortOrder: 5 },
];

const CategoriesGlobalPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div><h1 className="text-2xl font-display font-bold">Категории</h1><p className="text-[#2D2A26]/60">Глобальные категории на главной</p></div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl"><Plus className="w-4 h-4" />Добавить категорию</button>
      </div>

      <div className="bg-white dark:bg-[#2D2A26] rounded-2xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#F5F3F0]"><tr><th className="px-4 py-3 text-left">Сортировка</th><th className="px-4 py-3 text-left">Иконка</th><th className="px-4 py-3 text-left">Название</th><th className="px-4 py-3 text-left">Статус</th><th className="px-4 py-3 text-left">Действия</th></tr></thead>
          <tbody className="divide-y">
            {categories.map(cat => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="px-4 py-3"><GripVertical className="w-5 h-5 text-gray-400 cursor-move" /></td>
                <td className="px-4 py-3 text-2xl">{cat.icon}</td>
                <td className="px-4 py-3 font-medium">{cat.name}</td>
                <td className="px-4 py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${cat.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{cat.isActive ? "Активна" : "Скрыта"}</span></td>
                <td className="px-4 py-3"><div className="flex gap-2"><button className="p-2 hover:bg-[#F5F3F0] rounded"><Edit className="w-4 h-4" /></button><button className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-[#2D2A26] rounded-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Добавить категорию</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium mb-2">Название</label><input type="text" className="w-full px-4 py-2.5 rounded-xl bg-[#F5F3F0]" placeholder="Название" /></div>
              <div><label className="block text-sm font-medium mb-2">Иконка (emoji)</label><input type="text" className="w-full px-4 py-2.5 rounded-xl bg-[#F5F3F0]" placeholder="🍕" /></div>
            </div>
            <div className="flex gap-3 mt-6"><button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 bg-[#F5F3F0] rounded-xl">Отмена</button><button className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl">Создать</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesGlobalPage;