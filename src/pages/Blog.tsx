import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Calendar, 
  User, 
  Eye, 
  Search,
  BookOpen,
  TrendingUp,
  Clock,
  Tag
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const blogCategories = [
  { id: 'all', name: 'All Posts', count: 0 },
  { id: 'market-insights', name: 'Market Insights', count: 0 },
  { id: 'investment-tips', name: 'Investment Tips', count: 0 },
  { id: 'design-trends', name: 'Design Trends', count: 0 },
  { id: 'legal-guide', name: 'Legal Guide', count: 0 },
  { id: 'technology', name: 'Technology', count: 0 }
];

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  author_id: string;
  category: string;
  tags: string[];
  published: boolean;
  featured: boolean;
  views: number;
  created_at: string;
  profiles?: {
    name: string;
    avatar_url: string;
  } | null;
}

export default function Blog() {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const allPosts = data || [];
      setPosts(allPosts as BlogPost[]);
      setFeaturedPosts(allPosts.filter(post => post.featured).slice(0, 3) as BlogPost[]);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast({
        title: "Error",
        description: "Failed to load blog posts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    const matchesSearch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-hero-gradient border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-display mb-4">Real Estate Insights</h1>
            <p className="text-subheadline mb-8">
              Stay informed with the latest market trends, investment tips, 
              and expert insights from industry professionals
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search articles by title, content, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-headline mb-6 flex items-center">
              <TrendingUp className="h-6 w-6 mr-2 text-primary" />
              Featured Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPosts.map((post) => (
                <Card key={post.id} className="card-premium hover-lift overflow-hidden">
                  {post.featured_image && (
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={post.featured_image} 
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="default" className="bg-primary text-primary-foreground">
                        Featured
                      </Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Eye className="h-3 w-3 mr-1" />
                        {post.views}
                      </div>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">
                      <Link to={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                        {post.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <User className="h-3 w-3 mr-1" />
                        Author
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(post.created_at)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="grid w-full grid-cols-6 mb-8">
            {blogCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                Array(9).fill(0).map((_, i) => (
                  <Card key={i} className="card-premium">
                    <CardHeader>
                      <div className="aspect-video bg-gray-200 rounded animate-pulse mb-4" />
                      <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-16 bg-gray-200 rounded animate-pulse mb-4" />
                      <div className="flex justify-between">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                filteredPosts.map((post) => (
                  <Card key={post.id} className="card-premium hover-lift overflow-hidden">
                    {post.featured_image && (
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={post.featured_image} 
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary">
                          {post.category.replace('-', ' ')}
                        </Badge>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Eye className="h-3 w-3 mr-1" />
                          {post.views}
                        </div>
                      </div>
                      <CardTitle className="text-lg line-clamp-2">
                        <Link to={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                          {post.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {post.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              <Tag className="h-2 w-2 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                          {post.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{post.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <User className="h-3 w-3 mr-1" />
                          Author
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(post.created_at)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        {filteredPosts.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No articles found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or category filters
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="mt-16">
          <Card className="card-premium text-center">
            <CardContent className="p-8">
              <h2 className="text-headline mb-4">Stay Updated</h2>
              <p className="text-subheadline mb-6 max-w-2xl mx-auto">
                Subscribe to our newsletter and get the latest real estate insights 
                delivered directly to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input placeholder="Enter your email" className="flex-1" />
                <Button className="btn-premium">
                  Subscribe
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}