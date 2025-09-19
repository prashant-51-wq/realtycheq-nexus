-- Fix customer contact information security issue
-- Create a secure view that excludes sensitive customer contact info from vendors

-- First, drop existing problematic policies
DROP POLICY IF EXISTS "Users can view their own service requests" ON public.service_requests;
DROP POLICY IF EXISTS "Vendors can update assigned requests" ON public.service_requests;

-- Create new restrictive policies
-- Clients can view their own complete service requests
CREATE POLICY "Clients can view their own service requests" 
ON public.service_requests 
FOR SELECT 
USING (auth.uid() = client_id);

-- Clients can update their own service requests
CREATE POLICY "Clients can update their own service requests" 
ON public.service_requests 
FOR UPDATE 
USING (auth.uid() = client_id);

-- Create a secure view for vendors (excludes sensitive contact information)
CREATE OR REPLACE VIEW public.vendor_service_requests AS
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

-- Vendors can update status and internal fields of assigned requests (but not contact info)
CREATE POLICY "Vendors can update assigned request status" 
ON public.service_requests 
FOR UPDATE 
USING (auth.uid() = vendor_id)
WITH CHECK (
  auth.uid() = vendor_id AND 
  -- Prevent vendors from modifying contact information
  contact_name = (SELECT contact_name FROM public.service_requests WHERE id = service_requests.id) AND
  contact_email = (SELECT contact_email FROM public.service_requests WHERE id = service_requests.id) AND
  contact_phone = (SELECT contact_phone FROM public.service_requests WHERE id = service_requests.id)
);

-- Create a function to facilitate secure communication (admin only)
CREATE OR REPLACE FUNCTION public.get_service_request_contact(request_id UUID)
RETURNS TABLE(contact_name TEXT, contact_email TEXT, contact_phone TEXT) AS $$
BEGIN
  -- Only allow super_admin role to access contact information
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'super_admin'
  ) THEN
    RAISE EXCEPTION 'Unauthorized access to contact information';
  END IF;

  RETURN QUERY
  SELECT 
    sr.contact_name,
    sr.contact_email,
    sr.contact_phone
  FROM public.service_requests sr
  WHERE sr.id = request_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;