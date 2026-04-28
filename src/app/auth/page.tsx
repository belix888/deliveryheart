"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, User, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AuthPage() {
  const router = useRouter();
  const { signIn, signUp, user } = useAuth();
  
  const [mode, setMode] = useState<"phone" | "verify" | "register">("phone");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Функция для форматирования номера телефона
  const formatPhone = (value: string): string => {
    // Удаляем все не цифры
    let digits = value.replace(/\D/g, "");
    
    // Если начинается с 9 (после 7 или 8) - добавляем +7
    if (digits.startsWith("9") && digits.length >= 1) {
      digits = "7" + digits;
    }
    // Если начинается с 8 - заменяем на 7
    if (digits.startsWith("8") && digits.length >= 1) {
      digits = "7" + digits.substring(1);
    }
    
    return digits;
  };

  const handlePhoneChange = (value: string) => {
    const digits = formatPhone(value);
    setPhone(digits);
  };

  // Если уже вошёл - редирект
  React.useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleSendCode = async () => {
    setError("");
    setLoading(true);
    
    if (mode === "register") {
      if (!name.trim()) {
        setError("Введите имя");
        setLoading(false);
        return;
      }
      if (phone.length < 10) {
        setError("Введите корректный номер телефона");
        setLoading(false);
        return;
      }
      
      const result = await signUp(phone, name);
      if (result.success) {
        router.push("/");
      } else {
        setError(result.error || "Ошибка регистрации");
      }
    } else {
      if (phone.length < 10) {
        setError("Введите корректный номер телефона");
        setLoading(false);
        return;
      }
      
      const result = await signIn(phone);
      if (result.success) {
        router.push("/");
      } else {
        setError(result.error || "Ошибка входа");
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FFF9F5] dark:bg-[#1A1918] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary dark:bg-primary-dark rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <span className="text-white text-2xl">❤️</span>
          </div>
          <h1 className="text-2xl font-display font-bold">Доставка от души</h1>
          <p className="text-[#2D2A26]/60 dark:text-[#E8E6E3]/60 mt-2">
            {mode === "register" ? "Создайте аккаунт" : "Войдите по номеру телефона"}
          </p>
        </div>

        <div className="bg-white dark:bg-[#2D2A26] rounded-2xl p-6 shadow-lg">
          {mode === "phone" && (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Номер телефона</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2D2A26]/40 dark:text-[#E8E6E3]/40" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="+7 (999) 123-45-67"
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#F5F3F0] dark:bg-[#3D3A36] outline-none focus:ring-2 focus:ring-primary text-lg"
                  />
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleSendCode}
                disabled={loading || !phone}
                className="w-full py-4 bg-primary dark:bg-primary-dark text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Продолжить <ArrowRight className="w-5 h-5" /></>
                )}
              </button>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setMode("register")}
                  className="text-primary dark:text-primary-dark font-medium"
                >
                  Нет аккаунта? Зарегистрироваться
                </button>
              </div>
            </>
          )}

          {mode === "register" && (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Ваше имя</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2D2A26]/40 dark:text-[#E8E6E3]/40" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Как к вам обращаться"
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#F5F3F0] dark:bg-[#3D3A36] outline-none focus:ring-2 focus:ring-primary text-lg"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Номер телефона</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2D2A26]/40 dark:text-[#E8E6E3]/40" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="+7 (999) 123-45-67"
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#F5F3F0] dark:bg-[#3D3A36] outline-none focus:ring-2 focus:ring-primary text-lg"
                  />
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleSendCode}
                disabled={loading || !phone || !name}
                className="w-full py-4 bg-primary dark:bg-primary-dark text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Зарегистрироваться</>
                )}
              </button>

              <div className="mt-4 text-center">
                <button
                  onClick={() => setMode("phone")}
                  className="text-[#2D2A26]/60 dark:text-[#E8E6E3]/60 text-sm"
                >
                  <ArrowLeft className="w-4 h-4 inline mr-1" />
                  Назад
                </button>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-sm text-[#2D2A26]/40 dark:text-[#E8E6E3]/40 mt-6">
          Продолжая, вы соглашаетесь с условиями использования
        </p>
      </div>
    </div>
  );
}