import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, 
  PlayCircle, 
  Download, 
  Clock, 
  User,
  TrendingUp,
  Search,
  Filter,
  Star,
  ArrowRight,
  Calendar,
  Video,
  FileText,
  Headphones,
  Award,
  Users,
  Target
} from 'lucide-react';

const learningCategories = [
  { id: 'all', name: 'All Resources', count: 247 },
  { id: 'guides', name: 'Guides', count: 89, icon: BookOpen },
  { id: 'videos', name: 'Video Courses', count: 45, icon: PlayCircle },
  { id: 'webinars', name: 'Webinars', count: 32, icon: Calendar },
  { id: 'podcasts', name: 'Podcasts', count: 28, icon: Headphones },
  { id: 'tools', name: 'Tools & Calculators', count: 53, icon: Target }
];

const featuredContent = [
  {
    id: '1',
    title: 'Complete Guide to Property Investment in India',
    description: 'Comprehensive guide covering everything from market analysis to legal formalities',
    type: 'Guide',
    duration: '45 min read',
    level: 'Intermediate',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Investment',
    featured: true,
    author: 'Dr. Rajesh Kumar'
  },
  {
    id: '2',
    title: 'Real Estate Market Trends 2024',
    description: 'Latest market insights and predictions for the upcoming year',
    type: 'Video Course',
    duration: '2.5 hours',
    level: 'Beginner',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Market Analysis',
    featured: true,
    author: 'Priya Sharma'
  },
  {
    id: '3',
    title: 'Home Loan Masterclass',
    description: 'Everything you need to know about home loans, EMIs, and documentation',
    type: 'Webinar',
    duration: '90 minutes',
    level: 'Beginner',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Finance',
    featured: false,
    author: 'Amit Gupta'
  }
];

const popularTopics = [
  'Property Valuation',
  'Legal Documentation',
  'Tax Benefits',
  'Investment Strategies',
  'Market Analysis',
  'Construction Quality',
  'Property Management',
  'RERA Compliance'
];

export default function Learn() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContent = featuredContent.filter(content => {
    const matchesSearch = !searchQuery || 
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-hero-gradient border-b border-border">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-display mb-4">Learn Real Estate</h1>
            <p className="text-subheadline mb-8">
              Master the art of real estate with expert-curated courses, guides, 
              and resources from industry professionals
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative mb-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search courses, guides, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">247</div>
                <div className="text-sm text-muted-foreground">Learning Resources</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">15k+</div>
                <div className="text-sm text-muted-foreground">Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">4.8★</div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">95%</div>
                <div className="text-sm text-muted-foreground">Completion Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Popular Topics */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Popular Topics</h2>
          <div className="flex flex-wrap gap-2">
            {popularTopics.map((topic, index) => (
              <Badge key={index} variant="secondary" className="hover:bg-primary hover:text-primary-foreground cursor-pointer">
                {topic}
              </Badge>
            ))}
          </div>
        </section>

        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-8">
            {learningCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center">
                {category.icon && <category.icon className="h-4 w-4 mr-2" />}
                <span className="hidden sm:inline">{category.name}</span>
                <span className="sm:hidden">{category.name.split(' ')[0]}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory}>
            {/* Featured Content */}
            <section className="mb-12">
              <h2 className="text-xl font-semibold mb-6">Featured Learning</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredContent.map((content) => (
                  <Card key={content.id} className="card-premium hover-lift overflow-hidden">
                    <div className="aspect-video relative">
                      <img 
                        src={content.image} 
                        alt={content.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <PlayCircle className="h-12 w-12 text-white" />
                      </div>
                      {content.featured && (
                        <Badge className="absolute top-2 left-2 badge-choice">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">{content.type}</Badge>
                            <Badge variant="outline">{content.level}</Badge>
                          </div>
                          <CardTitle className="text-lg line-clamp-2">{content.title}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {content.description}
                      </p>

                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {content.duration}
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-yellow-500" />
                          {content.rating}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center text-sm">
                          <User className="h-4 w-4 mr-1" />
                          {content.author}
                        </div>
                        <Badge variant="outline">{content.category}</Badge>
                      </div>

                      <div className="flex space-x-2">
                        <Button className="flex-1 btn-premium">
                          Start Learning
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </TabsContent>
        </Tabs>

        {/* Learning Paths */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-6">Learning Paths</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="card-premium hover-lift">
              <CardHeader>
                <Award className="h-10 w-10 text-primary mb-3" />
                <CardTitle>First-Time Homebuyer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Complete roadmap for buying your first home in India
                </p>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <span>12 Courses</span>
                  <span>6-8 weeks</span>
                </div>
                <Button className="w-full">Start Path</Button>
              </CardContent>
            </Card>

            <Card className="card-premium hover-lift">
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Property Investment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Master the fundamentals of real estate investment
                </p>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <span>18 Courses</span>
                  <span>8-10 weeks</span>
                </div>
                <Button className="w-full">Start Path</Button>
              </CardContent>
            </Card>

            <Card className="card-premium hover-lift">
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Real Estate Professional</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Advanced training for real estate professionals
                </p>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <span>25 Courses</span>
                  <span>12-16 weeks</span>
                </div>
                <Button className="w-full">Start Path</Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Tools & Calculators */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-6">Interactive Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="card-premium hover-lift text-center">
              <CardContent className="p-6">
                <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">EMI Calculator</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Calculate your home loan EMI instantly
                </p>
                <Button variant="outline" size="sm">Try Now</Button>
              </CardContent>
            </Card>

            <Card className="card-premium hover-lift text-center">
              <CardContent className="p-6">
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">ROI Calculator</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Estimate returns on property investment
                </p>
                <Button variant="outline" size="sm">Calculate</Button>
              </CardContent>
            </Card>

            <Card className="card-premium hover-lift text-center">
              <CardContent className="p-6">
                <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Tax Calculator</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Calculate property tax benefits
                </p>
                <Button variant="outline" size="sm">Calculate</Button>
              </CardContent>
            </Card>

            <Card className="card-premium hover-lift text-center">
              <CardContent className="p-6">
                <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Checklist Generator</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Property buying checklist
                </p>
                <Button variant="outline" size="sm">Generate</Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Newsletter Signup */}
        <Card className="card-premium text-center">
          <CardContent className="p-8">
            <h2 className="text-headline mb-4">Stay Updated</h2>
            <p className="text-subheadline mb-6 max-w-2xl mx-auto">
              Get the latest real estate insights, market trends, and learning resources 
              delivered to your inbox weekly
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input placeholder="Enter your email" className="flex-1" />
              <Button className="btn-premium">
                Subscribe
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}