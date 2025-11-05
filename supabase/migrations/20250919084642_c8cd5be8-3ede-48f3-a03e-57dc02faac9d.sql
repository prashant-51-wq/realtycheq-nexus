-- Phase 3 & 4 & 5: Complete platform database schema

-- Blog posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  author_id UUID NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN NOT NULL DEFAULT false,
  featured BOOLEAN NOT NULL DEFAULT false,
  views INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- House plans and designs
CREATE TABLE public.house_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  architect_id UUID,
  category TEXT NOT NULL DEFAULT 'modern',
  style TEXT,
  bedrooms INTEGER,
  bathrooms INTEGER,
  area NUMERIC,
  floor_count INTEGER DEFAULT 1,
  images TEXT[] DEFAULT '{}',
  plan_files TEXT[] DEFAULT '{}',
  price NUMERIC,
  featured BOOLEAN NOT NULL DEFAULT false,
  likes INTEGER NOT NULL DEFAULT 0,
  downloads INTEGER NOT NULL DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Communities table
CREATE TABLE public.communities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  location TEXT,
  category TEXT NOT NULL DEFAULT 'residential',
  admin_id UUID NOT NULL,
  avatar_url TEXT,
  banner_url TEXT,
  member_count INTEGER NOT NULL DEFAULT 0,
  visibility TEXT NOT NULL DEFAULT 'public',
  join_approval BOOLEAN NOT NULL DEFAULT false,
  guidelines TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Community members
CREATE TABLE public.community_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  status TEXT NOT NULL DEFAULT 'active',
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(community_id, user_id)
);

-- Community posts/discussions
CREATE TABLE public.community_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  author_id UUID NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  post_type TEXT NOT NULL DEFAULT 'discussion',
  images TEXT[] DEFAULT '{}',
  attachments TEXT[] DEFAULT '{}',
  likes INTEGER NOT NULL DEFAULT 0,
  comments_count INTEGER NOT NULL DEFAULT 0,
  pinned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- AI consultant sessions
CREATE TABLE public.ai_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_type TEXT NOT NULL DEFAULT 'general',
  title TEXT,
  context JSONB,
  messages JSONB[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active',
  total_tokens INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Bidding system for opportunities
CREATE TABLE public.opportunity_bids (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID NOT NULL,
  bidder_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  timeline_days INTEGER,
  proposal TEXT NOT NULL,
  attachments TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending',
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User favorites/saves
CREATE TABLE public.user_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  item_id UUID NOT NULL,
  item_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, item_id, item_type)
);

-- Notifications system
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  data JSONB,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.house_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blog_posts
CREATE POLICY "Blog posts are viewable by everyone" ON public.blog_posts
FOR SELECT USING (published = true);

CREATE POLICY "Authors can manage their own posts" ON public.blog_posts
FOR ALL USING (auth.uid() = author_id);

-- RLS Policies for house_plans
CREATE POLICY "House plans are viewable by everyone" ON public.house_plans
FOR SELECT USING (true);

CREATE POLICY "Architects can manage their own plans" ON public.house_plans
FOR ALL USING (auth.uid() = architect_id);

-- RLS Policies for communities
CREATE POLICY "Public communities are viewable by everyone" ON public.communities
FOR SELECT USING (visibility = 'public');

CREATE POLICY "Community admins can manage their communities" ON public.communities
FOR ALL USING (auth.uid() = admin_id);

-- RLS Policies for community_members
CREATE POLICY "Members can view community memberships" ON public.community_members
FOR SELECT USING (true);

CREATE POLICY "Users can manage their own memberships" ON public.community_members
FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for community_posts
CREATE POLICY "Community posts are viewable by members" ON public.community_posts
FOR SELECT USING (true);

CREATE POLICY "Authors can manage their own posts" ON public.community_posts
FOR ALL USING (auth.uid() = author_id);

-- RLS Policies for ai_sessions
CREATE POLICY "Users can manage their own AI sessions" ON public.ai_sessions
FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for opportunity_bids
CREATE POLICY "Bids are viewable by bidders and opportunity owners" ON public.opportunity_bids
FOR SELECT USING (auth.uid() = bidder_id);

CREATE POLICY "Bidders can manage their own bids" ON public.opportunity_bids
FOR ALL USING (auth.uid() = bidder_id);

-- RLS Policies for user_favorites
CREATE POLICY "Users can manage their own favorites" ON public.user_favorites
FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
FOR UPDATE USING (auth.uid() = user_id);

-- Triggers for updated_at columns
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_house_plans_updated_at
BEFORE UPDATE ON public.house_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_communities_updated_at
BEFORE UPDATE ON public.communities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_community_posts_updated_at
BEFORE UPDATE ON public.community_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_sessions_updated_at
BEFORE UPDATE ON public.ai_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_opportunity_bids_updated_at
BEFORE UPDATE ON public.opportunity_bids
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();