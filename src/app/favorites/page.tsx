"use client";

import React, { useState, useEffect } from "react";
import { supabase, fetchRestaurants, fetchFavorites, Restaurant } from "@/lib/supabase";
import RestaurantCard from "@/components/RestaurantCard";

const FavoritesPage: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [needsAuth, setNeedsAuth] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      // Try to get any user from users table (for demo access)
      const { data: users } = await supabase.from('users').select('*').limit(1).single();
      
      if (users) {
        const favs = await fetchFavorites(users.id);
        setRestaurants(favs);
        setNeedsAuth(false);
      } else {
        // No user found - need to login
        setNeedsAuth(true);
        setRestaurants([]);
      }
    } catch {
      setNeedsAuth(true);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="px-4 py-4">
        <h1 className="text-2xl md:text-3xl font-display font-bold mb-6">
          Избранное
        </h1>

        {restaurants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-[#2D2A26] rounded-2xl border">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#F5F3F0] dark:bg-[#2D2A26] flex items-center justify-center">
              <svg
                className="w-10 h-10 text-[#2D2A26]/30 dark:text-[#E8E6E3]/30"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-display font-semibold mb-2">
              Нет избранных
            </h2>
            <p className="text-[#2D2A26]/60 dark:text-[#E8E6E3]/60">
              Добавляйте заведения в избранное
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;