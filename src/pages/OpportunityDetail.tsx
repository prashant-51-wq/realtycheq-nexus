import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Building2, 
  Clock, 
  Users, 
  FileText, 
  Download, 
  Star, 
  Shield, 
  CheckCircle, 
  MessageSquare, 
  Bookmark,
  Share2,
  Flag,
  Award
} from 'lucide-react';
import { mockOpportunities } from '@/data/mockData';
import { useAnalytics } from '@/lib/hooks/useAnalytics';
import BidSubmissionModal from '@/components/modals/BidSubmissionModal';

export default function OpportunityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { track } = useAnalytics();
  const [opportunity, setOpportunity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const found = mockOpportunities.find(opp => opp.id === id);
        if (found) {
          setOpportunity({
            ...found,
            client: {
              name: 'Rajesh Kumar',
              avatar: '',
              verified: true,
              rating: 4.8,
              projectsCompleted: 12,
              memberSince: '2022'
            },
            attachments: [
              { name: 'Floor Plan.pdf', size: '2.4 MB', type: 'pdf' },
              { name: 'Site Photos.zip', size: '15.2 MB', type: 'zip' },
              { name: 'Requirements.docx', size: '1.1 MB', type: 'doc' }
            ],
            milestones: [
              { title: 'Design Phase', description: 'Complete architectural and interior design', percentage: 30, amount: 300000 },
              { title: 'Approvals', description: 'Obtain necessary permits and approvals', percentage: 20, amount: 200000 },
              { title: 'Construction', description: 'Main construction and finishing work', percentage: 40, amount: 400000 },
              { title: 'Handover', description: 'Final inspection and handover', percentage: 10, amount: 100000 }
            ],
            bidsReceived: 8,
            viewsCount: 156,
            applicationsDeadline: '2024-02-15'
          });
          
          track('view_opportunity', {
            opportunity_id: id,
            category: found.category,
            budget_range: `${found.budget.min}-${found.budget.max}`
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load opportunity details.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunity();
  }, [id, track]);

  const handleSave = () => {
    setSaved(!saved);
    toast({
      title: saved ? "Removed from saved" : "Added to saved",
      description: saved ? "Opportunity removed from your saved list." : "Opportunity saved to your list."
    });
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: opportunity?.title,
        text: opportunity?.description,
        url: window.location.href
      });
    } catch (error) {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Opportunity link copied to clipboard."
      });
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Opportunity Not Found</h2>
          <p className="text-muted-foreground mb-4">The opportunity you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/opportunities')}>
            Back to Opportunities
          </Button>
        </div>
      </div>
    );
  }

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
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Bookmark className={`h-4 w-4 mr-2 ${saved ? 'fill-current' : ''}`} />
                {saved ? 'Saved' : 'Save'}
              </Button>
              <Button variant="outline" size="sm">
                <Flag className="h-4 w-4 mr-2" />
                Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Opportunity Header */}
            <Card className="card-premium">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-2xl">{opportunity.title}</CardTitle>
                      <Badge variant="secondary">{opportunity.category}</Badge>
                    </div>
                    <div className="flex items-center text-muted-foreground space-x-4 mb-4">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {opportunity.location.city}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {opportunity.timeline} months
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Posted {opportunity.createdAt}
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-primary">
                      {formatBudget(opportunity.budget.min, opportunity.budget.max)}
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Tabs Content */}
            <Tabs defaultValue="overview">
              <TabsList className="w-full">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
                <TabsTrigger value="milestones">Milestones</TabsTrigger>
                <TabsTrigger value="attachments">Attachments</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {opportunity.description}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium mb-1">Property Type</div>
                        <div className="flex items-center text-muted-foreground">
                          <Building2 className="h-4 w-4 mr-2" />
                          Apartment
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-1">Area</div>
                        <div className="text-muted-foreground">1,200 sq ft</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-1">Location</div>
                        <div className="text-muted-foreground">
                          {opportunity.location.address || 'HSR Layout, Bangalore'}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-1">Timeline</div>
                        <div className="text-muted-foreground">{opportunity.timeline} months</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="requirements" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Services Required</h4>
                        <div className="flex flex-wrap gap-2">
                          {opportunity.requirements.map((req: string, index: number) => (
                            <Badge key={index} variant="secondary">{req}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="font-medium mb-2">Vendor Qualifications</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>• Minimum 3 years of experience in similar projects</li>
                          <li>• Valid trade licenses and registrations</li>
                          <li>• Portfolio of completed residential projects</li>
                          <li>• Insurance coverage required</li>
                          <li>• Local presence in Bangalore preferred</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="milestones" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Milestones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {opportunity.milestones?.map((milestone: any, index: number) => (
                        <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                            {milestone.percentage}%
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{milestone.title}</h4>
                            <p className="text-sm text-muted-foreground">{milestone.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">₹{milestone.amount?.toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground">
                              {milestone.percentage}% of total
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="attachments" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {opportunity.attachments?.map((file: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-8 w-8 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{file.name}</div>
                              <div className="text-sm text-muted-foreground">{file.size}</div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Card */}
            <Card className="card-premium">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">Applications Deadline</div>
                    <div className="font-semibold text-destructive">Feb 15, 2024</div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-4 text-center text-sm">
                    <div>
                      <div className="font-semibold">{opportunity.bidsReceived}</div>
                      <div className="text-muted-foreground">Bids Received</div>
                    </div>
                    <div>
                      <div className="font-semibold">{opportunity.viewsCount}</div>
                      <div className="text-muted-foreground">Views</div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Button 
                      className="w-full btn-premium"
                      onClick={() => setShowBidModal(true)}
                    >
                      Submit Proposal
                    </Button>
                    <Button variant="outline" className="w-full">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact Client
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Client Info */}
            <Card>
              <CardHeader>
                <CardTitle>Posted By</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={opportunity.client?.avatar} alt={opportunity.client?.name} />
                    <AvatarFallback>
                      {opportunity.client?.name.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{opportunity.client?.name}</h4>
                      {opportunity.client?.verified && (
                        <CheckCircle className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Member since {opportunity.client?.memberSince}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 mr-1 text-primary" />
                        {opportunity.client?.rating} rating
                      </div>
                      <div>
                        {opportunity.client?.projectsCompleted} projects
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <Card>
              <CardHeader>
                <CardTitle>Trust & Safety</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Escrow Protection Available</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Verified Client Identity</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Award className="h-4 w-4 text-primary" />
                  <span>Premium Client</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Bid Submission Modal */}
      {showBidModal && (
        <BidSubmissionModal
          open={showBidModal}
          onClose={() => setShowBidModal(false)}
          opportunity={opportunity}
        />
      )}
    </div>
  );
}