"use client";

import React from "react";
import { Map } from "lucide-react";

const DeliveryZonesPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-display font-bold mb-6">Зоны доставки</h1>
      <div className="bg-[#F5F3F0] dark:bg-[#2D2A26] rounded-2xl p-12 text-center opacity-60">
        <Map className="w-12 h-12 mx-auto mb-4" />
        <p>Зоны доставки настраиваются в разделе Города</p>
      </div>
    </div>
  );
};

export default DeliveryZonesPage;