import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { 
  Layout, 
  Building, 
  Ruler, 
  FileImage, 
  Plus,
  ChevronDown,
  Calculator,
  Compass,
  Home,
  Palette,
  Shield,
  Hammer
} from 'lucide-react';
import modernHouseImage from '@/assets/modern-house-hero.jpg';

const planTypes = [
  { id: '2d-layout', label: '2D Layout Plan', icon: Layout },
  { id: '3d-elevation', label: '3D Front Elevation', icon: Building },
  { id: 'structural', label: 'Structural Drawings', icon: Ruler },
  { id: 'presentation', label: 'Presentation Plan', icon: FileImage },
];

const additionalServices = [
  { id: 'interior', label: 'Interior Design', icon: Palette },
  { id: 'vastu', label: 'Vastu Consultation', icon: Compass },
  { id: 'construction', label: 'Construction', icon: Hammer },
  { id: 'approval', label: 'Plan Approval', icon: Shield },
];

export function HousePlansHero() {
  const [activeTab, setActiveTab] = useState('2d-layout');
  const [showMore, setShowMore] = useState(false);
  const [formData, setFormData] = useState({
    depth: '',
    width: '',
    floors: '',
    buildingArea: '',
    direction: ''
  });

  const handleCalculatePrice = () => {
    // Handle price calculation logic
    console.log('Calculating price with:', formData);
  };

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${modernHouseImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/95" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/98 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 min-h-screen flex flex-col justify-center">
        <div className="max-w-6xl mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-display mb-6">
              Your One-Stop Destination For{' '}
              <span className="bg-primary-gradient bg-clip-text text-transparent">
                Home Plans And Designs
              </span>
            </h1>
            <p className="text-subheadline max-w-2xl mx-auto">
              We provide end-to-end solutions for your dream home with premium designs and expert consultation.
            </p>
          </div>

          {/* Plan Type Tabs */}
          <div className="mb-8 animate-slide-up">
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {planTypes.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setActiveTab(plan.id)}
                  className={`
                    relative flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 font-medium
                    ${activeTab === plan.id 
                      ? 'bg-primary text-primary-foreground shadow-premium hover-glow' 
                      : 'bg-card hover:bg-accent text-foreground hover-lift'
                    }
                  `}
                >
                  <plan.icon className="h-5 w-5" />
                  <span>{plan.label}</span>
                  {activeTab === plan.id && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <ChevronDown className="h-4 w-4 text-primary" />
                    </div>
                  )}
                </button>
              ))}
              
              {/* More Button */}
              <button
                onClick={() => setShowMore(!showMore)}
                className={`
                  flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 font-medium border-2
                  ${showMore 
                    ? 'bg-secondary text-secondary-foreground border-secondary shadow-premium' 
                    : 'bg-background border-border hover:border-primary text-foreground hover-lift'
                  }
                `}
              >
                <Plus className={`h-5 w-5 transition-transform duration-300 ${showMore ? 'rotate-45' : ''}`} />
                <span>More</span>
              </button>
            </div>

            {/* Additional Services (Expandable) */}
            <div className={`
              overflow-hidden transition-all duration-500 ease-out
              ${showMore ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'}
            `}>
              <div className="flex flex-wrap justify-center gap-2 p-4 bg-muted/30 rounded-2xl backdrop-blur">
                {additionalServices.map((service) => (
                  <Card 
                    key={service.id}
                    className="flex items-center space-x-3 p-4 bg-card hover:bg-accent hover-lift cursor-pointer"
                  >
                    <service.icon className="h-6 w-6 text-primary" />
                    <span className="font-medium">{service.label}</span>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <Card className="bg-card/95 backdrop-blur-sm shadow-premium border-0 p-8 max-w-4xl mx-auto animate-scale-in">
            <div className="space-y-6">
              {/* Form Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Depth (ft)
                  </label>
                  <Input
                    placeholder="e.g., 40"
                    value={formData.depth}
                    onChange={(e) => setFormData(prev => ({ ...prev, depth: e.target.value }))}
                    className="h-12"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Width (ft)
                  </label>
                  <Input
                    placeholder="e.g., 30"
                    value={formData.width}
                    onChange={(e) => setFormData(prev => ({ ...prev, width: e.target.value }))}
                    className="h-12"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Floors
                  </label>
                  <Select
                    value={formData.floors}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, floors: value }))}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select floors" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Ground Floor</SelectItem>
                      <SelectItem value="2">Ground + 1 Floor</SelectItem>
                      <SelectItem value="3">Ground + 2 Floors</SelectItem>
                      <SelectItem value="4">Ground + 3 Floors</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Form Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Building Area (sq ft)
                  </label>
                  <Input
                    placeholder="e.g., 1200"
                    value={formData.buildingArea}
                    onChange={(e) => setFormData(prev => ({ ...prev, buildingArea: e.target.value }))}
                    className="h-12"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Direction
                  </label>
                  <Select
                    value={formData.direction}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, direction: value }))}
                  >
                    <SelectTrigger className="h-12">
                      <Compass className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Select direction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="north">North Facing</SelectItem>
                      <SelectItem value="south">South Facing</SelectItem>
                      <SelectItem value="east">East Facing</SelectItem>
                      <SelectItem value="west">West Facing</SelectItem>
                      <SelectItem value="northeast">North-East Facing</SelectItem>
                      <SelectItem value="northwest">North-West Facing</SelectItem>
                      <SelectItem value="southeast">South-East Facing</SelectItem>
                      <SelectItem value="southwest">South-West Facing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button 
                    onClick={handleCalculatePrice}
                    className="btn-hero h-12 w-full text-base font-semibold"
                  >
                    <Calculator className="h-5 w-5 mr-2" />
                    Calculate Price
                  </Button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">Designs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">50+</div>
                  <div className="text-sm text-muted-foreground">Architects</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">1000+</div>
                  <div className="text-sm text-muted-foreground">Happy Clients</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">24/7</div>
                  <div className="text-sm text-muted-foreground">Support</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}