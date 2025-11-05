import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation } from '@/components/common/Navigation';
import { toast } from 'sonner';
import { Loader2, Phone, Mail, User, MessageSquare, Briefcase } from 'lucide-react';

const serviceTypes = [
  { value: '2d_elevation', label: '2D Elevation Design' },
  { value: '3d_elevation', label: '3D Elevation Design' },
  { value: 'structural_design', label: 'Structural Design' },
  { value: 'presentation_plan', label: 'Presentation Plan' },
  { value: 'site_supervision', label: 'Site Supervision' },
  { value: 'vaastu_consultancy', label: 'Vaastu Consultancy' },
  { value: 'cost_estimation', label: 'Cost Estimation' },
  { value: 'turnkey_construction', label: 'Turnkey Construction' },
  { value: 'interior_design', label: 'Interior Design' },
  { value: 'architectural_design', label: 'Architectural Design' }
];

const FreeConsultation = () => {
  const { user, profile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    email: user?.email || '',
    phone: profile?.phone || '',
    serviceType: '',
    budget: '',
    timeline: '',
    location: '',
    description: '',
    preferredContactTime: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create service request
      const { data, error } = await supabase
        .from('service_requests')
        .insert({
          client_id: user?.id || null,
          service_type: formData.serviceType,
          title: `Free Consultation Request - ${serviceTypes.find(s => s.value === formData.serviceType)?.label}`,
          description: formData.description,
          budget_min: formData.budget ? parseFloat(formData.budget) : null,
          budget_max: formData.budget ? parseFloat(formData.budget) * 1.2 : null,
          timeline_required: formData.timeline ? parseInt(formData.timeline) : null,
          location: formData.location,
          contact_name: formData.name,
          contact_email: formData.email,
          contact_phone: formData.phone,
          status: 'pending',
          priority: 'medium'
        })
        .select()
        .single();

      if (error) throw error;

      // Send notification email
      try {
        await supabase.functions.invoke('send-query-notification', {
          body: {
            type: 'consultation_request',
            data: {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              serviceType: serviceTypes.find(s => s.value === formData.serviceType)?.label,
              budget: formData.budget,
              timeline: formData.timeline,
              location: formData.location,
              description: formData.description,
              preferredContactTime: formData.preferredContactTime,
              requestId: data.id
            }
          }
        });
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
        // Don't fail the main request if email fails
      }

      toast.success('Consultation request submitted successfully! We\'ll contact you within 24 hours.');
      
      // Reset form
      setFormData({
        name: profile?.name || '',
        email: user?.email || '',
        phone: profile?.phone || '',
        serviceType: '',
        budget: '',
        timeline: '',
        location: '',
        description: '',
        preferredContactTime: ''
      });

    } catch (error) {
      console.error('Error submitting consultation request:', error);
      toast.error('Failed to submit consultation request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        title="Free Consultation"
        breadcrumbs={[
          { label: 'Services', href: '/services' },
          { label: 'Free Consultation', href: '/free-consultation' }
        ]}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Free Consultation</h1>
            <p className="text-xl text-muted-foreground">
              Get expert advice for your project. Our professionals will contact you within 24 hours.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Quick Response</h3>
                <p className="text-sm text-muted-foreground">Get callback within 24 hours</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Expert Advice</h3>
                <p className="text-sm text-muted-foreground">Certified professionals</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Personalized</h3>
                <p className="text-sm text-muted-foreground">Tailored to your needs</p>
              </CardContent>
            </Card>
          </div>

          {/* Form */}
          <Card className="card-premium">
            <CardHeader>
              <CardTitle>Tell us about your project</CardTitle>
              <CardDescription>
                Fill out the form below and our experts will get back to you with personalized recommendations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="pl-10"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="pl-10"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="pl-10"
                        placeholder="+91 9876543210"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredContactTime">Preferred Contact Time</Label>
                    <Select value={formData.preferredContactTime} onValueChange={(value) => handleInputChange('preferredContactTime', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="When should we call?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning (9 AM - 12 PM)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (12 PM - 6 PM)</SelectItem>
                        <SelectItem value="evening">Evening (6 PM - 9 PM)</SelectItem>
                        <SelectItem value="anytime">Anytime</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Project Details */}
                <div className="space-y-2">
                  <Label htmlFor="serviceType">Service Required *</Label>
                  <Select value={formData.serviceType} onValueChange={(value) => handleInputChange('serviceType', value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select the service you need" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceTypes.map((service) => (
                        <SelectItem key={service.value} value={service.value}>
                          {service.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget">Approximate Budget (₹)</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={formData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      placeholder="Enter your budget"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeline">Timeline (Days)</Label>
                    <Input
                      id="timeline"
                      type="number"
                      value={formData.timeline}
                      onChange={(e) => handleInputChange('timeline', e.target.value)}
                      placeholder="Project completion timeline"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Project Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="City, State"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Project Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your project requirements, expectations, and any specific details..."
                    className="min-h-[100px]"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full btn-premium" 
                  disabled={isSubmitting}
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting Request...
                    </>
                  ) : (
                    'Get Free Consultation'
                  )}
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                  By submitting this form, you agree to be contacted by our experts regarding your project.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FreeConsultation;