-- Fix the security definer function search path issue
-- Update the function to have a stable search path

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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;