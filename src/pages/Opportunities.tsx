import { useState } from 'react';
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
  PaintBucket
} from 'lucide-react';
import { mockOpportunities } from '@/data/mockData';

const opportunityCategories = [
  { id: 'all', name: 'All Opportunities', count: 24 },
  { id: 'construction', name: 'Construction', count: 8, icon: Building2 },
  { id: 'renovation', name: 'Renovation', count: 6, icon: Hammer },
  { id: 'design', name: 'Design', count: 5, icon: PaintBucket },
  { id: 'development', name: 'Development', count: 5, icon: TrendingUp }
];

export default function Opportunities() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedOpportunities, setSavedOpportunities] = useState<Set<string>>(new Set());

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

  const filteredOpportunities = mockOpportunities.filter(opp => {
    const matchesCategory = activeCategory === 'all' || opp.category === activeCategory;
    const matchesSearch = !searchQuery || 
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.location.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-hero-gradient border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-display mb-4">Project Opportunities</h1>
            <p className="text-subheadline mb-8">
              Discover lucrative real estate projects and connect with property owners 
              looking for trusted professionals
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
              {filteredOpportunities.map((opportunity) => (
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
                      <Button variant="outline">
                        View Details
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
              <Button size="lg" className="btn-premium">
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