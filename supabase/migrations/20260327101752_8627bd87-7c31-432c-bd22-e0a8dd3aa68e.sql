
-- Add user_id column referencing auth.users to the existing users table
ALTER TABLE public.users
ADD COLUMN user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE;
