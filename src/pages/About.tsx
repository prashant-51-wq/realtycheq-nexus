import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Target, Award, Heart, ArrowRight, Shield, Globe, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const teamMembers = [
  {
    name: 'Priya Sharma',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop',
    description: 'Former Goldman Sachs analyst with 12+ years in real estate finance'
  },
  {
    name: 'Rajesh Kumar',
    role: 'CTO',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
    description: 'Ex-Google engineer specialized in marketplace platforms'
  },
  {
    name: 'Anita Patel',
    role: 'Head of Operations',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
    description: '15+ years experience in real estate operations and compliance'
  }
];

const values = [
  {
    icon: Shield,
    title: 'Transparency',
    description: 'Every transaction backed by verified data and clear processes'
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Building connections between buyers, sellers, and service providers'
  },
  {
    icon: TrendingUp,
    title: 'Innovation',
    description: 'Leveraging technology to transform the real estate experience'
  },
  {
    icon: Heart,
    title: 'Trust',
    description: 'Putting customer satisfaction and security at the center of everything'
  }
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-hero-gradient py-16">
        <div className="container mx-auto px-4 text-center">
          <Badge className="badge-premium mb-4">About RealtyCheq</Badge>
          <h1 className="text-display mb-6">
            Transforming Real Estate
            <br />with Trust & Technology
          </h1>
          <p className="text-subheadline max-w-3xl mx-auto mb-8">
            We're building India's most comprehensive real estate ecosystem, where every transaction 
            is transparent, every service provider is verified, and every customer is empowered with data-driven insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="btn-hero">
              <Link to="/browse">
                Explore Properties
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Target className="h-6 w-6 text-primary" />
                <h2 className="text-headline">Our Mission</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                To democratize access to real estate opportunities by creating a transparent, 
                efficient, and community-driven marketplace that serves every stakeholder in 
                the real estate ecosystem.
              </p>
              <div className="flex items-center space-x-2 mb-4">
                <Globe className="h-6 w-6 text-primary" />
                <h2 className="text-headline">Our Vision</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To become the most trusted real estate platform in India, where every property 
                transaction is backed by verified data, every service provider maintains the 
                highest standards, and every customer achieves their real estate goals.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop"
                alt="Modern office building"
                className="rounded-2xl shadow-large w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-headline mb-4">Our Values</h2>
            <p className="text-subheadline max-w-2xl mx-auto">
              The principles that guide everything we do at RealtyCheq
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="card-premium text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-headline mb-4">Meet Our Team</h2>
            <p className="text-subheadline max-w-2xl mx-auto">
              Experienced professionals from real estate, technology, and finance
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="card-premium text-center">
                <CardContent className="p-6">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary-gradient text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">50K+</div>
              <div className="text-sm opacity-90">Properties Listed</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">10K+</div>
              <div className="text-sm opacity-90">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-sm opacity-90">Verified Vendors</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">25+</div>
              <div className="text-sm opacity-90">Cities Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-headline mb-4">Ready to Get Started?</h2>
          <p className="text-subheadline mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust RealtyCheq for their real estate needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="btn-premium" size="lg">
              <Link to="/browse">Start Browsing</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/membership">View Membership</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}