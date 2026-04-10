"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Star, Clock, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { fetchRestaurants, fetchCategories, fetchMenuItems, Restaurant, Category, MenuItem } from "@/lib/supabase";
import DishCard from "@/components/DishCard";

const RestaurantPage: React.FC = () => {
  const params = useParams();
  const restaurantId = params.id as string;
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    loadRestaurantData();
  }, [restaurantId]);

  const loadRestaurantData = async () => {
    setLoading(true);
    
    // Fetch restaurant
    const restaurants = await fetchRestaurants();
    const found = restaurants.find(r => r.id === restaurantId);
    setRestaurant(found || null);
    
    if (found) {
      // Fetch categories
      const cats = await fetchCategories(restaurantId);
      setCategories(cats);
      
      // Fetch all menu items
      let allItems: MenuItem[] = [];
      for (const cat of cats) {
        const items = await fetchMenuItems(cat.id);
        allItems = [...allItems, ...items.map(item => ({ ...item, category_name: cat.name }))];
      }
      setMenuItems(allItems);
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

  if (!restaurant) {
    return (
      <div className="p-4 text-center">
        <p className="text-xl mb-4">Ресторан не найден</p>
        <Link href="/" className="text-primary dark:text-primary-dark">
          Вернуться на главную
        </Link>
      </div>
    );
  }

  const imageUrl = restaurant.cover_url || restaurant.logo_url || 'https://images.unsplash.com/photo-1565299624946-b28f40a446ae?w=800&h=400&fit=crop';

  return (
    <div className="animate-fade-in">
      {/* Restaurant Header */}
      <div className="relative">
        <div className="relative h-48 md:h-64 w-full">
          <Image
            src={imageUrl}
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
          <p className="text-white/80 text-sm">{restaurant.address}</p>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="px-4 py-4 flex flex-wrap items-center gap-4 border-b border-[#F5F3F0] dark:border-[#3D3A36]">
        <div className="flex items-center gap-1">
          <Star className="w-5 h-5 star-filled" fill="#FFD700" />
          <span className="font-semibold">{restaurant.rating?.toFixed(1) || '0.0'}</span>
          <span className="text-sm text-[#2D2A26]/60 dark:text-[#E8E6E3]/60">
            ({restaurant.review_count || 0})
          </span>
        </div>
        <div className="flex items-center gap-1 text-[#2D2A26]/60 dark:text-[#E8E6E3]/60">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{restaurant.delivery_time_min}-{restaurant.delivery_time_max} мин</span>
        </div>
        <div className="flex items-center gap-1 text-[#2D2A26]/60 dark:text-[#E8E6E3]/60">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">от {restaurant.delivery_price} ₽</span>
        </div>
      </div>

      {/* Description */}
      {restaurant.description && (
        <div className="px-4 py-4 border-b border-[#F5F3F0] dark:border-[#3D3A36]">
          <p className="text-[#2D2A26]/70 dark:text-[#E8E6E3]/70">{restaurant.description}</p>
        </div>
      )}

      {/* Menu Categories */}
      <div className="px-4 py-4">
        <h2 className="text-lg font-display font-semibold mb-4">Меню</h2>
        
        {categories.length === 0 ? (
          <div className="text-center py-8 bg-white dark:bg-[#2D2A26] rounded-xl border">
            <p className="text-[#2D2A26]/60">Меню пока не добавлено</p>
          </div>
        ) : (
          <>
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
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`category-pill flex-shrink-0 px-4 py-2 rounded-full font-medium text-sm transition-all ${
                    activeCategory === category.id
                      ? "active"
                      : "bg-[#F5F3F0] dark:bg-[#2D2A26] text-[#2D2A26] dark:text-[#E8E6E3] hover:bg-[#E8E6E3] dark:hover:bg-[#3D3A36]"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Dishes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(activeCategory
                ? menuItems.filter(item => item.category_id === activeCategory)
                : menuItems
              ).map((dish) => (
                <DishCard key={dish.id} dish={dish} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RestaurantPage;