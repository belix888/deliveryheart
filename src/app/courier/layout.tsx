"use client";

import React from "react";
import { usePathname } from "next/navigation";
import BottomNav from "@/components/courier/BottomNav";

export default function CourierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  return (
    <div className="min-h-screen bg-[#0A0A09]">
      {children}
      <BottomNav />
    </div>
  );
}