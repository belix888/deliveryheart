import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

// GET /api/admin/users - Get all users with roles
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value || request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 });
    }

    // Check if admin
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('*, roles(name)')
      .eq('user_id', userId)
      .eq('is_active', true);

    const isAdmin = userRoles?.some((ur: any) => ur.roles?.name === 'admin');
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    // Get all users from auth.users
    const { data: users, error } = await supabase.auth.admin.listUsers();

    if (error) {
      console.error('[API] Error fetching users:', error);
      return NextResponse.json({ error: 'Ошибка получения пользователей' }, { status: 500 });
    }

    // Get user roles
    const { data: allUserRoles } = await supabase
      .from('user_roles')
      .select('*, roles(name, display_name), restaurants(name)')
      .in('user_id', users.users.map((u: any) => u.id));

    // Get roles list
    const { data: roles } = await supabase
      .from('roles')
      .select('*')
      .order('name');

    // Get restaurants
    const { data: restaurants } = await supabase
      .from('restaurants')
      .select('id, name');

    // Merge data
    const usersWithRoles = users.users.map((user: any) => {
      const userRole = allUserRoles?.filter((ur: any) => ur.user_id === user.id) || [];
      return {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        roles: userRole.map((ur: any) => ({
          id: ur.roles?.id,
          name: ur.roles?.name,
          display_name: ur.roles?.display_name,
          restaurant_id: ur.restaurant_id,
          restaurant_name: ur.restaurants?.name,
          is_active: ur.is_active,
        })),
        restaurants: userRole.filter((ur: any) => ur.restaurant_id).map((ur: any) => ({
          id: ur.restaurant_id,
          name: ur.restaurants?.name,
        })),
      };
    });

    return NextResponse.json({
      users: usersWithRoles,
      roles: roles || [],
      restaurants: restaurants || [],
    });
  } catch (error) {
    console.error('[API] Users error:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}

// POST /api/admin/users - Assign role to user
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value || request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 });
    }

    // Check if admin
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('*, roles(name)')
      .eq('user_id', userId)
      .eq('is_active', true);

    const isAdmin = userRoles?.some((ur: any) => ur.roles?.name === 'admin');
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    const body = await request.json();
    const { target_user_id, role_name, restaurant_id } = body;

    if (!target_user_id || !role_name) {
      return NextResponse.json({ error: 'Укажите пользователя и роль' }, { status: 400 });
    }

    // Get role by name
    const { data: role } = await supabase
      .from('roles')
      .select('id')
      .eq('name', role_name)
      .single();

    if (!role) {
      return NextResponse.json({ error: 'Роль не найдена' }, { status: 404 });
    }

    // Check if user already has this role
    const { data: existingRole } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', target_user_id)
      .eq('role_id', role.id)
      .eq('restaurant_id', restaurant_id || null)
      .single();

    if (existingRole) {
      // Activate existing role
      await supabase
        .from('user_roles')
        .update({ is_active: true, assigned_by: userId, assigned_at: new Date().toISOString() })
        .eq('id', existingRole.id);
    } else {
      // Create new role assignment
      await supabase
        .from('user_roles')
        .insert({
          user_id: target_user_id,
          role_id: role.id,
          restaurant_id: restaurant_id || null,
          assigned_by: userId,
          is_active: true,
        });
    }

    return NextResponse.json({ success: true, message: 'Роль назначена' });
  } catch (error) {
    console.error('[API] Assign role error:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}

// DELETE /api/admin/users - Remove role from user
export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value || request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 });
    }

    // Check if admin
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('*, roles(name)')
      .eq('user_id', userId)
      .eq('is_active', true);

    const isAdmin = userRoles?.some((ur: any) => ur.roles?.name === 'admin');
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const user_role_id = searchParams.get('user_role_id');

    if (!user_role_id) {
      return NextResponse.json({ error: 'Укажите ID роли' }, { status: 400 });
    }

    // Deactivate role
    await supabase
      .from('user_roles')
      .update({ is_active: false })
      .eq('id', user_role_id);

    return NextResponse.json({ success: true, message: 'Роль удалена' });
  } catch (error) {
    console.error('[API] Remove role error:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}