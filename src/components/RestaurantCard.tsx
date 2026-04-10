"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Clock } from "lucide-react";
import { Restaurant } from "@/lib/supabase";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const imageUrl = restaurant.cover_url || restaurant.logo_url || 'https://images.unsplash.com/photo-1565299624946-b28f40a446ae?w=400&h=300&fit=crop';
  
  return (
    <Link href={`/restaurant/${restaurant.id}`}>
      <div className="group bg-white dark:bg-[#2D2A26] rounded-2xl overflow-hidden border border-[#F5F3F0] dark:border-[#3D3A36] card-hover transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 dark:hover:shadow-primary-dark/10">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={imageUrl}
            alt={restaurant.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <h4 className="font-display font-semibold text-lg mb-2 group-hover:text-primary dark:group-hover:text-primary-dark transition-colors">
            {restaurant.name}
          </h4>
          <p className="text-sm text-[#2D2A26]/60 dark:text-[#E8E6E3]/60 mb-3 line-clamp-2">
            {restaurant.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 star-filled" fill="#FFD700" />
              <span className="font-semibold text-sm">{restaurant.rating?.toFixed(1) || '0.0'}</span>
              <span className="text-xs text-[#2D2A26]/50 dark:text-[#E8E6E3]/50">
                ({restaurant.review_count || 0})
              </span>
            </div>
            <div className="flex items-center gap-1 text-[#2D2A26]/60 dark:text-[#E8E6E3]/60">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{restaurant.delivery_time_min}-{restaurant.delivery_time_max} мин</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;