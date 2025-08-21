import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  Shield, 
  Star, 
  CheckCircle, 
  Award,
  Clock,
  Users,
  TrendingUp,
  ArrowRight,
  Zap,
  Target,
  Heart,
  MessageSquare
} from 'lucide-react';

const choiceFeatures = [
  {
    icon: Shield,
    title: 'Verified Excellence',
    description: 'Properties and services undergo rigorous verification for quality assurance'
  },
  {
    icon: Star,
    title: 'Premium Standards',
    description: 'Only top-rated properties and vendors with exceptional track records'
  },
  {
    icon: Award,
    title: 'Exclusive Benefits',
    description: 'Special pricing, priority support, and exclusive access to premium listings'
  },
  {
    icon: Clock,
    title: 'Priority Service',
    description: 'Faster response times and dedicated customer support for Choice members'
  }
];

const choiceStats = [
  { label: 'Choice Properties', value: '2,500+', icon: Crown },
  { label: 'Verified Vendors', value: '450+', icon: Shield },
  { label: 'Customer Satisfaction', value: '98%', icon: Heart },
  { label: 'Average Savings', value: '15%', icon: TrendingUp }
];

const membershipTiers = [
  {
    name: 'Choice Explorer',
    price: 999,
    period: 'month',
    description: 'Perfect for first-time buyers and investors',
    features: [
      'Access to Choice properties',
      'Basic verification reports',
      'Email support',
      '5 property inquiries/month',
      'Standard vendor network'
    ],
    popular: false
  },
  {
    name: 'Choice Professional',
    price: 2499,
    period: 'month',
    description: 'Ideal for serious investors and professionals',
    features: [
      'Everything in Explorer',
      'Detailed property analytics',
      'Priority customer support', 
      'Unlimited property inquiries',
      'Premium vendor network',
      'Investment advisory calls',
      'Market trend reports'
    ],
    popular: true
  },
  {
    name: 'Choice Elite',
    price: 4999,
    period: 'month',
    description: 'For enterprise clients and developers',
    features: [
      'Everything in Professional',
      'Dedicated relationship manager',
      'Custom property sourcing',
      'White-glove concierge service',
      'Exclusive pre-launch access',
      'Negotiation assistance',
      'Legal and financial consultation'
    ],
    popular: false
  }
];

export default function Choice() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-hero-gradient border-b border-border">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Crown className="h-12 w-12 text-primary mr-3" />
              <h1 className="text-display flex items-center">
                RealtyCheq <span className="text-primary ml-2">Choice</span>
              </h1>
            </div>
            <p className="text-subheadline mb-8">
              Premium real estate platform featuring hand-picked properties, 
              verified vendors, and exclusive services for discerning clients
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Button size="lg" className="btn-premium">
                <Crown className="h-5 w-5 mr-2" />
                Explore Choice Properties
              </Button>
              <Button size="lg" variant="outline">
                Learn About Membership
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {choiceStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <stat.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-headline mb-4">Why Choose RealtyCheq Choice?</h2>
            <p className="text-subheadline max-w-2xl mx-auto">
              Experience the difference with our premium platform designed for 
              sophisticated real estate needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {choiceFeatures.map((feature, index) => (
              <Card key={index} className="card-premium hover-lift text-center">
                <CardContent className="p-6">
                  <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-3">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Plans */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-headline mb-4">Choice Membership Plans</h2>
            <p className="text-subheadline max-w-2xl mx-auto">
              Select the perfect plan to unlock premium features and exclusive benefits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {membershipTiers.map((tier, index) => (
              <Card 
                key={index} 
                className={`card-premium hover-lift relative ${
                  tier.popular ? 'ring-2 ring-primary' : ''
                }`}
              >
                {tier.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 badge-choice">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                  <div className="text-3xl font-bold text-primary">
                    ₹{tier.price.toLocaleString()}
                    <span className="text-base font-normal text-muted-foreground">
                      /{tier.period}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{tier.description}</p>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full ${tier.popular ? 'btn-premium' : ''}`}
                    variant={tier.popular ? 'default' : 'outline'}
                  >
                    {tier.popular && <Crown className="h-4 w-4 mr-2" />}
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Exclusive Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-headline mb-4">Exclusive Choice Benefits</h2>
            <p className="text-subheadline max-w-2xl mx-auto">
              Unlock premium advantages available only to Choice members
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="card-premium hover-lift">
              <CardHeader>
                <Zap className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Early Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get first look at new listings and opportunities before they go public
                </p>
              </CardContent>
            </Card>

            <Card className="card-premium hover-lift">
              <CardHeader>
                <Target className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Personalized Matching</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  AI-powered recommendations based on your preferences and investment goals
                </p>
              </CardContent>
            </Card>

            <Card className="card-premium hover-lift">
              <CardHeader>
                <MessageSquare className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Dedicated Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Priority customer service with dedicated relationship managers
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-hero-gradient">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-headline mb-4">Ready to Experience Choice?</h2>
          <p className="text-subheadline mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust RealtyCheq Choice 
            for their premium real estate needs
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="btn-premium">
              <Crown className="h-5 w-5 mr-2" />
              Start Your Choice Journey
            </Button>
            <Button size="lg" variant="outline">
              Schedule a Demo
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}