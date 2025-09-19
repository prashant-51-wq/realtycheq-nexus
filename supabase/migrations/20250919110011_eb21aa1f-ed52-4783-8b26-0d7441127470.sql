-- Fix Business Directory Security Issue
-- Enable RLS on business_directory table and create appropriate access policies

-- Enable Row Level Security on business_directory table
ALTER TABLE public.business_directory ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow public read access to verified business profiles for vendor discovery
CREATE POLICY "Verified businesses are publicly discoverable" 
ON public.business_directory 
FOR SELECT 
USING (verified = true AND role IN ('vendor', 'contractor', 'broker'));

-- Policy 2: Allow business owners to view and manage their own business directory entry
CREATE POLICY "Business owners can manage their own directory entry" 
ON public.business_directory 
FOR ALL 
USING (auth.uid() = user_id);

-- Policy 3: Allow authenticated users to view their own entry even if not verified
CREATE POLICY "Users can view their own directory entry" 
ON public.business_directory 
FOR SELECT 
USING (auth.uid() = user_id);

-- Policy 4: Only allow super_admin to view all entries (for moderation)
CREATE POLICY "Super admins can view all business directory entries" 
ON public.business_directory 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'super_admin'
  )
);