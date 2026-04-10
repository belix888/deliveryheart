"use client";

import React, { useState, useEffect } from "react";
import { fetchRestaurants, Restaurant } from "@/lib/supabase";
import RestaurantCard from "@/components/RestaurantCard";

const CatalogPage: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [deliveryFilter, setDeliveryFilter] = useState<string | null>(null);

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    setLoading(true);
    const data = await fetchRestaurants();
    setRestaurants(data);
    setLoading(false);
  };

  const filteredRestaurants = restaurants.filter((r) => {
    if (ratingFilter && (r.rating || 0) < ratingFilter) return false;
    if (deliveryFilter) {
      const minTime = r.delivery_time_min || 0;
      if (deliveryFilter === "fast" && minTime > 25) return false;
      if (deliveryFilter === "normal" && minTime <= 25) return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="px-4 py-6">
        <h1 className="text-2xl md:text-3xl font-display font-bold mb-6">
          Каталог заведений
        </h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <select
            value={ratingFilter || ""}
            onChange={(e) =>
              setRatingFilter(e.target.value ? Number(e.target.value) : null)
            }
            className="px-4 py-2.5 rounded-xl bg-white dark:bg-[#2D2A26] border border-[#F5F3F0] dark:border-[#3D3A36] focus:border-primary dark:focus:border-primary-dark focus:outline-none text-sm"
          >
            <option value="">Рейтинг</option>
            <option value="4.5">4.5+</option>
            <option value="4">4.0+</option>
            <option value="3.5">3.5+</option>
          </select>

          <select
            value={deliveryFilter || ""}
            onChange={(e) => setDeliveryFilter(e.target.value || null)}
            className="px-4 py-2.5 rounded-xl bg-white dark:bg-[#2D2A26] border border-[#F5F3F0] dark:border-[#3D3A36] focus:border-primary dark:focus:border-primary-dark focus:outline-none text-sm"
          >
            <option value="">Время доставки</option>
            <option value="fast">Быстрая (до 25 мин)</option>
            <option value="normal">Обычная (25+ мин)</option>
          </select>

          {(ratingFilter || deliveryFilter) && (
            <button
              onClick={() => {
                setRatingFilter(null);
                setDeliveryFilter(null);
              }}
              className="px-4 py-2.5 rounded-xl text-secondary dark:text-secondary-dark text-sm hover:opacity-80"
            >
              Сбросить
            </button>
          )}
        </div>

        {/* Results count */}
        <p className="text-sm text-[#2D2A26]/60 dark:text-[#E8E6E3]/60 mb-4">
          Найдено {filteredRestaurants.length} заведений
        </p>

        {/* Restaurant Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>

        {filteredRestaurants.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-[#2D2A26] rounded-2xl border">
            <p className="text-lg text-[#2D2A26]/60 dark:text-[#E8E6E3]/60">
              Ничего не найдено. Попробуйте изменить фильтры.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogPage;