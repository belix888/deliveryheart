import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';
import { getRestaurantOrders, checkRestaurantOrderAccess, checkIsAdmin } from '@/lib/api/orders';

/**
 * GET /api/restaurant/orders
 * Получение заказов ресторана текущего пользователя
 * 
 * Query параметры:
 * - status: фильтр по статусу (pending, confirmed, preparing, ready, waiting_courier, in_delivery, delivered, cancelled)
 * - limit: количество записей (по умолчанию 20)
 * - offset: смещение для пагинации (по умолчанию 0)
 * 
 * Возвращает заказы только для ресторана текущего пользователя
 */
export async function GET(request: NextRequest) {
  try {
    console.log('[API] restaurant/orders GET вызван');

    // Получаем ID пользователя
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value || request.headers.get('x-user-id');

    if (!userId) {
      console.log('[API] Пользователь не авторизован');
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 });
    }

    // Проверяем права: админ или владелец/админ ресторана
    const isAdmin = await checkIsAdmin(userId);

    if (!isAdmin) {
      // Для не-админов получаем restaurant_id из user_roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('restaurant_id, roles(name)')
        .eq('user_id', userId)
        .eq('is_active', true)
        .then(async ({ data, error }) => {
          if (error) return { data: null, error };
          // Фильтруем на стороне клиента по роли
          const filtered = data?.filter((ur: any) => 
            ur.roles?.name === 'restaurant_owner' || ur.roles?.name === 'restaurant_admin'
          );
          return { data: filtered?.[0] || null, error: null };
        });

      if (rolesError || !userRoles?.restaurant_id) {
        console.log('[API] Ресторан не найден для пользователя');
        return NextResponse.json({ error: 'Ресторан не найден. У вас нет доступа к управлению заказами.' }, { status: 403 });
      }

      // Для обычных пользователей получаем только их заказы
      const { searchParams } = new URL(request.url);
      const status = searchParams.get('status') || undefined;
      const limit = parseInt(searchParams.get('limit') || '20', 10);
      const offset = parseInt(searchParams.get('offset') || '0', 10);

      console.log('[API] Параметры запроса:', { status, limit, offset, restaurantId: userRoles.restaurant_id });

      const orders = await getRestaurantOrders(userRoles.restaurant_id, status);

      // Применяем пагинацию
      const paginatedOrders = orders.slice(offset, offset + limit);

      return NextResponse.json({
        orders: paginatedOrders,
        total: orders.length,
        limit,
        offset,
      });
    }

    // Для админов - получаем все заказы или фильтр по restaurant_id
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get('restaurant_id') || undefined;
    const status = searchParams.get('status') || undefined;
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    console.log('[API] Параметры запроса (admin):', { status, limit, offset, restaurantId });

    let query = supabase
      .from('orders')
      .select(`
        *,
        users!orders_user_id_fkey(full_name, phone),
        restaurants(name, address)
      `)
      .order('created_at', { ascending: false });

    if (restaurantId) {
      query = query.eq('restaurant_id', restaurantId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data: orders, error } = await query.range(offset, offset + limit - 1);

    if (error) {
      console.error('[API] Ошибка получения заказов:', error);
      return NextResponse.json({ error: 'Ошибка получения заказов' }, { status: 500 });
    }

    // Получаем общее количество
    let countQuery = supabase
      .from('orders')
      .select('id', { count: 'exact', head: true });

    if (restaurantId) {
      countQuery = countQuery.eq('restaurant_id', restaurantId);
    }
    if (status) {
      countQuery = countQuery.eq('status', status);
    }

    const { count } = await countQuery;

    console.log('[API] Получено заказов:', orders?.length || 0, 'всего:', count);

    return NextResponse.json({
      orders: orders || [],
      total: count || 0,
      limit,
      offset,
    });
  } catch (error) {
    console.error('[API] Внутренняя ошибка сервера:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}