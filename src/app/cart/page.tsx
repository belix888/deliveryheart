"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus, MapPin, ArrowLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";

const CartPage: React.FC = () => {
  const { items, updateQuantity, removeFromCart, total, clearCart } = useCart();
  const [address, setAddress] = useState("");
  const [isOrdering, setIsOrdering] = useState(false);

  const handleOrder = () => {
    if (!address) {
      alert("Пожалуйста, укажите адрес доставки");
      return;
    }
    setIsOrdering(true);
    setTimeout(() => {
      clearCart();
      alert(
        "Заказ оформлен! Номер заказа: #" + Math.floor(Math.random() * 10000),
      );
      window.location.href = "/order";
    }, 1000);
  };

  if (items.length === 0) {
    return (
      <div className="animate-fade-in px-4 py-8">
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#F5F3F0] dark:bg-[#2D2A26] flex items-center justify-center">
            <MapPin className="w-10 h-10 text-[#2D2A26]/30 dark:text-[#E8E6E3]/30" />
          </div>
          <h2 className="text-xl font-display font-semibold mb-2">
            Корзина пуста
          </h2>
          <p className="text-[#2D2A26]/60 dark:text-[#E8E6E3]/60 mb-6">
            Добавьте блюда из ресторанов
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-primary dark:bg-primary-dark text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            Перейти к меню
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="px-4 py-4">
        <div className="flex items-center gap-2 mb-6">
          <Link
            href="/"
            className="p-2 rounded-full hover:bg-[#F5F3F0] dark:hover:bg-[#2D2A26] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#2D2A26] dark:text-[#E8E6E3]" />
          </Link>
          <h1 className="text-2xl md:text-3xl font-display font-bold">
            Корзина
          </h1>
        </div>

        {/* Cart Items */}
        <div className="space-y-4 mb-6">
          {items.map((item) => (
            <div
              key={item.dish.id}
              className="flex gap-4 bg-white dark:bg-[#2D2A26] rounded-2xl p-4 border border-[#F5F3F0] dark:border-[#3D3A36]"
            >
              <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                <Image
                  src={item.dish.image}
                  alt={item.dish.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold mb-1 truncate">
                  {item.dish.name}
                </h3>
                <p className="text-sm text-[#2D2A26]/60 dark:text-[#E8E6E3]/60 mb-2">
                  {item.dish.price} ₽
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-[#F5F3F0] dark:bg-[#3D3A36] rounded-full p-1">
                    <button
                      onClick={() =>
                        updateQuantity(item.dish.id, item.quantity - 1)
                      }
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-[#2D2A26] transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.dish.id, item.quantity + 1)
                      }
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-[#2D2A26] transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="font-bold text-primary dark:text-primary-dark">
                    {item.dish.price * item.quantity} ₽
                  </span>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item.dish.id)}
                className="self-start p-2 text-[#2D2A26]/40 hover:text-secondary dark:hover:text-secondary-dark transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Address */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Адрес доставки
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2D2A26]/40 dark:text-[#E8E6E3]/40" />
            <input
              type="text"
              placeholder="Улица, дом, квартира"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-white dark:bg-[#2D2A26] border border-[#F5F3F0] dark:border-[#3D3A36] focus:border-primary dark:focus:border-primary-dark focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Total */}
        <div className="bg-white dark:bg-[#2D2A26] rounded-2xl p-4 border border-[#F5F3F0] dark:border-[#3D3A36] mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#2D2A26]/70 dark:text-[#E8E6E3]/70">
              Сумма заказа
            </span>
            <span className="font-semibold">{total} ₽</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#2D2A26]/70 dark:text-[#E8E6E3]/70">
              Доставка
            </span>
            <span className="font-semibold text-green-500">Бесплатно</span>
          </div>
          <div className="border-t border-[#F5F3F0] dark:border-[#3D3A36] pt-2 mt-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Итого</span>
              <span className="text-2xl font-bold text-primary dark:text-primary-dark">
                {total} ₽
              </span>
            </div>
          </div>
        </div>

        {/* Order Button */}
        <button
          onClick={handleOrder}
          disabled={isOrdering}
          className="w-full py-4 bg-primary dark:bg-primary-dark text-white font-bold text-lg rounded-2xl hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isOrdering ? "Оформление..." : "Оформить заказ"}
        </button>
      </div>
    </div>
  );
};

export default CartPage;