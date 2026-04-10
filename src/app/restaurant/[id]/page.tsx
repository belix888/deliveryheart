"use client";

import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Star, Clock, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getRestaurantById, getDishesByRestaurant } from "@/data";
import DishCard from "@/components/DishCard";

const RestaurantPage: React.FC = () => {
  const params = useParams();
  const restaurantId = params.id as string;
  const restaurant = getRestaurantById(restaurantId);
  const allDishes = getDishesByRestaurant(restaurantId);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const dishesByCategory = useMemo(() => {
    const grouped: Record<string, typeof allDishes> = {};
    allDishes.forEach((dish) => {
      if (!grouped[dish.category]) {
        grouped[dish.category] = [];
      }
      grouped[dish.category].push(dish);
    });
    return grouped;
  }, [allDishes]);

  const availableCategories = Object.keys(dishesByCategory);

  if (!restaurant) {
    return (
      <div className="p-4 text-center">
        <p>Ресторан не найден</p>
        <Link href="/" className="text-primary dark:text-primary-dark">
          Вернуться на главную
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Restaurant Header */}
      <div className="relative">
        <div className="relative h-48 md:h-64 w-full">
          <Image
            src={restaurant.image}
            alt={restaurant.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <Link
            href="/"
            className="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">
            {restaurant.name}
          </h1>
          <div className="flex flex-wrap gap-2 mb-2">
            {restaurant.cuisines.map((cuisine) => (
              <span
                key={cuisine}
                className="text-xs px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white"
              >
                {cuisine}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="px-4 py-4 flex flex-wrap items-center gap-4 border-b border-[#F5F3F0] dark:border-[#3D3A36]">
        <div className="flex items-center gap-1">
          <Star className="w-5 h-5 star-filled" fill="#FFD700" />
          <span className="font-semibold">{restaurant.rating}</span>
          <span className="text-sm text-[#2D2A26]/60 dark:text-[#E8E6E3]/60">
            ({restaurant.reviewCount})
          </span>
        </div>
        <div className="flex items-center gap-1 text-[#2D2A26]/60 dark:text-[#E8E6E3]/60">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{restaurant.deliveryTime}</span>
        </div>
        <div className="flex items-center gap-1 text-[#2D2A26]/60 dark:text-[#E8E6E3]/60">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{restaurant.priceRange}</span>
        </div>
      </div>

      {/* Menu Categories */}
      <div className="px-4 py-4">
        <h2 className="text-lg font-display font-semibold mb-4">Меню</h2>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 mb-4">
          <button
            onClick={() => setActiveCategory(null)}
            className={`category-pill flex-shrink-0 px-4 py-2 rounded-full font-medium text-sm transition-all ${
              activeCategory === null
                ? "active"
                : "bg-[#F5F3F0] dark:bg-[#2D2A26] text-[#2D2A26] dark:text-[#E8E6E3] hover:bg-[#E8E6E3] dark:hover:bg-[#3D3A36]"
            }`}
          >
            Все блюда
          </button>
          {availableCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`category-pill flex-shrink-0 px-4 py-2 rounded-full font-medium text-sm transition-all ${
                activeCategory === category
                  ? "active"
                  : "bg-[#F5F3F0] dark:bg-[#2D2A26] text-[#2D2A26] dark:text-[#E8E6E3] hover:bg-[#E8E6E3] dark:hover:bg-[#3D3A36]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Dishes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(activeCategory
            ? dishesByCategory[activeCategory] || []
            : allDishes
          ).map((dish) => (
            <DishCard key={dish.id} dish={dish} showRestaurant={false} />
          ))}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="px-4 py-6 border-t border-[#F5F3F0] dark:border-[#3D3A36]">
        <h2 className="text-lg font-display font-semibold mb-4">Отзывы</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((review) => (
            <div
              key={review}
              className="bg-white dark:bg-[#2D2A26] rounded-xl p-4 border border-[#F5F3F0] dark:border-[#3D3A36]"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/20 dark:bg-primary-dark/20 flex items-center justify-center">
                    <span className="text-primary dark:text-primary-dark font-semibold">
                      А
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">Анна К.</p>
                    <p className="text-xs text-[#2D2A26]/50 dark:text-[#E8E6E3]/50">
                      2 дня назад
                    </p>
                  </div>
                </div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= 5 ? "star-filled" : "star-empty"
                      }`}
                      fill={star <= 5 ? "#FFD700" : "none"}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-[#2D2A26]/70 dark:text-[#E8E6E3]/70">
                Отличное заведение! Вкусная еда, быстрая доставка, вежливые
                курьеры. Всем рекомендую!
              </p>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 py-3 text-primary dark:text-primary-dark font-medium text-center hover:opacity-80 transition-opacity">
          Показать все отзывы
        </button>
      </div>
    </div>
  );
};

export default RestaurantPage;