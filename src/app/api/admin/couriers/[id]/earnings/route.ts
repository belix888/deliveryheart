import { NextRequest, NextResponse } from 'next/server';
import { getCourierProfileById, getCourierEarnings } from '@/lib/api/couriers';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('[API] admin/couriers/[id]/earnings GET called');
    
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const period = (searchParams.get('period') as 'daily' | 'weekly' | 'monthly') || 'daily';
    
    const courier = await getCourierProfileById(id);
    
    if (!courier) {
      return NextResponse.json({ error: 'Courier not found' }, { status: 404 });
    }
    
    const earnings = await getCourierEarnings(id, period);
    
    return NextResponse.json({ earnings });
  } catch (error) {
    console.error('[API] admin/couriers/[id]/earnings GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}