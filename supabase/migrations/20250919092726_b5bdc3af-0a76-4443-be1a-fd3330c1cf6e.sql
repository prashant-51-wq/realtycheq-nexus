-- Complete the security documentation for the handle_new_user function
-- (Skip the auth trigger comment since we can't modify that schema)

-- Update function documentation only (function was already updated in previous migration)
COMMENT ON FUNCTION public.handle_new_user IS 
'SECURITY DEFINER function for user registration. This function legitimately requires elevated privileges to insert into profiles table during the auth.users trigger execution. It only inserts basic non-sensitive profile data (user_id, name, role) for new users. The function is secure because: 1) Input validation ensures NEW.id comes from auth.users table managed by Supabase Auth, 2) Only inserts predefined safe values, 3) Uses explicit search_path to prevent injection, 4) Limited scope of operation.';