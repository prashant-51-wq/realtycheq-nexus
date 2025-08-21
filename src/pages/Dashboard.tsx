import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Home, 
  Heart, 
  MessageSquare, 
  Calendar, 
  Star,
  Eye,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  Settings,
  Bell,
  FileText,
  DollarSign,
  Clock,
  Users,
  Award,
  Activity
} from 'lucide-react';

const dashboardStats = [
  { label: 'Saved Properties', value: '12', icon: Heart, change: '+3 this week' },
  { label: 'Property Views', value: '47', icon: Eye, change: '+12 this month' },
  { label: 'Inquiries Sent', value: '8', icon: MessageSquare, change: '3 pending replies' },
  { label: 'Site Visits', value: '5', icon: Calendar, change: 'Next: Tomorrow 2PM' }
];

const recentActivity = [
  {
    id: '1',
    type: 'property_view',
    title: 'Viewed luxury villa in Bandra West',
    time: '2 hours ago',
    icon: Eye,
    details: '₹4.5Cr • 3 BHK • Mumbai'
  },
  {
    id: '2',
    type: 'inquiry_sent',
    title: 'Inquiry sent for commercial space',
    time: '1 day ago',
    icon: MessageSquare,
    details: 'Office Space • Gurgaon • Response pending'
  },
  {
    id: '3',
    type: 'site_visit',
    title: 'Site visit scheduled',
    time: '2 days ago',
    icon: Calendar,
    details: 'Apartment in HSR Layout • Tomorrow 2PM'
  },
  {
    id: '4',
    type: 'property_saved',
    title: 'Saved independent house',
    time: '3 days ago',
    icon: Heart,
    details: '₹1.2Cr • 4 BHK • Pune'
  }
];

const savedProperties = [
  {
    id: '1',
    title: 'Luxury Villa in Bandra West',
    price: 45000000,
    location: 'Bandra West, Mumbai',
    type: '3 BHK Villa',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    status: 'Available',
    lastViewed: '2 hours ago'
  },
  {
    id: '2',
    title: 'Modern Apartment in HSR Layout',
    price: 12000000,
    location: 'HSR Layout, Bangalore',
    type: '2 BHK Apartment',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    status: 'Visit Scheduled',
    lastViewed: '1 day ago'
  },
  {
    id: '3',
    title: 'Commercial Office Space',
    price: 25000000,
    location: 'Cyber City, Gurgaon',
    type: 'Office Space',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    status: 'Under Review',
    lastViewed: '2 days ago'
  }
];

const upcomingAppointments = [
  {
    id: '1',
    title: 'Site Visit - HSR Layout Apartment',
    date: 'Tomorrow',
    time: '2:00 PM',
    location: 'HSR Layout, Bangalore',
    contact: 'Rajesh Kumar',
    phone: '+91 98765 43210'
  },
  {
    id: '2',
    title: 'Virtual Tour - Bandra Villa',
    date: 'Dec 25',
    time: '11:00 AM',
    location: 'Online Meeting',
    contact: 'Priya Sharma',
    phone: '+91 87654 32109'
  }
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
    return `₹${price.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-hero-gradient border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" />
                <AvatarFallback>AK</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">Welcome back, Amit!</h1>
                <p className="text-muted-foreground">Premium Member since June 2023</p>
                <div className="flex items-center mt-1">
                  <Badge className="badge-choice">
                    <Star className="h-3 w-3 mr-1" />
                    Premium Member
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
                <Badge variant="destructive" className="ml-2">3</Badge>
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <Card key={index} className="card-premium">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold text-primary">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                  </div>
                  <stat.icon className="h-8 w-8 text-primary opacity-80" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="properties">Saved Properties</TabsTrigger>
            <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <Card className="card-premium">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                        <activity.icon className="h-5 w-5 text-primary mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">{activity.details}</p>
                          <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="card-premium">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button className="h-16 btn-premium flex-col">
                      <Home className="h-6 w-6 mb-2" />
                      Browse Properties
                    </Button>
                    <Button variant="outline" className="h-16 flex-col">
                      <MessageSquare className="h-6 w-6 mb-2" />
                      Contact Agent
                    </Button>
                    <Button variant="outline" className="h-16 flex-col">
                      <Calendar className="h-6 w-6 mb-2" />
                      Schedule Visit
                    </Button>
                    <Button variant="outline" className="h-16 flex-col">
                      <FileText className="h-6 w-6 mb-2" />
                      Get Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Appointments */}
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Upcoming Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <div className="flex-1">
                        <h3 className="font-semibold">{appointment.title}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Clock className="h-4 w-4 mr-1" />
                          {appointment.date} at {appointment.time}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-1" />
                          {appointment.location}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{appointment.contact}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Phone className="h-3 w-3 mr-1" />
                          {appointment.phone}
                        </div>
                        <Button size="sm" className="mt-2">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Contact
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="properties">
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2" />
                  Saved Properties ({savedProperties.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedProperties.map((property) => (
                    <Card key={property.id} className="hover-lift overflow-hidden">
                      <div className="aspect-video relative">
                        <img 
                          src={property.image} 
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                        <Badge 
                          className={`absolute top-2 right-2 ${
                            property.status === 'Available' ? 'bg-green-500' :
                            property.status === 'Visit Scheduled' ? 'bg-blue-500' :
                            'bg-orange-500'
                          }`}
                        >
                          {property.status}
                        </Badge>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold line-clamp-1">{property.title}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {property.location}
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div>
                            <div className="text-lg font-bold text-primary">
                              {formatPrice(property.price)}
                            </div>
                            <div className="text-xs text-muted-foreground">{property.type}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">Last viewed</div>
                            <div className="text-xs">{property.lastViewed}</div>
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-4">
                          <Button size="sm" className="flex-1">View Details</Button>
                          <Button size="sm" variant="outline">Contact</Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inquiries">
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  My Inquiries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No inquiries yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start browsing properties and send inquiries to connect with agents
                  </p>
                  <Button className="btn-premium">
                    Browse Properties
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments">
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  My Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="p-4 rounded-lg border border-border">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{appointment.title}</h3>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <Clock className="h-4 w-4 mr-1" />
                            {appointment.date} at {appointment.time}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-1" />
                            {appointment.location}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">Reschedule</Button>
                          <Button size="sm">Contact</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="card-premium">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <p className="text-muted-foreground">Amit Kumar</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-muted-foreground">amit.kumar@email.com</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <p className="text-muted-foreground">+91 98765 43210</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Location</label>
                    <p className="text-muted-foreground">Mumbai, Maharashtra</p>
                  </div>
                  <Button className="btn-premium">Edit Profile</Button>
                </CardContent>
              </Card>

              <Card className="card-premium">
                <CardHeader>
                  <CardTitle>Membership Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Current Plan</label>
                    <div className="flex items-center mt-1">
                      <Badge className="badge-choice">
                        <Star className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Member Since</label>
                    <p className="text-muted-foreground">June 15, 2023</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Next Billing</label>
                    <p className="text-muted-foreground">January 15, 2024</p>
                  </div>
                  <Button variant="outline">Upgrade Plan</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}