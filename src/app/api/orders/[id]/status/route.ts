import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';
import { updateOrderStatus, checkRestaurantOrderAccess, checkIsAdmin } from '@/lib/api/orders';

/**
 * PATCH /api/orders/[id]/status
 * Обновление статуса заказа
 * 
 * Тело запроса: { status: string, note?: string }
 * Статусы: pending, confirmed, preparing, ready, waiting_courier, in_delivery, delivered, cancelled
 * 
 * Проверка прав: владелец/админ ресторана может менять статусы своих заказов
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('[API] orders/[id]/status PATCH вызван');

    // Получаем ID пользователя из cookies или заголовков
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value || request.headers.get('x-user-id');

    if (!userId) {
      console.log('[API] Пользователь не авторизован');
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 });
    }

    // Получаем ID заказа из параметров
    const { id: orderId } = await params;

    // Проверяем существование заказа
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, restaurant_id, status')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      console.log('[API] Заказ не найден:', orderId);
      return NextResponse.json({ error: 'Заказ не найден' }, { status: 404 });
    }

    // Проверяем права доступа: админ или владелец/админ ресторана
    const isAdmin = await checkIsAdmin(userId);
    const hasRestaurantAccess = await checkRestaurantOrderAccess(userId, order.restaurant_id);

    if (!isAdmin && !hasRestaurantAccess) {
      console.log('[API] Доступ запрещён для пользователя:', userId);
      return NextResponse.json({ error: 'Доступ запрещён. У вас нет прав на изменение этого заказа.' }, { status: 403 });
    }

    // Получаем тело запроса
    const body = await request.json();
    const { status, note } = body;

    // Проверяем валидность статуса
    const validStatuses = [
      'pending',
      'confirmed',
      'preparing',
      'ready',
      'waiting_courier',
      'in_delivery',
      'delivered',
      'cancelled'
    ];

    if (!status || !validStatuses.includes(status)) {
      console.log('[API] Неверный статус:', status);
      return NextResponse.json(
        { error: `Неверный статус. Допустимые значения: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    console.log('[API] Обновление статуса заказа:', { orderId, status, note });

    // Обновляем статус
    const success = await updateOrderStatus(orderId, status, note, userId);

    if (!success) {
      console.error('[API] Ошибка обновления статуса заказа');
      return NextResponse.json({ error: 'Ошибка обновления статуса заказа' }, { status: 500 });
    }

    console.log('[API] Статус заказа успешно обновлён');
    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error('[API] Внутренняя ошибка сервера:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}

/**
 * GET /api/orders/[id]/status
 * Получение истории статусов заказа
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('[API] orders/[id]/status GET вызван');

    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value || request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 });
    }

    const { id: orderId } = await params;

    // Проверяем существование заказа
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, restaurant_id')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Заказ не найден' }, { status: 404 });
    }

    // Проверяем права доступа
    const isAdmin = await checkIsAdmin(userId);
    const hasRestaurantAccess = await checkRestaurantOrderAccess(userId, order.restaurant_id);

    if (!isAdmin && !hasRestaurantAccess) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    // Получаем историю статусов
    const { getOrderHistory } = await import('@/lib/api/orders');
    const history = await getOrderHistory(orderId);

    return NextResponse.json({ history });
  } catch (error) {
    console.error('[API] Внутренняя ошибка сервера:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}