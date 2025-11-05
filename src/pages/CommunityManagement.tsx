import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  MessageSquare, 
  Settings,
  Plus,
  Search,
  MoreHorizontal,
  Crown,
  Shield,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Pin,
  Flag,
  UserPlus,
  Activity
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Community {
  id: string;
  name: string;
  slug: string;
  description: string;
  location: string;
  category: string;
  admin_id: string;
  avatar_url: string;
  banner_url: string;
  member_count: number;
  visibility: string;
  join_approval: boolean;
  guidelines: string;
  created_at: string;
}

interface CommunityPost {
  id: string;
  community_id: string;
  author_id: string;
  title: string;
  content: string;
  post_type: string;
  images: string[];
  likes: number;
  comments_count: number;
  pinned: boolean;
  created_at: string;
}

interface CommunityMember {
  id: string;
  community_id: string;
  user_id: string;
  role: string;
  status: string;
  joined_at: string;
}

export default function CommunityManagement() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) {
      fetchMyCommunities();
    }
  }, [user]);

  useEffect(() => {
    if (selectedCommunity) {
      fetchCommunityData(selectedCommunity.id);
    }
  }, [selectedCommunity]);

  const fetchMyCommunities = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('admin_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCommunities(data || []);
      if (data && data.length > 0) {
        setSelectedCommunity(data[0]);
      }
    } catch (error) {
      console.error('Error fetching communities:', error);
      toast({
        title: "Error",
        description: "Failed to load communities.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCommunityData = async (communityId: string) => {
    try {
      // Fetch posts
      const { data: postsData, error: postsError } = await supabase
        .from('community_posts')
        .select('*')
        .eq('community_id', communityId)
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;
      setPosts(postsData || []);

      // Fetch members
      const { data: membersData, error: membersError } = await supabase
        .from('community_members')
        .select('*')
        .eq('community_id', communityId)
        .order('joined_at', { ascending: false });

      if (membersError) throw membersError;
      setMembers(membersData || []);
    } catch (error) {
      console.error('Error fetching community data:', error);
    }
  };

  const handleCreateCommunity = async () => {
    if (!user) return;
    
    // This would open a modal or navigate to create community page
    toast({
      title: "Create Community",
      description: "Feature coming soon!",
    });
  };

  const handleUpdateCommunity = async (updates: Partial<Community>) => {
    if (!selectedCommunity || !user) return;
    
    try {
      const { error } = await supabase
        .from('communities')
        .update(updates)
        .eq('id', selectedCommunity.id)
        .eq('admin_id', user.id);

      if (error) throw error;
      
      setSelectedCommunity({ ...selectedCommunity, ...updates });
      toast({
        title: "Success",
        description: "Community updated successfully.",
      });
    } catch (error) {
      console.error('Error updating community:', error);
      toast({
        title: "Error",
        description: "Failed to update community.",
        variant: "destructive",
      });
    }
  };

  const handlePinPost = async (postId: string, pinned: boolean) => {
    try {
      const { error } = await supabase
        .from('community_posts')
        .update({ pinned })
        .eq('id', postId);

      if (error) throw error;
      
      setPosts(prev => prev.map(post => 
        post.id === postId ? { ...post, pinned } : post
      ));
      
      toast({
        title: "Success",
        description: `Post ${pinned ? 'pinned' : 'unpinned'} successfully.`,
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

  const handleDeletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('community_posts')
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

  const handleMemberAction = async (memberId: string, action: 'promote' | 'demote' | 'remove') => {
    try {
      let updates: any = {};
      if (action === 'promote') updates.role = 'moderator';
      if (action === 'demote') updates.role = 'member';
      if (action === 'remove') {
        const { error } = await supabase
          .from('community_members')
          .delete()
          .eq('id', memberId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('community_members')
          .update(updates)
          .eq('id', memberId);
        if (error) throw error;
      }
      
      if (action === 'remove') {
        setMembers(prev => prev.filter(member => member.id !== memberId));
      } else {
        setMembers(prev => prev.map(member => 
          member.id === memberId ? { ...member, ...updates } : member
        ));
      }
      
      toast({
        title: "Success",
        description: `Member ${action}d successfully.`,
      });
    } catch (error) {
      console.error(`Error ${action}ing member:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action} member.`,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading communities...</p>
        </div>
      </div>
    );
  }

  if (communities.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">No Communities Yet</h2>
            <p className="text-muted-foreground mb-6">
              Create your first community to start building connections and sharing knowledge.
            </p>
            <Button onClick={handleCreateCommunity} className="btn-premium">
              <Plus className="h-4 w-4 mr-2" />
              Create Community
            </Button>
          </div>
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
              <h1 className="text-display mb-2">Community Management</h1>
              <p className="text-muted-foreground">
                Manage your communities, members, and content
              </p>
            </div>
            <Button onClick={handleCreateCommunity} className="btn-premium">
              <Plus className="h-4 w-4 mr-2" />
              Create Community
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Communities Sidebar */}
          <div className="lg:col-span-1">
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  My Communities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {communities.map((community) => (
                  <button
                    key={community.id}
                    onClick={() => setSelectedCommunity(community)}
                    className={`w-full text-left p-3 rounded-lg transition-all hover:bg-muted ${
                      selectedCommunity?.id === community.id 
                        ? 'bg-primary/10 border-2 border-primary' 
                        : 'border border-border'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{community.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {community.member_count} members
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedCommunity && (
              <div className="space-y-6">
                {/* Community Header */}
                <Card className="card-premium">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center">
                          <Users className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">{selectedCommunity.name}</h2>
                          <p className="text-muted-foreground">{selectedCommunity.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                            <span>{selectedCommunity.member_count} members</span>
                            <span>{selectedCommunity.location}</span>
                            <Badge variant={selectedCommunity.visibility === 'public' ? 'default' : 'secondary'}>
                              {selectedCommunity.visibility}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Management Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="posts">Posts</TabsTrigger>
                    <TabsTrigger value="members">Members</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="card-premium">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">Total Members</p>
                              <p className="text-2xl font-bold">{members.length}</p>
                            </div>
                            <Users className="h-8 w-8 text-primary" />
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="card-premium">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">Total Posts</p>
                              <p className="text-2xl font-bold">{posts.length}</p>
                            </div>
                            <MessageSquare className="h-8 w-8 text-primary" />
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="card-premium">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">This Month</p>
                              <p className="text-2xl font-bold">+{Math.floor(Math.random() * 20) + 5}</p>
                            </div>
                            <Activity className="h-8 w-8 text-primary" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Recent Activity */}
                    <Card className="card-premium">
                      <CardHeader>
                        <CardTitle>Recent Posts</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {posts.slice(0, 5).map((post) => (
                            <div key={post.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                              <div className="flex-1">
                                <p className="font-medium">{post.title || 'Untitled Post'}</p>
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                  {post.content}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <span>{post.likes} likes</span>
                                <span>{post.comments_count} comments</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="posts" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Manage Posts</h3>
                      <div className="flex items-center space-x-2">
                        <Input placeholder="Search posts..." className="w-64" />
                        <Button variant="outline" size="sm">
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {posts.map((post) => (
                        <Card key={post.id} className="card-premium">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  {post.pinned && (
                                    <Badge variant="secondary">
                                      <Pin className="h-3 w-3 mr-1" />
                                      Pinned
                                    </Badge>
                                  )}
                                  <Badge variant="outline">{post.post_type}</Badge>
                                </div>
                                <h4 className="font-medium mb-1">{post.title || 'Untitled Post'}</h4>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                  {post.content}
                                </p>
                                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                  <span>{post.likes} likes</span>
                                  <span>{post.comments_count} comments</span>
                                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handlePinPost(post.id, !post.pinned)}
                                >
                                  <Pin className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
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
                  </TabsContent>

                  <TabsContent value="members" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Manage Members</h3>
                      <div className="flex items-center space-x-2">
                        <Input placeholder="Search members..." className="w-64" />
                        <Button variant="outline" size="sm">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Invite
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {members.map((member) => (
                        <Card key={member.id} className="card-premium">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                                  <Users className="h-5 w-5" />
                                </div>
                                <div>
                                  <p className="font-medium">User {member.user_id.slice(0, 8)}</p>
                                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                    <Badge 
                                      variant={member.role === 'admin' ? 'default' : member.role === 'moderator' ? 'secondary' : 'outline'}
                                    >
                                      {member.role === 'admin' && <Crown className="h-3 w-3 mr-1" />}
                                      {member.role === 'moderator' && <Shield className="h-3 w-3 mr-1" />}
                                      {member.role}
                                    </Badge>
                                    <span>Joined {new Date(member.joined_at).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>
                              {member.role !== 'admin' && (
                                <div className="flex items-center space-x-1">
                                  {member.role === 'member' && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleMemberAction(member.id, 'promote')}
                                    >
                                      Promote
                                    </Button>
                                  )}
                                  {member.role === 'moderator' && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleMemberAction(member.id, 'demote')}
                                    >
                                      Demote
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleMemberAction(member.id, 'remove')}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="settings" className="space-y-6">
                    <Card className="card-premium">
                      <CardHeader>
                        <CardTitle>Community Settings</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Community Name</label>
                          <Input
                            value={selectedCommunity.name}
                            onChange={(e) => handleUpdateCommunity({ name: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Description</label>
                          <Textarea
                            value={selectedCommunity.description || ''}
                            onChange={(e) => handleUpdateCommunity({ description: e.target.value })}
                            rows={3}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Visibility</p>
                            <p className="text-sm text-muted-foreground">
                              {selectedCommunity.visibility === 'public' ? 'Anyone can find and join' : 'Invite only'}
                            </p>
                          </div>
                          <Button
                            variant={selectedCommunity.visibility === 'public' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleUpdateCommunity({ 
                              visibility: selectedCommunity.visibility === 'public' ? 'private' : 'public' 
                            })}
                          >
                            {selectedCommunity.visibility === 'public' ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          </Button>
                        </div>
                        <div className="pt-4 border-t">
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Community
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}