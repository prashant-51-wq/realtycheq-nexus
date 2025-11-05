import { useState, useEffect } from 'react';
import { Property } from '@/types';
import { MapPin, Home } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MapViewProps {
  properties: Property[];
  selectedProperty?: string;
  onPropertySelect?: (id: string) => void;
  hoveredPropertyId?: string | null;
}

export function MapView({ properties, selectedProperty, onPropertySelect, hoveredPropertyId }: MapViewProps) {
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => setMapLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)}Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`;
    }
    return `₹${price.toLocaleString()}`;
  };

  if (!mapLoaded) {
    return (
      <div className="w-full h-full bg-muted rounded-2xl flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-emerald-50 rounded-2xl overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-emerald-100">
        {/* Simulated map grid */}
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute border-gray-300"
              style={{
                left: `${(i % 5) * 20}%`,
                top: `${Math.floor(i / 5) * 25}%`,
                width: '20%',
                height: '25%',
                borderWidth: '1px',
              }}
            />
          ))}
        </div>
      </div>

      {/* Property Markers */}
      {properties.map((property, index) => (
        <div
          key={property.id}
          className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 z-10 ${
            selectedProperty === property.id ? 'z-20' : ''
          }`}
          style={{
            left: `${20 + (index % 4) * 20}%`,
            top: `${20 + (Math.floor(index / 4) % 3) * 25}%`,
          }}
          onClick={() => onPropertySelect?.(property.id)}
        >
          {/* Marker */}
          <div className={`relative group ${
            selectedProperty === property.id ? 'scale-110' : 'hover:scale-105'
          } transition-transform`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-medium ${
              property.isChoice 
                ? 'bg-gradient-to-r from-primary to-secondary' 
                : property.verified 
                ? 'bg-primary' 
                : 'bg-muted-foreground'
            }`}>
              <Home className="h-4 w-4 text-white" />
            </div>
            
            {/* Price Badge */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-white shadow-large rounded-lg px-2 py-1 whitespace-nowrap">
                <span className="text-xs font-semibold text-foreground">
                  {formatPrice(property.price)}
                </span>
              </div>
            </div>

            {/* Property Card on Hover */}
            {selectedProperty === property.id && (
              <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-30">
                <Card className="w-64 shadow-large">
                  <CardContent className="p-3">
                  <img
                      src={property.images[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop'}
                      alt={property.title}
                      className="w-full h-32 object-cover rounded-lg mb-2"
                    />
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">
                          {formatPrice(property.price)}
                        </span>
                        <div className="flex space-x-1">
                          {property.verified && (
                            <Badge variant="secondary" className="text-xs">
                              Verified
                            </Badge>
                          )}
                          {property.isChoice && (
                            <Badge className="badge-choice text-xs">
                              Choice
                            </Badge>
                          )}
                        </div>
                      </div>
                      <h4 className="font-medium text-sm line-clamp-1">
                        {property.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {property.bedrooms} BHK • {property.area} sqft
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {property.location.locality}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Map Controls */}
      <div className="absolute top-4 right-4 space-y-2">
        <button className="w-10 h-10 bg-white shadow-medium rounded-lg flex items-center justify-center hover:shadow-large transition-shadow">
          <span className="text-lg font-bold">+</span>
        </button>
        <button className="w-10 h-10 bg-white shadow-medium rounded-lg flex items-center justify-center hover:shadow-large transition-shadow">
          <span className="text-lg font-bold">−</span>
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur rounded-lg p-3 shadow-medium">
        <div className="space-y-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
            <span>RealtyCheq Choice</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span>Verified</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-muted-foreground rounded-full"></div>
            <span>Standard</span>
          </div>
        </div>
      </div>

      {/* Property Count */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur rounded-lg px-3 py-2 shadow-medium">
        <span className="text-sm font-medium">
          {properties.length} properties
        </span>
      </div>
    </div>
  );
}