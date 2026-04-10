"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Clock,
  CheckCircle,
  ChefHat,
  Truck,
  Home,
} from "lucide-react";
import { OrderStatus } from "@/types";

const statusSteps: {
  status: OrderStatus;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    status: "accepted",
    label: "Принят",
    icon: <CheckCircle className="w-6 h-6" />,
  },
  {
    status: "preparing",
    label: "Готовится",
    icon: <ChefHat className="w-6 h-6" />,
  },
  { status: "onTheWay", label: "В пути", icon: <Truck className="w-6 h-6" /> },
  {
    status: "delivered",
    label: "Доставлен",
    icon: <Home className="w-6 h-6" />,
  },
];

const OrderTrackingPage: React.FC = () => {
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>("accepted");
  const [timeLeft, setTimeLeft] = useState(35 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timeouts = [
      setTimeout(() => setCurrentStatus("preparing"), 10000),
      setTimeout(() => setCurrentStatus("onTheWay"), 20000),
      setTimeout(() => setCurrentStatus("delivered"), 35000),
    ];

    return () => timeouts.forEach(clearTimeout);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const currentIndex = statusSteps.findIndex((s) => s.status === currentStatus);

  return (
    <div className="animate-fade-in">
      <div className="px-4 py-4">
        <div className="flex items-center gap-2 mb-6">
          <Link
            href="/"
            className="p-2 rounded-full hover:bg-[#F5F3F0] dark:hover:bg-[#2D2A26] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#2D2A26] dark:text-[#E8E6E3]" />
          </Link>
          <h1 className="text-2xl md:text-3xl font-display font-bold">
            Отслеживание заказа
          </h1>
        </div>

        <div className="bg-white dark:bg-[#2D2A26] rounded-2xl p-4 border border-[#F5F3F0] dark:border-[#3D3A36] mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#2D2A26]/60 dark:text-[#E8E6E3]/60">
              Заказ
            </span>
            <span className="font-semibold">#2847</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#2D2A26]/60 dark:text-[#E8E6E3]/60">
              Ресторан
            </span>
            <span className="font-semibold">Пельменная №1</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <p className="text-sm text-[#2D2A26]/60 dark:text-[#E8E6E3]/60 mb-2">
            Ожидаемое время доставки
          </p>
          <div className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary-dark/10 px-6 py-3 rounded-2xl">
            <Clock className="w-6 h-6 text-primary dark:text-primary-dark" />
            <span className="text-3xl font-bold text-primary dark:text-primary-dark">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-6 left-0 right-0 h-1 bg-[#F5F3F0] dark:bg-[#3D3A36] rounded-full">
              <div
                className="h-full bg-primary dark:bg-primary-dark rounded-full transition-all duration-500"
                style={{
                  width: `${(currentIndex / (statusSteps.length - 1)) * 100}%`,
                }}
              />
            </div>

            {statusSteps.map((step, index) => (
              <div
                key={step.status}
                className="flex flex-col items-center relative z-10"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    index <= currentIndex
                      ? "bg-primary dark:bg-primary-dark text-white"
                      : "bg-[#F5F3F0] dark:bg-[#3D3A36] text-[#2D2A26]/40 dark:text-[#E8E6E3]/40"
                  }`}
                >
                  {step.icon}
                </div>
                <span
                  className={`mt-2 text-xs font-medium text-center ${
                    index <= currentIndex
                      ? "text-primary dark:text-primary-dark"
                      : "text-[#2D2A26]/40 dark:text-[#E8E6E3]/40"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#F5F3F0] dark:bg-[#2D2A26] rounded-2xl p-8 mb-6 text-center">
          <MapPin className="w-12 h-12 text-primary dark:text-primary-dark mx-auto mb-4" />
          <p className="text-[#2D2A26]/70 dark:text-[#E8E6E3]/70">
            Карта с позицией курьера
          </p>
          <p className="text-sm text-[#2D2A26]/50 dark:text-[#E8E6E3]/50 mt-2">
            (Имитация отслеживания)
          </p>
        </div>

        <div className="bg-white dark:bg-[#2D2A26] rounded-2xl p-4 border border-[#F5F3F0] dark:border-[#3D3A36]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary-dark/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary dark:text-primary-dark" />
            </div>
            <div>
              <p className="text-sm text-[#2D2A26]/60 dark:text-[#E8E6E3]/60">
                Адрес доставки
              </p>
              <p className="font-semibold">ул. Ленина, 42, кв. 15</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;