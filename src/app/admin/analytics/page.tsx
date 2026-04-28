"use client";

import React, { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, DollarSign, ShoppingCart } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface AnalyticsStats {
  ordersToday: number;
  revenue: number;
  newCustomers: number;
  avgCheck: number;
}

const AnalyticsPage = () => {
  const [stats, setStats] = useState<AnalyticsStats>({
    ordersToday: 0,
    revenue: 0,
    newCustomers: 0,
    avgCheck: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Get today's date
      const today = new Date().toISOString().split('T')[0];

      // Fetch orders today
      const { data: orders } = await supabase
        .from('orders')
        .select('total_amount, created_at')
        .gte('created_at', today);

      const ordersCount = orders?.length || 0;
      const revenue = orders?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0;

      // Fetch new customers this month
      const monthStart = new Date();
      monthStart.setDate(1);
      const { data: users } = await supabase
        .from('users')
        .select('id')
        .gte('created_at', monthStart.toISOString());

      const newCustomers = users?.length || 0;
      const avgCheck = ordersCount > 0 ? Math.round(revenue / ordersCount) : 0;

      setStats({
        ordersToday: ordersCount,
        revenue,
        newCustomers,
        avgCheck,
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-display font-bold mb-6">Аналитика</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: ShoppingCart, label: "Заказы сегодня", value: stats.ordersToday.toString(), color: "bg-blue-100" },
          { icon: DollarSign, label: "Выручка", value: formatPrice(stats.revenue), color: "bg-green-100" },
          { icon: Users, label: "Новые клиенты", value: stats.newCustomers.toString(), color: "bg-purple-100" },
          { icon: TrendingUp, label: "Средний чек", value: formatPrice(stats.avgCheck), color: "bg-orange-100" },
        ].map((item, i) => (
          <div key={i} className={`${item.color} rounded-2xl p-6`}>
            <item.icon className="w-8 h-8 mb-2" />
            <p className="text-2xl font-bold">{item.value}</p>
            <p className="text-sm opacity-60">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#F5F3F0] dark:bg-[#2D2A26] rounded-2xl p-6 text-center opacity-60">
        <BarChart3 className="w-12 h-12 mx-auto mb-4" />
        <p>Детальная аналитика скоро появится</p>
      </div>
    </div>
  );
};

export default AnalyticsPage;