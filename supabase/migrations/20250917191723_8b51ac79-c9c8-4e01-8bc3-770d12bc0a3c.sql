-- Create user roles enum
CREATE TYPE public.user_role AS ENUM ('buyer', 'seller', 'admin', 'broker', 'owner');

-- Create membership tiers enum  
CREATE TYPE public.membership_tier AS ENUM ('basic', 'standard', 'premium');

-- Create property types enum
CREATE TYPE public.property_type AS ENUM ('apartment', 'villa', 'house', 'plot', 'commercial', 'office');

-- Create property status enum
CREATE TYPE public.property_status AS ENUM ('active', 'sold', 'off-market', 'draft');

-- Create query status enum
CREATE TYPE public.query_status AS ENUM ('pending', 'in-progress', 'completed', 'closed');

-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'buyer',
  membership membership_tier NOT NULL DEFAULT 'basic',
  verified BOOLEAN NOT NULL DEFAULT false,
  kyc_status TEXT NOT NULL DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create properties table
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  property_type property_type NOT NULL,
  price DECIMAL(15,2) NOT NULL,
  area DECIMAL(10,2) NOT NULL,
  bedrooms INTEGER,
  bathrooms INTEGER,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  locality TEXT,
  micro_market TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  images TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  features JSONB DEFAULT '[]',
  year_built INTEGER,
  status property_status NOT NULL DEFAULT 'active',
  verified BOOLEAN NOT NULL DEFAULT false,
  is_choice BOOLEAN NOT NULL DEFAULT false,
  views INTEGER NOT NULL DEFAULT 0,
  saves INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user queries/requirements table
CREATE TABLE public.user_queries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  query_type TEXT NOT NULL,
  property_type property_type,
  budget_min DECIMAL(15,2),
  budget_max DECIMAL(15,2),
  location_preference TEXT,
  bedrooms INTEGER,
  requirements TEXT,
  additional_notes TEXT,
  status query_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_queries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for properties
CREATE POLICY "Properties are viewable by everyone" 
ON public.properties 
FOR SELECT 
USING (status = 'active' OR seller_id = auth.uid());

CREATE POLICY "Sellers can insert their own properties" 
ON public.properties 
FOR INSERT 
WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update their own properties" 
ON public.properties 
FOR UPDATE 
USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can delete their own properties" 
ON public.properties 
FOR DELETE 
USING (auth.uid() = seller_id);

-- Create RLS policies for user queries
CREATE POLICY "Users can view their own queries" 
ON public.user_queries 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own queries" 
ON public.user_queries 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own queries" 
ON public.user_queries 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_queries_updated_at
  BEFORE UPDATE ON public.user_queries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', 'User'), 'buyer');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_properties_seller_id ON public.properties(seller_id);
CREATE INDEX idx_properties_city ON public.properties(city);
CREATE INDEX idx_properties_property_type ON public.properties(property_type);
CREATE INDEX idx_properties_status ON public.properties(status);
CREATE INDEX idx_user_queries_user_id ON public.user_queries(user_id);
CREATE INDEX idx_user_queries_status ON public.user_queries(status);