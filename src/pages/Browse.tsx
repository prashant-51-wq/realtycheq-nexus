import { useState } from 'react';
import { PropertyCard } from '@/components/cards/PropertyCard';
import { SmartFilter } from '@/components/filters/SmartFilter';
import { MapView } from '@/components/map/MapView';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Map, List, Filter } from 'lucide-react';
import { mockProperties } from '@/data/mockData';
import { SearchFilters, Property } from '@/types';

export default function Browse() {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(mockProperties);
  const [savedProperties, setSavedProperties] = useState<Set<string>>(new Set());

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
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleViewProperty = (id: string) => {
    // Navigate to property detail
    window.location.href = `/browse/${id}`;
  };

  const handleCompareProperty = (id: string) => {
    // Add to comparison
    console.log('Compare property:', id);
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
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4 mr-2" />
                  List
                </Button>
                <Button
                  variant={viewMode === 'map' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('map')}
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
                    ₹{(filters.priceRange.min / 100000).toFixed(1)}L - 
                    ₹{(filters.priceRange.max / 10000000).toFixed(1)}Cr
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
        {viewMode === 'list' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                saved={savedProperties.has(property.id)}
                onSave={handleSaveProperty}
                onView={handleViewProperty}
                onCompare={handleCompareProperty}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
            <div className="space-y-4 overflow-y-auto">
              {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  saved={savedProperties.has(property.id)}
                  onSave={handleSaveProperty}
                  onView={handleViewProperty}
                  onCompare={handleCompareProperty}
                  compact
                />
              ))}
            </div>
            <div className="rounded-2xl overflow-hidden">
              <MapView properties={filteredProperties} />
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