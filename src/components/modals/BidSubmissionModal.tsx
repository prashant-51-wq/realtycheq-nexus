import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { 
  DollarSign, 
  Calendar, 
  FileText, 
  Upload, 
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAnalytics } from '@/lib/hooks/useAnalytics';

interface BidSubmissionModalProps {
  open: boolean;
  onClose: () => void;
  opportunity: any;
}

interface BidFormData {
  proposalAmount: number;
  timeline: number;
  proposal: string;
  milestones: Array<{
    title: string;
    description: string;
    percentage: number;
    amount: number;
  }>;
  terms: string;
  attachments: File[];
  acceptTerms: boolean;
}

export default function BidSubmissionModal({ open, onClose, opportunity }: BidSubmissionModalProps) {
  const { track } = useAnalytics();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<BidFormData>({
    proposalAmount: 0,
    timeline: opportunity?.timeline || 0,
    proposal: '',
    milestones: [
      { title: 'Project Initiation', description: 'Planning and setup', percentage: 20, amount: 0 },
      { title: 'Design Phase', description: 'Design development', percentage: 30, amount: 0 },
      { title: 'Execution', description: 'Implementation phase', percentage: 40, amount: 0 },
      { title: 'Completion', description: 'Final delivery', percentage: 10, amount: 0 }
    ],
    terms: '',
    attachments: [],
    acceptTerms: false
  });

  const totalSteps = 3;

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

  const updateMilestoneAmounts = (totalAmount: number) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.map(milestone => ({
        ...milestone,
        amount: Math.round((milestone.percentage / 100) * totalAmount)
      }))
    }));
  };

  const handleAmountChange = (amount: number) => {
    setFormData(prev => ({ ...prev, proposalAmount: amount }));
    updateMilestoneAmounts(amount);
  };

  const handleSubmit = async () => {
    if (!formData.acceptTerms) {
      toast({
        title: "Terms Required",
        description: "Please accept the terms and conditions to submit your bid.",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    
    try {
      track('submit_bid', {
        opportunity_id: opportunity.id,
        bid_amount: formData.proposalAmount,
        timeline: formData.timeline
      });

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Bid Submitted Successfully!",
        description: "Your proposal has been sent to the client. You'll be notified of any updates."
      });

      onClose();
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit your bid. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatBudget = (min: number, max: number) => {
    const formatAmount = (amount: number) => {
      if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
      if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
      return `₹${amount.toLocaleString()}`;
    };
    return `${formatAmount(min)} - ${formatAmount(max)}`;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Proposal Details</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="amount">Your Bid Amount (₹) *</Label>
                  <div className="relative mt-1">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="amount"
                      type="number"
                      value={formData.proposalAmount || ''}
                      onChange={(e) => handleAmountChange(parseInt(e.target.value) || 0)}
                      placeholder="Enter your bid amount"
                      className="pl-10"
                    />
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    Client Budget: {formatBudget(opportunity.budget.min, opportunity.budget.max)}
                  </div>
                </div>

                <div>
                  <Label htmlFor="timeline">Project Timeline (months) *</Label>
                  <div className="relative mt-1">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="timeline"
                      type="number"
                      value={formData.timeline || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, timeline: parseInt(e.target.value) || 0 }))}
                      placeholder="Enter timeline in months"
                      className="pl-10"
                    />
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    Client Expected: {opportunity.timeline} months
                  </div>
                </div>

                <div>
                  <Label htmlFor="proposal">Project Proposal *</Label>
                  <Textarea
                    id="proposal"
                    value={formData.proposal}
                    onChange={(e) => setFormData(prev => ({ ...prev, proposal: e.target.value }))}
                    placeholder="Describe your approach, methodology, and what makes your proposal unique..."
                    rows={6}
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
              <h3 className="text-lg font-semibold mb-4">Payment Milestones</h3>
              
              <div className="space-y-4">
                {formData.milestones.map((milestone, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{milestone.title}</h4>
                      <Badge variant="secondary">{milestone.percentage}%</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{milestone.description}</p>
                    <div className="text-lg font-semibold text-primary">
                      ₹{milestone.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
                
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between font-semibold">
                    <span>Total Project Value</span>
                    <span className="text-lg text-primary">
                      ₹{formData.proposalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="terms">Terms & Conditions</Label>
                <Textarea
                  id="terms"
                  value={formData.terms}
                  onChange={(e) => setFormData(prev => ({ ...prev, terms: e.target.value }))}
                  placeholder="Any specific terms, conditions, or requirements for this project..."
                  rows={4}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Supporting Documents</h3>
              
              <div className="space-y-4">
                <div>
                  <Label>Upload Portfolio/Samples</Label>
                  <div className="mt-2 border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload relevant portfolio items, certificates, or project samples
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      Supports: JPG, PNG, PDF (Max 5MB each)
                    </p>
                    <Button variant="outline">Choose Files</Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Bid Summary</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Proposed Amount:</span>
                      <span className="font-semibold">₹{formData.proposalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Timeline:</span>
                      <span className="font-semibold">{formData.timeline} months</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Milestones:</span>
                      <span className="font-semibold">{formData.milestones.length} phases</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                        What happens next?
                      </h4>
                      <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                        <li>• Client will review your proposal</li>
                        <li>• You may be invited for further discussion</li>
                        <li>• If selected, project contract will be initiated</li>
                        <li>• Payment will be secured through escrow</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, acceptTerms: checked as boolean }))}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the platform terms and conditions and confirm the accuracy of this proposal
                  </Label>
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Submit Proposal
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {step < currentStep ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    step
                  )}
                </div>
                {step < 3 && (
                  <div className={`w-12 h-1 mx-2 ${
                    step < currentStep ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Labels */}
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Proposal</span>
            <span>Milestones</span>
            <span>Review</span>
          </div>

          {/* Step Content */}
          {renderStepContent()}

          {/* Navigation */}
          <div className="flex justify-between pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              Previous
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              
              {currentStep < totalSteps ? (
                <Button onClick={handleNext} className="btn-premium">
                  Next
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  disabled={submitting || !formData.acceptTerms}
                  className="btn-premium"
                >
                  {submitting ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Submit Proposal
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}