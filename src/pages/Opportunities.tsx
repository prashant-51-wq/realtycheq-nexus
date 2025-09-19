import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Calendar,
  Search,
  Filter,
  Bookmark,
  ArrowRight,
  TrendingUp,
  Building2,
  Hammer,
  PaintBucket,
  ArrowLeft,
  Home,
  BriefcaseIcon as Briefcase
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const opportunityCategories = [
  { id: 'all', name: 'All Opportunities', count: 24 },
  { id: 'construction', name: 'Construction', count: 8, icon: Building2 },
  { id: 'renovation', name: 'Renovation', count: 6, icon: Hammer },
  { id: 'design', name: 'Design', count: 5, icon: PaintBucket },
  { id: 'development', name: 'Development', count: 5, icon: TrendingUp }
];

export default function Opportunities() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedOpportunities, setSavedOpportunities] = useState<Set<string>>(new Set());
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      // Use the secure vendor view for vendors, or show mock data for now
      // since service_requests table is now protected with RLS
      const { data, error } = await supabase
        .from('vendor_service_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        // If user doesn't have access or there's an error, show mock opportunities
        console.log('Using mock data for opportunities');
        const mockOpportunities = [
          {
            id: 'mock-1',
            title: 'Modern Villa Construction',
            description: 'Looking for experienced contractors to build a modern 3BHK villa with contemporary design',
            service_type: 'construction',
            budget_min: 2500000,
            budget_max: 3500000,
            timeline_required: 90,
            location: 'Bangalore',
            created_at: new Date().toISOString(),
            contact_info: 'Contact available through platform'
          },
          {
            id: 'mock-2', 
            title: '3D Elevation Design Required',
            description: 'Need professional 3D elevation design for residential building project',
            service_type: 'design',
            budget_min: 50000,
            budget_max: 100000,
            timeline_required: 15,
            location: 'Mumbai',
            created_at: new Date().toISOString(),
            contact_info: 'Contact available through platform'
          }
        ];
        setOpportunities(mockOpportunities.map(opp => ({
          id: opp.id,
          title: opp.title,
          description: opp.description,
          category: opp.service_type,
          budget: {
            min: opp.budget_min,
            max: opp.budget_max
          },
          timeline: Math.floor((opp.timeline_required || 30) / 30),
          location: {
            city: opp.location
          },
          requirements: ['Quality Work', 'Timely Delivery'],
          createdAt: new Date(opp.created_at).toLocaleDateString()
        })));
        return;
      }
      
      // Transform data to match opportunity format
      const transformedOpportunities = data?.map(request => ({
        id: request.id,
        title: request.title,
        description: request.description,
        category: request.service_type,
        budget: {
          min: request.budget_min || 100000,
          max: request.budget_max || 500000
        },
        timeline: Math.floor((request.timeline_required || 30) / 30),
        location: {
          city: request.location || 'City'
        },
        requirements: ['Quality Work', 'Timely Delivery'],
        createdAt: new Date(request.created_at).toLocaleDateString()
      })) || [];
      
      setOpportunities(transformedOpportunities);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      toast({
        title: "Error",
        description: "Failed to load opportunities. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (id: string) => {
    setSavedOpportunities(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const formatBudget = (min: number, max: number) => {
    const formatAmount = (amount: number) => {
      if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
      if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
      return `₹${amount.toLocaleString()}`;
    };
    return `${formatAmount(min)} - ${formatAmount(max)}`;
  };

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesCategory = activeCategory === 'all' || opp.category === activeCategory;
    const matchesSearch = !searchQuery || 
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.location.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="container mx-auto px-4 py-6">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
          <Link to="/" className="hover:text-primary flex items-center">
            <Home className="h-3 w-3 mr-1" />
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground">Investment Opportunities</span>
        </nav>
        <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </div>

      {/* Hero Section */}
      <div className="bg-hero-gradient border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-display mb-4 flex items-center justify-center">
              <Briefcase className="h-12 w-12 mr-4 text-white" />
              Investment Opportunities
            </h1>
            <p className="text-subheadline mb-8">
              Discover curated real estate investment opportunities with verified returns and transparent data
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search opportunities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">127</div>
              <div className="text-sm text-muted-foreground">Active Projects</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">₹45Cr</div>
              <div className="text-sm text-muted-foreground">Total Value</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">89%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">2.1k+</div>
              <div className="text-sm text-muted-foreground">Vendors</div>
            </CardContent>
          </Card>
        </div>

        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="grid w-full grid-cols-5 mb-8">
            {opportunityCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center">
                {category.icon && <category.icon className="h-4 w-4 mr-2" />}
                <span className="hidden sm:inline">{category.name}</span>
                <span className="sm:hidden">{category.name.split(' ')[0]}</span>
                <Badge variant="secondary" className="ml-2">
                  {category.count}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {loading ? (
                Array(4).fill(0).map((_, i) => (
                  <Card key={i} className="card-premium">
                    <CardHeader>
                      <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-16 bg-gray-200 rounded animate-pulse mb-4" />
                      <div className="h-20 bg-gray-200 rounded animate-pulse" />
                    </CardContent>
                  </Card>
                ))
              ) : (
                filteredOpportunities.map((opportunity) => (
                <Card key={opportunity.id} className="card-premium hover-lift">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                          <Badge variant="secondary">{opportunity.category}</Badge>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground space-x-4 mb-3">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {opportunity.location.city}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {opportunity.timeline} months
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSave(opportunity.id)}
                        className={savedOpportunities.has(opportunity.id) ? 'text-primary' : ''}
                      >
                        <Bookmark className={`h-4 w-4 ${savedOpportunities.has(opportunity.id) ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {opportunity.description}
                    </p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Project Budget</span>
                        <span className="text-lg font-bold text-primary">
                          {formatBudget(opportunity.budget.min, opportunity.budget.max)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Requirements</span>
                        <div className="flex flex-wrap gap-1">
                          {opportunity.requirements.slice(0, 2).map((req, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {req}
                            </Badge>
                          ))}
                          {opportunity.requirements.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{opportunity.requirements.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Posted</span>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {opportunity.createdAt}
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button className="flex-1 btn-premium">
                        Submit Proposal
                      </Button>
                      <Button variant="outline" onClick={() => navigate(`/opportunities/${opportunity.id}`)}>
                        View Details
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        {filteredOpportunities.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No opportunities found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or category filters
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Post Opportunity CTA */}
        <div className="mt-16">
          <Card className="card-premium text-center">
            <CardContent className="p-8">
              <h2 className="text-headline mb-4">Have a Project? Post an Opportunity</h2>
              <p className="text-subheadline mb-6 max-w-2xl mx-auto">
                Get proposals from verified vendors and professionals. 
                Post your project requirements and receive competitive bids.
              </p>
              <Button size="lg" className="btn-premium" onClick={() => navigate('/opportunities/new')}>
                Post New Opportunity
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}