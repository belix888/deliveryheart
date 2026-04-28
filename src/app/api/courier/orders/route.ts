import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAvailableOrders, getCourierOrders as getCourierOrdersApi, getOrdersForCourier } from '@/lib/api/couriers';
import { getCourierProfile } from '@/lib/api/couriers';

export async function GET(request: NextRequest) {
  try {
    console.log('[API] courier/orders GET called');
    
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value || request.headers.get('x-user-id');
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'available'; // 'available' or 'my'
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get courier profile
    const profile = await getCourierProfile(userId);
    
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
    
    let orders;
    
    if (type === 'my') {
      // Get orders assigned to this courier
      orders = await getOrdersForCourier(profile.id);
    } else {
      // Get available orders in the courier's city
      orders = await getAvailableOrders(profile.current_city || 'Москва');
    }
    
    return NextResponse.json({ orders });
  } catch (error) {
    console.error('[API] courier/orders GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}