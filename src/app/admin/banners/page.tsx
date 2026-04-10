"use client";

import React, { useState } from "react";
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Image, ArrowUp, ArrowDown } from "lucide-react";

const banners = [
  { id: "1", title: "Пицца 30% скидка", text: "Закажи пиццу и получи скидку", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800", link: "/catalog?promo=pizza", position: 1, isActive: true, dates: "01.04-30.04" },
  { id: "2", title: "Роллы 2+1=3", text: "При заказе 2 роллов - 3-й в подарок", image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800", link: "/restaurant/sushi-master", position: 2, isActive: true, dates: "05.04-15.05" },
  { id: "3", title: "Бесплатная доставка", text: "Доставка бесплатно от 500 ₽", image: "https://images.unsplash.com/photo-1565299624946-b28f40a446ae?w=800", link: "/catalog", position: 3, isActive: false, dates: "01.03-31.03" },
];

const BannersPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div><h1 className="text-2xl font-display font-bold">Баннеры</h1><p className="text-[#2D2A26]/60">Баннеры на главной странице</p></div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl"><Plus className="w-4 h-4" />Добавить баннер</button>
      </div>

      <div className="space-y-4">
        {banners.map(banner => (
          <div key={banner.id} className="bg-white dark:bg-[#2D2A26] rounded-2xl border p-4 flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-48 h-32 bg-[#F5F3F0] rounded-xl overflow-hidden">
              <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">{banner.title}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#2D2A26]/60">Позиция: {banner.position}</span>
                  <button className="p-1 hover:bg-[#F5F3F0] rounded"><ArrowUp className="w-4 h-4" /></button>
                  <button className="p-1 hover:bg-[#F5F3F0] rounded"><ArrowDown className="w-4 h-4" /></button>
                </div>
              </div>
              <p className="text-[#2D2A26]/70 mb-2">{banner.text}</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-[#2D2A26]/50">{banner.dates}</span>
                <span className="text-primary">{banner.link}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className={`p-2 rounded-full ${banner.isActive ? "bg-green-500" : "bg-gray-400"}`}>
                {banner.isActive ? <ToggleRight className="w-5 h-5 text-white" /> : <ToggleLeft className="w-5 h-5 text-white" />}
              </button>
              <button className="p-2 hover:bg-[#F5F3F0] rounded"><Edit className="w-4 h-4" /></button>
              <button className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-[#2D2A26] rounded-2xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold mb-4">Добавить баннер</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium mb-2">Заголовок</label><input type="text" className="w-full px-4 py-2.5 rounded-xl bg-[#F5F3F0]" placeholder="Заголовок" /></div>
              <div><label className="block text-sm font-medium mb-2">Текст</label><input type="text" className="w-full px-4 py-2.5 rounded-xl bg-[#F5F3F0]" placeholder="Текст" /></div>
              <div><label className="block text-sm font-medium mb-2">URL изображения</label><input type="url" className="w-full px-4 py-2.5 rounded-xl bg-[#F5F3F0]" placeholder="https://" /></div>
              <div><label className="block text-sm font-medium mb-2">Ссылка</label><input type="url" className="w-full px-4 py-2.5 rounded-xl bg-[#F5F3F0]" placeholder="/catalog" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-2">Дата начала</label><input type="date" className="w-full px-4 py-2.5 rounded-xl bg-[#F5F3F0]" /></div>
                <div><label className="block text-sm font-medium mb-2">Дата окончания</label><input type="date" className="w-full px-4 py-2.5 rounded-xl bg-[#F5F3F0]" /></div>
              </div>
            </div>
            <div className="flex gap-3 mt-6"><button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 bg-[#F5F3F0] rounded-xl">Отмена</button><button className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl">Создать</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannersPage;