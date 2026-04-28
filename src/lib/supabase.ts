import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo_url: string;
  cover_url: string;
  address: string;
  phone: string;
  rating: number;
  review_count: number;
  delivery_time_min: number;
  delivery_time_max: number;
  delivery_price: number;
  min_order: number;
  is_active: boolean;
  city: string;
}

export interface Category {
  id: string;
  restaurant_id: string;
  name: string;
  sort_order: number;
  is_active: boolean;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  weight: string;
  is_available: boolean;
  is_special: boolean;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  restaurant_id: string;
  status: string;
  total_amount: number;
  delivery_price: number;
  final_amount: number;
  created_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  address_text: string;
  apartment?: string;
  entrance?: string;
  floor?: string;
  comment?: string;
  is_default: boolean;
  created_at: string;
}

// Fetch restaurants
export const fetchRestaurants = async (): Promise<Restaurant[]> => {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('is_active', true)
    .order('rating', { ascending: false });
  
  if (error) {
    console.error('Error fetching restaurants:', error);
    return [];
  }
  return data || [];
};

// Fetch single restaurant by ID
export const fetchRestaurantById = async (restaurantId: string): Promise<Restaurant | null> => {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('id', restaurantId)
    .single();
  
  if (error) {
    console.error('Error fetching restaurant:', error);
    return null;
  }
  return data;
};

// Fetch categories for restaurant
export const fetchCategories = async (restaurantId: string): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .eq('is_active', true)
    .order('sort_order');
  
  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  return data || [];
};

// Fetch menu items for category
export const fetchMenuItems = async (categoryId: string): Promise<MenuItem[]> => {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('category_id', categoryId)
    .eq('is_available', true)
    .order('sort_order');
  
  if (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
  return data || [];
};

// Fetch all menu items for restaurant
export const fetchRestaurantMenu = async (restaurantId: string): Promise<MenuItem[]> => {
  // Get categories first
  const categories = await fetchCategories(restaurantId);
  
  if (categories.length === 0) {
    return [];
  }
  
  // Use Promise.all for parallel fetching instead of sequential
  const menuItemsArrays = await Promise.all(
    categories.map(category => fetchMenuItems(category.id))
  );
  
  return menuItemsArrays.flat();
};

// Fetch user by ID
export const fetchUser = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }
  return data;
};

// Fetch user addresses
export const fetchAddresses = async (userId: string) => {
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching addresses:', error);
    return [];
  }
  return data || [];
};

// Create order
export const createOrder = async (orderData: {
  order_number: string;
  user_id: string;
  restaurant_id: string;
  total_amount: number;
  delivery_price: number;
  final_amount: number;
  status: string;
  comment?: string;
}) => {
  console.log('createOrder called with:', JSON.stringify(orderData, null, 2));
  
  const { data, error } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating order:', JSON.stringify(error, null, 2));
    return null;
  }
  return data;
};

// Fetch user orders
export const fetchUserOrders = async (userId: string): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
  return data || [];
};

// Update order status (for restaurant admin)
export const updateOrderStatus = async (orderId: string, status: string) => {
  const { data, error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating order:', error);
    return null;
  }
  return data;
};

// Fetch all orders (for admin)
export const fetchAllOrders = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      restaurants (name),
      users (full_name, phone)
    `)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
  return data || [];
};

// Create user (registration)
export const createUser = async (userData: {
  email: string;
  phone?: string;
  full_name?: string;
}) => {
  const { data, error } = await supabase
    .from('users')
    .insert(userData)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating user:', error);
    return null;
  }
  return data;
};

// Add address
export const addAddress = async (addressData: {
  user_id: string;
  address_text: string;
  apartment?: string;
  entrance?: string;
  floor?: string;
  comment?: string;
  is_default?: boolean;
}) => {
  const { data, error } = await supabase
    .from('addresses')
    .insert(addressData)
    .select()
    .single();
  
  if (error) {
    console.error('Error adding address:', error);
    return null;
  }
  return data;
};

// Toggle favorite
export const toggleFavorite = async (userId: string, restaurantId: string) => {
  // Check if exists
  const { data: existing } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', userId)
    .eq('restaurant_id', restaurantId)
    .single();
  
  if (existing) {
    // Remove
    await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('restaurant_id', restaurantId);
    return false;
  } else {
    // Add
    await supabase
      .from('favorites')
      .insert({ user_id: userId, restaurant_id: restaurantId });
    return true;
  }
};

// Get favorites
export const fetchFavorites = async (userId: string) => {
  const { data, error } = await supabase
    .from('favorites')
    .select(`
      restaurants (*)
    `)
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
  return data?.map(f => f.restaurants).flat() || [];
};

// Subscribe to order updates (realtime)
export const subscribeToOrder = (orderId: string, callback: (payload: any) => void) => {
  const channel = supabase
    .channel(`order-${orderId}`)
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'orders',
      filter: `id=eq.${orderId}`
    }, callback)
    .subscribe();
  
  return channel;
};

// Sign in (simple - for demo)
export const signIn = async (email: string) => {
  // For demo, just find or create user
  let { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  
  if (!user) {
    user = await createUser({ email });
  }
  
  return user;
};

// Simple auth without password (for demo purposes)
export const getDemoUser = async () => {
  // Return a demo user for testing
  const { data: users } = await supabase
    .from('users')
    .select('*')
    .limit(1)
    .single();
  
  return users;
};

export const createDemoUser = async () => {
  const { data, error } = await supabase
    .from('users')
    .insert({
      email: `user_${Date.now()}@demo.com`,
      full_name: 'Демо пользователь',
      phone: '+79000000000'
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating demo user:', error);
    return null;
  }
  return data;
};

export const ensureDemoUser = async () => {
  let user = await getDemoUser();
  if (!user) {
    user = await createDemoUser();
  }
  return user;
};