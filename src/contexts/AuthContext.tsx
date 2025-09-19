import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  user_id: string;
  name: string;
  phone?: string;
  avatar_url?: string;
  role: 'buyer' | 'seller' | 'vendor' | 'contractor' | 'broker' | 'super_admin';
  membership: 'basic' | 'standard' | 'premium';
  verified: boolean;
  kyc_status: 'pending' | 'verified' | 'rejected';
  business_name?: string;
  license_number?: string;
  specializations?: string[];
  experience_years?: number;
  service_areas?: string[];
  website_url?: string;
  business_address?: string;
  gst_number?: string;
  pan_number?: string;
  aadhar_number?: string;
  portfolio_images?: string[];
  certifications?: string[];
  rating?: number;
  review_count?: number;
  is_featured?: boolean;
  approval_status?: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  approved_at?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name: string, role?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile
          setTimeout(async () => {
            await fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        
        if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data as Profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, name: string, role: string = 'buyer') => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          name,
          role,
        }
      }
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: 'No user logged in' };

    const { error } = await supabase
      .from('profiles')
      .update({
        name: updates.name,
        phone: updates.phone,
        avatar_url: updates.avatar_url,
        role: updates.role as any, // Cast to handle type mismatch with generated types
        membership: updates.membership,
        verified: updates.verified,
        kyc_status: updates.kyc_status,
        business_name: updates.business_name,
        license_number: updates.license_number,
        specializations: updates.specializations,
        experience_years: updates.experience_years,
        service_areas: updates.service_areas,
        website_url: updates.website_url,
        business_address: updates.business_address,
        gst_number: updates.gst_number,
        pan_number: updates.pan_number,
        aadhar_number: updates.aadhar_number,
        portfolio_images: updates.portfolio_images,
        certifications: updates.certifications,
        rating: updates.rating,
        review_count: updates.review_count,
        is_featured: updates.is_featured,
        approval_status: updates.approval_status,
        approved_by: updates.approved_by,
        approved_at: updates.approved_at
      })
      .eq('user_id', user.id);

    if (!error) {
      setProfile(prev => prev ? { ...prev, ...updates } : null);
    }

    return { error };
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}