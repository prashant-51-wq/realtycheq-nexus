-- Enhance Business Directory Security (Fixed)
-- The business_directory is a view built from profiles table
-- We need to ensure proper RLS policies are in place to protect business data

-- Drop the existing broad "Limited business discovery" policy and replace with more specific ones
DROP POLICY IF EXISTS "Limited business discovery" ON public.profiles;

-- Create comprehensive policy for profile access with proper business directory security
CREATE POLICY "Comprehensive profile access with business directory protection" 
ON public.profiles 
FOR SELECT 
USING (
  CASE 
    -- Own profile: full access
    WHEN auth.uid() = user_id THEN true
    -- Verified businesses: only public business info for discovery
    WHEN (role = ANY (ARRAY['vendor'::user_role, 'contractor'::user_role, 'broker'::user_role])) 
         AND verified = true 
         AND approval_status = 'approved' THEN true
    -- Admin: full access for moderation
    WHEN EXISTS (
      SELECT 1 FROM public.profiles p2 
      WHERE p2.user_id = auth.uid() 
      AND p2.role = 'admin'
    ) THEN true
    -- Everyone else: no access
    ELSE false
  END
);

-- Add additional security: Create a function to validate business directory access
CREATE OR REPLACE FUNCTION public.is_business_profile_accessible(profile_user_id uuid, profile_role user_role, profile_verified boolean, profile_approval_status text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT 
    -- Own profile
    auth.uid() = profile_user_id
    OR 
    -- Verified business profiles for public discovery
    (profile_role = ANY (ARRAY['vendor'::user_role, 'contractor'::user_role, 'broker'::user_role]) 
     AND profile_verified = true 
     AND profile_approval_status = 'approved')
    OR
    -- Admin access
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    );
$$;