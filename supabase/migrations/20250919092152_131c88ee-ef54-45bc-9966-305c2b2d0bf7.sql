-- Fix profiles table security issue by ensuring strict RLS policies
-- and creating a public business view for vendor discovery

-- First, ensure the profiles table has the most restrictive policies
-- Drop any overly permissive policies if they exist
DROP POLICY IF EXISTS "Public profiles are viewable" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create a security definer function to get user role safely
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Create a public business directory view that only exposes non-sensitive vendor information
CREATE OR REPLACE VIEW public.business_directory AS
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

-- Create a secure function to get full profile data (for authenticated users accessing their own data)
CREATE OR REPLACE FUNCTION public.get_user_profile(profile_user_id UUID DEFAULT NULL)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  name TEXT,
  phone TEXT,
  business_name TEXT,
  business_address TEXT,
  role user_role,
  avatar_url TEXT,
  website_url TEXT,
  rating NUMERIC,
  review_count INTEGER,
  verified BOOLEAN,
  is_featured BOOLEAN,
  experience_years INTEGER,
  specializations TEXT[],
  service_areas TEXT[],
  certifications TEXT[],
  portfolio_images TEXT[],
  membership membership_tier,
  kyc_status TEXT,
  approval_status TEXT,
  aadhar_number TEXT,
  pan_number TEXT,
  gst_number TEXT,
  license_number TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  approved_by UUID
) AS $$
BEGIN
  -- Only allow users to access their own full profile data
  IF profile_user_id IS NULL THEN
    profile_user_id := auth.uid();
  END IF;
  
  -- Security check - only allow access to own profile
  IF profile_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Access denied: Can only access own profile data';
  END IF;
  
  RETURN QUERY
  SELECT 
    p.id, p.user_id, p.name, p.phone, p.business_name, p.business_address,
    p.role, p.avatar_url, p.website_url, p.rating, p.review_count,
    p.verified, p.is_featured, p.experience_years, p.specializations,
    p.service_areas, p.certifications, p.portfolio_images, p.membership,
    p.kyc_status, p.approval_status, p.aadhar_number, p.pan_number,
    p.gst_number, p.license_number, p.created_at, p.updated_at,
    p.approved_at, p.approved_by
  FROM public.profiles p
  WHERE p.user_id = profile_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Add comment to document the security model
COMMENT ON TABLE public.profiles IS 'Contains sensitive user profile data. Access restricted by RLS policies. Use business_directory view for public vendor discovery.';
COMMENT ON VIEW public.business_directory IS 'Public view for business discovery - only exposes non-sensitive vendor information.';
COMMENT ON FUNCTION public.get_user_profile IS 'Secure function to get full profile data - only allows users to access their own profile.';

-- Create an index on the business directory view for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_business_directory 
ON public.profiles (role, verified, approval_status) 
WHERE role IN ('vendor', 'contractor', 'broker');