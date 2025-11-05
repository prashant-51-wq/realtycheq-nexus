import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { PropertyCard } from '@/components/cards/PropertyCard';
import { SmartFilter } from '@/components/filters/SmartFilter';
import { MapView } from '@/components/map/MapView';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Map, List, Filter, Bookmark, ArrowLeft, Home, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { SearchFilters, Property, PropertyType } from '@/types';
import { useAnalytics } from '@/lib/hooks/useAnalytics';
import { formatPrice } from '@/lib/utils/currency';
import { 
  getSavedProperties, 
  saveProperty as savePropertyToStorage, 
  removeSavedProperty,
  addToComparison,
  removeFromComparison,
  isInComparison 
} from '@/lib/utils/storage';

export default function Browse() {
  const { track } = useAnalytics();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [savedProperties, setSavedProperties] = useState<Set<string>>(new Set());
  const [hoveredProperty, setHoveredProperty] = useState<string | null>(null);
  const [comparedProperties, setComparedProperties] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Parse URL query parameters into filters
  const parseFiltersFromURL = (): SearchFilters => {
    const urlFilters: SearchFilters = {};
    
    const location = searchParams.get('location');
    if (location) urlFilters.location = location;
    
    const propertyType = searchParams.get('propertyType');
    if (propertyType) urlFilters.propertyType = [propertyType as PropertyType];
    
    const bedrooms = searchParams.get('bedrooms');
    if (bedrooms && bedrooms !== 'any') urlFilters.bedrooms = [parseInt(bedrooms)];
    
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    if (priceMin && priceMax) {
      urlFilters.priceRange = {
        min: parseInt(priceMin),
        max: parseInt(priceMax)
      };
    }
    
    const areaMin = searchParams.get('areaMin');
    const areaMax = searchParams.get('areaMax');
    if (areaMin && areaMax) {
      urlFilters.areaRange = {
        min: parseInt(areaMin),
        max: parseInt(areaMax)
      };
    }
    
    if (searchParams.get('verified') === 'true') urlFilters.verified = true;
    if (searchParams.get('choice') === 'true') urlFilters.isChoice = true;
    if (searchParams.get('financing') === 'true') urlFilters.financing = true;
    if (searchParams.get('design') === 'true') urlFilters.design = true;
    
    return urlFilters;
  };

  // Update URL when filters change
  const updateURL = (newFilters: SearchFilters) => {
    const params = new URLSearchParams();
    
    if (newFilters.location) params.set('location', newFilters.location);
    if (newFilters.propertyType?.length) params.set('propertyType', newFilters.propertyType[0]);
    if (newFilters.bedrooms?.length) params.set('bedrooms', newFilters.bedrooms[0].toString());
    
    if (newFilters.priceRange) {
      params.set('priceMin', newFilters.priceRange.min.toString());
      params.set('priceMax', newFilters.priceRange.max.toString());
    }
    
    if (newFilters.areaRange) {
      params.set('areaMin', newFilters.areaRange.min.toString());
      params.set('areaMax', newFilters.areaRange.max.toString());
    }
    
    if (newFilters.verified) params.set('verified', 'true');
    if (newFilters.isChoice) params.set('choice', 'true');
    if (newFilters.financing) params.set('financing', 'true');
    if (newFilters.design) params.set('design', 'true');
    
    setSearchParams(params);
  };

  useEffect(() => {
    setIsLoading(true);
    
    // Parse filters from URL on mount
    const urlFilters = parseFiltersFromURL();
    setFilters(urlFilters);
    
    // Load properties and saved properties
    Promise.all([
      fetchProperties(),
      loadSavedProperties()
    ]).then(() => {
      const hasFilters = Object.keys(urlFilters).length > 0;
      if (hasFilters) {
        const filterCount = Object.keys(urlFilters).length;
        toast({
          title: "Filters Applied",
          description: `Properties loaded with ${filterCount} filter${filterCount > 1 ? 's' : ''} applied.`,
        });
      }
      
      // Track page view
      track('view_listing', { 
        page: 'browse', 
        filterCount: Object.keys(urlFilters).length,
        hasURLFilters: hasFilters
      });
    });
  }, [searchParams]);

  useEffect(() => {
    if (properties.length > 0) {
      applyFiltersToProperties(filters);
      setIsLoading(false);
    }
  }, [properties, filters]);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching properties:', error);
        toast({
          title: 'Error',
          description: 'Failed to load properties. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      // Transform Supabase data to match Property interface
      const transformedProperties = data?.map(prop => ({
        id: prop.id,
        title: prop.title,
        description: prop.description,
        type: prop.property_type,
        price: prop.price,
        area: prop.area,
        bedrooms: prop.bedrooms,
        bathrooms: prop.bathrooms,
        location: {
          address: prop.address,
          city: prop.city,
          state: prop.state,
          pincode: prop.pincode,
          coordinates: { lat: prop.latitude, lng: prop.longitude },
          locality: prop.locality,
          microMarket: prop.micro_market
        },
        images: prop.images || [],
        amenities: prop.amenities || [],
        features: Array.isArray(prop.features) ? prop.features as any[] : [],
        listingDate: prop.created_at,
        status: prop.status,
        verified: prop.verified,
        isChoice: prop.is_choice,
        ownerId: prop.seller_id,
        views: prop.views,
        saves: prop.saves,
        yearBuilt: prop.year_built,
        daysOnMarket: Math.floor((new Date().getTime() - new Date(prop.created_at).getTime()) / (1000 * 60 * 60 * 24))
      })) || [];

      setProperties(transformedProperties);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while loading properties.',
        variant: 'destructive',
      });
    }
  };

  const loadSavedProperties = async () => {
    const saved = getSavedProperties();
    setSavedProperties(new Set(saved));
  };

  const applyFiltersToProperties = (filtersToApply: SearchFilters) => {
    let filtered = [...properties];
    
    if (filtersToApply.location) {
      filtered = filtered.filter(p => 
        p.location.city.toLowerCase().includes(filtersToApply.location!.toLowerCase()) ||
        p.location.address.toLowerCase().includes(filtersToApply.location!.toLowerCase()) ||
        (p.location.locality && p.location.locality.toLowerCase().includes(filtersToApply.location!.toLowerCase()))
      );
    }
    
    if (filtersToApply.priceRange) {
      filtered = filtered.filter(p => 
        p.price >= filtersToApply.priceRange!.min && 
        p.price <= filtersToApply.priceRange!.max
      );
    }
    
    if (filtersToApply.areaRange) {
      filtered = filtered.filter(p => 
        p.area >= filtersToApply.areaRange!.min && 
        p.area <= filtersToApply.areaRange!.max
      );
    }
    
    if (filtersToApply.propertyType?.length) {
      filtered = filtered.filter(p => 
        filtersToApply.propertyType!.includes(p.type)
      );
    }
    
    if (filtersToApply.bedrooms?.length) {
      filtered = filtered.filter(p => 
        filtersToApply.bedrooms!.includes(p.bedrooms)
      );
    }
    
    if (filtersToApply.verified) {
      filtered = filtered.filter(p => p.verified);
    }
    
    if (filtersToApply.isChoice) {
      filtered = filtered.filter(p => p.isChoice);
    }
    
    setFilteredProperties(filtered);
  };

  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    updateURL(newFilters);
    applyFiltersToProperties(newFilters);
    
    // Track filter usage
    track('apply_filters', { 
      filterCount: Object.keys(newFilters).length,
      hasLocation: !!newFilters.location,
      hasPrice: !!newFilters.priceRange,
      hasType: !!newFilters.propertyType?.length
    });
  };

  const handleSaveProperty = (id: string) => {
    setSavedProperties(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
        removeSavedProperty(id);
      } else {
        newSet.add(id);
        savePropertyToStorage(id);
      }
      return newSet;
    });
    track('save_property', { propertyId: id });
  };

  const handleViewProperty = (id: string) => {
    // Navigate to property detail
    window.location.href = `/property/${id}`;
  };

  const handleCompareProperty = (id: string) => {
    if (isInComparison(id)) {
      removeFromComparison(id);
      setComparedProperties(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } else {
      if (comparedProperties.size >= 4) {
        alert('You can only compare up to 4 properties');
        return;
      }
      addToComparison(id);
      setComparedProperties(prev => {
        const newSet = new Set(prev);
        newSet.add(id);
        return newSet;
      });
    }
    track('add_to_compare', { propertyId: id, totalCompared: comparedProperties.size });
  };

  const handleViewModeChange = (mode: 'list' | 'map') => {
    setViewMode(mode);
    track('switch_view_mode', { viewMode: mode });
  };

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
          <span className="text-foreground">Browse Properties</span>
        </nav>
        <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </div>

      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <Search className="h-8 w-8 mr-3 text-primary" />
                Browse Properties
              </h1>
              <p className="text-muted-foreground">
                {isLoading ? 'Loading...' : `${filteredProperties.length} properties found`}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex bg-muted rounded-lg p-1">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleViewModeChange('list')}
                  className="px-6"
                >
                  <List className="h-4 w-4 mr-2" />
                  List
                </Button>
                <Button
                  variant={viewMode === 'map' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleViewModeChange('map')}
                  className="px-6"
                >
                  <Map className="h-4 w-4 mr-2" />
                  Map
                </Button>
              </div>
              
              {/* Saved Properties */}
              <Button variant="outline" size="sm">
                <Bookmark className="h-4 w-4 mr-2" />
                Saved ({savedProperties.size})
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={viewMode} onValueChange={(value) => handleViewModeChange(value as 'list' | 'map')}>
          <div className="mb-8">
            <SmartFilter filters={filters} onFiltersChange={handleFilterChange} />
          </div>

          {/* Active Filters */}
          {Object.keys(filters).length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {filters.location && (
                <Badge variant="secondary" className="badge-filter">
                  Location: {filters.location}
                </Badge>
              )}
              {filters.priceRange && (
                <Badge variant="secondary" className="badge-filter">
                  Price: {formatPrice(filters.priceRange.min)} - {formatPrice(filters.priceRange.max)}
                </Badge>
              )}
              {filters.areaRange && (
                <Badge variant="secondary" className="badge-filter">
                  Area: {filters.areaRange.min} - {filters.areaRange.max} sq ft
                </Badge>
              )}
              {filters.bedrooms?.map(bedroom => (
                <Badge key={bedroom} variant="secondary" className="badge-filter">
                  {bedroom} BHK
                </Badge>
              ))}
              {filters.propertyType?.map(type => (
                <Badge key={type} variant="secondary" className="badge-filter">
                  {type}
                </Badge>
              ))}
              {filters.verified && (
                <Badge variant="secondary" className="badge-filter">
                  Verified Only
                </Badge>
              )}
              {filters.isChoice && (
                <Badge variant="secondary" className="badge-filter">
                  RealtyCheq Choice
                </Badge>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setFilters({});
                  setSearchParams(new URLSearchParams());
                  applyFiltersToProperties({});
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear All
              </Button>
            </div>
          )}

          {/* Comparison Bar */}
          {comparedProperties.size > 0 && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-medium">
                  {comparedProperties.size} properties selected for comparison
                </span>
                <div className="space-x-2">
                  <Button size="sm">
                    Compare Now
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setComparedProperties(new Set())}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <TabsContent value="list" className="mt-0 col-span-12">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="card-skeleton">
                      <Skeleton className="aspect-[4/3] rounded-t-2xl" />
                      <div className="p-6 space-y-3">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <div className="flex justify-between">
                          <Skeleton className="h-6 w-20" />
                          <Skeleton className="h-6 w-16" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProperties.map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        saved={savedProperties.has(property.id)}
                        onSave={handleSaveProperty}
                        onView={handleViewProperty}
                        onCompare={handleCompareProperty}
                        isHovered={hoveredProperty === property.id}
                        onHover={() => setHoveredProperty(property.id)}
                        onHoverEnd={() => setHoveredProperty(null)}
                      />
                    ))}
                  </div>
                  
                  {filteredProperties.length === 0 && (
                    <div className="text-center py-12">
                      <div className="max-w-md mx-auto">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                          <Filter className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No properties found</h3>
                        <p className="text-muted-foreground mb-4">
                          No properties match your current search criteria. Try adjusting your filters.
                        </p>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setFilters({});
                            setSearchParams(new URLSearchParams());
                            applyFiltersToProperties({});
                          }}
                        >
                          Clear All Filters
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="map" className="mt-0 col-span-12">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[600px]">
                <div className="lg:col-span-2 overflow-y-auto">
                  {isLoading ? (
                    <div className="space-y-4">
                      {[...Array(4)].map((_, index) => (
                        <div key={index} className="card-skeleton">
                          <Skeleton className="aspect-[16/9] rounded-t-2xl" />
                          <div className="p-4 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredProperties.map((property) => (
                        <PropertyCard
                          key={property.id}
                          property={property}
                          saved={savedProperties.has(property.id)}
                          onSave={handleSaveProperty}
                          onView={handleViewProperty}
                          onCompare={handleCompareProperty}
                          isHovered={hoveredProperty === property.id}
                          onHover={() => setHoveredProperty(property.id)}
                          onHoverEnd={() => setHoveredProperty(null)}
                          compact
                        />
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="lg:col-span-3">
                  <MapView 
                    properties={filteredProperties}
                    hoveredPropertyId={hoveredProperty}
                  />
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}