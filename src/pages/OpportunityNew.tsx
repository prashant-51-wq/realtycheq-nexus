import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  ArrowRight, 
  Upload, 
  Plus, 
  X, 
  Building2, 
  MapPin, 
  Calendar, 
  DollarSign,
  FileText,
  Shield,
  CheckCircle
} from 'lucide-react';
import { useAnalytics } from '@/lib/hooks/useAnalytics';
import { supabase } from '@/integrations/supabase/client';

interface RFQFormData {
  title: string;
  description: string;
  category: string;
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  budget: {
    min: number;
    max: number;
  };
  timeline: number;
  requirements: string[];
  projectDetails: {
    propertyType: string;
    area: number;
    scope: string[];
  };
  attachments: File[];
  milestones: Array<{
    title: string;
    description: string;
    percentage: number;
  }>;
  nda: boolean;
}

const projectCategories = [
  { value: 'construction', label: 'Construction' },
  { value: 'renovation', label: 'Renovation' },
  { value: 'design', label: 'Design & Planning' },
  { value: 'development', label: 'Development' },
  { value: 'consultation', label: 'Consultation' }
];

const propertyTypes = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'villa', label: 'Villa' },
  { value: 'house', label: 'Independent House' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'plot', label: 'Plot/Land' }
];

const scopeOptions = [
  'Architectural Design',
  'Structural Design', 
  'Interior Design',
  'Project Management',
  'Material Procurement',
  'Labor Management',
  'Approvals & Permits',
  'Quality Control'
];

