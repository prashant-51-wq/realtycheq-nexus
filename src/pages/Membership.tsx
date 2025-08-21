import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Crown, 
  Star, 
  CheckCircle, 
  X,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Award,
  Clock,
  HeartHandshake,
  ArrowRight,
  Phone,
  MessageSquare,
  Calendar,
  Target
} from 'lucide-react';
import { mockMembershipPlans } from '@/data/mockData';

const membershipFeatures = [
  {
    category: 'Access & Discovery',
    features: [
      { name: 'Property listings access', free: true, premium: true, enterprise: true },
      { name: 'Advanced search filters', free: false, premium: true, enterprise: true },
      { name: 'Saved searches & alerts', free: '3', premium: 'Unlimited', enterprise: 'Unlimited' },
      { name: 'Price drop notifications', free: false, premium: true, enterprise: true },
      { name: 'Off-market properties', free: false, premium: false, enterprise: true }
    ]
  },
  {
    category: 'Verification & Reports',
    features: [
      { name: 'Basic property verification', free: false, premium: true, enterprise: true },
      { name: 'Detailed inspection reports', free: false, premium: false, enterprise: true },
      { name: 'Legal document verification', free: false, premium: 'Basic', enterprise: 'Complete' },
      { name: 'Market value assessment', free: false, premium: true, enterprise: true },
      { name: 'Investment analysis reports', free: false, premium: false, enterprise: true }
    ]
  },
  {
    category: 'Support & Services',
    features: [
      { name: 'Customer support', free: 'Email only', premium: 'Phone & Email', enterprise: 'Dedicated manager' },
      { name: 'Site visit coordination', free: false, premium: true, enterprise: true },
      { name: 'Negotiation assistance', free: false, premium: false, enterprise: true },
      { name: 'Legal consultation', free: false, premium: '1 session', enterprise: 'Unlimited' },
      { name: 'Post-purchase support', free: false, premium: '30 days', enterprise: '1 year' }
    ]
  }
];

const testimonials = [
  {
    name: 'Rahul Sharma',
    role: 'Property Investor',
    plan: 'Enterprise',
    rating: 5,
    comment: 'The enterprise plan saved me months of research. The dedicated manager helped me find the perfect investment property.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
  },
  {
    name: 'Priya Patel',
    role: 'First-time Homebuyer',
    plan: 'Premium',
    rating: 5,
    comment: 'Premium membership made my home buying journey so much easier. The verification reports gave me confidence.',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
  },
  {
    name: 'Amit Kumar',
    role: 'Real Estate Professional',
    plan: 'Enterprise',
    rating: 5,
    comment: 'The off-market properties and investment analysis reports have been game-changers for my business.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
  }
];

