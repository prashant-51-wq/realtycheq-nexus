import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, MessageCircle, Phone, Mail, Book, Users, Shield, Home, FileText, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

const helpCategories = [
  {
    icon: Home,
    title: 'Property Listings',
    description: 'How to search, filter, and manage property listings',
    articles: 12,
    href: '/help/properties'
  },
  {
    icon: Users,
    title: 'Account Management',
    description: 'Profile settings, preferences, and account security',
    articles: 8,
    href: '/help/account'
  },
  {
    icon: CreditCard,
    title: 'Membership & Billing',
    description: 'Membership plans, payments, and billing queries',
    articles: 15,
    href: '/help/billing'
  },
  {
    icon: Shield,
    title: 'Safety & Security',
    description: 'Verification process, trust measures, and safety tips',
    articles: 10,
    href: '/help/safety'
  },
  {
    icon: FileText,
    title: 'Legal & Compliance',
    description: 'RERA compliance, documentation, and legal processes',
    articles: 20,
    href: '/help/legal'
  },
  {
    icon: Book,
    title: 'Vendor Services',
    description: 'How to find, hire, and work with service providers',
    articles: 18,
    href: '/help/vendors'
  }
];

const popularFAQs = [
  {
    question: 'How do I verify a property listing?',
    answer: 'Property verification on RealtyCheq involves a multi-step process including document verification, physical inspection, and legal title checks. Look for the "Verified" badge on listings that have completed our comprehensive verification process.'
  },
  {
    question: 'What is RealtyCheq Choice?',
    answer: 'RealtyCheq Choice is our premium curation service where our experts handpick the best properties based on location, pricing, legal clarity, and investment potential. Choice properties undergo additional due diligence and come with extended warranties.'
  },
  {
    question: 'How do I schedule a property visit?',
    answer: 'You can schedule a property visit directly from the property detail page by clicking "Schedule Visit". Choose your preferred date and time, and we\'ll coordinate with the seller or agent to confirm your appointment.'
  },
  {
    question: 'What are the membership benefits?',
    answer: 'RealtyCheq membership offers exclusive access to pre-launch properties, priority customer support, advanced search filters, market insights, discounted vendor services, and much more. View our membership page for detailed benefits.'
  },
  {
    question: 'How does the escrow service work?',
    answer: 'Our escrow service ensures secure transactions by holding funds until all conditions are met. The buyer deposits funds, seller provides necessary documents, and funds are released only when both parties fulfill their obligations.'
  },
  {
    question: 'Can I cancel my membership?',
    answer: 'Yes, you can cancel your membership anytime from your account settings. Cancellations take effect at the end of your current billing cycle, and you\'ll continue to have access until then.'
  }
];

const quickActions = [
  {
    icon: MessageCircle,
    title: 'Live Chat',
    description: 'Chat with our support team',
    action: 'Start Chat',
    href: '#'
  },
  {
    icon: Phone,
    title: 'Call Support',
    description: '+91 90000 90000',
    action: 'Call Now',
    href: 'tel:+919000090000'
  },
  {
    icon: Mail,
    title: 'Email Support',
    description: 'support@realtycheq.com',
    action: 'Send Email',
    href: 'mailto:support@realtycheq.com'
  }
];

export default function Help() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-hero-gradient py-16">
        <div className="container mx-auto px-4 text-center">
          <Badge className="badge-premium mb-4">Help Center</Badge>
          <h1 className="text-display mb-6">How can we help you?</h1>
          <p className="text-subheadline max-w-2xl mx-auto mb-8">
            Find answers to your questions, learn about our features, or get in touch with our support team
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                className="pl-12 pr-4 py-6 text-lg border-2"
                placeholder="Search for help articles, guides, and FAQs..."
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Quick Actions */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-headline mb-4">Need Immediate Help?</h2>
            <p className="text-muted-foreground">Get quick assistance from our support team</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Card key={index} className="card-premium text-center hover-lift">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <action.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{action.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{action.description}</p>
                  <Button asChild className="btn-premium">
                    <Link to={action.href}>{action.action}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Help Categories */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-headline mb-4">Browse Help Topics</h2>
            <p className="text-muted-foreground">Choose a category to find relevant help articles</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpCategories.map((category, index) => (
              <Link key={index} to={category.href} className="block">
                <Card className="card-premium cursor-pointer hover-lift h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <category.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{category.title}</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {category.articles} articles
                        </Badge>
                      </div>
                    </div>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Popular FAQs */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-headline mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Quick answers to the most common questions</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="card-premium">
              <CardContent className="p-6">
                <Accordion type="single" collapsible className="w-full">
                  {popularFAQs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Still Need Help */}
        <section className="mt-16 text-center">
          <h2 className="text-headline mb-4">Still Need Help?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to help you with any questions or issues.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="btn-premium">
              <Link to="/contact">Contact Support</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/learn">Browse Learning Center</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}