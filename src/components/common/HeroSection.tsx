import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  MapPin, 
  Home, 
  IndianRupee, 
  Ruler,
  ShoppingCart,
  Building,
  Palette,
  Shield,
  ArrowRight
} from 'lucide-react';

const intentTabs = [
  { id: 'buy', label: 'Buy', icon: ShoppingCart },
  { id: 'sell', label: 'Sell', icon: Home },
  { id: 'rent', label: 'Rent', icon: Building },
  { id: 'build', label: 'Build', icon: Building },
  { id: 'renovate', label: 'Renovate', icon: Palette },
  { id: 'design', label: 'Design', icon: Palette },
  { id: 'audit', label: 'Audit', icon: Shield },
];

const propertyTypes = [
  'Apartment', 'Villa', 'House', 'Plot', 'Commercial', 'Office'
];

const cities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata'
];

export function HeroSection() {
  const [activeIntent, setActiveIntent] = useState('buy');
  const [searchForm, setSearchForm] = useState({
    location: '',
    propertyType: '',
    priceRange: [10, 100], // in lakhs
    areaRange: [500, 3000], // in sqft
    bedrooms: 'any',
    timeline: '',
    verified: false,
    choice: false,
    financing: false,
    design: false
  });

  const handleSearch = () => {
    // Navigate to browse with filters
    const params = new URLSearchParams({
      intent: activeIntent,
      location: searchForm.location,
      propertyType: searchForm.propertyType,
      priceMin: (searchForm.priceRange[0] * 100000).toString(),
      priceMax: (searchForm.priceRange[1] * 100000).toString(),
      areaMin: searchForm.areaRange[0].toString(),
      areaMax: searchForm.areaRange[1].toString(),
      bedrooms: searchForm.bedrooms,
      verified: searchForm.verified.toString(),
      choice: searchForm.choice.toString()
    });
    
    window.location.href = `/browse?${params.toString()}`;
  };

  return (
    <div className="relative bg-hero-gradient">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-primary/10 to-transparent rounded-full" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-secondary/10 to-transparent rounded-full" />
      </div>

      <div className="container mx-auto px-4 py-16 relative">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-display mb-6">
              India's Most Trusted{' '}
              <span className="bg-primary-gradient bg-clip-text text-transparent">
                Real Estate Marketplace
              </span>
            </h1>
            <p className="text-subheadline max-w-3xl mx-auto">
              Connect with verified properties, trusted professionals, and thriving communities. 
              Your complete real estate journey starts here.
            </p>
          </div>

          {/* Intent Tabs */}
          <Tabs value={activeIntent} onValueChange={setActiveIntent} className="w-full">
            <TabsList className="grid grid-cols-7 w-full max-w-4xl mx-auto mb-8">
              {intentTabs.map((tab) => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="flex items-center space-x-2"
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Smart Filter Card */}
            <div className="bg-card/95 backdrop-blur rounded-3xl border border-border shadow-premium p-8 max-w-5xl mx-auto">
              <TabsContent value="buy" className="mt-0">
                <div className="space-y-6">
                  {/* Primary Search Row */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="City, locality, project..."
                        value={searchForm.location}
                        onChange={(e) => setSearchForm(prev => ({ ...prev, location: e.target.value }))}
                        className="pl-10 h-12"
                      />
                    </div>
                    
                    <Select
                      value={searchForm.propertyType}
                      onValueChange={(value) => setSearchForm(prev => ({ ...prev, propertyType: value }))}
                    >
                      <SelectTrigger className="h-12">
                        <Home className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Property Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyTypes.map((type) => (
                          <SelectItem key={type} value={type.toLowerCase()}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={searchForm.bedrooms}
                      onValueChange={(value) => setSearchForm(prev => ({ ...prev, bedrooms: value }))}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Bedrooms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any BHK</SelectItem>
                        <SelectItem value="1">1 BHK</SelectItem>
                        <SelectItem value="2">2 BHK</SelectItem>
                        <SelectItem value="3">3 BHK</SelectItem>
                        <SelectItem value="4">4 BHK</SelectItem>
                        <SelectItem value="5+">5+ BHK</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button 
                      onClick={handleSearch}
                      className="btn-hero h-12 text-base font-semibold"
                    >
                      <Search className="h-5 w-5 mr-2" />
                      Search Properties
                    </Button>
                  </div>

                  {/* Price & Area Sliders */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <Label className="text-sm font-medium mb-3 block">
                        Budget Range: ₹{searchForm.priceRange[0]}L - ₹{searchForm.priceRange[1]}L
                      </Label>
                      <Slider
                        value={searchForm.priceRange}
                        onValueChange={(value) => setSearchForm(prev => ({ ...prev, priceRange: value }))}
                        max={500}
                        min={5}
                        step={5}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium mb-3 block">
                        Area: {searchForm.areaRange[0]} - {searchForm.areaRange[1]} sq ft
                      </Label>
                      <Slider
                        value={searchForm.areaRange}
                        onValueChange={(value) => setSearchForm(prev => ({ ...prev, areaRange: value }))}
                        max={5000}
                        min={300}
                        step={100}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Quick Filters */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="verified"
                        checked={searchForm.verified}
                        onCheckedChange={(checked) => 
                          setSearchForm(prev => ({ ...prev, verified: checked as boolean }))
                        }
                      />
                      <Label htmlFor="verified" className="text-sm font-medium">
                        Verified Only
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="choice"
                        checked={searchForm.choice}
                        onCheckedChange={(checked) => 
                          setSearchForm(prev => ({ ...prev, choice: checked as boolean }))
                        }
                      />
                      <Label htmlFor="choice" className="text-sm font-medium">
                        RealtyCheq Choice
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="financing"
                        checked={searchForm.financing}
                        onCheckedChange={(checked) => 
                          setSearchForm(prev => ({ ...prev, financing: checked as boolean }))
                        }
                      />
                      <Label htmlFor="financing" className="text-sm font-medium">
                        Need Financing
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="design"
                        checked={searchForm.design}
                        onCheckedChange={(checked) => 
                          setSearchForm(prev => ({ ...prev, design: checked as boolean }))
                        }
                      />
                      <Label htmlFor="design" className="text-sm font-medium">
                        Need Design/Construction
                      </Label>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Other intent tabs would have similar but adapted forms */}
              <TabsContent value="sell" className="mt-0">
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-semibold">List Your Property</h3>
                  <p className="text-muted-foreground">
                    Get maximum exposure and connect with verified buyers
                  </p>
                  <Button className="btn-hero">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Start Listing
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="design" className="mt-0">
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-semibold">Find Design Professionals</h3>
                  <p className="text-muted-foreground">
                    Connect with verified architects and interior designers
                  </p>
                  <Button className="btn-hero">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Browse Services
                  </Button>
                </div>
              </TabsContent>
            </div>
          </Tabs>

          {/* Quick Action CTAs */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button variant="outline" className="btn-ghost-premium">
              List Property
            </Button>
            <Button variant="outline" className="btn-ghost-premium">
              Post Opportunity
            </Button>
            <Button variant="outline" className="btn-ghost-premium">
              Join as Vendor
            </Button>
            <Button variant="outline" className="btn-ghost-premium">
              Buy Membership
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
