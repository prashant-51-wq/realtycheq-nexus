import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Mail, Clock, MessageCircle, HeadphonesIcon } from 'lucide-react';

const contactMethods = [
  {
    icon: Phone,
    title: 'Phone Support',
    description: 'Speak directly with our support team',
    contact: '+91 90000 90000',
    availability: 'Mon-Sat: 9 AM - 8 PM'
  },
  {
    icon: Mail,
    title: 'Email Support',
    description: 'Send us an email and we\'ll respond within 24 hours',
    contact: 'support@realtycheq.com',
    availability: '24/7 Response'
  },
  {
    icon: MessageCircle,
    title: 'Live Chat',
    description: 'Chat with us in real-time',
    contact: 'Available on website',
    availability: 'Mon-Sat: 9 AM - 8 PM'
  }
];

const offices = [
  {
    city: 'Mumbai',
    address: '123 Business District, Bandra Kurla Complex, Mumbai 400051',
    phone: '+91 90000 90001'
  },
  {
    city: 'Delhi',
    address: '456 Corporate Tower, Connaught Place, New Delhi 110001',
    phone: '+91 90000 90002'
  },
  {
    city: 'Bangalore',
    address: '789 Tech Park, Electronic City, Bangalore 560100',
    phone: '+91 90000 90003'
  }
];

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-hero-gradient py-16">
        <div className="container mx-auto px-4 text-center">
          <Badge className="badge-premium mb-4">Get In Touch</Badge>
          <h1 className="text-display mb-6">Contact Us</h1>
          <p className="text-subheadline max-w-2xl mx-auto">
            Have questions? We're here to help. Reach out to our team and we'll get back to you as soon as possible.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card className="card-premium">
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="Enter your first name" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Enter your last name" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="+91 90000 90000" />
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="property">Property Related</SelectItem>
                      <SelectItem value="vendor">Vendor Services</SelectItem>
                      <SelectItem value="membership">Membership</SelectItem>
                      <SelectItem value="technical">Technical Support</SelectItem>
                      <SelectItem value="billing">Billing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell us more about your inquiry..."
                    className="min-h-[120px]"
                  />
                </div>

                <Button className="w-full btn-premium">Send Message</Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Methods */}
            <div>
              <h2 className="text-headline mb-6">Get in touch</h2>
              <div className="space-y-4">
                {contactMethods.map((method, index) => (
                  <Card key={index} className="card-premium">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <method.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{method.title}</h3>
                          <p className="text-muted-foreground text-sm mb-2">{method.description}</p>
                          <p className="font-medium text-primary">{method.contact}</p>
                          <div className="flex items-center space-x-1 mt-2">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{method.availability}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Office Locations */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Our Offices</h3>
              <div className="space-y-4">
                {offices.map((office, index) => (
                  <Card key={index} className="card-premium">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <h4 className="font-semibold">{office.city}</h4>
                          <p className="text-muted-foreground text-sm">{office.address}</p>
                          <p className="text-primary text-sm font-medium">{office.phone}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Support Hours */}
            <Card className="card-featured">
              <CardContent className="p-6 text-center">
                <HeadphonesIcon className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">24/7 Emergency Support</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  For urgent property emergencies and critical issues
                </p>
                <Button variant="outline" className="btn-ghost-premium">
                  Call Emergency Line
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mt-16 text-center">
          <h2 className="text-headline mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground mb-6">
            Looking for quick answers? Check out our comprehensive FAQ section
          </p>
          <Button variant="outline" size="lg">
            View FAQ
          </Button>
        </section>
      </div>
    </div>
  );
}