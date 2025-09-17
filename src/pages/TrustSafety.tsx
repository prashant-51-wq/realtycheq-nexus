import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, FileCheck, Users, Lock, Eye, AlertTriangle, CheckCircle2, Award, Gavel, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const safetyFeatures = [
  {
    icon: Shield,
    title: 'Property Verification',
    description: 'Comprehensive verification of all property documents and legal status',
    features: ['Document authentication', 'Legal title verification', 'RERA compliance check', 'Physical inspection']
  },
  {
    icon: Users,
    title: 'User Authentication',
    description: 'Rigorous verification process for all platform users',
    features: ['KYC verification', 'Phone & email validation', 'ID document verification', 'Background checks']
  },
  {
    icon: Lock,
    title: 'Secure Transactions',
    description: 'Bank-grade security for all financial transactions',
    features: ['Escrow services', 'Encrypted payments', 'Audit trails', 'Fraud monitoring']
  },
  {
    icon: Eye,
    title: 'Transparency',
    description: 'Complete visibility into property history and market data',
    features: ['Price transparency', 'Transaction history', 'Market analytics', 'Ownership records']
  }
];

const trustMeasures = [
  {
    title: 'RERA Compliance',
    description: 'All properties and developers are RERA registered and compliant',
    icon: FileCheck,
    status: 'Active'
  },
  {
    title: 'Escrow Protection',
    description: 'Funds held securely until all transaction conditions are met',
    icon: Shield,
    status: 'Active'
  },
  {
    title: 'Insurance Coverage',
    description: 'Transaction insurance available for additional peace of mind',
    icon: Award,
    status: 'Active'
  },
  {
    title: 'Legal Support',
    description: 'Access to legal experts for documentation and compliance',
    icon: Gavel,
    status: 'Active'
  }
];

const reportingOptions = [
  {
    title: 'Fraudulent Listing',
    description: 'Report fake or misleading property listings',
    severity: 'high'
  },
  {
    title: 'Fake Documents',
    description: 'Report suspected document forgery or manipulation',
    severity: 'high'
  },
  {
    title: 'Harassment',
    description: 'Report inappropriate behavior or harassment',
    severity: 'medium'
  },
  {
    title: 'Spam/Unwanted Contact',
    description: 'Report spam messages or unwanted communication',
    severity: 'low'
  },
  {
    title: 'Payment Issues',
    description: 'Report problems with transactions or payments',
    severity: 'high'
  },
  {
    title: 'Technical Issues',
    description: 'Report platform bugs or technical problems',
    severity: 'low'
  }
];

export default function TrustSafety() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-hero-gradient py-16">
        <div className="container mx-auto px-4 text-center">
          <Badge className="badge-verified mb-4">Trust & Safety</Badge>
          <h1 className="text-display mb-6">
            Your Security is Our Priority
          </h1>
          <p className="text-subheadline max-w-3xl mx-auto mb-8">
            We've built comprehensive safety measures to ensure secure, transparent, 
            and trustworthy real estate transactions for everyone on our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="btn-premium">
              <Link to="#report">Report an Issue</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/help">Safety Guidelines</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Safety Features */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-headline mb-4">How We Keep You Safe</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Multiple layers of security and verification to protect your interests
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {safetyFeatures.map((feature, index) => (
              <Card key={index} className="card-premium">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{feature.title}</CardTitle>
                    </div>
                  </div>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {feature.features.map((item, i) => (
                      <div key={i} className="flex items-center space-x-2 text-sm">
                        <CheckCircle2 className="h-3 w-3 text-success" />
                        <span className="text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Trust Measures */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-headline mb-4">Trust Measures</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Industry-leading standards for transparency and security
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustMeasures.map((measure, index) => (
              <Card key={index} className="card-premium text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <measure.icon className="h-6 w-6 text-success" />
                  </div>
                  <h3 className="font-semibold mb-2">{measure.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{measure.description}</p>
                  <Badge className="badge-verified text-xs">{measure.status}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Data Protection */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-headline mb-6">Data Protection & Privacy</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                    <Lock className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">End-to-End Encryption</h3>
                    <p className="text-muted-foreground text-sm">All personal data is encrypted during transmission and storage</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                    <Shield className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">GDPR Compliant</h3>
                    <p className="text-muted-foreground text-sm">Full compliance with global data protection regulations</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                    <Eye className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Data Transparency</h3>
                    <p className="text-muted-foreground text-sm">Clear policies on data collection, usage, and sharing</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                    <Users className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">User Control</h3>
                    <p className="text-muted-foreground text-sm">Full control over your personal data and privacy settings</p>
                  </div>
                </div>
              </div>
              <Button asChild className="btn-premium mt-6">
                <Link to="/privacy">Read Privacy Policy</Link>
              </Button>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop"
                alt="Data Security"
                className="rounded-2xl shadow-large w-full"
              />
            </div>
          </div>
        </section>

        {/* Report Issues */}
        <section id="report" className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-headline mb-4">Report Safety Issues</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Help us maintain a safe platform by reporting any suspicious activity or violations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportingOptions.map((option, index) => (
              <Card key={index} className="card-premium cursor-pointer hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-3 h-3 rounded-full ${
                      option.severity === 'high' ? 'bg-destructive' :
                      option.severity === 'medium' ? 'bg-warning' : 'bg-success'
                    }`} />
                    <h3 className="font-semibold">{option.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">{option.description}</p>
                  <Button size="sm" variant="outline" className="w-full">
                    Report Issue
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Emergency Contact */}
        <section>
          <Card className="card-featured">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Phone className="h-6 w-6 text-primary" />
                <h2 className="text-headline">24/7 Safety Hotline</h2>
              </div>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                For urgent safety concerns or emergency situations, contact our dedicated safety team immediately
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="btn-premium" size="lg">
                  Call Safety Hotline
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/help">View Safety Guidelines</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}