export default function OpportunityNew() {
  const navigate = useNavigate();
  const { track } = useAnalytics();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RFQFormData>({
    title: '',
    description: '',
    category: '',
    location: {
      address: '',
      city: '',
      state: '',
      pincode: ''
    },
    budget: {
      min: 0,
      max: 0
    },
    timeline: 0,
    requirements: [],
    projectDetails: {
      propertyType: '',
      area: 0,
      scope: []
    },
    attachments: [],
    milestones: [
      { title: 'Project Start', description: 'Initial planning and setup', percentage: 20 },
      { title: 'Design Phase', description: 'Complete design and approvals', percentage: 40 },
      { title: 'Execution', description: 'Construction/implementation phase', percentage: 80 },
      { title: 'Completion', description: 'Final delivery and handover', percentage: 100 }
    ],
    nda: false
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRequirementAdd = (requirement: string) => {
    if (requirement && !formData.requirements.includes(requirement)) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, requirement]
      }));
    }
  };

  const handleRequirementRemove = (requirement: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter(req => req !== requirement)
    }));
  };

  const handleScopeToggle = (scope: string) => {
    setFormData(prev => ({
      ...prev,
      projectDetails: {
        ...prev.projectDetails,
        scope: prev.projectDetails.scope.includes(scope)
          ? prev.projectDetails.scope.filter(s => s !== scope)
          : [...prev.projectDetails.scope, scope]
      }
    }));
  };

  const handleSubmit = async () => {
    try {
      track('post_opportunity', {
        category: formData.category,
        budget_range: `${formData.budget.min}-${formData.budget.max}`,
        timeline: formData.timeline,
        location: formData.location.city
      });

      // Submit to Supabase
      const { data, error } = await supabase
        .from('service_requests')
        .insert({
          title: formData.title,
          description: formData.description,
          service_type: formData.category,
          location: formData.location.city,
          budget_min: formData.budget.min,
          budget_max: formData.budget.max,
          timeline_required: formData.timeline,
          contact_name: 'Current User',
          contact_email: 'user@example.com',
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Opportunity Posted Successfully!",
        description: "Your RFQ has been published and vendors will start submitting proposals."
      });

      navigate('/opportunities', { 
        state: { posted: true, opportunityId: data.id }
      });
    } catch (error) {
      console.error('Error posting opportunity:', error);
      toast({
        title: "Error",
        description: "Failed to post opportunity. Please try again.",
        variant: "destructive"
      });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Project Basics</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., 3BHK Apartment Interior Design in Bangalore"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Project Category *</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select project category" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectCategories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Project Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your project requirements, objectives, and any specific preferences..."
                    rows={4}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="propertyType">Property Type *</Label>
                  <Select 
                    value={formData.projectDetails.propertyType} 
                    onValueChange={(value) => setFormData(prev => ({ 
                      ...prev, 
                      projectDetails: { ...prev.projectDetails, propertyType: value }
                    }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="area">Property Area (sq ft)</Label>
                  <Input
                    id="area"
                    type="number"
                    value={formData.projectDetails.area || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      projectDetails: { ...prev.projectDetails, area: parseInt(e.target.value) || 0 }
                    }))}
                    placeholder="e.g., 1200"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Location & Timeline</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="address">Property Address *</Label>
                  <Input
                    id="address"
                    value={formData.location.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: { ...prev.location, address: e.target.value } }))}
                    placeholder="Enter property address"
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.location.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: { ...prev.location, city: e.target.value } }))}
                      placeholder="City"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.location.state}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: { ...prev.location, state: e.target.value } }))}
                      placeholder="State"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={formData.location.pincode}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: { ...prev.location, pincode: e.target.value } }))}
                    placeholder="Pincode"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="timeline">Project Timeline (months) *</Label>
                  <Input
                    id="timeline"
                    type="number"
                    value={formData.timeline || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, timeline: parseInt(e.target.value) || 0 }))}
                    placeholder="e.g., 6"
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minBudget">Min Budget (₹) *</Label>
                    <Input
                      id="minBudget"
                      type="number"
                      value={formData.budget.min || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, budget: { ...prev.budget, min: parseInt(e.target.value) || 0 } }))}
                      placeholder="e.g., 500000"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxBudget">Max Budget (₹) *</Label>
                    <Input
                      id="maxBudget"
                      type="number"
                      value={formData.budget.max || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, budget: { ...prev.budget, max: parseInt(e.target.value) || 0 } }))}
                      placeholder="e.g., 1000000"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Project Scope & Requirements</h3>
              
              <div className="space-y-4">
                <div>
                  <Label>Services Required</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {scopeOptions.map((scope) => (
                      <div key={scope} className="flex items-center space-x-2">
                        <Checkbox
                          id={scope}
                          checked={formData.projectDetails.scope.includes(scope)}
                          onCheckedChange={() => handleScopeToggle(scope)}
                        />
                        <Label htmlFor={scope} className="text-sm">{scope}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <Label>Additional Requirements</Label>
                  <div className="mt-2">
                    <div className="flex space-x-2 mb-2">
                      <Input
                        placeholder="Add specific requirement..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleRequirementAdd(e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <Button 
                        type="button"
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          handleRequirementAdd(input.value);
                          input.value = '';
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.requirements.map((req, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {req}
                          <X 
                            className="h-3 w-3 cursor-pointer hover:text-destructive" 
                            onClick={() => handleRequirementRemove(req)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Upload Documents/Images</Label>
                  <div className="mt-2 border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag & drop files here, or click to select
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports: JPG, PNG, PDF, DWG (Max 10MB each)
                    </p>
                    <Button variant="outline" className="mt-2">
                      Choose Files
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Review & Submit</h3>
              
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Building2 className="h-5 w-5" />
                      Project Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Title:</span> {formData.title}
                      </div>
                      <div>
                        <span className="font-medium">Category:</span> {formData.category}
                      </div>
                      <div>
                        <span className="font-medium">Property Type:</span> {formData.projectDetails.propertyType}
                      </div>
                      <div>
                        <span className="font-medium">Area:</span> {formData.projectDetails.area} sq ft
                      </div>
                      <div>
                        <span className="font-medium">Timeline:</span> {formData.timeline} months
                      </div>
                      <div>
                        <span className="font-medium">Budget:</span> ₹{formData.budget.min?.toLocaleString()} - ₹{formData.budget.max?.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Location:</span> {formData.location.address}, {formData.location.city}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Project Milestones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {formData.milestones.map((milestone, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                            {milestone.percentage}%
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{milestone.title}</div>
                            <div className="text-sm text-muted-foreground">{milestone.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="nda"
                    checked={formData.nda}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, nda: checked as boolean }))}
                  />
                  <Label htmlFor="nda" className="text-sm">
                    Require vendors to sign NDA before viewing detailed requirements
                  </Label>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Shield className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium mb-1">What happens next?</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Your RFQ will be published to verified vendors</li>
                        <li>• You'll receive proposals within 2-3 business days</li>
                        <li>• Compare bids and select the best vendor</li>
                        <li>• Start your project with escrow protection</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/opportunities')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Opportunities
            </Button>
            <div className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold">Post New Opportunity</h1>
              <div className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Form Content */}
          <Card className="card-premium">
            <CardContent className="p-6">
              {renderStepContent()}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button 
                onClick={handleNext}
                className="btn-premium"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                className="btn-premium flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Post Opportunity
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}