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
      image: '/category-modern.jpg',
      description: 'Contemporary designs with clean lines'
    },
    {
      name: 'Traditional',
      image: '/category-traditional.jpg',
      description: 'Classic architectural styles'
    },
    {
      name: 'Luxury',
      image: '/category-luxury.jpg',
      description: 'Premium finishes and amenities'
    },
    {
      name: 'Sustainable',
      image: '/category-sustainable.jpg',
      description: 'Eco-friendly and energy efficient'
    }
  ];

  const trends = [
    {
      title: 'Smart Home Integration Rising',
      description: 'IoT-enabled properties seeing 40% higher demand',
      image: '/trend-1.jpg'
    },
    {
      title: 'Sustainable Building Materials',
      description: 'Eco-friendly construction gaining momentum',
      image: '/trend-2.jpg'
    },
    {
      title: 'Co-working Spaces in Residential',
      description: 'Work-from-home friendly designs trending',
      image: '/trend-3.jpg'
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
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Palette className="h-16 w-16 text-primary" />
                  </div>
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
                  <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                    <TrendingUp className="h-12 w-12 text-primary" />
                  </div>
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

      {/* CTA Section */}
      <section className="py-16 bg-primary-gradient text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied customers on RealtyCheq
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-gray-100">
              Browse Properties
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
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
