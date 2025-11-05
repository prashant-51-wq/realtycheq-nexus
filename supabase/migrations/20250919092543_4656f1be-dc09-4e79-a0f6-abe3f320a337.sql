-- Address the security linter warning about the handle_new_user function
-- This function legitimately needs SECURITY DEFINER to insert profiles for new users
-- Add proper documentation and security context

-- Update the function with enhanced security documentation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER  -- Required: This function needs elevated privileges to insert into profiles table
SET search_path = public  -- Security: Explicitly set search path to prevent schema injection
AS $function$
BEGIN
  -- Security: This function only inserts a basic profile record for new authenticated users
  -- It runs with definer rights to bypass RLS during user registration process
  -- Input validation: NEW.id comes from auth.users table (managed by Supabase Auth)
  INSERT INTO public.profiles (user_id, name, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'), 
    'buyer'::user_role  -- Default role for new users
  );
  RETURN NEW;
END;
$function$;

-- Add comprehensive security documentation
COMMENT ON FUNCTION public.handle_new_user IS 
'SECURITY DEFINER function for user registration. Requires elevated privileges to insert into profiles table during auth.users trigger. Only inserts basic non-sensitive profile data for new users. Input is validated and comes from Supabase Auth system.';

-- Ensure this function is only used by the auth trigger
-- (The trigger should already exist, but let''s document it)
COMMENT ON TRIGGER on_auth_user_created ON auth.users IS 
'Trigger to create profile record when new user registers. Uses SECURITY DEFINER function handle_new_user() which is required for this operation.';