import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  Plus, 
  MessageCircle, 
  Users,
  TrendingUp,
  Briefcase
} from 'lucide-react';

export const QuickActions = () => {
  const actions = [
    {
      title: 'Browse Properties',
      description: 'Explore verified properties',
      icon: Search,
      href: '/browse',
      color: 'text-blue-600'
    },
    {
      title: 'List Property',
      description: 'Sell your property',
      icon: Plus,  
      href: '/list-property',
      color: 'text-green-600'
    },
    {
      title: 'Submit Requirements',
      description: 'Tell us what you need',
      icon: MessageCircle,
      href: '/requirements',
      color: 'text-purple-600'
    },
    {
      title: 'Professional Services',
      description: 'Connect with experts',
      icon: Briefcase,
      href: '/services',
      color: 'text-orange-600'
    },
    {
      title: 'Join Communities',
      description: 'Network with others',
      icon: Users,
      href: '/communities',
      color: 'text-pink-600'
    },
    {
      title: 'Investment Opportunities',
      description: 'Discover deals',
      icon: TrendingUp,
      href: '/opportunities',
      color: 'text-indigo-600'
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-headline mb-4">Quick Actions</h2>
          <p className="text-subheadline">
            Everything you need for your real estate journey
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {actions.map((action, index) => (
            <Link key={index} to={action.href}>
              <Card className="card-premium hover-lift cursor-pointer h-full">
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center`}>
                    <action.icon className={`h-6 w-6 ${action.color}`} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{action.title}</h3>
                  <p className="text-muted-foreground text-sm">{action.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};