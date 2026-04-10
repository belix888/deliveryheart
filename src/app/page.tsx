"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Star, Clock, ArrowRight } from "lucide-react";
import { restaurants, categories, getDishesByRestaurant } from "@/data";
import { Restaurant, Dish } from "@/types";
import DishCard from "@/components/DishCard";
import RestaurantCard from "@/components/RestaurantCard";

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [popularDishes, setPopularDishes] = useState<Dish[]>([]);

  React.useEffect(() => {
    // Get popular dishes from all restaurants
    const allDishes = restaurants.flatMap((r) => getDishesByRestaurant(r.id));
    setPopularDishes(allDishes.slice(0, 6));
  }, []);

  const filteredRestaurants = restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.cuisines.some((c) =>
        c.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  const filteredByCategory = activeCategory
    ? popularDishes.filter((d) => d.category === activeCategory)
    : popularDishes;

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFF9F5] dark:from-[#1A1918] to-transparent z-10" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-20 md:opacity-100">
          <h1 className="text-[15vw] md:text-[12vw] font-display font-bold text-primary/10 dark:text-primary-dark/10 leading-none">
            ДУШИ
          </h1>
        </div>

        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 py-12">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6 leading-tight">
              Вкусная еда с{" "}
              <span className="text-primary dark:text-primary-dark">душой</span>
            </h2>
            <p className="text-lg text-[#2D2A26]/70 dark:text-[#E8E6E3]/70 mb-8">
              Заказывайте любимые блюда из лучших ресторанов города
            </p>

            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2D2A26]/40 dark:text-[#E8E6E3]/40" />
                <input
                  type="text"
                  placeholder="Что хотите заказать?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-[#2D2A26] border border-[#F5F3F0] dark:border-[#3D3A36] focus:border-primary dark:focus:border-primary-dark focus:outline-none transition-colors text-base"
                />
              </div>
              <button className="px-6 py-4 bg-primary dark:bg-primary-dark text-white font-semibold rounded-2xl hover:opacity-90 transition-opacity">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-lg font-display font-semibold mb-4">Категории</h3>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={`category-pill flex-shrink-0 px-5 py-2.5 rounded-full font-medium transition-all ${
                activeCategory === null
                  ? "active"
                  : "bg-[#F5F3F0] dark:bg-[#2D2A26] text-[#2D2A26] dark:text-[#E8E6E3] hover:bg-[#E8E6E3] dark:hover:bg-[#3D3A36]"
              }`}
            >
              Все
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`category-pill flex-shrink-0 px-5 py-2.5 rounded-full font-medium transition-all ${
                  activeCategory === category
                    ? "active"
                    : "bg-[#F5F3F0] dark:bg-[#2D2A26] text-[#2D2A26] dark:text-[#E8E6E3] hover:bg-[#E8E6E3] dark:hover:bg-[#3D3A36]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Restaurants */}
      <section className="py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-display font-semibold">
              Популярные заведения
            </h3>
            <Link
              href="/catalog"
              className="flex items-center gap-1 text-primary dark:text-primary-dark text-sm font-medium hover:opacity-80"
            >
              Все <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {restaurants.slice(0, 6).map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Dishes */}
      <section className="py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-display font-semibold">
              Популярные блюда
            </h3>
            <button className="flex items-center gap-1 text-primary dark:text-primary-dark text-sm font-medium hover:opacity-80">
              Все <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredByCategory.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;