-- Fix the security definer view issue
-- Recreate the vendor_service_requests view with security invoker

DROP VIEW IF EXISTS public.vendor_service_requests;

-- Recreate the view with explicit security invoker to avoid security definer issues
CREATE VIEW public.vendor_service_requests
WITH (security_invoker = true) AS
SELECT 
  id,
  title,
  description,
  service_type,
  location,
  budget_min,
  budget_max,
  timeline_required,
  status,
  priority,
  vendor_id,
  client_id,
  created_at,
  updated_at,
  -- Exclude sensitive fields: contact_name, contact_email, contact_phone
  'Contact available through platform' as contact_info
FROM public.service_requests
WHERE vendor_id = auth.uid();

-- Grant access to the secure view
GRANT SELECT ON public.vendor_service_requests TO authenticated;