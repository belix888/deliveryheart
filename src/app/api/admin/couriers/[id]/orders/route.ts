import { NextRequest, NextResponse } from 'next/server';
import { getCourierOrders } from '@/lib/api/couriers';
import { getCourierProfileById } from '@/lib/api/couriers';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('[API] admin/couriers/[id]/orders GET called');
    
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    
    const courier = await getCourierProfileById(id);
    
    if (!courier) {
      return NextResponse.json({ error: 'Courier not found' }, { status: 404 });
    }
    
    const orders = await getCourierOrders(id, status);
    
    return NextResponse.json({ orders });
  } catch (error) {
    console.error('[API] admin/couriers/[id]/orders GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}