"use client";

import React, { useState, useEffect } from "react";
import { Search, Trash2, ToggleLeft, ToggleRight, Copy } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Coupon {
  id: string;
  code: string;
  description: string;
  discount_type: string;
  discount_value: number;
  min_order_amount: number;
  max_uses: number;
  used_count: number;
  is_active: boolean;
  valid_to: string;
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => { loadCoupons(); }, []);

  const loadCoupons = async () => {
    setLoading(true);
    const { data } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
    if (data) setCoupons(data);
    setLoading(false);
  };

  const toggleActive = async (id: string, active: boolean) => {
    await supabase.from('coupons').update({ is_active: !active }).eq('id', id);
    loadCoupons();
  };

  const deleteCoupon = async (id: string) => {
    if (confirm('Удалить промокод?')) {
      await supabase.from('coupons').delete().eq('id', id);
      loadCoupons();
    }
  };

  const formatPrice = (price: number) => new Intl.NumberFormat('ru-RU').format(price || 0) + ' ₽';
  const formatDate = (date: string) => date ? new Date(date).toLocaleDateString('ru-RU') : 'Без срока';

  const filteredCoupons = coupons.filter(c => !searchQuery || c.code?.toLowerCase().includes(searchQuery.toLowerCase()));

  if (loading) {
    return <div className="flex items-center justify-center min-h-[50vh]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold">Промокоды</h1>
        <p className="text-[#2D2A26]/60">{coupons.length} промокодов</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2D2A26]/40" />
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Поиск по коду" className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#F5F3F0] dark:bg-[#2D2A26] outline-none" />
      </div>

      <div className="space-y-4">
        {filteredCoupons.map((coupon) => (
          <div key={coupon.id} className={`bg-[#F5F3F0] dark:bg-[#2D2A26] rounded-2xl p-4 ${!coupon.is_active ? 'opacity-50' : ''}`}>
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <code className="text-xl font-bold font-mono">{coupon.code}</code>
                  <button onClick={() => navigator.clipboard.writeText(coupon.code)} className="p-1 text-[#2D2A26]/40 hover:text-[#2D2A26]"><Copy className="w-4 h-4" /></button>
                </div>
                <p className="text-sm text-[#2D2A26]/60">{coupon.description}</p>
              </div>
              <button onClick={() => toggleActive(coupon.id, coupon.is_active)}>
                {coupon.is_active ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6 text-gray-400" />}
              </button>
            </div>
            <div className="flex gap-4 mt-3 text-sm text-[#2D2A26]/60">
              <span>{coupon.discount_type === 'percent' ? `${coupon.discount_value}%` : formatPrice(coupon.discount_value)}</span>
              <span>от {formatPrice(coupon.min_order_amount)}</span>
              <span>{coupon.used_count}/{coupon.max_uses || '∞'}</span>
              <span>до {formatDate(coupon.valid_to)}</span>
            </div>
            <div className="flex justify-end mt-3 pt-3 border-t border-[#2D2A26]/10">
              <button onClick={() => deleteCoupon(coupon.id)} className="p-2 text-red-400"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {filteredCoupons.length === 0 && <div className="text-center py-12 text-[#2D2A26]/60">Промокоды не найдены</div>}
    </div>
  );
}