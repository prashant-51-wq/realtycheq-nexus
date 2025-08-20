import { Property, Vendor, ServicePackage, Opportunity, Community, MembershipPlan } from '@/types';

export const mockProperties: Property[] = [
  {
    id: '1',
    title: '3 BHK Luxury Apartment in Bandra West',
    description: 'Premium apartment with sea view, modern amenities, and prime location.',
    type: 'apartment',
    price: 35000000,
    area: 1450,
    bedrooms: 3,
    bathrooms: 3,
    location: {
      address: 'Waterfield Road, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
      coordinates: { lat: 19.0596, lng: 72.8295 },
      locality: 'Bandra West',
      microMarket: 'Waterfield Road'
    },
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop'],
    amenities: ['Swimming Pool', 'Gym', 'Security', 'Parking', 'Garden'],
    features: [
      { name: 'Furnished', value: true, category: 'basic' },
      { name: 'Balcony', value: 2, category: 'basic' },
      { name: 'Sea View', value: true, category: 'luxury' }
    ],
    listingDate: '2024-01-15',
    status: 'active',
    verified: true,
    isChoice: true,
    ownerId: 'owner1',
    views: 847,
    saves: 23,
    daysOnMarket: 12
  },
  {
    id: '2',
    title: '4 BHK Independent Villa in Whitefield',
    description: 'Spacious villa with private garden, perfect for families.',
    type: 'villa',
    price: 28000000,
    area: 2800,
    bedrooms: 4,
    bathrooms: 4,
    location: {
      address: 'Varthur Road, Whitefield',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560066',
      coordinates: { lat: 12.9698, lng: 77.7500 },
      locality: 'Whitefield',
      microMarket: 'Varthur Road'
    },
    images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop'],
    amenities: ['Private Garden', 'Parking', 'Security', 'Terrace'],
    features: [
      { name: 'Independent', value: true, category: 'basic' },
      { name: 'Garden Area', value: '500 sqft', category: 'luxury' }
    ],
    listingDate: '2024-01-10',
    status: 'active',
    verified: true,
    isChoice: false,
    ownerId: 'owner2',
    views: 654,
    saves: 18,
    daysOnMarket: 17
  },
  {
    id: '3',
    title: '2 BHK Modern Apartment in Gurgaon',
    description: 'Contemporary apartment in premium society with all amenities.',
    type: 'apartment',
    price: 18500000,
    area: 1200,
    bedrooms: 2,
    bathrooms: 2,
    location: {
      address: 'Sector 54, Golf Course Road',
      city: 'Gurgaon',
      state: 'Haryana',
      pincode: '122002',
      coordinates: { lat: 28.4595, lng: 77.0266 },
      locality: 'Sector 54',
      microMarket: 'Golf Course Road'
    },
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'],
    amenities: ['Club House', 'Swimming Pool', 'Gym', 'Kids Play Area'],
    features: [
      { name: 'Ready to Move', value: true, category: 'basic' },
      { name: 'Premium Society', value: true, category: 'luxury' }
    ],
    listingDate: '2024-01-08',
    status: 'active',
    verified: false,
    isChoice: false,
    ownerId: 'owner3',
    views: 432,
    saves: 12,
    daysOnMarket: 19
  }
];

export const mockVendors: Vendor[] = [
  {
    id: 'v1',
    name: 'Rajesh Kumar',
    company: 'Urban Design Studio',
    type: 'architect',
    specializations: ['Residential', 'Modern', 'Vastu'],
    location: {
      address: 'Koramangala',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560034',
      coordinates: { lat: 12.9352, lng: 77.6245 },
      locality: 'Koramangala'
    },
    rating: 4.8,
    reviewCount: 124,
    portfolio: [
      {
        id: 'p1',
        title: '3BHK Villa Design',
        description: 'Modern villa with sustainable features',
        images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop'],
        category: 'Residential',
        completedAt: '2023-12-15',
        budget: 1200000,
        duration: 45
      }
    ],
    licenses: [
      {
        type: 'Architect License',
        number: 'AR/2019/BLR/1234',
        authority: 'Council of Architecture',
        validUntil: '2026-03-15',
        verified: true
      }
    ],
    insurance: [
      {
        type: 'Professional Indemnity',
        provider: 'HDFC ERGO',
        coverage: 5000000,
        validUntil: '2024-12-31',
        verified: true
      }
    ],
    pricing: {
      design2D: { min: 25, max: 50 },
      design3D: { min: 75, max: 150 },
      construction: { min: 1200, max: 1800 },
      consultation: 2500
    },
    capacity: 8,
    onTimeScore: 92,
    disputeRatio: 0.02,
    verified: true,
    joinedAt: '2023-01-15',
    badges: ['verified', 'choice', 'top-rated']
  }
];

