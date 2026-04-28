import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getCourierProfile, acceptOrder, updateOrderStatus } from '@/lib/api/couriers';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('[API] courier/orders/[id] POST called');
    
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value || request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const profile = await getCourierProfile(userId);
    
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
    
    const { id: orderId } = await params;
    const body = await request.json();
    const { action } = body;
    
    if (action === 'accept') {
      const success = await acceptOrder(orderId, profile.id);
      
      if (!success) {
        return NextResponse.json({ error: 'Failed to accept order' }, { status: 400 });
      }
      
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('[API] courier/orders/[id] POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('[API] courier/orders/[id] PATCH called');
    
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value || request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const profile = await getCourierProfile(userId);
    
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
    
    const { id: orderId } = await params;
    const body = await request.json();
    const { status } = body;
    
    const validStatuses = ['accepted', 'picked_up', 'in_delivery', 'delivered', 'cancelled', 'failed'];
    
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    
    const success = await updateOrderStatus(orderId, profile.id, status);
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to update status' }, { status: 400 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] courier/orders/[id] PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}