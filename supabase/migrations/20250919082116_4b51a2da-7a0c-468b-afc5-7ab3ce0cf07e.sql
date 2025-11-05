-- Add new user roles to existing enum (only add missing ones)
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'vendor';
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'contractor';  
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'broker';
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'super_admin';

-- Add additional profile fields for different user types (only add if not exists)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS business_name TEXT,
ADD COLUMN IF NOT EXISTS license_number TEXT,
ADD COLUMN IF NOT EXISTS specializations TEXT[],
ADD COLUMN IF NOT EXISTS experience_years INTEGER,
ADD COLUMN IF NOT EXISTS service_areas TEXT[],
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS business_address TEXT,
ADD COLUMN IF NOT EXISTS gst_number TEXT,
ADD COLUMN IF NOT EXISTS pan_number TEXT,
ADD COLUMN IF NOT EXISTS aadhar_number TEXT,
ADD COLUMN IF NOT EXISTS portfolio_images TEXT[],
ADD COLUMN IF NOT EXISTS certifications TEXT[],
ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES public.profiles(id),
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;

-- Create services table for vendor/contractor services
CREATE TABLE IF NOT EXISTS public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL CHECK (service_type IN (
    '2d_elevation', '3d_elevation', 'structural_design', 'presentation_plan',
    'site_supervision', 'vaastu_consultancy', 'cost_estimation', 
    'turnkey_construction', 'interior_design', 'architectural_design'
  )),
  title TEXT NOT NULL,
  description TEXT,
  price_min DECIMAL(12,2),
  price_max DECIMAL(12,2),
  price_unit TEXT DEFAULT 'per_project',
  timeline_days INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on services table
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Create service requests table for lead capture
CREATE TABLE IF NOT EXISTS public.service_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.profiles(id),
  vendor_id UUID REFERENCES public.profiles(id),
  service_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  budget_min DECIMAL(12,2),
  budget_max DECIMAL(12,2),
  timeline_required INTEGER,
  location TEXT,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in_progress', 'completed', 'cancelled')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on service_requests table
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

-- Create vendor reviews table
CREATE TABLE IF NOT EXISTS public.vendor_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  service_request_id UUID REFERENCES public.service_requests(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  images TEXT[],
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(vendor_id, client_id, service_request_id)
);

-- Enable RLS on vendor_reviews table
ALTER TABLE public.vendor_reviews ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for services
CREATE POLICY "Services are viewable by everyone" 
ON public.services 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Vendors can manage their own services" 
ON public.services 
FOR ALL 
USING (auth.uid() = vendor_id);

CREATE POLICY "Super admins can manage all services" 
ON public.services 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'super_admin'
  )
);

-- Create RLS policies for service_requests
CREATE POLICY "Users can view their own service requests" 
ON public.service_requests 
FOR SELECT 
USING (auth.uid() = client_id OR auth.uid() = vendor_id);

CREATE POLICY "Authenticated users can create service requests" 
ON public.service_requests 
FOR INSERT 
WITH CHECK (auth.uid() = client_id OR client_id IS NULL);

CREATE POLICY "Clients can update their own requests" 
ON public.service_requests 
FOR UPDATE 
USING (auth.uid() = client_id);

CREATE POLICY "Vendors can update assigned requests" 
ON public.service_requests 
FOR UPDATE 
USING (auth.uid() = vendor_id);

CREATE POLICY "Super admins can manage all service requests" 
ON public.service_requests 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'super_admin'
  )
);

-- Create RLS policies for vendor_reviews
CREATE POLICY "Reviews are viewable by everyone" 
ON public.vendor_reviews 
FOR SELECT 
USING (true);

CREATE POLICY "Clients can create reviews for completed services" 
ON public.vendor_reviews 
FOR INSERT 
WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Clients can update their own reviews" 
ON public.vendor_reviews 
FOR UPDATE 
USING (auth.uid() = client_id);

CREATE POLICY "Super admins can manage all reviews" 
ON public.vendor_reviews 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'super_admin'
  )
);

-- Update triggers for updated_at columns
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_service_requests_updated_at
  BEFORE UPDATE ON public.service_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vendor_reviews_updated_at
  BEFORE UPDATE ON public.vendor_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();