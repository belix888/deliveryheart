"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Clock } from "lucide-react";
import { Restaurant } from "@/types";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  return (
    <Link href={`/restaurant/${restaurant.id}`}>
      <div className="group bg-white dark:bg-[#2D2A26] rounded-2xl overflow-hidden border border-[#F5F3F0] dark:border-[#3D3A36] card-hover transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 dark:hover:shadow-primary-dark/10">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={restaurant.image}
            alt={restaurant.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {restaurant.isPromoted && (
            <span className="absolute top-3 left-3 px-3 py-1 bg-secondary dark:bg-secondary-dark text-white text-xs font-semibold rounded-full">
              Акция
            </span>
          )}
        </div>
        <div className="p-4">
          <h4 className="font-display font-semibold text-lg mb-2 group-hover:text-primary dark:group-hover:text-primary-dark transition-colors">
            {restaurant.name}
          </h4>
          <div className="flex flex-wrap gap-2 mb-3">
            {restaurant.cuisines.map((cuisine) => (
              <span
                key={cuisine}
                className="text-xs px-2 py-1 bg-[#F5F3F0] dark:bg-[#3D3A36] rounded-full text-[#2D2A26]/70 dark:text-[#E8E6E3]/70"
              >
                {cuisine}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 star-filled" fill="#FFD700" />
              <span className="font-semibold text-sm">{restaurant.rating}</span>
              <span className="text-xs text-[#2D2A26]/50 dark:text-[#E8E6E3]/50">
                ({restaurant.reviewCount})
              </span>
            </div>
            <div className="flex items-center gap-1 text-[#2D2A26]/60 dark:text-[#E8E6E3]/60">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{restaurant.deliveryTime}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;