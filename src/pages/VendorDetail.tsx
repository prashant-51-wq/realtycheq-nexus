import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  Shield, 
  Phone, 
  Mail, 
  Globe, 
  CheckCircle, 
  Award, 
  Calendar, 
  Users, 
  MessageSquare, 
  Heart, 
  Share2, 
  Flag,
  ExternalLink,
  Download,
  Building2,
  Clock,
  TrendingUp
} from 'lucide-react';
import { mockVendors } from '@/data/mockData';
import { useAnalytics } from '@/lib/hooks/useAnalytics';

export default function VendorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { track } = useAnalytics();
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const found = mockVendors.find(v => v.id === id);
        if (found) {
          setVendor({
            ...found,
            contact: {
              phone: '+91 98765 43210',
              email: 'contact@vendor.com',
              website: 'www.vendor.com'
            },
            stats: {
              projectsCompleted: 127,
              clientsServed: 89,
              yearsExperience: 8,
              responseTime: '2 hours',
              onTimeDelivery: 96,
              repeatClients: 78
            },
            services: [
              { name: 'Complete Home Interior', price: 250000, duration: '45-60 days' },
              { name: '3D Visualization', price: 15000, duration: '7-10 days' },
              { name: 'Space Planning', price: 35000, duration: '15-20 days' },
              { name: 'Furniture Design', price: 85000, duration: '30-40 days' }
            ],
            reviews: [
              {
                id: '1',
                client: 'Priya Sharma',
                avatar: '',
                rating: 5,
                date: '2024-01-15',
                project: '3BHK Interior Design',
                comment: 'Exceptional work quality and timely delivery. The team was professional and understood our requirements perfectly.'
              },
              {
                id: '2',
                client: 'Amit Kumar',
                avatar: '',
                rating: 5,
                date: '2024-01-02',
                project: 'Office Interior',
                comment: 'Great attention to detail and excellent project management. Highly recommend for commercial projects.'
              }
            ],
            certifications: [
              { name: 'Certified Interior Designer', authority: 'IIID', year: '2020' },
              { name: 'Green Building Certification', authority: 'IGBC', year: '2021' },
              { name: 'Project Management Professional', authority: 'PMI', year: '2019' }
            ]
          });
          
          track('view_vendor', {
            vendor_id: id,
            vendor_type: found.type,
            location: found.location.city
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load vendor details.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, [id, track]);

  const handleSave = () => {
    setSaved(!saved);
    toast({
      title: saved ? "Removed from favorites" : "Added to favorites",
      description: saved ? "Vendor removed from your favorites." : "Vendor added to your favorites."
    });
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: vendor?.name,
        text: `Check out ${vendor?.name} - ${vendor?.type}`,
        url: window.location.href
      });
    } catch (error) {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Vendor profile link copied to clipboard."
      });
    }
  };

  const handleContact = () => {
    track('contact_vendor', {
      vendor_id: id,
      vendor_type: vendor?.type
    });
    toast({
      title: "Contact Information",
      description: "Opening contact modal...",
    });
  };

  const handleHire = () => {
    track('hire_vendor', {
      vendor_id: id,
      vendor_type: vendor?.type
    });
    toast({
      title: "Hire Process Started",
      description: "Redirecting to project details form...",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Vendor Not Found</h2>
          <p className="text-muted-foreground mb-4">The vendor you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/vendors')}>
            Back to Vendors
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/vendors')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Vendors
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Heart className={`h-4 w-4 mr-2 ${saved ? 'fill-current' : ''}`} />
                {saved ? 'Saved' : 'Save'}
              </Button>
              <Button variant="outline" size="sm">
                <Flag className="h-4 w-4 mr-2" />
                Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vendor Header */}
            <Card className="card-premium">
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={vendor.portfolio[0]?.images[0]} alt={vendor.name} />
                    <AvatarFallback className="text-lg">
                      {vendor.name.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-2xl">{vendor.name}</CardTitle>
                      {vendor.verified && (
                        <CheckCircle className="h-6 w-6 text-primary" />
                      )}
                      <Badge variant="secondary" className="ml-2">Verified</Badge>
                    </div>
                    <p className="text-lg text-muted-foreground mb-2">{vendor.type}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {vendor.location.city}
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1 text-primary" />
                        {vendor.rating} rating
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {vendor.stats?.projectsCompleted}+ projects
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {vendor.specializations.slice(0, 4).map((spec: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                      {vendor.specializations.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{vendor.specializations.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Tabs Content */}
            <Tabs defaultValue="overview">
              <TabsList className="w-full">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      Professional {vendor.type.toLowerCase()} with {vendor.stats?.yearsExperience} years of experience in delivering 
                      exceptional design solutions. Specialized in residential and commercial projects with a focus on 
                      modern, functional, and aesthetically pleasing spaces.
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{vendor.stats?.projectsCompleted}</div>
                        <div className="text-sm text-muted-foreground">Projects</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{vendor.stats?.clientsServed}</div>
                        <div className="text-sm text-muted-foreground">Clients</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{vendor.stats?.yearsExperience}+</div>
                        <div className="text-sm text-muted-foreground">Years Exp.</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{vendor.stats?.onTimeDelivery}%</div>
                        <div className="text-sm text-muted-foreground">On-Time</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Certifications & Licenses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {vendor.certifications?.map((cert: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Award className="h-6 w-6 text-primary" />
                            <div>
                              <div className="font-medium">{cert.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {cert.authority} • {cert.year}
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="portfolio" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {vendor.portfolio.map((project: any, index: number) => (
                    <Card key={index} className="overflow-hidden hover-lift">
                      <div className="aspect-video bg-muted relative">
                        {project.images[0] && (
                          <img
                            src={project.images[0]}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button variant="secondary">View Details</Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">{project.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                        <div className="flex items-center justify-between text-sm">
                          <Badge variant="secondary">{project.category}</Badge>
                          <span className="text-muted-foreground">{project.completedAt}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="services" className="space-y-6">
                <div className="grid gap-4">
                  {vendor.services?.map((service: any, index: number) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-2">{service.name}</h3>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {service.duration}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-primary">
                              ₹{service.price.toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">Starting from</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                <div className="space-y-4">
                  {vendor.reviews?.map((review: any) => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <Avatar>
                            <AvatarImage src={review.avatar} alt={review.client} />
                            <AvatarFallback>
                              {review.client.split(' ').map((n: string) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h4 className="font-medium">{review.client}</h4>
                                <p className="text-sm text-muted-foreground">{review.project}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating
                                          ? 'text-primary fill-current'
                                          : 'text-muted-foreground'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-muted-foreground">{review.date}</span>
                              </div>
                            </div>
                            <p className="text-muted-foreground">{review.comment}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Card */}
            <Card className="card-premium">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-2">
                      ₹{vendor.pricing?.consultation?.toLocaleString() || '50,000'}
                    </div>
                    <div className="text-sm text-muted-foreground">Starting from</div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Response Time</span>
                      <span className="font-medium">{vendor.stats?.responseTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">On-Time Delivery</span>
                      <span className="font-medium">{vendor.stats?.onTimeDelivery}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Repeat Clients</span>
                      <span className="font-medium">{vendor.stats?.repeatClients}%</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Button className="w-full btn-premium" onClick={handleHire}>
                      Hire Now
                    </Button>
                    <Button variant="outline" className="w-full" onClick={handleContact}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Get Quote
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{vendor.contact?.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{vendor.contact?.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{vendor.contact?.website}</span>
                </div>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <Card>
              <CardHeader>
                <CardTitle>Trust & Safety</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Verified Professional</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Background Checked</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Award className="h-4 w-4 text-primary" />
                  <span>Licensed & Insured</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span>Top Rated Vendor</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}