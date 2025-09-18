import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, ArrowRight, CheckCircle, User, Home, IndianRupee, MapPin, MessageCircle } from 'lucide-react';

type Step = 1 | 2 | 3 | 4 | 5;

const RequirementsFunnel = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    query_type: '',
    property_type: '',
    budget_min: '',
    budget_max: '',
    location_preference: '',
    bedrooms: '',
    requirements: '',
    additional_notes: ''
  });

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => (prev + 1) as Step);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => (prev - 1) as Step);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_queries')
        .insert({
          user_id: user?.id || null,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          query_type: formData.query_type,
          property_type: formData.property_type as 'apartment' | 'villa' | 'house' | 'plot' | 'commercial' | 'office' || null,
          budget_min: formData.budget_min ? parseFloat(formData.budget_min) : null,
          budget_max: formData.budget_max ? parseFloat(formData.budget_max) : null,
          location_preference: formData.location_preference,
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
          requirements: formData.requirements,
          additional_notes: formData.additional_notes,
          status: 'pending' as 'pending'
        });

      if (error) {
        throw error;
      }

      // Send email notification
      try {
        const { error: emailError } = await supabase.functions.invoke('send-query-notification', {
          body: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            locationPreference: formData.location_preference,
            propertyType: formData.property_type,
            budgetMin: formData.budget_min ? parseInt(formData.budget_min) : null,
            budgetMax: formData.budget_max ? parseInt(formData.budget_max) : null,
            bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
            requirements: formData.requirements,
            additionalNotes: formData.additional_notes,
            queryType: 'Requirement Funnel'
          }
        });

        if (emailError) {
          console.error('Error sending email notification:', emailError);
          // Don't fail the whole process if email fails
        }
      } catch (emailError) {
        console.error('Error with email service:', emailError);
        // Don't fail the whole process if email fails
      }

      toast({
        title: 'Requirements submitted!',
        description: 'We have received your requirements. Our team will get back to you soon.'
      });

      // Reset form and go to success step
      setCurrentStep(5);
    } catch (error: any) {
      toast({
        title: 'Submission failed',
        description: error.message || 'Failed to submit requirements. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.email && formData.phone;
      case 2:
        return formData.query_type;
      case 3:
        return formData.property_type && formData.location_preference;
      case 4:
        return formData.requirements;
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <User className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Tell us about yourself</h2>
              <p className="text-muted-foreground">We need some basic information to help you better</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">What can we help you with?</h2>
              <p className="text-muted-foreground">Select the type of assistance you need</p>
            </div>
            
            <div className="space-y-3">
              {[
                { value: 'buying', label: 'I want to buy a property', desc: 'Looking for properties to purchase' },
                { value: 'selling', label: 'I want to sell my property', desc: 'Get help selling your property' },
                { value: 'renting', label: 'I need rental assistance', desc: 'Looking for rental properties or tenants' },
                { value: 'investment', label: 'Investment advice', desc: 'Guidance on real estate investment' },
                { value: 'other', label: 'Other services', desc: 'Legal, documentation, or other services' }
              ].map((option) => (
                <Card
                  key={option.value}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    formData.query_type === option.value ? 'ring-2 ring-primary bg-primary/5' : ''
                  }`}
                  onClick={() => handleChange('query_type', option.value)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{option.label}</h3>
                        <p className="text-sm text-muted-foreground">{option.desc}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        formData.query_type === option.value ? 'bg-primary border-primary' : 'border-muted'
                      }`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Home className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Property preferences</h2>
              <p className="text-muted-foreground">Help us understand what you're looking for</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="property_type">Property Type *</Label>
                <Select value={formData.property_type} onValueChange={(value) => handleChange('property_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="plot">Plot</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location_preference">Preferred Location *</Label>
                <Input
                  id="location_preference"
                  placeholder="City, area, or specific location"
                  value={formData.location_preference}
                  onChange={(e) => handleChange('location_preference', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Select value={formData.bedrooms} onValueChange={(value) => handleChange('bedrooms', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bedrooms (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 BHK</SelectItem>
                    <SelectItem value="2">2 BHK</SelectItem>
                    <SelectItem value="3">3 BHK</SelectItem>
                    <SelectItem value="4">4 BHK</SelectItem>
                    <SelectItem value="5">5+ BHK</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget_min">Min Budget (₹)</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="budget_min"
                      type="number"
                      placeholder="Min budget"
                      value={formData.budget_min}
                      onChange={(e) => handleChange('budget_min', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="budget_max">Max Budget (₹)</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="budget_max"
                      type="number"
                      placeholder="Max budget"
                      value={formData.budget_max}
                      onChange={(e) => handleChange('budget_max', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Specific requirements</h2>
              <p className="text-muted-foreground">Tell us more about your needs and preferences</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="requirements">Main Requirements *</Label>
                <Textarea
                  id="requirements"
                  placeholder="Describe your main requirements (e.g., parking, amenities, proximity to schools, etc.)"
                  value={formData.requirements}
                  onChange={(e) => handleChange('requirements', e.target.value)}
                  rows={4}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="additional_notes">Additional Notes</Label>
                <Textarea
                  id="additional_notes"
                  placeholder="Any additional information or special requirements"
                  value={formData.additional_notes}
                  onChange={(e) => handleChange('additional_notes', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="text-center space-y-6">
            <CheckCircle className="h-16 w-16 text-success mx-auto" />
            <div>
              <h2 className="text-2xl font-bold text-success">Requirements Submitted!</h2>
              <p className="text-muted-foreground mt-2">
                Thank you for sharing your requirements. Our team will review your submission and get back to you within 24 hours.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <h3 className="font-semibold mb-2">What happens next?</h3>
                <ul className="text-sm text-muted-foreground space-y-1 text-left">
                  <li>• Our team will review your requirements</li>
                  <li>• We'll match you with suitable properties/services</li>
                  <li>• You'll receive a call from our expert within 24 hours</li>
                  <li>• We'll schedule visits/consultations as needed</li>
                </ul>
              </div>
              
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => navigate('/browse')}
                  className="btn-hero w-full"
                >
                  Browse Properties
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="w-full"
                >
                  Go to Home
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-hero-gradient py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-white hover:text-white/80 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="text-center text-white mb-6">
            <h1 className="text-3xl font-bold mb-2 text-slate-950">Tell us your requirements</h1>
            <p className="text-slate-950">We'll match you with the perfect properties and services</p>
          </div>

          {/* Progress Bar */}
          {currentStep < 5 && (
            <div className="flex items-center justify-between mb-8">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step <= currentStep ? 'bg-white text-primary' : 'bg-white/20 text-white/60'
                  }`}>
                    {step}
                  </div>
                  {step < 4 && (
                    <div className={`w-8 h-0.5 mx-2 ${step < currentStep ? 'bg-white' : 'bg-white/20'}`} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <Card className="card-premium">
          <CardContent className="p-8">
            {renderStep()}

            {currentStep < 5 && (
              <div className="flex justify-between pt-8">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>

                {currentStep === 4 ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={!validateStep() || isLoading}
                    className="btn-hero"
                  >
                    {isLoading ? 'Submitting...' : 'Submit Requirements'}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={!validateStep()}
                    className="btn-hero"
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RequirementsFunnel;