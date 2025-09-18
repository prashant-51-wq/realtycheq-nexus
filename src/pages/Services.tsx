import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, 
  Hammer, 
  Shield, 
  Calculator,
  Clock,
  Star,
  ArrowRight,
  CheckCircle,
  ArrowLeft,
  Home,
  Briefcase
} from 'lucide-react';
import { mockServicePackages } from '@/data/mockData';

const serviceCategories = [
  {
    id: 'design',
    name: 'Design',
    icon: Palette,
    description: 'Architecture and interior design services',
    color: 'text-blue-600'
  },
  {
    id: 'construction',
    name: 'Build & Renovate', 
    icon: Hammer,
    description: 'Construction and renovation services',
    color: 'text-orange-600'
  },
  {
    id: 'verification',
    name: 'Verify & Audit',
    icon: Shield,
    description: 'Property verification and quality audits',
    color: 'text-green-600'
  }
];

export default function Services() {
  const [activeCategory, setActiveCategory] = useState('design');

  const formatPrice = (min: number, max: number) => {
    const formatAmount = (amount: number) => {
      if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
      return `₹${amount.toLocaleString()}`;
    };
    return `${formatAmount(min)} - ${formatAmount(max)}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="container mx-auto px-4 py-6">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
          <Link to="/" className="hover:text-primary flex items-center">
            <Home className="h-3 w-3 mr-1" />
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground">Services</span>
        </nav>
        <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </div>

      {/* Hero Section */}
      <div className="bg-hero-gradient border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-display mb-4 flex items-center justify-center">
              <Briefcase className="h-12 w-12 mr-4 text-white" />
              Professional Real Estate Services
            </h1>
            <p className="text-subheadline mb-8">
              From design to construction to verification - find trusted professionals 
              for every aspect of your real estate journey
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {serviceCategories.map((category) => (
                <Card 
                  key={category.id}
                  className={`cursor-pointer hover-lift ${
                    activeCategory === category.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <CardContent className="p-6 text-center">
                    <category.icon className={`h-12 w-12 mx-auto mb-3 ${category.color}`} />
                    <h3 className="font-semibold mb-2">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Services Content */}
      <div className="container mx-auto px-4 py-12">
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="grid w-full grid-cols-3">
            {serviceCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                <category.icon className="h-4 w-4 mr-2" />
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="design" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockServicePackages
                .filter(pkg => pkg.category === 'design')
                .map((service) => (
                  <Card key={service.id} className="card-premium hover-lift">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{service.name}</CardTitle>
                          {service.popular && (
                            <Badge className="mt-2 badge-choice">
                              <Star className="h-3 w-3 mr-1" />
                              Popular
                            </Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">
                            {formatPrice(service.pricing.min, service.pricing.max)}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {service.timeline} days
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{service.description}</p>
                      
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium mb-2">Deliverables</h4>
                          <ul className="space-y-1">
                            {service.deliverables.map((item, index) => (
                              <li key={index} className="flex items-center text-sm">
                                <CheckCircle className="h-3 w-3 text-primary mr-2" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Features</h4>
                          <div className="flex flex-wrap gap-1">
                            {service.features.map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2 mt-6">
                        <Button className="flex-1 btn-premium">
                          Get Quote
                        </Button>
                        <Button variant="outline" size="sm">
                          View Details
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="construction" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="card-premium hover-lift">
                <CardHeader>
                  <CardTitle>Turnkey Construction</CardTitle>
                  <div className="text-lg font-bold">₹1,200 - ₹1,800 per sqft</div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Complete construction management from foundation to finishing
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center text-sm">
                      <CheckCircle className="h-3 w-3 text-primary mr-2" />
                      End-to-end project management
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle className="h-3 w-3 text-primary mr-2" />
                      Quality materials & labor
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle className="h-3 w-3 text-primary mr-2" />
                      Timeline guarantee
                    </li>
                  </ul>
                  <Button className="w-full btn-premium">Get Quote</Button>
                </CardContent>
              </Card>

              <Card className="card-premium hover-lift">
                <CardHeader>
                  <CardTitle>House Renovation</CardTitle>
                  <div className="text-lg font-bold">₹800 - ₹1,200 per sqft</div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Transform your existing space with modern renovations
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center text-sm">
                      <CheckCircle className="h-3 w-3 text-primary mr-2" />
                      Modular kitchen & bathrooms
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle className="h-3 w-3 text-primary mr-2" />
                      Electrical & plumbing updates
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle className="h-3 w-3 text-primary mr-2" />
                      Paint & flooring
                    </li>
                  </ul>
                  <Button className="w-full btn-premium">Get Quote</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="verification" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="card-premium hover-lift">
                <CardHeader>
                  <CardTitle>Property Verification</CardTitle>
                  <div className="text-lg font-bold">₹15,000 - ₹35,000</div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Comprehensive property verification and documentation check
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center text-sm">
                      <CheckCircle className="h-3 w-3 text-primary mr-2" />
                      Title verification
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle className="h-3 w-3 text-primary mr-2" />
                      Legal compliance check
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle className="h-3 w-3 text-primary mr-2" />
                      Physical inspection
                    </li>
                  </ul>
                  <Button className="w-full btn-premium">Book Verification</Button>
                </CardContent>
              </Card>

              <Card className="card-premium hover-lift">
                <CardHeader>
                  <CardTitle>Quality Audit</CardTitle>
                  <div className="text-lg font-bold">₹10,000 - ₹25,000</div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Professional quality audit for construction projects
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center text-sm">
                      <CheckCircle className="h-3 w-3 text-primary mr-2" />
                      Structural assessment
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle className="h-3 w-3 text-primary mr-2" />
                      Material quality check
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle className="h-3 w-3 text-primary mr-2" />
                      Compliance verification
                    </li>
                  </ul>
                  <Button className="w-full btn-premium">Schedule Audit</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Utilities Section */}
        <div className="mt-16">
          <h2 className="text-headline mb-8 text-center">Planning Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="card-premium hover-lift text-center">
              <CardContent className="p-6">
                <Calculator className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Cost Estimator</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get accurate construction cost estimates
                </p>
                <Button variant="outline" size="sm">Try Now</Button>
              </CardContent>
            </Card>

            <Card className="card-premium hover-lift text-center">
              <CardContent className="p-6">
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Timeline Planner</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Plan your project timeline effectively
                </p>
                <Button variant="outline" size="sm">Plan Now</Button>
              </CardContent>
            </Card>

            <Card className="card-premium hover-lift text-center">
              <CardContent className="p-6">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">BoQ Generator</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Generate detailed bill of quantities
                </p>
                <Button variant="outline" size="sm">Generate</Button>
              </CardContent>
            </Card>

            <Card className="card-premium hover-lift text-center">
              <CardContent className="p-6">
                <Star className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Warranty Tracker</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Track warranties and maintenance
                </p>
                <Button variant="outline" size="sm">Track</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}