export default function Membership() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const renderFeatureValue = (value: string | boolean, planType: string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <CheckCircle className="h-5 w-5 text-green-500" />
      ) : (
        <X className="h-5 w-5 text-muted-foreground" />
      );
    }
    
    if (value === 'false' || value === '0') {
      return <X className="h-5 w-5 text-muted-foreground" />;
    }
    
    return <span className="text-sm font-medium">{value}</span>;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-hero-gradient border-b border-border">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-display mb-4">Choose Your Membership</h1>
            <p className="text-subheadline mb-8">
              Unlock premium features and get access to exclusive properties, 
              expert support, and advanced tools
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center mb-8">
              <span className={`mr-3 ${billingPeriod === 'monthly' ? 'font-semibold' : 'text-muted-foreground'}`}>
                Monthly
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
                className="relative"
              >
                <div className={`w-12 h-6 rounded-full ${billingPeriod === 'yearly' ? 'bg-primary' : 'bg-muted'} relative transition-colors`}>
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${billingPeriod === 'yearly' ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </div>
              </Button>
              <span className={`ml-3 ${billingPeriod === 'yearly' ? 'font-semibold' : 'text-muted-foreground'}`}>
                Yearly
              </span>
              {billingPeriod === 'yearly' && (
                <Badge className="ml-2 badge-choice">Save 20%</Badge>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50k+</div>
                <div className="text-sm text-muted-foreground">Active Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">4.9★</div>
                <div className="text-sm text-muted-foreground">Member Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">98%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Membership Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
          {mockMembershipPlans.map((plan, index) => (
            <Card 
              key={plan.id} 
              className={`card-premium hover-lift relative ${
                plan.popular ? 'ring-2 ring-primary scale-105' : ''
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 badge-choice">
                  <Star className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                {plan.name === 'basic' && <Users className="h-8 w-8 text-primary" />}
                {plan.name === 'premium' && <Star className="h-8 w-8 text-primary" />}
                {plan.name === 'standard' && <Crown className="h-8 w-8 text-primary" />}
              </div>
              
              <CardTitle className="text-2xl capitalize">{plan.name}</CardTitle>
              <p className="text-muted-foreground mb-4">Professional real estate services</p>
                
                <div className="text-4xl font-bold text-primary">
                  {plan.price === 0 ? 'Free' : `₹${billingPeriod === 'yearly' ? Math.round(plan.price * 10) : plan.price}`}
                  {plan.price > 0 && (
                    <span className="text-base font-normal text-muted-foreground">
                      /{billingPeriod === 'yearly' ? 'year' : 'month'}
                    </span>
                  )}
                </div>
                
                {billingPeriod === 'yearly' && plan.price > 0 && (
                  <div className="text-sm text-muted-foreground">
                    Save ₹{Math.round(plan.price * 2.4)} per year
                  </div>
                )}
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full ${plan.popular ? 'btn-premium' : ''}`}
                  variant={plan.popular ? 'default' : 'outline'}
                  size="lg"
                >
                  {plan.name === 'basic' ? 'Get Started Free' : `Choose ${plan.name}`}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Feature Comparison */}
        <section className="mb-16">
          <h2 className="text-headline text-center mb-8">Feature Comparison</h2>
          <Card className="card-premium overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-6 font-semibold">Features</th>
                    <th className="text-center p-6 font-semibold w-32">Free</th>
                    <th className="text-center p-6 font-semibold w-32 bg-primary/5">Premium</th>
                    <th className="text-center p-6 font-semibold w-32">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {membershipFeatures.map((category, categoryIndex) => (
                    <>
                      <tr key={`category-${categoryIndex}`} className="bg-muted/30">
                        <td colSpan={4} className="p-4 font-semibold text-sm uppercase tracking-wide">
                          {category.category}
                        </td>
                      </tr>
                      {category.features.map((feature, featureIndex) => (
                        <tr key={`${categoryIndex}-${featureIndex}`} className="border-b border-border/50">
                          <td className="p-4 font-medium">{feature.name}</td>
                          <td className="p-4 text-center">
                            {renderFeatureValue(feature.free, 'free')}
                          </td>
                          <td className="p-4 text-center bg-primary/5">
                            {renderFeatureValue(feature.premium, 'premium')}
                          </td>
                          <td className="p-4 text-center">
                            {renderFeatureValue(feature.enterprise, 'enterprise')}
                          </td>
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        {/* Member Testimonials */}
        <section className="mb-16">
          <h2 className="text-headline text-center mb-8">What Our Members Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="card-premium">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="h-12 w-12 rounded-full mr-4"
                    />
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      <Badge variant="secondary" className="mt-1">
                        {testimonial.plan} Member
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground italic">
                    "{testimonial.comment}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-headline text-center mb-8">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              <Card className="card-premium">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Can I upgrade or downgrade my plan anytime?</h3>
                  <p className="text-muted-foreground">
                    Yes, you can change your membership plan at any time. Changes take effect immediately, 
                    and we'll prorate the billing accordingly.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-premium">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
                  <p className="text-muted-foreground">
                    We accept all major credit cards, debit cards, UPI, net banking, and digital wallets. 
                    All payments are processed securely.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-premium">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Is there a free trial for paid plans?</h3>
                  <p className="text-muted-foreground">
                    Yes, we offer a 14-day free trial for both Premium and Enterprise plans. 
                    No credit card required to start your trial.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Sales */}
        <Card className="card-premium text-center">
          <CardContent className="p-8">
            <h2 className="text-headline mb-4">Need a Custom Plan?</h2>
            <p className="text-subheadline mb-6 max-w-2xl mx-auto">
              For large teams, enterprises, or special requirements, 
              contact our sales team for a customized solution.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="btn-premium">
                <Phone className="h-5 w-5 mr-2" />
                Call Sales
              </Button>
              <Button size="lg" variant="outline">
                <MessageSquare className="h-5 w-5 mr-2" />
                Chat with Us
              </Button>
              <Button size="lg" variant="outline">
                <Calendar className="h-5 w-5 mr-2" />
                Schedule Demo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}