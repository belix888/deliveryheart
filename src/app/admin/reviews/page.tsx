"use client";

import React, { useState } from "react";
import { Star, Trash2, MessageCircle, Flag, CheckCircle, XCircle, Search } from "lucide-react";

const reviewsData = [
  { id: "1", restaurant: "Пельменная №1", user: "Анна К.", rating: 5, comment: "Вкуснейшие пельмени! Тесто идеальное, начинка сочная. Обязательно закажу ещё!", date: "09.04.2026", isVisible: true, hasReply: false },
  { id: "2", restaurant: "Sushi Master", user: "Иван П.", rating: 4, comment: "Роллы свежие, вкусные. Но доставка немного задержалась.", date: "08.04.2026", isVisible: true, hasReply: true, reply: "Спасибо за отзыв! Приносим извинения за задержку доставки." },
  { id: "3", restaurant: "Pizza Napoli", user: "Мария С.", rating: 5, comment: "Лучшая пицца в городе! Тесто хрустящее, сыр настоящий.", date: "07.04.2026", isVisible: true, hasReply: false },
  { id: "4", restaurant: "Burger House", user: "Алексей Д.", rating: 2, comment: "Бургер был холодным, котлета пересушена. Разочарован.", date: "06.04.2026", isVisible: true, hasReply: false },
  { id: "5", restaurant: "Пельменная №1", user: "Елена В.", rating: 3, comment: "Нормально, но ожидала большего. Вареники немного разварились.", date: "05.04.2026", isVisible: false, hasReply: false },
];

const ReviewsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurantFilter, setRestaurantFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [selectedReview, setSelectedReview] = useState<typeof reviewsData[0] | null>(null);

  const filteredReviews = reviewsData.filter(r => {
    const matchesSearch = r.user.toLowerCase().includes(searchQuery.toLowerCase()) || r.comment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRestaurant = !restaurantFilter || r.restaurant === restaurantFilter;
    const matchesRating = !ratingFilter || r.rating === parseInt(ratingFilter);
    return matchesSearch && matchesRestaurant && matchesRating;
  });

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Отзывы</h1>
          <p className="text-[#2D2A26]/60 dark:text-[#E8E6E3]/60">Управление отзывами пользователей</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2D2A26]/40" />
          <input type="text" placeholder="Поиск по пользователю или тексту..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-[#2D2A26] border border-[#F5F3F0] dark:border-[#3D3A36] focus:border-primary" />
        </div>
        <select value={restaurantFilter} onChange={e => setRestaurantFilter(e.target.value)} className="px-4 py-3 rounded-xl bg-white dark:bg-[#2D2A26] border border-[#F5F3F0]">
          <option value="">Все рестораны</option>
          <option>Пельменная №1</option>
          <option>Sushi Master</option>
          <option>Pizza Napoli</option>
          <option>Burger House</option>
        </select>
        <select value={ratingFilter} onChange={e => setRatingFilter(e.target.value)} className="px-4 py-3 rounded-xl bg-white dark:bg-[#2D2A26] border border-[#F5F3F0]">
          <option value="">Любой рейтинг</option>
          <option value="5">5 звёзд</option>
          <option value="4">4 звезды</option>
          <option value="3">3 звезды</option>
          <option value="2">2 звезды</option>
          <option value="1">1 звезда</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredReviews.map(review => (
          <div key={review.id} className="bg-white dark:bg-[#2D2A26] rounded-2xl border border-[#F5F3F0] dark:border-[#3D3A36] p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-semibold text-primary">{review.user.charAt(0)}</div>
                <div>
                  <p className="font-semibold">{review.user}</p>
                  <p className="text-sm text-[#2D2A26]/60">{review.restaurant} • {review.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(star => <Star key={star} className={`w-4 h-4 ${star <= review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} />)}
              </div>
            </div>
            <p className="text-[#2D2A26]/80 dark:text-[#E8E6E3]/80 mb-3">{review.comment}</p>
            {review.hasReply && (
              <div className="p-3 bg-[#F5F3F0] dark:bg-[#3D3A36] rounded-xl text-sm">
                <p className="font-medium mb-1">Ответ ресторана:</p>
                <p className="text-[#2D2A26]/70">{review.reply}</p>
              </div>
            )}
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#F5F3F0]">
              {!review.hasReply && <button className="flex items-center gap-2 px-3 py-1.5 bg-[#F5F3F0] dark:bg-[#3D3A36] rounded-lg text-sm hover:opacity-80"><MessageCircle className="w-4 h-4" />Ответить</button>}
              <button className="flex items-center gap-2 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-sm"><Trash2 className="w-4 h-4" />Удалить</button>
              <button className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${review.isVisible ? "bg-orange-100 text-orange-600" : "bg-green-100 text-green-600"}`}>
                {review.isVisible ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                {review.isVisible ? "Скрыть" : "Показать"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsPage;