import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  MapPin, 
  Star, 
  Award, 
  Users, 
  Calendar,
  Search,
  Shield,
  Phone,
  Mail,
  ExternalLink,
  Heart,
  MessageSquare,
  CheckCircle,
  Building2,
  Hammer,
  PaintBucket,
  Calculator
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const vendorCategories = [
  { id: 'all', name: 'All Vendors', count: 156 },
  { id: 'architects', name: 'Architects', count: 42, icon: Building2 },
  { id: 'contractors', name: 'Contractors', count: 38, icon: Hammer },
  { id: 'designers', name: 'Designers', count: 29, icon: PaintBucket },
  { id: 'consultants', name: 'Consultants', count: 47, icon: Calculator }
];

export default function Vendors() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedVendors, setSavedVendors] = useState<Set<string>>(new Set());
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      // Use the business_directory view for secure public vendor discovery
      const { data, error } = await supabase
        .from('business_directory')
        .select('*')
        .order('rating', { ascending: false });

      if (error) throw error;
      
      // Transform data to match vendor format
      const transformedVendors = data?.map(vendor => ({
        id: vendor.user_id,
        name: vendor.name,
        type: vendor.role,
        verified: vendor.verified,
        rating: vendor.rating || 4.5,
        location: {
          city: 'Location available upon contact' // business_location removed for security
        },
        specializations: vendor.specializations || ['General Services'],
        portfolio: [], // portfolio_images removed for security
        licenses: [], // certifications removed for security
        pricing: {
          consultation: 50000
        }
      })) || [];
      
      setVendors(transformedVendors);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast({
        title: "Error",
        description: "Failed to load vendors. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (id: string) => {
    setSavedVendors(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesCategory = activeCategory === 'all' || 
      vendor.specializations.some((spec: string) => 
        spec.toLowerCase().includes(activeCategory.slice(0, -1).toLowerCase())
      );
    const matchesSearch = !searchQuery || 
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.specializations.join(' ').toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.location.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-hero-gradient border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-display mb-4">Trusted Vendors</h1>
            <p className="text-subheadline mb-8">
              Connect with verified professionals and service providers 
              who deliver exceptional results
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search vendors by name, skill, or location..."
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
              <div className="text-2xl font-bold text-primary">2,100+</div>
              <div className="text-sm text-muted-foreground">Verified Vendors</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">4.8★</div>
              <div className="text-sm text-muted-foreground">Avg. Rating</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">95%</div>
              <div className="text-sm text-muted-foreground">On-time Delivery</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">₹850Cr</div>
              <div className="text-sm text-muted-foreground">Projects Completed</div>
            </CardContent>
          </Card>
        </div>

        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="grid w-full grid-cols-5 mb-8">
            {vendorCategories.map((category) => (
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
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {loading ? (
                Array(6).fill(0).map((_, i) => (
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
                filteredVendors.map((vendor) => (
                <Card key={vendor.id} className="card-premium hover-lift">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={vendor.portfolio[0]?.images[0]} alt={vendor.name} />
                          <AvatarFallback>{vendor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {vendor.name}
                            {vendor.verified && (
                              <CheckCircle className="h-4 w-4 text-primary" />
                            )}
                          </CardTitle>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            {vendor.location.city}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSave(vendor.id)}
                        className={savedVendors.has(vendor.id) ? 'text-primary' : ''}
                      >
                        <Heart className={`h-4 w-4 ${savedVendors.has(vendor.id) ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      Professional {vendor.type} services
                    </p>

                    {/* Specializations */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {vendor.specializations.slice(0, 3).map((spec, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                        {vendor.specializations.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{vendor.specializations.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                      <div>
                        <div className="flex items-center justify-center text-primary">
                          <Star className="h-4 w-4 mr-1" />
                          <span className="font-semibold">{vendor.rating}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">Rating</div>
                      </div>
                      <div>
                        <div className="font-semibold text-primary">{vendor.portfolio.length}</div>
                        <div className="text-xs text-muted-foreground">Projects</div>
                      </div>
                      <div>
                        <div className="font-semibold text-primary">5+y</div>
                        <div className="text-xs text-muted-foreground">Experience</div>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="mb-4">
                      <div className="text-sm text-muted-foreground">Starting from</div>
                      <div className="text-lg font-bold text-primary">
                        ₹{vendor.pricing.consultation?.toLocaleString() || '50,000'}/project
                      </div>
                    </div>

                    {/* Certifications */}
                    {vendor.licenses.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                          <Award className="h-3 w-3 mr-1" />
                          Licensed
                        </div>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs">
                            Verified Professional
                          </Badge>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button className="flex-1 btn-premium">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                      <Button variant="outline" onClick={() => navigate(`/vendors/${vendor.id}`)}>
                        View Profile
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                    </Card>
                  ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        {filteredVendors.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No vendors found</h3>
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

        {/* Join as Vendor CTA */}
        <div className="mt-16">
          <Card className="card-premium text-center">
            <CardContent className="p-8">
              <h2 className="text-headline mb-4">Join Our Vendor Network</h2>
              <p className="text-subheadline mb-6 max-w-2xl mx-auto">
                Connect with property owners and grow your business. 
                Get verified, showcase your work, and win more projects.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="btn-premium" asChild>
                  <Link to="/vendor-onboarding">
                    <Shield className="h-5 w-5 mr-2" />
                    Apply as Vendor
                  </Link>
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