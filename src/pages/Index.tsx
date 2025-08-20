import { PropertyCard } from '@/components/cards/PropertyCard';
import { HeroSection } from '@/components/common/HeroSection';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Users, 
  Shield, 
  Clock, 
  Star,
  CheckCircle,
  ArrowRight,
  Palette,
  Hammer,
  Calculator,
  Crown
} from 'lucide-react';
import { mockProperties, mockMembershipPlans } from '@/data/mockData';
import { useState } from 'react';
import heroImage from '@/assets/hero-property.jpg';

const Index = () => {
  const [savedProperties, setSavedProperties] = useState<Set<string>>(new Set());

  const handleSaveProperty = (id: string) => {
    setSavedProperties(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleViewProperty = (id: string) => {
    window.location.href = `/browse/${id}`;
  };

  const handleCompareProperty = (id: string) => {
    console.log('Compare property:', id);
  };

  const categories = [
    {
      name: 'Modern',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      description: 'Contemporary designs with clean lines'
    },
    {
      name: 'Traditional',
      image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&h=300&fit=crop',
      description: 'Classic architectural styles'
    },
    {
      name: 'Luxury',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
      description: 'Premium finishes and amenities'
    },
    {
      name: 'Sustainable',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      description: 'Eco-friendly and energy efficient'
    }
  ];

  const trends = [
    {
      title: 'Smart Home Integration Rising',
      description: 'IoT-enabled properties seeing 40% higher demand',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop'
    },
    {
      title: 'Sustainable Building Materials',
      description: 'Eco-friendly construction gaining momentum',
      image: 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=600&h=400&fit=crop'
    },
    {
      title: 'Co-working Spaces in Residential',
      description: 'Work-from-home friendly designs trending',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop'
    }
  ];

  const howItWorksSteps = [
    {
      icon: Shield,
      title: 'Verified Listings',
      description: 'Browse through professionally verified properties and services'
    },
    {
      icon: Users,
      title: 'Connect Safely',
      description: 'Connect with verified sellers, buyers, and professionals'
    },
    {
      icon: CheckCircle,
      title: 'Secure Transactions',
      description: 'Complete transactions with escrow protection and legal support'
    },
    {
      icon: Crown,
      title: 'Premium Support',
      description: 'Get dedicated support throughout your real estate journey'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Properties */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-headline mb-4">Featured Properties</h2>
            <p className="text-subheadline">
              Handpicked premium properties from our verified collection
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {mockProperties.slice(0, 3).map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                saved={savedProperties.has(property.id)}
                onSave={handleSaveProperty}
                onView={handleViewProperty}
                onCompare={handleCompareProperty}
              />
            ))}
          </div>

          <div className="text-center">
            <Button className="btn-premium">
              View All Properties
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Design Categories */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-headline mb-4">Design Categories</h2>
            <p className="text-subheadline">
              Explore different architectural and interior design styles
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Card key={index} className="card-premium hover-lift cursor-pointer">
                <div className="aspect-[4/3] overflow-hidden rounded-t-2xl">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Trends */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-headline mb-4">Latest Trends</h2>
            <p className="text-subheadline">
              Stay updated with the latest real estate and design trends
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trends.map((trend, index) => (
              <Card key={index} className="card-premium hover-lift cursor-pointer">
                <div className="aspect-[16/9] overflow-hidden rounded-t-2xl">
                  <img 
                    src={trend.image} 
                    alt={trend.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{trend.title}</h3>
                  <p className="text-muted-foreground">{trend.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-hero-gradient">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-headline mb-4">How RealtyCheq Works</h2>
            <p className="text-subheadline">
              Your trusted partner for every real estate need
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorksSteps.map((step, index) => (
              <Card key={index} className="card-premium text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Pricing */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-headline mb-4">Membership Plans</h2>
            <p className="text-subheadline">
              Choose the perfect plan for your real estate journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {mockMembershipPlans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`card-premium hover-lift ${
                  plan.popular ? 'card-featured ring-2 ring-primary scale-105' : ''
                }`}
              >
                <CardHeader className="text-center">
                  <div className="space-y-2">
                    {plan.popular && (
                      <Badge className="badge-choice mx-auto">
                        <Star className="h-3 w-3 mr-1" />
                        Most Popular
                      </Badge>
                    )}
                    <CardTitle className="text-2xl capitalize">{plan.name}</CardTitle>
                    <div className="space-y-1">
                      <div className="text-3xl font-bold">
                        {plan.price === 0 ? 'Free' : `₹${plan.price.toLocaleString()}`}
                      </div>
                      {plan.price > 0 && (
                        <div className="text-sm text-muted-foreground">per month</div>
                      )}
                      {plan.savings && (
                        <div className="text-sm text-success">
                          Save ₹{plan.savings.toLocaleString()}/year
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-success mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.popular ? 'btn-hero' : 'btn-premium'}`}
                  >
                    {plan.price === 0 ? 'Get Started' : 'Choose Plan'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary-gradient text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Trusted by Thousands</h2>
            <p className="text-xl opacity-90">Real numbers from our growing community</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="opacity-90">Properties Listed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">25K+</div>
              <div className="opacity-90">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="opacity-90">Verified Vendors</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">₹2000Cr+</div>
              <div className="opacity-90">Transactions Facilitated</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose RealtyCheq */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-headline mb-4">Why Choose RealtyCheq?</h2>
            <p className="text-subheadline">
              Experience the difference with India's most trusted real estate platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-3">100% Verified</h3>
              <p className="text-muted-foreground">All properties and vendors undergo strict verification</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-3">Lightning Fast</h3>
              <p className="text-muted-foreground">Find and connect with the right people in minutes</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-3">Premium Quality</h3>
              <p className="text-muted-foreground">Curated selection of high-quality properties and services</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-3">Community Driven</h3>
              <p className="text-muted-foreground">Join thriving communities with DAO governance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-headline mb-4">What Our Customers Say</h2>
            <p className="text-subheadline">
              Real experiences from real customers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="card-premium">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "RealtyCheq made buying my dream home so easy. The verification process gave me complete confidence in my purchase."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold">PK</span>
                  </div>
                  <div>
                    <div className="font-semibold">Priya Kapoor</div>
                    <div className="text-sm text-muted-foreground">Home Buyer, Mumbai</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-premium">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "As an architect, RealtyCheq has connected me with amazing clients. The platform's professionalism is unmatched."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold">RS</span>
                  </div>
                  <div>
                    <div className="font-semibold">Rajesh Sharma</div>
                    <div className="text-sm text-muted-foreground">Architect, Bangalore</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-premium">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "The community aspect is fantastic. I've learned so much from other investors and made some great connections."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-warning rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold">AM</span>
                  </div>
                  <div>
                    <div className="font-semibold">Anjali Mehta</div>
                    <div className="text-sm text-muted-foreground">Property Investor, Delhi</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-headline mb-4">Frequently Asked Questions</h2>
            <p className="text-subheadline">
              Get answers to common questions about RealtyCheq
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <Card className="card-premium">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-3">How does property verification work?</h3>
                <p className="text-muted-foreground">
                  Our expert team conducts comprehensive verification including title checks, legal compliance, 
                  and physical inspection to ensure every property meets our strict standards.
                </p>
              </CardContent>
            </Card>

            <Card className="card-premium">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-3">What is RealtyCheq Choice?</h3>
                <p className="text-muted-foreground">
                  RealtyCheq Choice is our premium curation service featuring the best properties and vendors, 
                  handpicked by our experts for exceptional quality and value.
                </p>
              </CardContent>
            </Card>

            <Card className="card-premium">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-3">How do community features work?</h3>
                <p className="text-muted-foreground">
                  Join local property communities to participate in DAO governance, vote on proposals, 
                  share opportunities, and connect with like-minded investors and owners.
                </p>
              </CardContent>
            </Card>

            <Card className="card-premium">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-3">What are the membership benefits?</h3>
                <p className="text-muted-foreground">
                  Members get priority access to listings, reduced platform fees, exclusive opportunities, 
                  dedicated support, and advanced tools for better decision making.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-hero-gradient">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-muted-foreground">
            Join thousands of satisfied customers on RealtyCheq
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              className="btn-hero"
              onClick={() => window.location.href = '/browse'}
            >
              Browse Properties
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => window.location.href = '/list-property'}
            >
              List Your Property
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
