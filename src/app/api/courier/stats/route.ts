import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getCourierProfile, getCourierStats } from '@/lib/api/couriers';

export async function GET(request: NextRequest) {
  try {
    console.log('[API] courier/stats GET called');
    
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value || request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const profile = await getCourierProfile(userId);
    
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
    
    const stats = await getCourierStats(profile.id);
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('[API] courier/stats GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}