import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  });

  const { pathname, searchParams } = request.nextUrl;

  // Проверяем код ошибки
  const error = searchParams.get("error");
  if (error === "access_denied") {
    return NextResponse.redirect(new URL("/auth?error=Доступ+запрещен", request.url));
  }

  // Публичные маршруты
  const isPublicRoute = 
    pathname === "/auth" ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".");

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Защищённые маршруты
  const isAdminRoute = pathname.startsWith("/admin");
  const isCourierRoute = pathname.startsWith("/courier");
  const isRestaurantRoute = pathname.startsWith("/restaurant");

  // Получаем токен из заголовков
  const authHeader = request.headers.get("authorization");
  const accessToken = authHeader?.replace("Bearer ", "") || request.cookies.get("sb-access-token")?.value;

  if (!accessToken) {
    // Пробуем получить сессию через URL
    const userId = request.cookies.get("user_id")?.value;
    
    if (!userId) {
      // Нет авторизации - редирект
      if (isAdminRoute || isCourierRoute) {
        return NextResponse.redirect(new URL("/auth?redirect=" + pathname, request.url));
      }
    }
  }

  // Проверка роли для админ-панели
  if (isAdminRoute && accessToken) {
    try {
      const { data: { user } } = await supabase.auth.getUser(accessToken);
      
      if (user) {
        // Проверяем роль
        const { data: userRoles } = await supabase
          .from("user_roles")
          .select("*, roles(name)")
          .eq("user_id", user.id)
          .eq("is_active", true);

        const roles = userRoles?.map((ur: any) => ur.roles?.name) || [];
        
        if (!roles.includes("admin")) {
          return NextResponse.redirect(new URL("/auth?error=admin_required", request.url));
        }
      }
    } catch (e) {
      console.error("[middleware] admin check error:", e);
    }
  }

  // Проверка роли для курьеров
  if (isCourierRoute && accessToken) {
    try {
      const { data: { user } } = await supabase.auth.getUser(accessToken);
      
      if (user) {
        const { data: userRoles } = await supabase
          .from("user_roles")
          .select("*, roles(name)")
          .eq("user_id", user.id)
          .eq("is_active", true);

        const roles = userRoles?.map((ur: any) => ur.roles?.name) || [];
        
        if (!roles.includes("courier")) {
          return NextResponse.redirect(new URL("/auth?error=courier_required", request.url));
        }
      }
    } catch (e) {
      console.error("[middleware] courier check error:", e);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/courier/:path*",
  ],
};