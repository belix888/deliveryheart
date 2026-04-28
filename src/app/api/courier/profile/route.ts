import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getCourierProfile, upsertCourierProfile } from '@/lib/api/couriers';
import { getUser } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    console.log('[API] courier/profile GET called');
    
    // Get user from cookie or header (simplified auth)
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value || request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const profile = await getCourierProfile(userId);
    
    if (!profile) {
      return NextResponse.json({ profile: null });
    }
    
    return NextResponse.json({ profile });
  } catch (error) {
    console.error('[API] courier/profile GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('[API] courier/profile POST called');
    
    // Get user from cookie or header
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value || request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    console.log('[API] courier/profile POST body:', body);
    
    const profile = await upsertCourierProfile(userId, body);
    
    if (!profile) {
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 400 });
    }
    
    return NextResponse.json({ profile });
  } catch (error) {
    console.error('[API] courier/profile POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}