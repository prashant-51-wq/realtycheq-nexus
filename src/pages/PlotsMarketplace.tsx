import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MapPin, 
  Search,
  Filter,
  Maximize,
  TrendingUp,
  Eye,
  Heart,
  Phone,
  Calculator,
  Navigation,
  Mountain,
  Trees
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const plotTypes = [
  { id: 'all', name: 'All Plots', count: 0 },
  { id: 'residential', name: 'Residential', count: 0 },
  { id: 'commercial', name: 'Commercial', count: 0 },
  { id: 'agricultural', name: 'Agricultural', count: 0 },
  { id: 'industrial', name: 'Industrial', count: 0 }
];

interface Plot {
  id: string;
  title: string;
  description: string;
  type: string;
  price: number;
  area: number;
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  images: string[];
  amenities: string[];
  seller_id: string;
  verified: boolean;
  views: number;
  saves: number;
  created_at: string;
}

export default function PlotsMarketplace() {
  const { toast } = useToast();
  const [activeType, setActiveType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [plots, setPlots] = useState<Plot[]>([]);
  const [savedPlots, setSavedPlots] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState('all');
  const [areaRange, setAreaRange] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchPlots();
  }, []);

  const fetchPlots = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('property_type', 'plot')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform data to plot format
      const transformedPlots = data?.map(property => ({
        id: property.id,
        title: property.title,
        description: property.description,
        type: 'residential', // Default type
        price: property.price,
        area: property.area,
        location: {
          address: property.address,
          city: property.city,
          state: property.state,
          pincode: property.pincode
        },
        images: property.images || [],
        amenities: property.amenities || [],
        seller_id: property.seller_id,
        verified: property.verified,
        views: property.views,
        saves: property.saves,
        created_at: property.created_at
      })) || [];
      
      setPlots(transformedPlots);
    } catch (error) {
      console.error('Error fetching plots:', error);
      toast({
        title: "Error",
        description: "Failed to load plots. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (id: string) => {
    setSavedPlots(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const filteredPlots = plots.filter(plot => {
    const matchesType = activeType === 'all' || plot.type === activeType;
    const matchesSearch = !searchQuery || 
      plot.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plot.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plot.location.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesPrice = true;
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      matchesPrice = plot.price >= min && (max ? plot.price <= max : true);
    }
    
    let matchesArea = true;
    if (areaRange !== 'all') {
      const [min, max] = areaRange.split('-').map(Number);
      matchesArea = plot.area >= min && (max ? plot.area <= max : true);
    }
    
    return matchesType && matchesSearch && matchesPrice && matchesArea;
  });

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
    return `₹${price.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-hero-gradient border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-display mb-4">Buy & Sell Plots</h1>
            <p className="text-subheadline mb-8">
              Discover premium plots and land parcels across India. 
              Perfect for investment, construction, or agriculture.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by location, title, or pincode..."
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
              <div className="text-2xl font-bold text-primary">5,200+</div>
              <div className="text-sm text-muted-foreground">Available Plots</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">₹2.5Cr</div>
              <div className="text-sm text-muted-foreground">Avg. Investment</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">15%</div>
              <div className="text-sm text-muted-foreground">Avg. Annual Return</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">98%</div>
              <div className="text-sm text-muted-foreground">Clear Titles</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="card-premium mb-8">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filters:</span>
              </div>
              
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="0-1000000">Under ₹10L</SelectItem>
                  <SelectItem value="1000000-5000000">₹10L - ₹50L</SelectItem>
                  <SelectItem value="5000000-10000000">₹50L - ₹1Cr</SelectItem>
                  <SelectItem value="10000000-">Above ₹1Cr</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={areaRange} onValueChange={setAreaRange}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Area Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Areas</SelectItem>
                  <SelectItem value="0-1000">Under 1000 sq ft</SelectItem>
                  <SelectItem value="1000-5000">1000 - 5000 sq ft</SelectItem>
                  <SelectItem value="5000-10000">5000 - 10000 sq ft</SelectItem>
                  <SelectItem value="10000-">Above 10000 sq ft</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="area-large">Area: Largest First</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setPriceRange('all');
                  setAreaRange('all');
                  setSortBy('newest');
                  setActiveType('all');
                }}
              >
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Plot Types Tabs */}
        <Tabs value={activeType} onValueChange={setActiveType}>
          <TabsList className="grid w-full grid-cols-5 mb-8">
            {plotTypes.map((type) => (
              <TabsTrigger key={type.id} value={type.id}>
                {type.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeType}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                Array(9).fill(0).map((_, i) => (
                  <Card key={i} className="card-premium">
                    <div className="aspect-video bg-gray-200 rounded-t animate-pulse" />
                    <CardHeader>
                      <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-16 bg-gray-200 rounded animate-pulse mb-4" />
                      <div className="h-10 bg-gray-200 rounded animate-pulse" />
                    </CardContent>
                  </Card>
                ))
              ) : (
                filteredPlots.map((plot) => (
                  <Card key={plot.id} className="card-premium hover-lift overflow-hidden">
                    <div className="aspect-video overflow-hidden relative">
                      {plot.images?.[0] ? (
                        <img 
                          src={plot.images[0]} 
                          alt={plot.title}
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Mountain className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      
                      {plot.verified && (
                        <Badge className="absolute top-2 left-2 bg-green-500 text-white">
                          Verified
                        </Badge>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSave(plot.id)}
                        className={`absolute top-2 right-2 bg-white/80 hover:bg-white ${savedPlots.has(plot.id) ? 'text-primary' : ''}`}
                      >
                        <Heart className={`h-4 w-4 ${savedPlots.has(plot.id) ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                    
                    <CardHeader>
                      <CardTitle className="text-lg">
                        <Link to={`/plots/${plot.id}`} className="hover:text-primary transition-colors">
                          {plot.title}
                        </Link>
                      </CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        {plot.location.city}, {plot.location.state}
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {plot.description}
                      </p>
                      
                      {/* Plot Details */}
                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div className="flex items-center">
                          <Maximize className="h-3 w-3 text-primary mr-1" />
                          <span>{plot.area.toLocaleString()} sq ft</span>
                        </div>
                        <div className="flex items-center">
                          <Calculator className="h-3 w-3 text-primary mr-1" />
                          <span>₹{(plot.price / plot.area).toFixed(0)}/sq ft</span>
                        </div>
                      </div>
                      
                      {/* Price */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-2xl font-bold text-primary">
                          {formatPrice(plot.price)}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Eye className="h-3 w-3 mr-1" />
                            {plot.views}
                          </div>
                          <div className="flex items-center">
                            <Heart className="h-3 w-3 mr-1" />
                            {plot.saves}
                          </div>
                        </div>
                      </div>
                      
                      {/* Amenities */}
                      {plot.amenities.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {plot.amenities.slice(0, 3).map((amenity, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {amenity}
                              </Badge>
                            ))}
                            {plot.amenities.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{plot.amenities.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <Button className="flex-1 btn-premium">
                          <Phone className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                        <Button variant="outline" asChild>
                          <Link to={`/plots/${plot.id}`}>
                            <Navigation className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        {filteredPlots.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Mountain className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No plots found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search filters or explore different locations
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setActiveType('all');
                setPriceRange('all');
                setAreaRange('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Sell Your Plot CTA */}
        <div className="mt-16">
          <Card className="card-premium text-center">
            <CardContent className="p-8">
              <h2 className="text-headline mb-4">Sell Your Plot</h2>
              <p className="text-subheadline mb-6 max-w-2xl mx-auto">
                List your plot with us and reach thousands of potential buyers. 
                Get the best price with our expert guidance.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="btn-premium">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  List Your Plot
                </Button>
                <Button size="lg" variant="outline">
                  <Calculator className="h-5 w-5 mr-2" />
                  Get Valuation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}