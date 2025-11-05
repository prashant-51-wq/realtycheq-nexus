import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Home, 
  Download, 
  Heart, 
  Search,
  Layers,
  Maximize,
  Star,
  Eye,
  Filter,
  Grid3X3,
  Building2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { HousePlansHero } from '@/components/common/HousePlansHero';

const planCategories = [
  { id: 'all', name: 'All Plans', count: 0 },
  { id: 'modern', name: 'Modern', count: 0 },
  { id: 'traditional', name: 'Traditional', count: 0 },
  { id: 'contemporary', name: 'Contemporary', count: 0 },
  { id: 'minimalist', name: 'Minimalist', count: 0 },
  { id: 'luxury', name: 'Luxury', count: 0 }
];

interface HousePlan {
  id: string;
  title: string;
  description: string;
  architect_id: string;
  category: string;
  style: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  floor_count: number;
  images: string[];
  plan_files: string[];
  price: number;
  featured: boolean;
  likes: number;
  downloads: number;
  tags: string[];
  created_at: string;
}

export default function HousePlans() {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [plans, setPlans] = useState<HousePlan[]>([]);
  const [savedPlans, setSavedPlans] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHousePlans();
  }, []);

  const fetchHousePlans = async () => {
    try {
      const { data, error } = await supabase
        .from('house_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching house plans:', error);
      toast({
        title: "Error",
        description: "Failed to load house plans. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (id: string) => {
    setSavedPlans(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleDownload = async (planId: string) => {
    // In a real app, this would handle the download logic
    toast({
      title: "Download Started",
      description: "Your house plan is being prepared for download.",
    });
  };

  const filteredPlans = plans.filter(plan => {
    const matchesCategory = activeCategory === 'all' || plan.category === activeCategory;
    const matchesSearch = !searchQuery || 
      plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPlans = plans.filter(plan => plan.featured).slice(0, 6);

  return (
    <div className="bg-background">
      {/* Premium Hero Section */}
      <HousePlansHero />

      <div className="container mx-auto px-4 py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">1,200+</div>
              <div className="text-sm text-muted-foreground">House Plans</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">150+</div>
              <div className="text-sm text-muted-foreground">Architects</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">25K+</div>
              <div className="text-sm text-muted-foreground">Downloads</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">4.9★</div>
              <div className="text-sm text-muted-foreground">Avg. Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Plans */}
        {featuredPlans.length > 0 && (
          <div className="mb-12">
            <h2 className="text-headline mb-6 flex items-center">
              <Star className="h-6 w-6 mr-2 text-primary" />
              Featured Plans
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPlans.map((plan) => (
                <Card key={plan.id} className="card-premium hover-lift overflow-hidden">
                  <div className="aspect-video overflow-hidden relative">
                    {plan.images?.[0] ? (
                      <img 
                        src={plan.images[0]} 
                        alt={plan.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Building2 className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                      Featured
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSave(plan.id)}
                      className={`absolute top-2 right-2 bg-white/80 hover:bg-white ${savedPlans.has(plan.id) ? 'text-primary' : ''}`}
                    >
                      <Heart className={`h-4 w-4 ${savedPlans.has(plan.id) ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      <Link to={`/house-plans/${plan.id}`} className="hover:text-primary transition-colors">
                        {plan.title}
                      </Link>
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Home className="h-3 w-3 mr-1" />
                        {plan.bedrooms}BR
                      </div>
                      <div className="flex items-center">
                        <Maximize className="h-3 w-3 mr-1" />
                        {plan.area} sq ft
                      </div>
                      <div className="flex items-center">
                        <Layers className="h-3 w-3 mr-1" />
                        {plan.floor_count} Floor{plan.floor_count > 1 ? 's' : ''}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {plan.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-lg font-bold text-primary">
                        ₹{plan.price?.toLocaleString() || 'Free'}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Heart className="h-3 w-3 mr-1" />
                          {plan.likes}
                        </div>
                        <div className="flex items-center">
                          <Download className="h-3 w-3 mr-1" />
                          {plan.downloads}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        className="flex-1 btn-premium"
                        onClick={() => handleDownload(plan.id)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" asChild>
                        <Link to={`/house-plans/${plan.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="grid w-full grid-cols-6 mb-8">
            {planCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {loading ? (
                Array(12).fill(0).map((_, i) => (
                  <Card key={i} className="card-premium">
                    <div className="aspect-video bg-gray-200 rounded-t animate-pulse" />
                    <CardHeader>
                      <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-16 bg-gray-200 rounded animate-pulse mb-4" />
                      <div className="h-10 bg-gray-200 rounded animate-pulse" />
                    </CardContent>
                  </Card>
                ))
              ) : (
                filteredPlans.map((plan) => (
                  <Card key={plan.id} className="card-premium hover-lift overflow-hidden">
                    <div className="aspect-video overflow-hidden relative">
                      {plan.images?.[0] ? (
                        <img 
                          src={plan.images[0]} 
                          alt={plan.title}
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Building2 className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSave(plan.id)}
                        className={`absolute top-2 right-2 bg-white/80 hover:bg-white ${savedPlans.has(plan.id) ? 'text-primary' : ''}`}
                      >
                        <Heart className={`h-4 w-4 ${savedPlans.has(plan.id) ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        <Link to={`/house-plans/${plan.id}`} className="hover:text-primary transition-colors">
                          {plan.title}
                        </Link>
                      </CardTitle>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Home className="h-3 w-3 mr-1" />
                          {plan.bedrooms}BR
                        </div>
                        <div className="flex items-center">
                          <Maximize className="h-3 w-3 mr-1" />
                          {plan.area} sq ft
                        </div>
                        <div className="flex items-center">
                          <Layers className="h-3 w-3 mr-1" />
                          {plan.floor_count}F
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-bold text-primary">
                          ₹{plan.price?.toLocaleString() || 'Free'}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <Heart className="h-3 w-3 mr-1" />
                            {plan.likes}
                          </div>
                          <div className="flex items-center">
                            <Download className="h-3 w-3 mr-1" />
                            {plan.downloads}
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        size="sm" 
                        className="w-full btn-premium"
                        onClick={() => handleDownload(plan.id)}
                      >
                        <Download className="h-3 w-3 mr-2" />
                        Download
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        {filteredPlans.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Grid3X3 className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No house plans found</h3>
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

        {/* Upload CTA */}
        <div className="mt-16">
          <Card className="card-premium text-center">
            <CardContent className="p-8">
              <h2 className="text-headline mb-4">Share Your Designs</h2>
              <p className="text-subheadline mb-6 max-w-2xl mx-auto">
                Are you an architect or designer? Share your house plans with our community 
                and earn from each download.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="btn-premium">
                  <Building2 className="h-5 w-5 mr-2" />
                  Upload Plans
                </Button>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}