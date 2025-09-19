-- Fix function search path security issue
-- Update the business profile accessibility function to have a stable search path

CREATE OR REPLACE FUNCTION public.is_business_profile_accessible(profile_user_id uuid, profile_role user_role, profile_verified boolean, profile_approval_status text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
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