export const mockServicePackages: ServicePackage[] = [
  {
    id: 's1',
    name: '2D Floor Plan Design',
    category: 'design',
    description: 'Professional floor plan with dimensions and room layouts',
    deliverables: [
      'Dimensioned floor plan',
      'Furniture layout',
      '3 revision rounds',
      'PDF and CAD files'
    ],
    timeline: 7,
    pricing: { min: 15000, max: 35000 },
    features: ['Site visit included', 'Vastu consultation', '24/7 support'],
    vendorId: 'v1',
    popular: true
  },
  {
    id: 's2',
    name: '3D Exterior Visualization',
    category: 'design',
    description: 'Photorealistic 3D exterior rendering',
    deliverables: [
      'High-res 3D renders',
      'Multiple angle views',
      'Day and night views',
      'Landscape design'
    ],
    timeline: 10,
    pricing: { min: 25000, max: 75000 },
    features: ['Unlimited revisions', 'Animation add-on', 'VR compatible'],
    vendorId: 'v1',
    popular: false
  }
];

export const mockOpportunities: Opportunity[] = [
  {
    id: 'o1',
    title: 'Interior Design for 3BHK Apartment',
    description: 'Looking for modern interior design for newly purchased apartment',
    category: 'design',
    budget: { min: 800000, max: 1200000 },
    timeline: 60,
    location: {
      address: 'Indiranagar',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560038',
      coordinates: { lat: 12.9719, lng: 77.6412 },
      locality: 'Indiranagar'
    },
    requirements: [
      'Modern contemporary style',
      'Space optimization',
      'Quality materials',
      'Timely completion'
    ],
    attachments: [],
    createdBy: 'user1',
    createdAt: '2024-01-20',
    deadline: '2024-02-20',
    status: 'open',
    bids: [],
    tags: ['interior', 'modern', 'residential'],
    ndaRequired: false
  }
];

export const mockCommunities: Community[] = [
  {
    id: 'c1',
    name: 'Mumbai Property Owners',
    description: 'Community for property owners in Mumbai to share insights and opportunities',
    city: 'Mumbai',
    memberCount: 2847,
    manager: 'Priya Sharma',
    proposals: [
      {
        id: 'pr1',
        title: 'Improve Property Verification Process',
        description: 'Proposal to enhance the current verification system with blockchain',
        proposer: 'Amit Patel',
        votes: [
          { userId: 'u1', choice: 'for', votedAt: '2024-01-22', weight: 1 },
          { userId: 'u2', choice: 'for', votedAt: '2024-01-22', weight: 1 }
        ],
        status: 'active',
        deadline: '2024-02-15',
        category: 'improvement'
      }
    ],
    opportunities: ['o1'],
    events: [
      {
        id: 'e1',
        title: 'Real Estate Investment Meetup',
        description: 'Monthly meetup for investors and buyers',
        date: '2024-02-15',
        location: 'Bandra Community Center',
        attendees: 45,
        maxAttendees: 100
      }
    ],
    guides: []
  }
];

export const mockMembershipPlans: MembershipPlan[] = [
  {
    id: 'basic',
    name: 'basic',
    price: 0,
    billing: 'monthly',
    features: [
      'Browse properties',
      'Basic search filters',
      'Contact 3 sellers/month',
      'Community access'
    ],
    limits: {
      listings: 1,
      leads: 10,
      verification: 0,
      support: 'Email only'
    },
    popular: false
  },
  {
    id: 'standard',
    name: 'standard',
    price: 2999,
    billing: 'monthly',
    features: [
      'All Basic features',
      'Advanced filters',
      'Unlimited contacts',
      'Priority support',
      'Verification requests',
      'Market insights'
    ],
    limits: {
      listings: 5,
      leads: 50,
      verification: 2,
      support: 'Phone + Email'
    },
    popular: true
  },
  {
    id: 'premium',
    name: 'premium',
    price: 4999,
    billing: 'monthly',
    features: [
      'All Standard features',
      'Featured listings',
      'Dedicated manager',
      'Escrow support',
      'Legal assistance',
      'Custom reports'
    ],
    limits: {
      listings: 20,
      leads: 200,
      verification: 10,
      support: 'Dedicated manager'
    },
    popular: false,
    savings: 1999
  }
];