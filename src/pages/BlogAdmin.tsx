import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Save,
  Upload,
  Search,
  Filter,
  Star,
  Calendar,
  TrendingUp,
  BookOpen,
  Tag,
  Image as ImageIcon
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string;
  author_id: string;
  category: string;
  tags: string[];
  published: boolean;
  featured: boolean;
  views: number;
  created_at: string;
  updated_at: string;
}

const blogCategories = [
  'general',
  'market-insights',
  'investment-tips', 
  'design-trends',
  'legal-guide',
  'technology'
];

export default function BlogAdmin() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // New/Edit post form
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image: '',
    category: 'general',
    tags: [] as string[],
    published: false,
    featured: false
  });

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  const fetchPosts = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('author_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to load blog posts.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'title' && !editingPost) {
        updated.slug = generateSlug(value);
      }
      return updated;
    });
  };

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    handleInputChange('tags', tags);
  };

  const handleSavePost = async () => {
    if (!user) return;
    
    try {
      const postData = {
        ...formData,
        author_id: user.id,
        updated_at: new Date().toISOString()
      };

      if (editingPost) {
        // Update existing post
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', editingPost.id);

        if (error) throw error;
        
        setPosts(prev => prev.map(post => 
          post.id === editingPost.id ? { ...post, ...postData } : post
        ));
        
        toast({
          title: "Success",
          description: "Post updated successfully.",
        });
      } else {
        // Create new post
        const { data, error } = await supabase
          .from('blog_posts')
          .insert([postData])
          .select()
          .single();

        if (error) throw error;
        
        setPosts(prev => [data, ...prev]);
        
        toast({
          title: "Success",
          description: "Post created successfully.",
        });
      }
      
      setShowEditor(false);
      setEditingPost(null);
      setFormData({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        featured_image: '',
        category: 'general',
        tags: [],
        published: false,
        featured: false
      });
    } catch (error) {
      console.error('Error saving post:', error);
      toast({
        title: "Error",
        description: "Failed to save post.",
        variant: "destructive",
      });
    }
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || '',
      featured_image: post.featured_image || '',
      category: post.category,
      tags: post.tags || [],
      published: post.published,
      featured: post.featured
    });
    setShowEditor(true);
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
      
      setPosts(prev => prev.filter(post => post.id !== postId));
      toast({
        title: "Success",
        description: "Post deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: "Failed to delete post.",
        variant: "destructive",
      });
    }
  };

  const handleTogglePublished = async (postId: string, published: boolean) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ published })
        .eq('id', postId);

      if (error) throw error;
      
      setPosts(prev => prev.map(post => 
        post.id === postId ? { ...post, published } : post
      ));
      
      toast({
        title: "Success",
        description: `Post ${published ? 'published' : 'unpublished'} successfully.`,
      });
    } catch (error) {
      console.error('Error updating post:', error);
      toast({
        title: "Error",
        description: "Failed to update post.",
        variant: "destructive",
      });
    }
  };

  const handleToggleFeatured = async (postId: string, featured: boolean) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ featured })
        .eq('id', postId);

      if (error) throw error;
      
      setPosts(prev => prev.map(post => 
        post.id === postId ? { ...post, featured } : post
      ));
      
      toast({
        title: "Success",
        description: `Post ${featured ? 'featured' : 'unfeatured'} successfully.`,
      });
    } catch (error) {
      console.error('Error updating post:', error);
      toast({
        title: "Error",
        description: "Failed to update post.",
        variant: "destructive",
      });
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || post.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'published' && post.published) ||
      (filterStatus === 'draft' && !post.published) ||
      (filterStatus === 'featured' && post.featured);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    total: posts.length,
    published: posts.filter(p => p.published).length,
    drafts: posts.filter(p => !p.published).length,
    featured: posts.filter(p => p.featured).length,
    totalViews: posts.reduce((sum, p) => sum + p.views, 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading blog admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-hero-gradient border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-display mb-2">Blog Admin</h1>
              <p className="text-muted-foreground">
                Manage your blog posts and content
              </p>
            </div>
            <Button 
              onClick={() => setShowEditor(true)} 
              className="btn-premium"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card className="card-premium text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Posts</div>
            </CardContent>
          </Card>
          <Card className="card-premium text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.published}</div>
              <div className="text-sm text-muted-foreground">Published</div>
            </CardContent>
          </Card>
          <Card className="card-premium text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">{stats.drafts}</div>
              <div className="text-sm text-muted-foreground">Drafts</div>
            </CardContent>
          </Card>
          <Card className="card-premium text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">{stats.featured}</div>
              <div className="text-sm text-muted-foreground">Featured</div>
            </CardContent>
          </Card>
          <Card className="card-premium text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">{stats.totalViews.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Views</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="posts">All Posts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-6">
            {/* Filters */}
            <Card className="card-premium">
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search posts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64"
                    />
                  </div>
                  
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {blogCategories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="featured">Featured</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    More Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Posts List */}
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="card-premium">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant={post.published ? 'default' : 'secondary'}>
                            {post.published ? 'Published' : 'Draft'}
                          </Badge>
                          {post.featured && (
                            <Badge variant="outline">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                          <Badge variant="outline">{post.category}</Badge>
                        </div>
                        
                        <h3 className="text-lg font-semibold mb-1">{post.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {post.excerpt || post.content.substring(0, 150) + '...'}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <Eye className="h-3 w-3 mr-1" />
                            {post.views} views
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(post.created_at).toLocaleDateString()}
                          </div>
                          {post.tags.length > 0 && (
                            <div className="flex items-center">
                              <Tag className="h-3 w-3 mr-1" />
                              {post.tags.length} tags
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTogglePublished(post.id, !post.published)}
                        >
                          {post.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleFeatured(post.id, !post.featured)}
                        >
                          <Star className={`h-4 w-4 ${post.featured ? 'fill-current text-primary' : ''}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditPost(post)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No posts found</h3>
                <p className="text-muted-foreground mb-4">
                  {posts.length === 0 
                    ? "Create your first blog post to get started."
                    : "Try adjusting your search or filters."
                  }
                </p>
                <Button onClick={() => setShowEditor(true)} className="btn-premium">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Post
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Blog Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Analytics features coming soon! Track your blog performance, view insights, and more.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="card-premium">
              <CardHeader>
                <CardTitle>Blog Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Blog settings and configuration options coming soon!
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Post Editor Modal/Overlay */}
        {showEditor && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto card-premium">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{editingPost ? 'Edit Post' : 'Create New Post'}</span>
                  <Button variant="ghost" onClick={() => setShowEditor(false)}>
                    ×
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Title *</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter post title"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Slug *</label>
                    <Input
                      value={formData.slug}
                      onChange={(e) => handleInputChange('slug', e.target.value)}
                      placeholder="post-url-slug"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Excerpt</label>
                  <Textarea
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    placeholder="Brief description of your post"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Content *</label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Write your blog post content here..."
                    rows={10}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {blogCategories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Tags</label>
                    <Input
                      value={formData.tags.join(', ')}
                      onChange={(e) => handleTagsChange(e.target.value)}
                      placeholder="tag1, tag2, tag3"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Featured Image URL</label>
                  <div className="flex space-x-2">
                    <Input
                      value={formData.featured_image}
                      onChange={(e) => handleInputChange('featured_image', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                    <Button variant="outline">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.published}
                      onChange={(e) => handleInputChange('published', e.target.checked)}
                    />
                    <span className="text-sm">Publish immediately</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => handleInputChange('featured', e.target.checked)}
                    />
                    <span className="text-sm">Feature this post</span>
                  </label>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setShowEditor(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSavePost} className="btn-premium">
                    <Save className="h-4 w-4 mr-2" />
                    {editingPost ? 'Update Post' : 'Create Post'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}