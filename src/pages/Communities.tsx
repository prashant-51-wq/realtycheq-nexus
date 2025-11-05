import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  FileText, 
  Vote, 
  TrendingUp,
  MapPin,
  Crown,
  Clock,
  CheckCircle,
  ArrowLeft,
  Home,
  UserCheck
} from 'lucide-react';
import { mockCommunities } from '@/data/mockData';

export default function Communities() {
  const [selectedCommunity, setSelectedCommunity] = useState(mockCommunities[0]);

  const getVotePercentage = (proposal: any) => {
    const totalVotes = proposal.votes.length;
    const forVotes = proposal.votes.filter((v: any) => v.choice === 'for').length;
    return totalVotes > 0 ? Math.round((forVotes / totalVotes) * 100) : 0;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="container mx-auto px-4 py-6">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
          <Link to="/" className="hover:text-primary flex items-center">
            <Home className="h-3 w-3 mr-1" />
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground">Communities</span>
        </nav>
        <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </div>

      {/* Hero Section */}
      <div className="bg-hero-gradient border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-display mb-4 flex items-center justify-center">
              <UserCheck className="h-12 w-12 mr-4 text-white" />
              Community Hubs
            </h1>
            <p className="text-subheadline mb-8">
              Connect with local property owners, investors, and professionals. 
              Participate in community governance and opportunities.
            </p>
            <div className="flex justify-center">
              <Button className="btn-hero text-lg px-8 py-3">
                <Users className="h-5 w-5 mr-2" />
                Join Your Community
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Community List */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4">Communities</h2>
            <div className="space-y-3">
              {mockCommunities.map((community) => (
                <Card 
                  key={community.id}
                  className={`cursor-pointer hover-lift ${
                    selectedCommunity.id === community.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedCommunity(community)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-sm">{community.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {community.memberCount}
                      </Badge>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground mb-2">
                      <MapPin className="h-3 w-3 mr-1" />
                      {community.city}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Crown className="h-3 w-3 mr-1" />
                      {community.manager}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Community Content */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold">{selectedCommunity.name}</h1>
                  <p className="text-muted-foreground">{selectedCommunity.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {selectedCommunity.memberCount.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Members</div>
                </div>
              </div>

              {/* Community Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Vote className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-lg font-bold">{selectedCommunity.proposals.length}</div>
                    <div className="text-xs text-muted-foreground">Active Proposals</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-lg font-bold">{selectedCommunity.events.length}</div>
                    <div className="text-xs text-muted-foreground">Upcoming Events</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-lg font-bold">{selectedCommunity.opportunities.length}</div>
                    <div className="text-xs text-muted-foreground">Opportunities</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-lg font-bold">92%</div>
                    <div className="text-xs text-muted-foreground">Engagement</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Tabs defaultValue="proposals" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="proposals">
                  <Vote className="h-4 w-4 mr-2" />
                  Proposals
                </TabsTrigger>
                <TabsTrigger value="events">
                  <Calendar className="h-4 w-4 mr-2" />
                  Events
                </TabsTrigger>
                <TabsTrigger value="opportunities">
                  <FileText className="h-4 w-4 mr-2" />
                  Opportunities
                </TabsTrigger>
                <TabsTrigger value="feed">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Feed
                </TabsTrigger>
              </TabsList>

              <TabsContent value="proposals" className="space-y-4">
                {selectedCommunity.proposals.map((proposal) => (
                  <Card key={proposal.id} className="card-premium">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{proposal.title}</CardTitle>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge 
                              variant={proposal.status === 'active' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {proposal.status.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {proposal.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary">
                            {getVotePercentage(proposal)}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {proposal.votes.length} votes
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{proposal.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          Ends {new Date(proposal.deadline).toLocaleDateString()}
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button size="sm" className="btn-premium">
                            Vote Now
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="events" className="space-y-4">
                {selectedCommunity.events.map((event) => (
                  <Card key={event.id} className="card-premium">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                          <p className="text-muted-foreground mb-4">{event.description}</p>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                              {new Date(event.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                              {event.location}
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                              {event.attendees}/{event.maxAttendees} attending
                            </div>
                          </div>
                        </div>
                        <Button className="btn-premium">
                          Register
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="opportunities" className="space-y-4">
                <Card className="card-premium">
                  <CardContent className="p-6 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Community Opportunities</h3>
                    <p className="text-muted-foreground mb-4">
                      Discover exclusive opportunities shared by community members
                    </p>
                    <Button className="btn-premium">
                      Browse Opportunities
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="feed" className="space-y-4">
                <Card className="card-premium">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold">Community Manager</span>
                          <Badge variant="secondary" className="text-xs">Manager</Badge>
                          <span className="text-xs text-muted-foreground">2 hours ago</span>
                        </div>
                        <p className="text-muted-foreground mb-3">
                          Welcome to our growing community! We're excited to announce new verification 
                          processes and exclusive member benefits coming soon.
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <button className="hover:text-primary">Like (12)</button>
                          <button className="hover:text-primary">Comment (3)</button>
                          <button className="hover:text-primary">Share</button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-premium">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">AP</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold">Amit Patel</span>
                          <Badge variant="outline" className="text-xs">Investor</Badge>
                          <span className="text-xs text-muted-foreground">1 day ago</span>
                        </div>
                        <p className="text-muted-foreground mb-3">
                          Just completed my property verification through RealtyCheq. 
                          The process was seamless and the report was very detailed. Highly recommend!
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <button className="hover:text-primary">Like (8)</button>
                          <button className="hover:text-primary">Comment (2)</button>
                          <button className="hover:text-primary">Share</button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}