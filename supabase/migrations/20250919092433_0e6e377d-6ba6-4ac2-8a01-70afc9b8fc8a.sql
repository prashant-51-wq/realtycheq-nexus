-- Remove all security definer functions to resolve the security warning
-- We'll replace them with a simpler, more secure approach

-- Drop the security definer functions
DROP FUNCTION IF EXISTS public.get_current_user_role();
DROP FUNCTION IF EXISTS public.get_user_profile(UUID);

-- The profiles table already has proper RLS policies:
-- - Users can only view their own profiles (auth.uid() = user_id)
-- - The new "Public business discovery" policy allows access to verified vendor data only

-- Let's verify our RLS policies are correct by listing them
-- (This is just for documentation - the policies are already in place)

-- Current policies on profiles:
-- 1. "Users can insert their own profile" - INSERT with auth.uid() = user_id
-- 2. "Users can update their own profile" - UPDATE with auth.uid() = user_id  
-- 3. "Users can view their own profile" - SELECT with auth.uid() = user_id
-- 4. "Public business discovery" - SELECT for verified vendors/contractors/brokers

-- The business_directory view will now properly use these RLS policies
-- without any security definer functions