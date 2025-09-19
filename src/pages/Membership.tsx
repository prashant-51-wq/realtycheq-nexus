import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Crown, ArrowLeft, Home, Star } from 'lucide-react';

export default function Membership() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
          <Link to="/" className="hover:text-primary flex items-center">
            <Home className="h-3 w-3 mr-1" />
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground">Membership</span>
        </nav>
        <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </div>

      <div className="bg-hero-gradient border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-display mb-4 flex items-center justify-center">
              <Crown className="h-12 w-12 mr-4 text-yellow-400" />
              Membership Plans
            </h1>
            <p className="text-subheadline mb-8">
              Choose the perfect plan to unlock premium features.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-12">
          <Star className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Membership Plans Coming Soon</h3>
          <p className="text-muted-foreground mb-4">
            We're designing premium membership tiers with exclusive benefits.
          </p>
          <Button className="btn-premium">
            Join Waitlist
          </Button>
        </div>
      </div>
    </div>
  );
}