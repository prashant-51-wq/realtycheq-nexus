import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Heart, Share, MapPin, Bed, Bath, Square, Calendar,
  Shield, Award, Phone, MessageCircle, Eye, Download, Car,
  Wifi, Dumbbell, Waves, TreePine, Clock, IndianRupee, Calculator
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { mockProperties } from '@/data/mockData';
import { formatPrice, formatArea, calculateEMI } from '@/lib/utils/currency';
import { useAnalytics } from '@/lib/hooks/useAnalytics';
import { isPropertySaved, saveProperty, removeSavedProperty } from '@/lib/utils/storage';

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { track } = useAnalytics();
  const [property, setProperty] = useState(mockProperties.find(p => p.id === id));
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [saved, setSaved] = useState(false);
  const [showMortgageCalc, setShowMortgageCalc] = useState(false);
  const [loanAmount, setLoanAmount] = useState(property?.price ? property.price * 0.8 : 0);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(240); // 20 years in months

  useEffect(() => {
    if (property) {
      setSaved(isPropertySaved(property.id));
      track('view_listing', { 
        propertyId: property.id, 
        price: property.price,
        type: property.type,
        location: property.location.city 
      });
    }
  }, [property, track]);

  const handleSave = () => {
    if (!property) return;
    
    if (saved) {
      removeSavedProperty(property.id);
      setSaved(false);
      toast({ title: 'Property unsaved' });
    } else {
      saveProperty(property.id);
      setSaved(true);
      toast({ title: 'Property saved to favorites' });
      track('save_property', { propertyId: property.id });
    }
  };

  const handleScheduleVisit = () => {
    track('schedule_visit', { propertyId: property?.id });
    toast({ 
      title: 'Visit scheduled!', 
      description: 'We will contact you within 24 hours to confirm.' 
    });
  };

  const handleRequestVerification = () => {
    track('start_rfq', { propertyId: property?.id, type: 'verification' });
    toast({ 
      title: 'Verification requested', 
      description: 'Our team will verify this property within 3-5 business days.' 
    });
  };

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Property not found</h1>
          <Button onClick={() => navigate('/browse')}>Back to Browse</Button>
        </div>
      </div>
    );
  }

  const emi = calculateEMI(loanAmount, interestRate, tenure);
  const amenityIcons: Record<string, any> = {
    'Swimming Pool': Waves,
    'Gym': Dumbbell,
    'Parking': Car,
    'WiFi': Wifi,
    'Garden': TreePine,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/browse')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Browse
            </Button>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Heart className={`h-4 w-4 mr-2 ${saved ? 'fill-red-500 text-red-500' : ''}`} />
                {saved ? 'Saved' : 'Save'}
              </Button>
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative h-[60vh] bg-muted">
        <img
          src={property.images[currentImageIndex] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop'}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        
        {/* Image Navigation */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-2">
            {property.images.slice(0, 5).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full ${
                  currentImageIndex === index ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex space-x-2">
          {property.verified && (
            <Badge className="badge-verified">
              <Shield className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          )}
          {property.isChoice && (
            <Badge className="badge-choice">
              <Award className="h-3 w-3 mr-1" />
              RealtyCheq Choice
            </Badge>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-display mb-2">{property.title}</h1>
                  <div className="flex items-center text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.location.address}, {property.location.locality}, {property.location.city}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Listed {Math.floor(Math.random() * 30)} days ago
                    </span>
                    <span className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {Math.floor(Math.random() * 500) + 100} views
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">{formatPrice(property.price)}</div>
                  <div className="text-sm text-muted-foreground">
                    ₹{Math.round(property.price / property.area)} per sq ft
                  </div>
                </div>
              </div>

              {/* Key Facts */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-2xl">
                <div className="text-center">
                  <Bed className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="font-semibold">{property.bedrooms}</div>
                  <div className="text-sm text-muted-foreground">Bedrooms</div>
                </div>
                <div className="text-center">
                  <Bath className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="font-semibold">{property.bathrooms}</div>
                  <div className="text-sm text-muted-foreground">Bathrooms</div>
                </div>
                <div className="text-center">
                  <Square className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="font-semibold">{formatArea(property.area)}</div>
                  <div className="text-sm text-muted-foreground">Built-up Area</div>
                </div>
                <div className="text-center">
                  <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="font-semibold">{property.yearBuilt || 'N/A'}</div>
                  <div className="text-sm text-muted-foreground">Year Built</div>
                </div>
              </div>
            </div>

            {/* Property Details Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="legal">Legal & Docs</TabsTrigger>
                <TabsTrigger value="market">Market Stats</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {property.description}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Property Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {property.features?.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span>{feature.name}: {feature.value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="amenities">
                <Card>
                  <CardHeader>
                    <CardTitle>Amenities & Facilities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {property.amenities.map((amenity, index) => {
                        const IconComponent = amenityIcons[amenity] || TreePine;
                        return (
                          <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                            <IconComponent className="h-5 w-5 text-primary" />
                            <span>{amenity}</span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="location">
                <Card>
                  <CardHeader>
                    <CardTitle>Location & Connectivity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
                          <p className="text-muted-foreground">Interactive map will be loaded here</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Nearby Places</h4>
                          <div className="space-y-2 text-sm">
                            <div>Metro Station - 0.5 km</div>
                            <div>Hospital - 1.2 km</div>
                            <div>School - 0.8 km</div>
                            <div>Shopping Mall - 2.1 km</div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Transport</h4>
                          <div className="space-y-2 text-sm">
                            <div>Bus Stop - 200m</div>
                            <div>Railway Station - 3.5 km</div>
                            <div>Airport - 12 km</div>
                            <div>Highway Access - 1.5 km</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="legal">
                <Card>
                  <CardHeader>
                    <CardTitle>Legal & Documentation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-success/10 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Shield className="h-5 w-5 text-success" />
                          <div>
                            <div className="font-semibold">RERA Approved</div>
                            <div className="text-sm text-muted-foreground">Registration: UP-RERA-123456</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <h4 className="font-semibold">Available Documents</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Sale Deed</span>
                              <Badge variant="secondary">Verified</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Encumbrance Certificate</span>
                              <Badge variant="secondary">Verified</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Property Tax Receipt</span>
                              <Badge variant="secondary">Available</Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <h4 className="font-semibold">Verification Status</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Title Verification</span>
                              <Badge className="badge-verified">Complete</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Physical Inspection</span>
                              <Badge className="badge-verified">Complete</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Legal Clearance</span>
                              <Badge variant="outline">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-0 text-xs"
                                  onClick={handleRequestVerification}
                                >
                                  Request Now
                                </Button>
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="market">
                <Card>
                  <CardHeader>
                    <CardTitle>Market Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-success">+12%</div>
                        <div className="text-sm text-muted-foreground">Price appreciation (1Y)</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{Math.floor(Math.random() * 50) + 20}</div>
                        <div className="text-sm text-muted-foreground">Similar properties</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-warning">{Math.floor(Math.random() * 100) + 50}</div>
                        <div className="text-sm text-muted-foreground">Days on market</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Contact Seller</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button className="w-full" size="lg">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full" onClick={handleScheduleVisit}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Visit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Schedule Property Visit</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" placeholder="Enter your name" />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" placeholder="+91 XXXXX XXXXX" />
                        </div>
                        <div>
                          <Label htmlFor="date">Preferred Date</Label>
                          <Input id="date" type="date" />
                        </div>
                        <div>
                          <Label htmlFor="message">Message (Optional)</Label>
                          <Textarea id="message" placeholder="Any specific requirements..." />
                        </div>
                        <Button className="w-full" onClick={handleScheduleVisit}>
                          Confirm Visit
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="text-sm text-muted-foreground text-center">
                    Response rate: 85% • Response time: 2 hours
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mortgage Calculator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="h-5 w-5 mr-2" />
                  EMI Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="loan-amount">Loan Amount</Label>
                  <Input
                    id="loan-amount"
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="interest-rate">Interest Rate (%)</Label>
                  <Input
                    id="interest-rate"
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="tenure">Tenure (Years)</Label>
                  <Input
                    id="tenure"
                    type="number"
                    value={tenure / 12}
                    onChange={(e) => setTenure(Number(e.target.value) * 12)}
                  />
                </div>
                
                <div className="p-4 bg-primary/10 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {formatPrice(emi)}
                    </div>
                    <div className="text-sm text-muted-foreground">Monthly EMI</div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  <IndianRupee className="h-4 w-4 mr-2" />
                  Get Pre-approved
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}