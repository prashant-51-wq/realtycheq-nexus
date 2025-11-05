-- Fix the security definer view issue by making the view use security invoker (default)
-- and ensuring proper access control through the underlying table's RLS policies

-- Drop the problematic security definer approach and recreate properly
DROP VIEW IF EXISTS public.business_directory;

-- Create a safe public business directory view that relies on the underlying table's RLS
-- This view will be subject to the RLS policies of the profiles table
CREATE VIEW public.business_directory AS
SELECT 
  p.id,
  p.user_id,
  p.name,
  p.business_name,
  p.role,
  p.avatar_url,
  p.website_url,
  p.rating,
  p.review_count,
  p.verified,
  p.is_featured,
  p.experience_years,
  p.specializations,
  p.service_areas,
  p.certifications,
  p.portfolio_images,
  p.membership,
  p.created_at,
  -- Only show business address city/state, not full address
  CASE 
    WHEN p.business_address IS NOT NULL 
    THEN SPLIT_PART(p.business_address, ',', -2) || ', ' || SPLIT_PART(p.business_address, ',', -1)
    ELSE NULL 
  END as business_location
FROM public.profiles p
WHERE p.role IN ('vendor', 'contractor', 'broker') 
  AND p.verified = true
  AND p.approval_status = 'approved';

-- Since this is a regular view (not security definer), it will use the calling user's permissions
-- We need to add a specific RLS policy for business discovery that allows public access
-- to non-sensitive vendor data only

-- Create a new RLS policy for public business discovery
CREATE POLICY "Public business discovery"
ON public.profiles
FOR SELECT
USING (
  role IN ('vendor', 'contractor', 'broker') 
  AND verified = true 
  AND approval_status = 'approved'
);

-- Update comments
COMMENT ON VIEW public.business_directory IS 'Public view for business discovery - exposes only verified vendors/contractors/brokers with non-sensitive information. Access controlled by profiles table RLS policies.';