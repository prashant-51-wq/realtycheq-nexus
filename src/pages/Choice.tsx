import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PropertyCard } from '@/components/cards/PropertyCard';
import { Crown, ArrowLeft, Home, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function Choice() {
  const { toast } = useToast();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChoiceProperties();
  }, []);

  const fetchChoiceProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('is_choice', true)
        .eq('status', 'active');

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load Choice properties.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
          <Link to="/" className="hover:text-primary flex items-center">
            <Home className="h-3 w-3 mr-1" />
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground">RealtyCheq Choice</span>
        </nav>
        <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </div>

      <div className="bg-hero-gradient border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Crown className="h-16 w-16 text-yellow-400 mr-4" />
              <h1 className="text-display">RealtyCheq Choice</h1>
            </div>
            <p className="text-subheadline mb-8">
              Handpicked premium properties that meet our highest standards for quality, location, and value.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-12">
          <Crown className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Choice Properties Coming Soon</h3>
          <p className="text-muted-foreground mb-4">
            We're curating premium properties for our Choice collection.
          </p>
          <Button className="btn-premium">
            <Award className="h-5 w-5 mr-2" />
            Apply for Choice Verification
          </Button>
        </div>
      </div>
    </div>
  );
}