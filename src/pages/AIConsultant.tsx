import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bot, 
  Send, 
  Sparkles, 
  MessageSquare,
  User,
  Home,
  TrendingUp,
  Calculator,
  FileText,
  Mic,
  MicOff,
  Loader2,
  Brain
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ConsultationTopic {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const consultationTopics: ConsultationTopic[] = [
  {
    id: 'property-valuation',
    name: 'Property Valuation',
    description: 'Get AI-powered property value estimates',
    icon: <Calculator className="h-5 w-5" />,
    color: 'bg-blue-500'
  },
  {
    id: 'market-analysis',
    name: 'Market Analysis',
    description: 'Understand market trends and opportunities',
    icon: <TrendingUp className="h-5 w-5" />,
    color: 'bg-green-500'
  },
  {
    id: 'investment-advice',
    name: 'Investment Advice',
    description: 'Get personalized investment recommendations',
    icon: <Home className="h-5 w-5" />,
    color: 'bg-purple-500'
  },
  {
    id: 'legal-guidance',
    name: 'Legal Guidance',
    description: 'Understanding property laws and procedures',
    icon: <FileText className="h-5 w-5" />,
    color: 'bg-orange-500'
  }
];

export default function AIConsultant() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      createNewSession();
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const createNewSession = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('ai_sessions')
        .insert({
          user_id: user.id,
          session_type: selectedTopic || 'general',
          title: `AI Consultation - ${new Date().toLocaleDateString()}`,
          context: { topic: selectedTopic },
          messages: []
        })
        .select()
        .single();

      if (error) throw error;
      setSessionId(data.id);
      
      // Add welcome message
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        content: `Hello! I'm your AI real estate consultant. I can help you with ${selectedTopic ? consultationTopics.find(t => t.id === selectedTopic)?.name.toLowerCase() : 'various real estate topics'}. What would you like to know?`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Error creating session:', error);
      toast({
        title: "Error",
        description: "Failed to start consultation session.",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !user) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // In a real implementation, this would call an AI service
      // For now, we'll simulate an AI response
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: generateAIResponse(inputMessage, selectedTopic),
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);
      }, 2000);

      // Update session in database
      if (sessionId) {
        await supabase
          .from('ai_sessions')
          .update({
            messages: [...messages, userMessage].map(m => ({
              role: m.role,
              content: m.content,
              timestamp: m.timestamp.toISOString()
            })),
            updated_at: new Date().toISOString()
          })
          .eq('id', sessionId);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const generateAIResponse = (userInput: string, topic: string): string => {
    // This is a simplified AI response generator
    // In a real app, this would integrate with OpenAI, Claude, or similar
    const responses = {
      'property-valuation': [
        "Based on current market trends, I can help you estimate property values. Could you provide more details about the property location, size, and type?",
        "Property valuation depends on several factors including location, amenities, market conditions, and comparable sales. What specific property are you looking to value?"
      ],
      'market-analysis': [
        "The real estate market shows interesting trends. Which area or segment are you interested in analyzing?",
        "Current market indicators suggest varying trends across different property types and locations. What specific market analysis do you need?"
      ],
      'investment-advice': [
        "Real estate investment requires careful consideration of location, budget, and investment goals. What's your investment timeline and budget range?",
        "For investment advice, I'd need to understand your risk tolerance, investment amount, and preferred property type. Could you share more details?"
      ],
      'legal-guidance': [
        "Property transactions involve various legal aspects. Are you looking for information about documentation, registration, or compliance requirements?",
        "Legal guidance for real estate covers documentation, due diligence, and regulatory compliance. What specific legal aspect concerns you?"
      ]
    };

    const topicResponses = responses[topic as keyof typeof responses] || [
      "I understand you're asking about real estate. Could you provide more specific details so I can give you tailored advice?",
      "That's an interesting question about real estate. Let me provide you with some insights based on current market conditions and best practices."
    ];

    return topicResponses[Math.floor(Math.random() * topicResponses.length)];
  };

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopic(topicId);
    setMessages([]);
    createNewSession();
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, this would start/stop voice recording
    toast({
      title: isRecording ? "Recording Stopped" : "Recording Started",
      description: isRecording ? "Processing your voice message..." : "Speak your question...",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-hero-gradient border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Brain className="h-12 w-12 text-primary mr-4" />
              <h1 className="text-display">AI Real Estate Consultant</h1>
            </div>
            <p className="text-subheadline mb-8">
              Get instant, personalized advice on property investments, market trends, 
              valuations, and legal guidance powered by advanced AI
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Topics Sidebar */}
          <div className="lg:col-span-1">
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-primary" />
                  Consultation Topics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {consultationTopics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => handleTopicSelect(topic.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all hover:bg-muted ${
                      selectedTopic === topic.id ? 'bg-primary/10 border-2 border-primary' : 'border border-border'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`${topic.color} text-white p-2 rounded-lg flex-shrink-0`}>
                        {topic.icon}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{topic.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {topic.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="card-premium mt-6">
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Calculator className="h-4 w-4 mr-2" />
                  Property Calculator
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Market Reports
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Document Guide
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="card-premium h-[600px] flex flex-col">
              <CardHeader className="border-b border-border">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Bot className="h-5 w-5 mr-2 text-primary" />
                    AI Consultant Chat
                    {selectedTopic && (
                      <Badge variant="secondary" className="ml-2">
                        {consultationTopics.find(t => t.id === selectedTopic)?.name}
                      </Badge>
                    )}
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setMessages([]);
                      setSelectedTopic('');
                      createNewSession();
                    }}
                  >
                    New Chat
                  </Button>
                </div>
              </CardHeader>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground ml-4'
                            : 'bg-muted mr-4'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {message.role === 'assistant' && (
                            <Bot className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          )}
                          {message.role === 'user' && (
                            <User className="h-5 w-5 text-primary-foreground flex-shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg p-3 mr-4">
                        <div className="flex items-center space-x-2">
                          <Bot className="h-5 w-5 text-primary" />
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>

              {/* Input Area */}
              <div className="border-t border-border p-4">
                <div className="flex space-x-2">
                  <div className="flex-1 relative">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ask me anything about real estate..."
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      disabled={isTyping}
                      className="pr-12"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleRecording}
                      className={`absolute right-1 top-1/2 -translate-y-1/2 ${
                        isRecording ? 'text-red-500' : 'text-muted-foreground'
                      }`}
                    >
                      {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="btn-premium"
                  >
                    {isTyping ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  AI responses are for informational purposes only. Please consult with qualified professionals for specific advice.
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12">
          <h2 className="text-headline text-center mb-8">AI Consultant Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="card-premium text-center">
              <CardContent className="p-6">
                <Calculator className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Property Valuation</h3>
                <p className="text-sm text-muted-foreground">
                  Get instant property value estimates based on market data
                </p>
              </CardContent>
            </Card>
            <Card className="card-premium text-center">
              <CardContent className="p-6">
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Market Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Understand trends, demand, and growth opportunities
                </p>
              </CardContent>
            </Card>
            <Card className="card-premium text-center">
              <CardContent className="p-6">
                <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Smart Recommendations</h3>
                <p className="text-sm text-muted-foreground">
                  Personalized advice based on your goals and preferences
                </p>
              </CardContent>
            </Card>
            <Card className="card-premium text-center">
              <CardContent className="p-6">
                <MessageSquare className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">24/7 Availability</h3>
                <p className="text-sm text-muted-foreground">
                  Get instant answers anytime, anywhere
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}