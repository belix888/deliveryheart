-- Fixed RLS policy for user registration
-- Run this in Supabase SQL Editor to allow new user registration

-- Add INSERT policy that allows anyone to create a user account
CREATE POLICY "allow_registration" ON users
    FOR INSERT WITH CHECK (true);

-- This allows anonymous users to insert their profile during sign-up
-- After sign-up, they can update their own profile