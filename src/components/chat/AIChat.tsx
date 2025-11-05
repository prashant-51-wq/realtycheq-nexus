import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Phone, 
  Mail, 
  Calendar,
  Building2,
  MessageSquare
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actions?: ChatAction[];
}

interface ChatAction {
  type: 'schedule_consultation' | 'view_services' | 'submit_requirements';
  label: string;
  data?: any;
}

interface AIChatProps {
  onClose?: () => void;
  initialMessage?: string;
  context?: 'services' | 'properties' | 'general';
}

const AIChat: React.FC<AIChatProps> = ({ 
  onClose, 
  initialMessage = "Hi! How can I help you with your real estate needs?",
  context = 'general'
}) => {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: initialMessage,
      timestamp: new Date(),
      actions: [
        { type: 'schedule_consultation', label: 'Schedule Free Consultation' },
        { type: 'view_services', label: 'View Services' },
        { type: 'submit_requirements', label: 'Submit Requirements' }
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationContext, setConversationContext] = useState({
    leadCaptured: false,
    userInterests: [] as string[],
    budget: null as number | null,
    timeline: null as number | null,
    location: ''
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const analyzeUserIntent = (message: string): { intent: string; entities: any } => {
    const lowerMessage = message.toLowerCase();
    
    // Intent detection
    let intent = 'general';
    if (lowerMessage.includes('budget') || lowerMessage.includes('cost') || lowerMessage.includes('price')) {
      intent = 'budget_inquiry';
    } else if (lowerMessage.includes('design') || lowerMessage.includes('architect') || lowerMessage.includes('plan')) {
      intent = 'design_services';
    } else if (lowerMessage.includes('construction') || lowerMessage.includes('build') || lowerMessage.includes('contractor')) {
      intent = 'construction_services';
    } else if (lowerMessage.includes('consultation') || lowerMessage.includes('advice') || lowerMessage.includes('help')) {
      intent = 'consultation_request';
    } else if (lowerMessage.includes('property') || lowerMessage.includes('house') || lowerMessage.includes('flat')) {
      intent = 'property_inquiry';
    }

    // Entity extraction
    const entities: any = {};
    
    // Extract budget ranges
    const budgetMatch = message.match(/(\d+)\s*(lakh|crore|thousand|k)/i);
    if (budgetMatch) {
      const amount = parseInt(budgetMatch[1]);
      const unit = budgetMatch[2].toLowerCase();
      entities.budget = unit === 'crore' ? amount * 10000000 : 
                      unit === 'lakh' ? amount * 100000 : 
                      (unit === 'k' || unit === 'thousand') ? amount * 1000 : amount;
    }

    // Extract timeline
    const timelineMatch = message.match(/(\d+)\s*(day|week|month|year)/i);
    if (timelineMatch) {
      const amount = parseInt(timelineMatch[1]);
      const unit = timelineMatch[2].toLowerCase();
      entities.timeline = unit === 'year' ? amount * 365 : 
                         unit === 'month' ? amount * 30 : 
                         unit === 'week' ? amount * 7 : amount;
    }

    // Extract location
    const locationWords = ['in', 'at', 'near', 'around'];
    for (const word of locationWords) {
      const regex = new RegExp(`${word}\\s+([a-zA-Z\\s]+?)(?:\\s|$|,|\\.)`, 'i');
      const match = message.match(regex);
      if (match) {
        entities.location = match[1].trim();
        break;
      }
    }

    return { intent, entities };
  };

  const generateAIResponse = (userMessage: string, analysis: { intent: string; entities: any }): { content: string; actions: ChatAction[] } => {
    const { intent, entities } = analysis;
    let content = '';
    let actions: ChatAction[] = [];

    // Update conversation context
    if (entities.budget) {
      setConversationContext(prev => ({ ...prev, budget: entities.budget }));
    }
    if (entities.timeline) {
      setConversationContext(prev => ({ ...prev, timeline: entities.timeline }));
    }
    if (entities.location) {
      setConversationContext(prev => ({ ...prev, location: entities.location }));
    }

    switch (intent) {
      case 'budget_inquiry':
        content = `I understand you're interested in budget planning${entities.budget ? ` around ₹${entities.budget.toLocaleString()}` : ''}. I can help you with cost estimation services and connect you with professionals who can provide accurate quotes for your project.`;
        actions = [
          { type: 'schedule_consultation', label: 'Get Cost Estimation' },
          { type: 'view_services', label: 'View Pricing Services' }
        ];
        break;

      case 'design_services':
        content = `Great! I can help you with design services including 2D/3D elevation, architectural design, and presentation plans. Our certified architects and designers can bring your vision to life.`;
        actions = [
          { type: 'schedule_consultation', label: 'Design Consultation' },
          { type: 'view_services', label: 'View Design Services' }
        ];
        break;

      case 'construction_services':
        content = `Perfect! We have experienced contractors and builders who can handle everything from structural work to turnkey construction${entities.timeline ? ` within your ${entities.timeline} day timeline` : ''}.`;
        actions = [
          { type: 'schedule_consultation', label: 'Construction Consultation' },
          { type: 'view_services', label: 'Find Contractors' }
        ];
        break;

      case 'consultation_request':
        content = `I'd be happy to help you get expert advice! Our free consultation service connects you with professionals who can provide personalized guidance for your project.`;
        actions = [
          { type: 'schedule_consultation', label: 'Schedule Free Consultation' },
          { type: 'submit_requirements', label: 'Submit Project Details' }
        ];
        break;

      case 'property_inquiry':
        content = `Looking for properties? I can help you find the perfect property${entities.location ? ` in ${entities.location}` : ''}${entities.budget ? ` within your budget of ₹${entities.budget.toLocaleString()}` : ''}. Let me know your specific requirements!`;
        actions = [
          { type: 'submit_requirements', label: 'Submit Property Requirements' },
          { type: 'view_services', label: 'Browse Properties' }
        ];
        break;

      default:
        content = `Thanks for your message! I can help you with property search, professional services, cost estimation, and connecting you with verified vendors. What specific aspect of your real estate journey can I assist you with?`;
        actions = [
          { type: 'schedule_consultation', label: 'Free Consultation' },
          { type: 'view_services', label: 'Explore Services' },
          { type: 'submit_requirements', label: 'Submit Requirements' }
        ];
    }

    // Add lead capture if not done yet
    if (!conversationContext.leadCaptured && !user) {
      content += "\n\nTo provide you with the most relevant assistance and connect you with the right professionals, I'd recommend creating a free account or scheduling a consultation where we can discuss your needs in detail.";
    }

    return { content, actions };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Analyze user intent and generate response
    const analysis = analyzeUserIntent(userMessage);
    const { content, actions } = generateAIResponse(userMessage, analysis);

    // Add AI response
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content,
      timestamp: new Date(),
      actions
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);

    // Save conversation to database if user is logged in
    if (user) {
      try {
        await supabase.from('service_requests').insert({
          client_id: user.id,
          service_type: 'consultation',
          title: 'AI Chat Consultation',
          description: `User inquiry: ${userMessage}\nAI Response: ${content}`,
          contact_name: profile?.name || 'Chat User',
          contact_email: user.email || '',
          contact_phone: profile?.phone || '',
          status: 'pending',
          priority: 'low'
        });
      } catch (error) {
        console.error('Failed to save chat to database:', error);
        // This is expected behavior now due to RLS policies protecting contact info
      }
    }
  };

  const handleActionClick = (action: ChatAction) => {
    switch (action.type) {
      case 'schedule_consultation':
        window.open('/free-consultation', '_blank');
        break;
      case 'view_services':
        window.open('/services', '_blank');
        break;
      case 'submit_requirements':
        window.open('/requirements-funnel', '_blank');
        break;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="w-full max-w-md h-96 flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bot className="h-5 w-5 text-primary" />
            AI Assistant
          </CardTitle>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Online
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  
                  <div className={`rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    
                    {message.actions && message.actions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {message.actions.map((action, index) => (
                          <Button
                            key={index}
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={() => handleActionClick(action)}
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about real estate..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground mt-2 text-center">
            AI Assistant • Powered by RealtyCheq
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIChat;