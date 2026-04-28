import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getCourierProfile, setCourierStatus } from '@/lib/api/couriers';

export async function GET(request: NextRequest) {
  try {
    console.log('[API] courier/status GET called');
    
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value || request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const profile = await getCourierProfile(userId);
    
    if (!profile) {
      return NextResponse.json({ status: null, error: 'Profile not found' }, { status: 404 });
    }
    
    return NextResponse.json({ status: profile.status });
  } catch (error) {
    console.error('[API] courier/status GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    console.log('[API] courier/status PATCH called');
    
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value || request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { status } = body;
    
    if (!status || !['online', 'offline', 'busy'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    
    const profile = await getCourierProfile(userId);
    
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
    
    const success = await setCourierStatus(profile.id, status);
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to update status' }, { status: 400 });
    }
    
    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error('[API] courier/status PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}