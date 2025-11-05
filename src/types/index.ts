export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  membership: MembershipTier;
  verified: boolean;
  kycStatus: 'pending' | 'verified' | 'rejected';
  joinedAt: string;
}

export type UserRole = 
  | 'buyer' 
  | 'seller' 
  | 'vendor' 
  | 'contractor' 
  | 'broker' 
  | 'super_admin';

export type MembershipTier = 'basic' | 'standard' | 'premium';

export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  location: Location;
  images: string[];
  amenities: string[];
  features: PropertyFeature[];
  listingDate: string;
  status: 'active' | 'sold' | 'off-market' | 'draft';
  verified: boolean;
  isChoice: boolean;
  ownerId: string;
  brokerId?: string;
  views: number;
  saves: number;
  daysOnMarket: number;
  yearBuilt?: number;
}

export type PropertyType = 
  | 'apartment' 
  | 'villa' 
  | 'house' 
  | 'plot' 
  | 'commercial' 
  | 'office';

export interface Location {
  address: string;
  city: string;
  state: string;
  pincode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  locality: string;
  microMarket?: string;
}

export interface PropertyFeature {
  name: string;
  value: string | number | boolean;
  category: 'basic' | 'amenity' | 'luxury' | 'safety';
}

export interface Vendor {
  id: string;
  name: string;
  company: string;
  type: VendorType;
  specializations: string[];
  location: Location;
  rating: number;
  reviewCount: number;
  portfolio: PortfolioItem[];
  licenses: License[];
  insurance: Insurance[];
  pricing: PricingTier;
  capacity: number;
  onTimeScore: number;
  disputeRatio: number;
  verified: boolean;
  joinedAt: string;
  badges: VendorBadge[];
}

export type VendorType = 
  | 'architect' 
  | 'interior-designer' 
  | 'contractor' 
  | 'auditor' 
  | 'legal' 
  | 'financial';

export type VendorBadge = 'verified' | 'choice' | 'escrow-enabled' | 'top-rated';

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  completedAt: string;
  budget: number;
  duration: number;
}

export interface License {
  type: string;
  number: string;
  authority: string;
  validUntil: string;
  verified: boolean;
}

export interface Insurance {
  type: string;
  provider: string;
  coverage: number;
  validUntil: string;
  verified: boolean;
}

export interface PricingTier {
  design2D: { min: number; max: number };
  design3D: { min: number; max: number };
  construction: { min: number; max: number };
  consultation: number;
}

export interface ServicePackage {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  deliverables: string[];
  timeline: number;
  pricing: {
    min: number;
    max: number;
  };
  features: string[];
  vendorId: string;
  popular: boolean;
}

export type ServiceCategory = 
  | 'design' 
  | 'construction' 
  | 'renovation' 
  | 'verification' 
  | 'legal' 
  | 'financial';

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: OpportunityCategory;
  budget: {
    min: number;
    max: number;
  };
  timeline: number;
  location: Location;
  requirements: string[];
  attachments: string[];
  createdBy: string;
  createdAt: string;
  deadline: string;
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  bids: Bid[];
  tags: string[];
  ndaRequired: boolean;
}

export type OpportunityCategory = 
  | 'rfq' 
  | 'rfp' 
  | 'bounty' 
  | 'consultation' 
  | 'design' 
  | 'construction';

export interface Bid {
  id: string;
  opportunityId: string;
  vendorId: string;
  amount: number;
  timeline: number;
  proposal: string;
  milestones: Milestone[];
  attachments: string[];
  submittedAt: string;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: number;
  deadline: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  deliverables: string[];
}

export interface Community {
  id: string;
  name: string;
  description: string;
  city: string;
  memberCount: number;
  manager: string;
  proposals: Proposal[];
  opportunities: string[];
  events: CommunityEvent[];
  guides: Guide[];
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  votes: Vote[];
  status: 'active' | 'passed' | 'rejected' | 'expired';
  deadline: string;
  category: 'improvement' | 'funding' | 'policy' | 'event';
}

export interface Vote {
  userId: string;
  choice: 'for' | 'against' | 'abstain';
  votedAt: string;
  weight: number;
}

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  attendees: number;
  maxAttendees: number;
}

export interface Guide {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  publishedAt: string;
  views: number;
}

export interface MembershipPlan {
  id: string;
  name: MembershipTier;
  price: number;
  billing: 'monthly' | 'yearly';
  features: string[];
  limits: {
    listings: number;
    leads: number;
    verification: number;
    support: string;
  };
  popular: boolean;
  savings?: number;
}

export interface SearchFilters {
  query?: string;
  location?: string;
  propertyType?: PropertyType[];
  priceRange?: {
    min: number;
    max: number;
  };
  areaRange?: {
    min: number;
    max: number;
  };
  bedrooms?: number[];
  amenities?: string[];
  features?: string[];
  verified?: boolean;
  isChoice?: boolean;
  newListings?: boolean;
  daysOnMarket?: number;
  financing?: boolean;
  design?: boolean;
}

export interface SearchResults<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}