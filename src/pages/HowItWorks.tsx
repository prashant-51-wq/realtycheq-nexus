import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, FileCheck, HandHeart, Key, Users, Briefcase, Shield, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const buyerSteps = [
  {
    icon: Search,
    title: 'Search & Filter',
    description: 'Use our advanced filters to find properties that match your exact requirements',
    details: ['Location-based search', 'Price range filters', 'Property type selection', 'Amenities matching']
  },
  {
    icon: FileCheck,
    title: 'Verify & Compare',
    description: 'Compare verified properties and check all legal documents',
    details: ['Document verification', 'Legal clearance check', 'Price comparison', 'Neighborhood analysis']
  },
  {
    icon: HandHeart,
    title: 'Schedule Visit',
    description: 'Book property visits and get expert guidance',
    details: ['Flexible scheduling', 'Virtual tours available', 'Expert consultation', 'Multiple property visits']
  },
  {
    icon: Key,
    title: 'Secure Transaction',
    description: 'Complete your purchase through our secure escrow service',
    details: ['Escrow protection', 'Legal documentation', 'Transparent process', 'Post-purchase support']
  }
];

const sellerSteps = [
  {
    icon: FileCheck,
    title: 'List Your Property',
    description: 'Create a comprehensive listing with all property details',
    details: ['Professional photography', 'Detailed description', 'Competitive pricing', 'Document upload']
  },
  {
    icon: Shield,
    title: 'Get Verified',
    description: 'Enhance credibility with our verification process',
    details: ['Document verification', 'Property inspection', 'Legal clearance', 'Verified badge']
  },
  {
    icon: Users,
    title: 'Connect with Buyers',
    description: 'Receive genuine inquiries from pre-qualified buyers',
    details: ['Quality leads', 'Buyer verification', 'Direct communication', 'Visit coordination']
  },
  {
    icon: HandHeart,
    title: 'Close the Deal',
    description: 'Complete the sale with our support and guidance',
    details: ['Negotiation support', 'Escrow service', 'Legal assistance', 'Smooth closure']
  }
];

const serviceProviderSteps = [
  {
    icon: FileCheck,
    title: 'Register & Verify',
    description: 'Join our network of trusted service providers',
    details: ['Business verification', 'License validation', 'Insurance check', 'Background screening']
  },
  {
    icon: Briefcase,
    title: 'Showcase Services',
    description: 'Create a compelling profile with your expertise',
    details: ['Portfolio display', 'Service packages', 'Pricing transparency', 'Customer reviews']
  },
  {
    icon: Users,
    title: 'Receive Opportunities',
    description: 'Get matched with relevant projects and clients',
    details: ['Smart matching', 'Quality leads', 'Project notifications', 'Bid on opportunities']
  },
  {
    icon: CheckCircle,
    title: 'Deliver Excellence',
    description: 'Complete projects and build your reputation',
    details: ['Project management', 'Milestone tracking', 'Secure payments', 'Review system']
  }
];

const features = [
  {
    title: 'Verified Listings',
    description: 'All properties undergo thorough verification for legal clarity and authenticity'
  },
  {
    title: 'Escrow Protection',
    description: 'Secure transactions with our trusted escrow service for peace of mind'
  },
  {
    title: 'Expert Guidance',
    description: 'Get support from real estate experts throughout your journey'
  },
  {
    title: 'Transparent Pricing',
    description: 'No hidden fees - clear pricing for all services and transactions'
  },
  {
    title: 'Community Driven',
    description: 'Connect with local communities and get neighborhood insights'
  },
  {
    title: 'Technology Powered',
    description: 'Advanced algorithms for smart matching and market insights'
  }
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-hero-gradient py-16">
        <div className="container mx-auto px-4 text-center">
          <Badge className="badge-premium mb-4">How It Works</Badge>
          <h1 className="text-display mb-6">
            Simple Steps to Your
            <br />Real Estate Goals
          </h1>
          <p className="text-subheadline max-w-3xl mx-auto mb-8">
            Whether you're buying, selling, or providing services, RealtyCheq makes 
            the process transparent, secure, and efficient for everyone.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Role-based Steps */}
        <Tabs defaultValue="buyer" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-12">
            <TabsTrigger value="buyer">For Buyers</TabsTrigger>
            <TabsTrigger value="seller">For Sellers</TabsTrigger>
            <TabsTrigger value="vendor">For Service Providers</TabsTrigger>
          </TabsList>

          <TabsContent value="buyer">
            <div className="text-center mb-12">
              <h2 className="text-headline mb-4">Your Property Buying Journey</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                From search to ownership, we guide you through every step of buying your dream property
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {buyerSteps.map((step, index) => (
                <Card key={index} className="card-premium relative">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <step.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="absolute top-4 right-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{step.description}</p>
                    <div className="space-y-1">
                      {step.details.map((detail, i) => (
                        <div key={i} className="flex items-center justify-center text-xs text-muted-foreground">
                          <CheckCircle className="h-3 w-3 text-success mr-1" />
                          {detail}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button asChild className="btn-premium" size="lg">
                <Link to="/browse">
                  Start Property Search
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="seller">
            <div className="text-center mb-12">
              <h2 className="text-headline mb-4">Your Property Selling Journey</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                List your property and connect with serious buyers through our trusted platform
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sellerSteps.map((step, index) => (
                <Card key={index} className="card-premium relative">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <step.icon className="h-8 w-8 text-secondary" />
                    </div>
                    <div className="absolute top-4 right-4 w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{step.description}</p>
                    <div className="space-y-1">
                      {step.details.map((detail, i) => (
                        <div key={i} className="flex items-center justify-center text-xs text-muted-foreground">
                          <CheckCircle className="h-3 w-3 text-success mr-1" />
                          {detail}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button asChild className="btn-premium" size="lg">
                <Link to="/dashboard/listings/new">
                  List Your Property
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="vendor">
            <div className="text-center mb-12">
              <h2 className="text-headline mb-4">Your Service Provider Journey</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Join our network of trusted professionals and grow your business
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {serviceProviderSteps.map((step, index) => (
                <Card key={index} className="card-premium relative">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <step.icon className="h-8 w-8 text-warning" />
                    </div>
                    <div className="absolute top-4 right-4 w-8 h-8 bg-warning rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{step.description}</p>
                    <div className="space-y-1">
                      {step.details.map((detail, i) => (
                        <div key={i} className="flex items-center justify-center text-xs text-muted-foreground">
                          <CheckCircle className="h-3 w-3 text-success mr-1" />
                          {detail}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button asChild className="btn-premium" size="lg">
                <Link to="/vendor-onboarding">
                  Join as Vendor
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Key Features */}
        <section className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-headline mb-4">Why Choose RealtyCheq?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built with trust, security, and transparency at the core
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="card-premium">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-1 mb-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <h3 className="font-semibold">{feature.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-24 text-center">
          <Card className="card-featured">
            <CardContent className="p-12">
              <h2 className="text-headline mb-4">Ready to Get Started?</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied customers who trust RealtyCheq for their real estate needs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="btn-premium" size="lg">
                  <Link to="/browse">Find Properties</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/membership">View Membership</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}