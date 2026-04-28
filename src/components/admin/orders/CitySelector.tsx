"use client";

import React from "react";
import { MapPin } from "lucide-react";

// =====================================================
// TYPES
// =====================================================

interface City {
  id: string;
  name: string;
}

interface CitySelectorProps {
  cities: City[];
  selectedCity: string;
  onCityChange: (city: string) => void;
  label?: string;
}

// =====================================================
// CITY SELECTOR COMPONENT
// =====================================================

export function CitySelector({
  cities,
  selectedCity,
  onCityChange,
  label = "Город",
}: CitySelectorProps) {
  return (
    <div className="relative">
      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2D2A26]/40 pointer-events-none" />
      <select
        value={selectedCity}
        onChange={(e) => onCityChange(e.target.value)}
        className="pl-9 pr-4 py-2 rounded-xl bg-[#F5F3F0] dark:bg-[#2D2A26] outline-none focus:ring-2 focus:ring-primary text-[#2D2A26] dark:text-[#E8E6E3] appearance-none cursor-pointer min-w-[150px]"
        aria-label={label}
      >
        <option value="all">Все города</option>
        {cities.map((city) => (
          <option key={city.id} value={city.name}>
            {city.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CitySelector;