"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";

interface User {
  id: string;
  email: string;
  phone?: string;
  full_name?: string;
  role: string;
  is_verified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (phone: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (phone: string, name: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  verifyCode: (phone: string, code: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    setLoading(true);
    // Пробуем найти пользователя по localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        // Проверяем в БД
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("id", parsed.id)
          .single();
        if (data) {
          setUser(data);
        } else {
          localStorage.removeItem("user");
        }
      } catch (e) {
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  };

  const signUp = async (phone: string, name: string) => {
    try {
      // Проверяем, не занят ли номер
      const { data: existing } = await supabase
        .from("users")
        .select("id")
        .eq("phone", phone)
        .single();

      if (existing) {
        return { success: false, error: "Этот номер уже зарегистрирован" };
      }

      // Создаём код подтверждения (6 цифр)
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Сохраняем временные данные
      localStorage.setItem("verify_code", code);
      localStorage.setItem("verify_phone", phone);
      localStorage.setItem("verify_name", name);

      // В реальном приложении здесь был бы API отправки SMS
      // Пока для теста показываем код
      console.log("Код подтверждения:", code);

      // Имитируем успешную регистрацию для демо
      const { data, error } = await supabase
        .from("users")
        .insert({
          phone,
          full_name: name,
          role: "user",
          is_verified: true,
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      if (data) {
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        return { success: true };
      }

      return { success: false, error: "Ошибка регистрации" };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  };

  const signIn = async (phone: string) => {
    try {
      // Ищем пользователя по номеру
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("phone", phone)
        .single();

      if (error || !data) {
        return { success: false, error: "Пользователь не найден" };
      }

      // Генерируем код
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      localStorage.setItem("verify_code", code);
      localStorage.setItem("verify_phone", phone);
      
      console.log("Код подтверждения:", code);

      // Для демо-режима сразу входим
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  };

  const verifyCode = async (phone: string, code: string) => {
    const savedCode = localStorage.getItem("verify_code");
    const savedPhone = localStorage.getItem("verify_phone");

    if (savedCode !== code || savedPhone !== phone) {
      return { success: false, error: "Неверный код" };
    }

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("phone", phone)
      .single();

    if (error || !data) {
      return { success: false, error: "Пользователь не найден" };
    }

    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
    localStorage.removeItem("verify_code");
    localStorage.removeItem("verify_phone");
    localStorage.removeItem("verify_name");

    return { success: true };
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, verifyCode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};