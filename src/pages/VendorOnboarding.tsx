import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Upload, 
  Building2, 
  User, 
  FileText,
  Star,
  ArrowRight,
  ArrowLeft,
  Shield,
  Briefcase,
  Award,
  MapPin
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: 'Basic Information',
    description: 'Tell us about yourself and your business',
    icon: <User className="h-5 w-5" />
  },
  {
    id: 2,
    title: 'Professional Details',
    description: 'Share your experience and specializations',
    icon: <Briefcase className="h-5 w-5" />
  },
  {
    id: 3,
    title: 'Certifications',
    description: 'Upload your licenses and certifications',
    icon: <Award className="h-5 w-5" />
  },
  {
    id: 4,
    title: 'Portfolio',
    description: 'Showcase your best work',
    icon: <Building2 className="h-5 w-5" />
  },
  {
    id: 5,
    title: 'Verification',
    description: 'Complete KYC and document verification',
    icon: <Shield className="h-5 w-5" />
  }
];

export default function VendorOnboarding() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, updateProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    // Basic Info
    business_name: '',
    phone: '',
    business_address: '',
    website_url: '',
    
    // Professional Details
    role: 'vendor',
    experience_years: '',
    specializations: [] as string[],
    service_areas: [] as string[],
    
    // Certifications
    certifications: [] as string[],
    license_number: '',
    gst_number: '',
    
    // Portfolio
    portfolio_images: [] as string[],
    
    // KYC
    pan_number: '',
    aadhar_number: ''
  });

  const specializations = [
    'Interior Design', 'Architecture', 'Construction', 'Renovation', 
    'Landscaping', 'Plumbing', 'Electrical', 'Painting', 
    'Flooring', 'Roofing', 'Kitchen Design', 'Bathroom Design'
  ];

  const serviceAreas = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 
    'Hyderabad', 'Pune', 'Ahmedabad', 'Surat', 'Jaipur'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item) 
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.business_name && formData.phone && formData.business_address);
      case 2:
        return !!(formData.experience_years && formData.specializations.length > 0);
      case 3:
        return !!(formData.license_number || formData.gst_number);
      case 4:
        return true; // Portfolio is optional
      case 5:
        return !!(formData.pan_number && formData.aadhar_number);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    } else {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive",
      });
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const profileUpdates = {
        ...formData,
        role: formData.role as any,
        experience_years: parseInt(formData.experience_years),
        kyc_status: 'pending' as const,
        approval_status: 'pending' as const
      };

      await updateProfile(profileUpdates);
      
      toast({
        title: "Application Submitted!",
        description: "Your vendor application has been submitted for review. We'll contact you within 2-3 business days.",
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Business Name *</label>
              <Input
                value={formData.business_name}
                onChange={(e) => handleInputChange('business_name', e.target.value)}
                placeholder="Your company or business name"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Phone Number *</label>
              <Input
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+91 9876543210"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Business Address *</label>
              <Textarea
                value={formData.business_address}
                onChange={(e) => handleInputChange('business_address', e.target.value)}
                placeholder="Complete business address with city and pincode"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Website URL</label>
              <Input
                value={formData.website_url}
                onChange={(e) => handleInputChange('website_url', e.target.value)}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Professional Role *</label>
              <div className="grid grid-cols-2 gap-3">
                {['vendor', 'contractor'].map((role) => (
                  <Button
                    key={role}
                    variant={formData.role === role ? 'default' : 'outline'}
                    onClick={() => handleInputChange('role', role)}
                    className="justify-start"
                  >
                    {role === 'vendor' ? <Building2 className="h-4 w-4 mr-2" /> : <Briefcase className="h-4 w-4 mr-2" />}
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Years of Experience *</label>
              <Input
                type="number"
                value={formData.experience_years}
                onChange={(e) => handleInputChange('experience_years', e.target.value)}
                placeholder="5"
                min="0"
                max="50"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Specializations *</label>
              <p className="text-sm text-muted-foreground mb-3">Select your areas of expertise</p>
              <div className="grid grid-cols-2 gap-2">
                {specializations.map((spec) => (
                  <Badge
                    key={spec}
                    variant={formData.specializations.includes(spec) ? 'default' : 'outline'}
                    className="cursor-pointer justify-center p-2"
                    onClick={() => handleInputChange('specializations', 
                      toggleArrayItem(formData.specializations, spec)
                    )}
                  >
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Service Areas</label>
              <p className="text-sm text-muted-foreground mb-3">Select cities you serve</p>
              <div className="grid grid-cols-3 gap-2">
                {serviceAreas.map((area) => (
                  <Badge
                    key={area}
                    variant={formData.service_areas.includes(area) ? 'default' : 'outline'}
                    className="cursor-pointer justify-center p-2"
                    onClick={() => handleInputChange('service_areas', 
                      toggleArrayItem(formData.service_areas, area)
                    )}
                  >
                    <MapPin className="h-3 w-3 mr-1" />
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Professional License Number</label>
              <Input
                value={formData.license_number}
                onChange={(e) => handleInputChange('license_number', e.target.value)}
                placeholder="Enter your professional license number"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">GST Number</label>
              <Input
                value={formData.gst_number}
                onChange={(e) => handleInputChange('gst_number', e.target.value)}
                placeholder="Enter your GST registration number"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Certifications</label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Upload your professional certifications
                </p>
                <Button variant="outline" size="sm">
                  Choose Files
                </Button>
              </div>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Portfolio Images</label>
              <p className="text-sm text-muted-foreground mb-3">
                Upload images of your best work to showcase your expertise
              </p>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  Drag and drop your portfolio images here, or click to browse
                </p>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Images
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Supported formats: JPG, PNG, WebP (Max 5MB each)
                </p>
              </div>
            </div>
          </div>
        );
      
      case 5:
        return (
          <div className="space-y-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-orange-600 mr-2" />
                <p className="text-sm font-medium text-orange-800">KYC Verification Required</p>
              </div>
              <p className="text-xs text-orange-700 mt-1">
                This information is required for identity verification and will be kept secure
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">PAN Number *</label>
              <Input
                value={formData.pan_number}
                onChange={(e) => handleInputChange('pan_number', e.target.value)}
                placeholder="ABCDE1234F"
                maxLength={10}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Aadhar Number *</label>
              <Input
                value={formData.aadhar_number}
                onChange={(e) => handleInputChange('aadhar_number', e.target.value)}
                placeholder="1234 5678 9012"
                maxLength={12}
              />
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Document verification (1-2 business days)</li>
                <li>• Profile review by our team</li>
                <li>• Email notification once approved</li>
                <li>• Start receiving project opportunities</li>
              </ul>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const progress = (currentStep / 5) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-hero-gradient border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-display mb-4">Join as a Professional</h1>
            <p className="text-subheadline">
              Complete your profile to start receiving project opportunities
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Indicator */}
        <Card className="card-premium mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Setup Progress</h2>
              <span className="text-sm text-muted-foreground">{currentStep} of 5</span>
            </div>
            <Progress value={progress} className="h-2 mb-4" />
            
            <div className="grid grid-cols-5 gap-2">
              {onboardingSteps.map((step) => (
                <div key={step.id} className="text-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${
                    step.id <= currentStep 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {step.id < currentStep ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <p className="text-xs font-medium">{step.title}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Form */}
        <div className="max-w-2xl mx-auto">
          <Card className="card-premium">
            <CardHeader>
              <CardTitle className="flex items-center">
                {onboardingSteps[currentStep - 1].icon}
                <span className="ml-2">{onboardingSteps[currentStep - 1].title}</span>
              </CardTitle>
              <p className="text-muted-foreground">
                {onboardingSteps[currentStep - 1].description}
              </p>
            </CardHeader>
            <CardContent>
              {renderStepContent()}
              
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                
                {currentStep < 5 ? (
                  <Button onClick={handleNext} className="btn-premium">
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmit} 
                    disabled={loading || !validateStep(5)}
                    className="btn-premium"
                  >
                    {loading ? 'Submitting...' : 'Submit Application'}
                    <CheckCircle className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}