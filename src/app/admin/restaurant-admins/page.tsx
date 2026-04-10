"use client";

import React from "react";
import { Users } from "lucide-react";

const RestaurantAdminsPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-display font-bold mb-6">Админы ресторанов</h1>
      <div className="bg-[#F5F3F0] dark:bg-[#2D2A26] rounded-2xl p-12 text-center opacity-60">
        <Users className="w-12 h-12 mx-auto mb-4" />
        <p>Управление админами ресторанов</p>
        <p className="text-sm mt-2">Добавьте email пользователя в таблице restaurant_admins</p>
      </div>
    </div>
  );
};

export default RestaurantAdminsPage;