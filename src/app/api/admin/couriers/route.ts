import { NextRequest, NextResponse } from 'next/server';
import { getAllCouriers } from '@/lib/api/couriers';

export async function GET(request: NextRequest) {
  try {
    console.log('[API] admin/couriers GET called');
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const city = searchParams.get('city') || undefined;
    const isActive = searchParams.get('is_active') === 'true' ? true : 
                   searchParams.get('is_active') === 'false' ? false : undefined;
    
    const couriers = await getAllCouriers({
      status: status || undefined,
      city: city || undefined,
      isActive,
    });
    
    return NextResponse.json({ couriers });
  } catch (error) {
    console.error('[API] admin/couriers GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}