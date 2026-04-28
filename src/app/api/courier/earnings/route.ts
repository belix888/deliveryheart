import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getCourierProfile, getCourierEarnings } from '@/lib/api/couriers';

export async function GET(request: NextRequest) {
  try {
    console.log('[API] courier/earnings GET called');
    
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value || request.headers.get('x-user-id');
    const { searchParams } = new URL(request.url);
    const period = (searchParams.get('period') as 'daily' | 'weekly' | 'monthly') || 'daily';
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const profile = await getCourierProfile(userId);
    
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
    
    const earnings = await getCourierEarnings(profile.id, period);
    
    return NextResponse.json({ earnings });
  } catch (error) {
    console.error('[API] courier/earnings GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}