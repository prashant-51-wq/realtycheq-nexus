import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Eye, Lock, Users, Database, Bell, Download, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const privacyPrinciples = [
  {
    icon: Shield,
    title: 'Data Protection',
    description: 'Your personal data is encrypted and protected with industry-standard security'
  },
  {
    icon: Eye,
    title: 'Transparency',
    description: 'Clear information about what data we collect and how we use it'
  },
  {
    icon: Lock,
    title: 'User Control',
    description: 'You have full control over your data and privacy settings'
  },
  {
    icon: Users,
    title: 'Limited Sharing',
    description: 'We never sell your data and only share when necessary for services'
  }
];

const dataTypes = [
  {
    category: 'Account Information',
    items: ['Name, email, phone number', 'Profile photo and preferences', 'Account settings and history'],
    purpose: 'Account management and authentication'
  },
  {
    category: 'Property Data',
    items: ['Search history and preferences', 'Saved properties and comparisons', 'Property viewing history'],
    purpose: 'Personalized recommendations and search results'
  },
  {
    category: 'Transaction Data',
    items: ['Payment information', 'Purchase history', 'Billing addresses'],
    purpose: 'Processing payments and maintaining transaction records'
  },
  {
    category: 'Usage Analytics',
    items: ['Website interaction data', 'Device and browser information', 'Location data (with consent)'],
    purpose: 'Improving platform performance and user experience'
  }
];

const userRights = [
  {
    icon: Eye,
    title: 'Right to Access',
    description: 'Request a copy of all personal data we hold about you',
    action: 'Download My Data'
  },
  {
    icon: Download,
    title: 'Data Portability',
    description: 'Export your data in a machine-readable format',
    action: 'Export Data'
  },
  {
    icon: Lock,
    title: 'Right to Rectification',
    description: 'Update or correct any inaccurate personal information',
    action: 'Update Profile'
  },
  {
    icon: Trash2,
    title: 'Right to Erasure',
    description: 'Request deletion of your personal data (subject to legal requirements)',
    action: 'Delete Account'
  }
];

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-hero-gradient py-16">
        <div className="container mx-auto px-4 text-center">
          <Badge className="badge-verified mb-4">Privacy</Badge>
          <h1 className="text-display mb-6">Privacy Policy</h1>
          <p className="text-subheadline max-w-3xl mx-auto mb-6">
            We are committed to protecting your privacy and ensuring transparency 
            in how we collect, use, and protect your personal information.
          </p>
          <p className="text-sm text-muted-foreground">
            Last updated: December 15, 2024 | Effective Date: January 1, 2025
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Privacy Principles */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-headline mb-4">Our Privacy Principles</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The foundational principles that guide our approach to data privacy
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {privacyPrinciples.map((principle, index) => (
              <Card key={index} className="card-premium text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <principle.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{principle.title}</h3>
                  <p className="text-muted-foreground text-sm">{principle.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Data Collection */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-headline mb-4">What Data We Collect</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Information we collect to provide and improve our services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dataTypes.map((type, index) => (
              <Card key={index} className="card-premium">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Database className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{type.category}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {type.items.map((item, i) => (
                      <p key={i} className="text-sm text-muted-foreground">• {item}</p>
                    ))}
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-xs font-medium text-primary">Purpose:</p>
                    <p className="text-xs text-muted-foreground">{type.purpose}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How We Use Data */}
        <section className="mb-16">
          <Card className="card-premium">
            <CardHeader>
              <CardTitle className="text-xl">How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Service Provision</h4>
                <p className="text-muted-foreground text-sm">
                  To provide our core services including property search, matching, verification, and transaction facilitation.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Personalization</h4>
                <p className="text-muted-foreground text-sm">
                  To customize your experience with relevant property recommendations, search results, and content.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Communication</h4>
                <p className="text-muted-foreground text-sm">
                  To send you important updates, notifications, and marketing communications (with your consent).
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Security & Fraud Prevention</h4>
                <p className="text-muted-foreground text-sm">
                  To protect our platform, prevent fraud, and ensure the security of transactions and user accounts.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Legal Compliance</h4>
                <p className="text-muted-foreground text-sm">
                  To comply with applicable laws, regulations, and legal processes including RERA requirements.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Data Sharing */}
        <section className="mb-16">
          <Card className="card-premium">
            <CardHeader>
              <CardTitle className="text-xl">When We Share Your Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="font-semibold text-sm mb-2">We never sell your personal data to third parties.</p>
                <p className="text-muted-foreground text-xs">
                  Your privacy is not for sale. We only share data when necessary to provide services or as required by law.
                </p>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-sm">Service Providers</h4>
                  <p className="text-muted-foreground text-xs">
                    With trusted partners who help us operate the platform (payment processors, hosting services, analytics providers).
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Property Transactions</h4>
                  <p className="text-muted-foreground text-xs">
                    Contact information may be shared between buyers and sellers to facilitate property transactions.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Legal Requirements</h4>
                  <p className="text-muted-foreground text-xs">
                    When required by law, court order, or to protect our rights and the safety of our users.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Your Rights */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-headline mb-4">Your Privacy Rights</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              You have full control over your personal data
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userRights.map((right, index) => (
              <Card key={index} className="card-premium">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <right.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{right.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{right.description}</p>
                      <Button size="sm" variant="outline" className="w-full">
                        {right.action}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact & Updates */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="card-premium">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Privacy Updates</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">
                We'll notify you of any material changes to this privacy policy via email or platform notifications.
              </p>
              <Button variant="outline" className="w-full">
                Subscribe to Privacy Updates
              </Button>
            </CardContent>
          </Card>

          <Card className="card-featured">
            <CardHeader>
              <CardTitle>Privacy Questions?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">
                Contact our Data Protection Officer for any privacy-related inquiries.
              </p>
              <div className="space-y-2 text-sm mb-4">
                <p>Email: privacy@realtycheq.com</p>
                <p>Address: Data Protection Officer, RealtyCheq, Mumbai, India</p>
              </div>
              <Button asChild className="btn-premium w-full">
                <Link to="/contact">Contact Privacy Team</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}