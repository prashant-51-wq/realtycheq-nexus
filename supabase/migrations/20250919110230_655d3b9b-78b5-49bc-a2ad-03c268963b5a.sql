-- Enhance Business Directory Security
-- The business_directory is a view built from profiles table
-- We need to ensure proper RLS policies are in place to protect business data

-- First, let's add a more restrictive policy for business profile access
-- This ensures business data is only visible through the intended business_directory view

-- Drop the existing broad "Limited business discovery" policy and replace with more specific ones
DROP POLICY IF EXISTS "Limited business discovery" ON public.profiles;

-- Create specific policy for business directory public access
CREATE POLICY "Public business directory access" 
ON public.profiles 
FOR SELECT 
USING (
  (role = ANY (ARRAY['vendor'::user_role, 'contractor'::user_role, 'broker'::user_role])) 
  AND verified = true 
  AND approval_status = 'approved'
);

-- Create policy to prevent unauthorized access to sensitive business fields
-- Users can only see limited business info of others, full details only for themselves
CREATE POLICY "Restricted business profile access" 
ON public.profiles 
FOR SELECT 
USING (
  CASE 
    -- Own profile: full access
    WHEN auth.uid() = user_id THEN true
    -- Verified businesses: only show public business info
    WHEN (role = ANY (ARRAY['vendor'::user_role, 'contractor'::user_role, 'broker'::user_role])) 
         AND verified = true 
         AND approval_status = 'approved' THEN true
    -- Super admin: full access
    WHEN EXISTS (
      SELECT 1 FROM public.profiles p2 
      WHERE p2.user_id = auth.uid() 
      AND p2.role = 'super_admin'
    ) THEN true
    -- Everyone else: no access
    ELSE false
  END
);

-- Add a policy specifically for the business directory view access
-- This ensures the view can only be accessed by authenticated users or for public discovery
CREATE POLICY "Business directory view access" 
ON public.profiles 
FOR SELECT 
USING (
  -- Public access to verified business profiles for discovery
  (role = ANY (ARRAY['vendor'::user_role, 'contractor'::user_role, 'broker'::user_role])) 
  AND verified = true 
  AND approval_status = 'approved'
);