import { useState } from 'react';
import { Search, MapPin, Home, IndianRupee, Ruler, Bed, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { SearchFilters, PropertyType } from '@/types';

interface SmartFilterProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

const propertyTypes: { value: PropertyType; label: string }[] = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'villa', label: 'Villa' },
  { value: 'house', label: 'House' },
  { value: 'plot', label: 'Plot' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'office', label: 'Office' },
];

const popularAmenities = [
  'Swimming Pool', 'Gym', 'Security', 'Parking', 'Garden', 
  'Club House', 'Kids Play Area', 'Lift', 'Power Backup'
];

export function SmartFilter({ filters, onFiltersChange }: SmartFilterProps) {
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterUpdate = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handlePriceRangeChange = (values: number[]) => {
    handleFilterUpdate('priceRange', { min: values[0] * 100000, max: values[1] * 100000 });
  };

  const handleAreaRangeChange = (values: number[]) => {
    handleFilterUpdate('areaRange', { min: values[0] * 100, max: values[1] * 100 });
  };

  const handlePropertyTypeToggle = (type: PropertyType, checked: boolean) => {
    const currentTypes = localFilters.propertyType || [];
    let newTypes;
    
    if (checked) {
      newTypes = [...currentTypes, type];
    } else {
      newTypes = currentTypes.filter(t => t !== type);
    }
    
    handleFilterUpdate('propertyType', newTypes.length > 0 ? newTypes : undefined);
  };

  const handleBedroomsToggle = (beds: number, checked: boolean) => {
    const currentBeds = localFilters.bedrooms || [];
    let newBeds;
    
    if (checked) {
      newBeds = [...currentBeds, beds];
    } else {
      newBeds = currentBeds.filter(b => b !== beds);
    }
    
    handleFilterUpdate('bedrooms', newBeds.length > 0 ? newBeds : undefined);
  };

  const handleAmenityToggle = (amenity: string, checked: boolean) => {
    const currentAmenities = localFilters.amenities || [];
    let newAmenities;
    
    if (checked) {
      newAmenities = [...currentAmenities, amenity];
    } else {
      newAmenities = currentAmenities.filter(a => a !== amenity);
    }
    
    handleFilterUpdate('amenities', newAmenities.length > 0 ? newAmenities : undefined);
  };

  const clearAllFilters = () => {
    setLocalFilters({});
    onFiltersChange({});
  };

  const priceRange = localFilters.priceRange || { min: 1000000, max: 50000000 };
  const areaRange = localFilters.areaRange || { min: 500, max: 5000 };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-soft">
      {/* Main Search Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
        {/* Search Query */}
        <div className="md:col-span-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by location, project..."
              value={localFilters.query || ''}
              onChange={(e) => handleFilterUpdate('query', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Location */}
        <div className="md:col-span-3">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="City, locality, pincode"
              value={localFilters.location || ''}
              onChange={(e) => handleFilterUpdate('location', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Property Type */}
        <div className="md:col-span-2">
          <Select 
            value={localFilters.propertyType?.[0] || ''} 
            onValueChange={(value) => handleFilterUpdate('propertyType', value ? [value as PropertyType] : undefined)}
          >
            <SelectTrigger>
              <Home className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              {propertyTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quick Price Range */}
        <div className="md:col-span-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <IndianRupee className="h-4 w-4 mr-2" />
                Price Range
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="space-y-4">
                <Label>Price Range (₹)</Label>
                <Slider
                  value={[priceRange.min / 100000, priceRange.max / 100000]}
                  onValueChange={handlePriceRangeChange}
                  max={500}
                  min={10}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>₹{(priceRange.min / 100000).toFixed(1)}L</span>
                  <span>₹{(priceRange.max / 100000).toFixed(1)}L</span>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="md:col-span-2">
          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full"
          >
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border-t border-border pt-4 space-y-4">
          {/* Property Types */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Property Types</Label>
            <div className="flex flex-wrap gap-2">
              {propertyTypes.map((type) => (
                <div key={type.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type.value}`}
                    checked={localFilters.propertyType?.includes(type.value) || false}
                    onCheckedChange={(checked) => 
                      handlePropertyTypeToggle(type.value, checked as boolean)
                    }
                  />
                  <Label htmlFor={`type-${type.value}`} className="text-sm">
                    {type.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Bedrooms */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Bedrooms</Label>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((beds) => (
                <div key={beds} className="flex items-center space-x-2">
                  <Checkbox
                    id={`beds-${beds}`}
                    checked={localFilters.bedrooms?.includes(beds) || false}
                    onCheckedChange={(checked) => 
                      handleBedroomsToggle(beds, checked as boolean)
                    }
                  />
                  <Label htmlFor={`beds-${beds}`} className="text-sm">
                    {beds} BHK
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Area Range */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Area (sq ft)</Label>
            <Slider
              value={[areaRange.min / 100, areaRange.max / 100]}
              onValueChange={handleAreaRangeChange}
              max={50}
              min={5}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>{areaRange.min} sq ft</span>
              <span>{areaRange.max} sq ft</span>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Amenities</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {popularAmenities.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={`amenity-${amenity}`}
                    checked={localFilters.amenities?.includes(amenity) || false}
                    onCheckedChange={(checked) => 
                      handleAmenityToggle(amenity, checked as boolean)
                    }
                  />
                  <Label htmlFor={`amenity-${amenity}`} className="text-sm">
                    {amenity}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Special Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="verified"
                checked={localFilters.verified || false}
                onCheckedChange={(checked) => 
                  handleFilterUpdate('verified', checked as boolean)
                }
              />
              <Label htmlFor="verified" className="text-sm">
                Verified Properties Only
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="choice"
                checked={localFilters.isChoice || false}
                onCheckedChange={(checked) => 
                  handleFilterUpdate('isChoice', checked as boolean)
                }
              />
              <Label htmlFor="choice" className="text-sm">
                RealtyCheq Choice
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="new"
                checked={localFilters.newListings || false}
                onCheckedChange={(checked) => 
                  handleFilterUpdate('newListings', checked as boolean)
                }
              />
              <Label htmlFor="new" className="text-sm">
                New Listings (7 days)
              </Label>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="flex justify-end">
            <Button variant="ghost" onClick={clearAllFilters} size="sm">
              <X className="h-4 w-4 mr-2" />
              Clear All Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}