"use client";

import React, { useState } from "react";
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, MapPin, Package } from "lucide-react";

const cities = [
  { id: "1", name: "Сураж", region: "Брянская область", isActive: true, restaurants: 3, orders: 156 },
  { id: "2", name: "Дятьково", region: "Брянская область", isActive: false, restaurants: 0, orders: 0 },
  { id: "3", name: "Клинцы", region: "Брянская область", isActive: false, restaurants: 0, orders: 0 },
];

const CitiesPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Города</h1>
          <p className="text-[#2D2A26]/60">Управление городами доставки</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl">
          <Plus className="w-4 h-4" />Добавить город
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cities.map(city => (
          <div key={city.id} className="bg-white dark:bg-[#2D2A26] rounded-2xl border border-[#F5F3F0] p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-xl"><MapPin className="w-5 h-5 text-primary" /></div>
                <div>
                  <h3 className="font-semibold">{city.name}</h3>
                  <p className="text-sm text-[#2D2A26]/60">{city.region}</p>
                </div>
              </div>
              <button className={`p-2 rounded-full ${city.isActive ? "bg-green-500" : "bg-gray-400"}`}>
                {city.isActive ? <ToggleRight className="w-5 h-5 text-white" /> : <ToggleLeft className="w-5 h-5 text-white" />}
              </button>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#2D2A26]/60">{city.restaurants} ресторанов</span>
              <span className="text-[#2D2A26]/60">{city.orders} заказов</span>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#F5F3F0] rounded-lg"><Edit className="w-4 h-4" />Изменить</button>
              <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-[#2D2A26] rounded-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Добавить город</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium mb-2">Название</label><input type="text" className="w-full px-4 py-2.5 rounded-xl bg-[#F5F3F0]" placeholder="Название города" /></div>
              <div><label className="block text-sm font-medium mb-2">Область</label><input type="text" className="w-full px-4 py-2.5 rounded-xl bg-[#F5F3F0]" placeholder="Область" /></div>
              <div><label className="block text-sm font-medium mb-2">Координаты (широта, долгота)</label><input type="text" className="w-full px-4 py-2.5 rounded-xl bg-[#F5F3F0]" placeholder="52.5, 32.5" /></div>
            </div>
            <div className="flex gap-3 mt-6"><button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 bg-[#F5F3F0] rounded-xl">Отмена</button><button className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl">Создать</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitiesPage;