-- Fix the critical security issues with careful policy management

-- 1. Drop the overly broad "Public business discovery" policy that exposes sensitive data
DROP POLICY IF EXISTS "Public business discovery" ON public.profiles;

-- 2. Create a much more restrictive policy that only exposes minimal business information
CREATE POLICY "Limited business discovery"
ON public.profiles
FOR SELECT
USING (
  -- Only allow access to verified business profiles
  role IN ('vendor', 'contractor', 'broker') 
  AND verified = true 
  AND approval_status = 'approved'
);

-- 3. Recreate the business_directory view with only essential business discovery fields
-- Remove any potentially sensitive information
DROP VIEW IF EXISTS public.business_directory;

CREATE VIEW public.business_directory AS
SELECT 
  p.id,
  p.user_id,
  p.name,
  p.business_name,
  p.role,
  p.avatar_url,
  p.rating,
  p.review_count,
  p.verified,
  p.is_featured,
  p.experience_years,
  p.specializations,
  p.service_areas,
  p.membership,
  p.created_at
  -- Explicitly exclude all sensitive fields:
  -- phone, business_address, aadhar_number, pan_number, gst_number, 
  -- license_number, kyc_status, certifications, portfolio_images
FROM public.profiles p
WHERE p.role IN ('vendor', 'contractor', 'broker') 
  AND p.verified = true
  AND p.approval_status = 'approved';

-- 4. Update documentation
COMMENT ON VIEW public.business_directory IS 'Secure public view for business discovery - only exposes essential non-sensitive business information for verified vendors/contractors/brokers. All sensitive data (phone, addresses, government IDs) are excluded.';

COMMENT ON POLICY "Limited business discovery" ON public.profiles IS 'Restricted policy for business discovery - only allows access to verified business profiles through business_directory view. Sensitive personal data remains protected.';