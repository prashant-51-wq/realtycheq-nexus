import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Scale, Shield, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing or using RealtyCheq's platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.`
  },
  {
    title: '2. Platform Description',
    content: `RealtyCheq is an online marketplace that connects property buyers, sellers, and service providers. We facilitate transactions but are not a real estate broker, agent, or developer. We provide a platform for users to list, search, and transact properties and related services.`
  },
  {
    title: '3. User Responsibilities',
    content: `Users are responsible for providing accurate information, maintaining account security, complying with applicable laws, and conducting transactions in good faith. Users must not engage in fraudulent activities, post misleading information, or violate intellectual property rights.`
  },
  {
    title: '4. Property Listings',
    content: `Property listings must be accurate, complete, and comply with all applicable laws including RERA regulations. Sellers are responsible for the accuracy of their listings and must have proper authorization to list the property. We reserve the right to remove listings that violate our policies.`
  },
  {
    title: '5. Verification Services',
    content: `Our verification services are provided to enhance trust and transparency. However, verification does not guarantee the accuracy of all information or eliminate all risks. Users should conduct their own due diligence before making any property decisions.`
  },
  {
    title: '6. Financial Transactions',
    content: `All financial transactions are processed through secure, third-party payment processors. Users are responsible for applicable taxes, fees, and charges. Our escrow service, when used, provides additional security but does not eliminate all transaction risks.`
  },
  {
    title: '7. Membership and Subscriptions',
    content: `Membership fees are non-refundable except as required by law. Memberships automatically renew unless cancelled. Users can cancel their membership at any time, with cancellation taking effect at the end of the current billing period.`
  },
  {
    title: '8. Intellectual Property',
    content: `The RealtyCheq platform, including its design, features, and content, is protected by intellectual property laws. Users may not copy, modify, or distribute our content without permission. User-generated content remains owned by users but grants us license to use it on the platform.`
  },
  {
    title: '9. Privacy and Data Protection',
    content: `We are committed to protecting user privacy and comply with applicable data protection laws. Our Privacy Policy details how we collect, use, and protect personal information. Users consent to our data practices by using the platform.`
  },
  {
    title: '10. Limitation of Liability',
    content: `RealtyCheq is not liable for losses arising from property transactions, user interactions, or platform use beyond our direct control. Our liability is limited to the maximum extent permitted by law. Users assume responsibility for their own decisions and actions.`
  },
  {
    title: '11. Dispute Resolution',
    content: `Disputes between users should first be resolved directly. If mediation is needed, we provide dispute resolution services. Legal disputes with RealtyCheq are subject to binding arbitration under Indian arbitration laws and the jurisdiction of Mumbai courts.`
  },
  {
    title: '12. Modifications to Terms',
    content: `We may modify these terms at any time by posting updated terms on our platform. Continued use after modifications constitutes acceptance of new terms. Users will be notified of material changes via email or platform notifications.`
  }
];

const keyPoints = [
  {
    icon: Users,
    title: 'User Responsibilities',
    description: 'Accurate information and good faith transactions'
  },
  {
    icon: Shield,
    title: 'Platform Safety',
    description: 'Verification services and secure transactions'
  },
  {
    icon: Scale,
    title: 'Legal Compliance',
    description: 'RERA compliance and regulatory adherence'
  },
  {
    icon: FileText,
    title: 'Intellectual Property',
    description: 'Content rights and usage permissions'
  }
];

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-hero-gradient py-16">
        <div className="container mx-auto px-4 text-center">
          <Badge className="badge-premium mb-4">Legal</Badge>
          <h1 className="text-display mb-6">Terms of Service</h1>
          <p className="text-subheadline max-w-3xl mx-auto mb-6">
            These terms govern your use of RealtyCheq's platform and services. 
            Please read them carefully before using our platform.
          </p>
          <p className="text-sm text-muted-foreground">
            Last updated: December 15, 2024
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Key Points Overview */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-headline mb-4">Key Terms Overview</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Essential points to understand before using our platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyPoints.map((point, index) => (
              <Card key={index} className="card-premium text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <point.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{point.title}</h3>
                  <p className="text-muted-foreground text-sm">{point.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Terms Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="card-premium">
                <CardHeader>
                  <CardTitle className="text-lg">Table of Contents</CardTitle>
                </CardHeader>
                <CardContent>
                  <nav className="space-y-2">
                    {sections.map((section, index) => (
                      <a
                        key={index}
                        href={`#section-${index + 1}`}
                        className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                      >
                        {section.title}
                      </a>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Terms Sections */}
          <div className="lg:col-span-3 space-y-8">
            {sections.map((section, index) => (
              <section key={index} id={`section-${index + 1}`}>
                <Card className="card-premium">
                  <CardHeader>
                    <CardTitle className="text-xl">{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {section.content}
                    </p>
                  </CardContent>
                </Card>
              </section>
            ))}

            {/* Contact Information */}
            <Card className="card-featured">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-semibold mb-4">Questions About These Terms?</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  If you have any questions about these Terms of Service, please contact our legal team
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="btn-premium">
                    <Link to="/contact">Contact Legal Team</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/privacy">View Privacy Policy</Link>
                  </Button>
                </div>
                <div className="mt-6 text-sm text-muted-foreground">
                  <p>Email: legal@realtycheq.com</p>
                  <p>Address: Legal Department, RealtyCheq, Mumbai, India</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}