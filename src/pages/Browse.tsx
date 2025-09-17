import { useState, useEffect } from 'react';
import { PropertyCard } from '@/components/cards/PropertyCard';
import { SmartFilter } from '@/components/filters/SmartFilter';
import { MapView } from '@/components/map/MapView';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Map, List, Filter, Bookmark } from 'lucide-react';
import { mockProperties } from '@/data/mockData';
import { SearchFilters, Property } from '@/types';
import { useAnalytics } from '@/lib/hooks/useAnalytics';
import { formatPrice } from '@/lib/utils/currency';
import { 
  getSavedProperties, 
  saveProperty, 
  removeSavedProperty,
  addToComparison,
  removeFromComparison,
  isInComparison 
} from '@/lib/utils/storage';

export default function Browse() {
  const { track } = useAnalytics();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(mockProperties);
  const [savedProperties, setSavedProperties] = useState<Set<string>>(new Set());
  const [hoveredProperty, setHoveredProperty] = useState<string | null>(null);
  const [comparedProperties, setComparedProperties] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load saved properties from localStorage
    const saved = getSavedProperties();
    setSavedProperties(new Set(saved));
    
    // Track page view
    track('view_listing', { page: 'browse', filterCount: Object.keys(filters).length });
  }, []);

  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    // Apply filters to properties
    let filtered = mockProperties;
    
    if (newFilters.priceRange) {
      filtered = filtered.filter(p => 
        p.price >= newFilters.priceRange!.min && 
        p.price <= newFilters.priceRange!.max
      );
    }
    
    if (newFilters.propertyType?.length) {
      filtered = filtered.filter(p => 
        newFilters.propertyType!.includes(p.type)
      );
    }
    
    if (newFilters.verified) {
      filtered = filtered.filter(p => p.verified);
    }
    
    if (newFilters.isChoice) {
      filtered = filtered.filter(p => p.isChoice);
    }
    
    setFilteredProperties(filtered);
  };

  const handleSaveProperty = (id: string) => {
    setSavedProperties(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
        removeSavedProperty(id);
      } else {
        newSet.add(id);
        saveProperty(id);
      }
      return newSet;
    });
    track('save_property', { propertyId: id });
  };

  const handleViewProperty = (id: string) => {
    // Navigate to property detail
    window.location.href = `/browse/${id}`;
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
      setComparedProperties(prev => new Set([...prev, id]));
    }
    track('add_to_compare', { propertyId: id });
  };

  const handleViewModeChange = (mode: 'list' | 'map') => {
    setViewMode(mode);
    track('switch_view_mode', { mode });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-hero-gradient border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-headline">Browse Properties</h1>
                <p className="text-muted-foreground">
                  {filteredProperties.length} properties found
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleViewModeChange('list')}
                >
                  <List className="h-4 w-4 mr-2" />
                  List
                </Button>
                <Button
                  variant={viewMode === 'map' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleViewModeChange('map')}
                >
                  <Map className="h-4 w-4 mr-2" />
                  Map
                </Button>
              </div>
            </div>

            {/* Smart Filter */}
            <SmartFilter
              filters={filters}
              onFiltersChange={handleFilterChange}
            />

            {/* Active Filters */}
            {Object.keys(filters).length > 0 && (
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {filters.verified && (
                  <Badge variant="secondary">Verified Only</Badge>
                )}
                {filters.isChoice && (
                  <Badge variant="secondary">RealtyCheq Choice</Badge>
                )}
                {filters.priceRange && (
                  <Badge variant="secondary">
                    {formatPrice(filters.priceRange.min)} - {formatPrice(filters.priceRange.max)}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFilters({});
                    setFilteredProperties(mockProperties);
                  }}
                >
                  Clear All
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Comparison Bar */}
        {comparedProperties.size > 0 && (
          <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground rounded-2xl p-4 shadow-large z-50">
            <div className="flex items-center space-x-3">
              <Bookmark className="h-5 w-5" />
              <span className="font-medium">{comparedProperties.size} properties to compare</span>
              <Button variant="secondary" size="sm">
                Compare Now
              </Button>
            </div>
          </div>
        )}

        {viewMode === 'list' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                onMouseEnter={() => setHoveredProperty(property.id)}
                onMouseLeave={() => setHoveredProperty(null)}
              >
                <PropertyCard
                  property={property}
                  saved={savedProperties.has(property.id)}
                  onSave={handleSaveProperty}
                  onView={handleViewProperty}
                  onCompare={handleCompareProperty}
                  isCompared={comparedProperties.has(property.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
            <div className="space-y-4 overflow-y-auto">
              {filteredProperties.map((property) => (
                <div
                  key={property.id}
                  onMouseEnter={() => setHoveredProperty(property.id)}
                  onMouseLeave={() => setHoveredProperty(null)}
                >
                  <PropertyCard
                    property={property}
                    saved={savedProperties.has(property.id)}
                    onSave={handleSaveProperty}
                    onView={handleViewProperty}
                    onCompare={handleCompareProperty}
                    isCompared={comparedProperties.has(property.id)}
                    compact
                  />
                </div>
              ))}
            </div>
            <div className="rounded-2xl overflow-hidden">
              <MapView 
                properties={filteredProperties} 
                selectedProperty={hoveredProperty}
                onPropertySelect={setHoveredProperty}
              />
            </div>
          </div>
        )}

        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No properties found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters to see more results
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setFilters({});
                setFilteredProperties(mockProperties);
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}