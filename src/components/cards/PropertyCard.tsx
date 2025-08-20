import { Heart, Eye, MapPin, Calendar, Camera, Verified, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Property } from '@/types';

interface PropertyCardProps {
  property: Property;
  onSave?: (id: string) => void;
  onView?: (id: string) => void;
  onCompare?: (id: string) => void;
  saved?: boolean;
  compact?: boolean;
}

export function PropertyCard({ 
  property, 
  onSave, 
  onView, 
  onCompare, 
  saved = false,
  compact = false 
}: PropertyCardProps) {
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)}Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`;
    }
    return `₹${price.toLocaleString()}`;
  };

  const handleCardClick = () => {
    onView?.(property.id);
  };

  return (
    <Card className="card-premium hover-lift cursor-pointer group overflow-hidden">
      <div className="relative">
        {/* Image */}
        <div className="aspect-[4/3] overflow-hidden rounded-t-2xl">
          <img
            src={property.images[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop'}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onClick={handleCardClick}
          />
          
          {/* Image Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {property.verified && (
              <Badge className="badge-verified text-xs">
                <Verified className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
            {property.isChoice && (
              <Badge className="badge-choice text-xs">
                <Star className="h-3 w-3 mr-1" />
                Choice
              </Badge>
            )}
          </div>

          {/* Save Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-muted-foreground hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onSave?.(property.id);
            }}
          >
            <Heart className={`h-4 w-4 ${saved ? 'fill-destructive text-destructive' : ''}`} />
          </Button>

          {/* Image Count */}
          {property.images.length > 1 && (
            <div className="absolute bottom-3 right-3 flex items-center space-x-1 bg-black/60 rounded-full px-2 py-1">
              <Camera className="h-3 w-3 text-white" />
              <span className="text-white text-xs">{property.images.length}</span>
            </div>
          )}

          {/* Price */}
          <div className="absolute bottom-3 left-3">
            <div className="bg-white rounded-lg px-3 py-1">
              <span className="font-bold text-lg text-foreground">
                {formatPrice(property.price)}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-4" onClick={handleCardClick}>
          <div className="space-y-3">
            {/* Title & Location */}
            <div>
              <h3 className="font-semibold text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                {property.title}
              </h3>
              <div className="flex items-center text-muted-foreground text-sm mt-1">
                <MapPin className="h-3 w-3 mr-1" />
                <span className="line-clamp-1">{property.location.locality}, {property.location.city}</span>
              </div>
            </div>

            {/* Property Details */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <span className="text-muted-foreground">
                  {property.bedrooms} BHK
                </span>
                <span className="text-muted-foreground">
                  {property.area} sqft
                </span>
                <span className="text-muted-foreground capitalize">
                  {property.type}
                </span>
              </div>
            </div>

            {/* Stats & Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Eye className="h-3 w-3" />
                  <span>{property.views}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{property.daysOnMarket}d</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCompare?.(property.id);
                  }}
                >
                  Compare
                </Button>
                <Button
                  className="btn-premium text-xs"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle contact action
                  }}
                >
                  Contact
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}