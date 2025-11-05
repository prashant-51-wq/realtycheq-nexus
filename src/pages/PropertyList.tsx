import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Plus, ArrowLeft, Home, IndianRupee, MapPin } from 'lucide-react';

const PropertyList = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    property_type: '',
    price: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    locality: '',
    micro_market: '',
    amenities: '',
    year_built: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to list a property.',
        variant: 'destructive',
      });
      return;
    }

    if (profile?.role !== 'seller' && profile?.role !== 'super_admin') {
      toast({
        title: 'Access denied',
        description: 'Only sellers can list properties. Please update your profile role.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const amenitiesArray = formData.amenities
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);

      const { error } = await supabase
        .from('properties')
        .insert({
          seller_id: user.id,
          title: formData.title,
          description: formData.description,
          property_type: formData.property_type as 'apartment' | 'villa' | 'house' | 'plot' | 'commercial' | 'office',
          price: parseFloat(formData.price),
          area: parseFloat(formData.area),
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
          bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          locality: formData.locality,
          micro_market: formData.micro_market,
          amenities: amenitiesArray,
          year_built: formData.year_built ? parseInt(formData.year_built) : null,
          status: 'active' as 'active',
        });

      if (error) {
        throw error;
      }

      toast({
        title: 'Property listed successfully!',
        description: 'Your property has been added and is now live.',
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        property_type: '',
        price: '',
        area: '',
        bedrooms: '',
        bathrooms: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        locality: '',
        micro_market: '',
        amenities: '',
        year_built: '',
      });

      navigate('/browse');
    } catch (error: any) {
      toast({
        title: 'Failed to list property',
        description: error.message || 'An error occurred while listing your property.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="card-premium max-w-md text-center">
          <CardContent className="p-8">
            <Home className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
            <p className="text-muted-foreground mb-6">
              Please sign in to list your property on RealtyCheq.
            </p>
            <Link to="/auth">
              <Button className="btn-hero">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (profile?.role !== 'seller' && profile?.role !== 'super_admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="card-premium max-w-md text-center">
          <CardContent className="p-8">
            <Home className="h-16 w-16 text-warning mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Seller Access Required</h2>
            <p className="text-muted-foreground mb-6">
              Only sellers can list properties. Please contact support to update your role.
            </p>
            <Link to="/">
              <Button variant="outline">Go Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold">List Your Property</h1>
          <p className="text-muted-foreground">
            Showcase your property to thousands of potential buyers
          </p>
        </div>

        <Card className="card-premium">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Property Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Property Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., 3 BHK Luxury Apartment in Bandra"
                      value={formData.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="property_type">Property Type *</Label>
                    <Select value={formData.property_type} onValueChange={(value) => handleChange('property_type', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="plot">Plot</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="office">Office</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your property, its features, and what makes it special..."
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={4}
                  />
                </div>
              </div>

              {/* Pricing & Specifications */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Pricing & Specifications</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹) *</Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="price"
                        type="number"
                        placeholder="50000000"
                        value={formData.price}
                        onChange={(e) => handleChange('price', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="area">Area (sq ft) *</Label>
                    <Input
                      id="area"
                      type="number"
                      placeholder="1200"
                      value={formData.area}
                      onChange={(e) => handleChange('area', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="year_built">Year Built</Label>
                    <Input
                      id="year_built"
                      type="number"
                      placeholder="2020"
                      value={formData.year_built}
                      onChange={(e) => handleChange('year_built', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Select value={formData.bedrooms} onValueChange={(value) => handleChange('bedrooms', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select bedrooms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 BHK</SelectItem>
                        <SelectItem value="2">2 BHK</SelectItem>
                        <SelectItem value="3">3 BHK</SelectItem>
                        <SelectItem value="4">4 BHK</SelectItem>
                        <SelectItem value="5">5+ BHK</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Select value={formData.bathrooms} onValueChange={(value) => handleChange('bathrooms', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select bathrooms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Location
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Full Address *</Label>
                  <Input
                    id="address"
                    placeholder="Building name, street, area"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="Mumbai"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      placeholder="Maharashtra"
                      value={formData.state}
                      onChange={(e) => handleChange('state', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      placeholder="400001"
                      value={formData.pincode}
                      onChange={(e) => handleChange('pincode', e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="locality">Locality</Label>
                    <Input
                      id="locality"
                      placeholder="Bandra West"
                      value={formData.locality}
                      onChange={(e) => handleChange('locality', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="micro_market">Micro Market</Label>
                    <Input
                      id="micro_market"
                      placeholder="Linking Road"
                      value={formData.micro_market}
                      onChange={(e) => handleChange('micro_market', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Amenities</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="amenities">Amenities (comma separated)</Label>
                  <Input
                    id="amenities"
                    placeholder="Swimming Pool, Gym, Security, Parking, Garden"
                    value={formData.amenities}
                    onChange={(e) => handleChange('amenities', e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Separate multiple amenities with commas
                  </p>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  className="btn-hero flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    'Publish Property'
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PropertyList;