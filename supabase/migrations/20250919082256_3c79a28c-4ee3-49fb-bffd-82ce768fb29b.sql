-- Create RLS policies for services
CREATE POLICY "Services are viewable by everyone" 
ON public.services 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Vendors can manage their own services" 
ON public.services 
FOR ALL 
USING (auth.uid() = vendor_id);

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