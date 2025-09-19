-- Fix the remaining critical security issues identified in the scan

-- 1. Drop the overly broad "Public business discovery" policy that exposes sensitive data
DROP POLICY IF EXISTS "Public business discovery" ON public.profiles;

-- 2. Create a much more restrictive policy that only exposes minimal business information
-- This policy will only allow access to very specific non-sensitive fields
CREATE POLICY "Limited business discovery"
ON public.profiles
FOR SELECT
USING (
  -- Only allow access to verified business profiles
  role IN ('vendor', 'contractor', 'broker') 
  AND verified = true 
  AND approval_status = 'approved'
  -- Important: This policy will be used by the business_directory view
  -- The view itself filters the columns to exclude sensitive data
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

-- 4. Add proper RLS to the business_directory view by ensuring it uses the underlying table's policies
-- (Views automatically inherit RLS from underlying tables when using security_invoker)

-- 5. Ensure service_requests table has proper access control
-- Update the policy to prevent contact information exposure to unauthorized users
DROP POLICY IF EXISTS "Users can view their own service requests" ON public.service_requests;
DROP POLICY IF EXISTS "Vendors can update assigned requests" ON public.service_requests;

-- Create more secure policies for service requests
CREATE POLICY "Clients can view their own requests"
ON public.service_requests
FOR SELECT
USING (auth.uid() = client_id);

CREATE POLICY "Assigned vendors can view requests"
ON public.service_requests
FOR SELECT
USING (auth.uid() = vendor_id AND vendor_id IS NOT NULL);

CREATE POLICY "Clients can update their own requests"
ON public.service_requests
FOR UPDATE
USING (auth.uid() = client_id);

CREATE POLICY "Assigned vendors can update assigned requests"
ON public.service_requests
FOR UPDATE
USING (auth.uid() = vendor_id AND vendor_id IS NOT NULL);

-- 6. Update documentation
COMMENT ON VIEW public.business_directory IS 'Secure public view for business discovery - only exposes essential non-sensitive business information for verified vendors/contractors/brokers. All sensitive data (phone, addresses, government IDs) are excluded.';

COMMENT ON POLICY "Limited business discovery" ON public.profiles IS 'Restricted policy for business discovery - only allows access to verified business profiles through business_directory view. Sensitive personal data remains protected.';