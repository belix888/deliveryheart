"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus, MapPin, ArrowLeft, CreditCard, Printer } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { supabase, createOrder, Address, fetchAddresses } from "@/lib/supabase";

const CartPage: React.FC = () => {
  const { items, updateQuantity, removeFromCart, total, deliveryPrice, clearCart, restaurant } = useCart();
  const { user } = useAuth();
  const [address, setAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [comment, setComment] = useState("");
  const [isOrdering, setIsOrdering] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    const { data: users } = await supabase.from('users').select('id').limit(1);
    if (users && users.length > 0) {
      const uid = users[0].id;
      setUserId(uid);
      const addrs = await fetchAddresses(uid);
      setSavedAddresses(addrs);
      
      // Автозаполнение дефолтного адреса
      const defaultAddr = addrs.find(a => a.is_default);
      if (defaultAddr) {
        setAddress(defaultAddr.address_text);
      }
    }
  };

  const handleOrder = async () => {
    // Require authentication before ordering
    if (!user) {
      window.location.href = '/auth';
      return;
    }
    
    if (!address) {
      setError("Пожалуйста, укажите адрес доставки");
      return;
    }
    
    if (!restaurant) {
      setError("Выберите ресторан");
      return;
    }

    setError(null);
    setIsOrdering(true);

    try {
      // Получаем userId если есть из AuthContext
      let currentUserId = userId;
      if (!currentUserId) {
        currentUserId = 'guest';
      }
      
      // Создаём адрес если его нет в сохранённых
      let addressId = null;
      
      // Пробуем найти существующий адрес (частичное совпадение)
      const existingAddr = savedAddresses.find(a => 
        a.address_text?.includes(address) || address?.includes(a.address_text)
      );
      if (existingAddr) {
        addressId = existingAddr.id;
      } else if (currentUserId) {
        // Создаём новый адрес
        const { data: newAddr } = await supabase
          .from('addresses')
          .insert({
            user_id: currentUserId,
            address_text: address,
            apartment: apartment || undefined,
            comment: comment || undefined,
            is_default: savedAddresses.length === 0,
          })
          .select()
          .single();
        
        if (newAddr) {
          addressId = newAddr.id;
        }
      }

      // Создаём заказ
      const orderData = {
        user_id: currentUserId || 'guest',
        restaurant_id: restaurant.id,
        delivery_address_id: addressId,
        total_amount: total,
        delivery_price: deliveryPrice,
        final_amount: total + deliveryPrice,
        comment: comment || undefined,
      };

      console.log('Creating order with data:', orderData);
      
      const order = await createOrder(orderData);
      
      console.log('Order result:', order);

      if (order) {
        setOrderNumber(order.order_number);
        
        // Добавляем позиции заказа
        if (items.length > 0) {
          const orderItems = items.map(item => ({
            order_id: order.id,
            menu_item_id: item.dish.id,
            quantity: item.quantity,
            price: item.dish.price,
            total_price: item.dish.price * item.quantity,
          }));
          
          console.log('Adding order items:', orderItems);
          await supabase.from('order_items').insert(orderItems);
        }
        
        clearCart();
      } else {
        console.error('Order creation failed - order is null');
        setError("Ошибка при создании заказа. Попробуйте ещё раз.");
        setIsOrdering(false);
      }
    } catch (err) {
      console.error('Order error:', err);
      setError("Произошла ошибка. Попробуйте ещё раз.");
      setIsOrdering(false);
    }
  };

  // Успешный заказ
  if (orderNumber) {
    return (
      <div className="animate-fade-in px-4 py-8">
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <Printer className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-display font-bold mb-2">Заказ оформлен!</h2>
          <p className="text-[#2D2A26]/60 mb-2">Спасибо за заказ</p>
          <p className="text-3xl font-bold mb-6">#{orderNumber}</p>
          <p className="text-sm text-[#2D2A26]/60 mb-8">
            Мы отправим уведомление, когда заказ будет готов
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-primary dark:bg-primary-dark text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            Вернуться на главную
          </Link>
        </div>
      </div>
    );
  }

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
  };

  return (
    <div className="animate-fade-in px-4 py-8">
      <Link href={restaurant ? `/restaurant/${restaurant.id}` : "/"} className="flex items-center gap-2 mb-6 text-[#2D2A26]/60 dark:text-[#E8E6E3]/60">
        <ArrowLeft className="w-4 h-4" />
        {restaurant ? restaurant.name : "Назад"}
      </Link>

      <h1 className="text-2xl font-display font-bold mb-6">Корзина</h1>

      {/* Items */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.dish.id} className="flex gap-4 bg-[#F5F3F0] dark:bg-[#2D2A26] rounded-2xl p-4">
            {item.dish.image && (
              <div className="w-16 h-16 rounded-xl overflow-hidden relative flex-shrink-0">
                <Image src={item.dish.image} alt={item.dish.name} fill sizes="64px" className="object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{item.dish.name}</p>
              <p className="text-sm text-[#2D2A26]/60 dark:text-[#E8E6E3]/60">{item.dish.category}</p>
              <p className="font-semibold">{formatPrice(item.dish.price)}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateQuantity(item.dish.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="w-8 h-8 rounded-full bg-[#2D2A26]/10 dark:bg-[#E8E6E3]/10 flex items-center justify-center disabled:opacity-50"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-medium">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.dish.id, item.quantity + 1)}
                className="w-8 h-8 rounded-full bg-[#2D2A26]/10 dark:bg-[#E8E6E3]/10 flex items-center justify-center"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => removeFromCart(item.dish.id)}
              className="p-2 text-red-400 hover:text-red-600"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {/* Address */}
      <div className="mb-6">
        <h2 className="font-semibold mb-3">Адрес доставки</h2>
        
        {savedAddresses.length > 0 && (
          <div className="mb-3 space-y-2">
            {savedAddresses.map(addr => (
              <button
                key={addr.id}
                onClick={() => setAddress(addr.address_text)}
                className={`w-full text-left p-3 rounded-xl border-2 transition-colors ${
                  address === addr.address_text
                    ? "border-primary dark:border-primary-dark bg-primary/5"
                    : "border-transparent bg-[#F5F3F0] dark:bg-[#2D2A26]"
                }`}
              >
                <MapPin className="w-4 h-4 inline mr-2" />
                {addr.address_text}
                {addr.apartment && <span className="text-sm ml-2">кв. {addr.apartment}</span>}
              </button>
            ))}
          </div>
        )}
        
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Улица, дом, подъезд"
          className="w-full p-4 rounded-xl bg-[#F5F3F0] dark:bg-[#2D2A26] border-2 border-transparent focus:border-primary dark:focus:border-primary-dark outline-none"
        />
        
        <div className="flex gap-3 mt-3">
          <input
            type="text"
            value={apartment}
            onChange={(e) => setApartment(e.target.value)}
            placeholder="Квартира"
            className="flex-1 p-4 rounded-xl bg-[#F5F3F0] dark:bg-[#2D2A26] border-2 border-transparent focus:border-primary dark:focus:border-primary-dark outline-none"
          />
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Комментарий"
            className="flex-1 p-4 rounded-xl bg-[#F5F3F0] dark:bg-[#2D2A26] border-2 border-transparent focus:border-primary dark:focus:border-primary-dark outline-none"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl">
          {error}
        </div>
      )}

      {/* Total */}
      <div className="bg-[#F5F3F0] dark:bg-[#2D2A26] rounded-2xl p-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-[#2D2A26]/60 dark:text-[#E8E6E3]/60">Товары</span>
          <span>{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#2D2A26]/60 dark:text-[#E8E6E3]/60">Доставка</span>
          <span>{deliveryPrice > 0 ? formatPrice(deliveryPrice) : "Бесплатно"}</span>
        </div>
        <div className="flex justify-between text-lg font-bold pt-2 border-t border-[#2D2A26]/10">
          <span>Итого</span>
          <span>{formatPrice(total + deliveryPrice)}</span>
        </div>
      </div>

      {/* Order Button */}
      <button
        onClick={handleOrder}
        disabled={isOrdering}
        className="w-full mt-6 py-4 bg-primary dark:bg-primary-dark text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isOrdering ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Оформление...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            Оформить заказ
          </>
        )}
      </button>
    </div>
  );
};

export default CartPage;