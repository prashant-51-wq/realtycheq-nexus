import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowLeft, Home, GraduationCap } from 'lucide-react';

export default function Learn() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
          <Link to="/" className="hover:text-primary flex items-center">
            <Home className="h-3 w-3 mr-1" />
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground">Learn</span>
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
              <BookOpen className="h-12 w-12 mr-4 text-white" />
              Real Estate Learning Hub
            </h1>
            <p className="text-subheadline mb-8">
              Master real estate with expert-curated content and courses.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-12">
          <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Learning Content Coming Soon</h3>
          <p className="text-muted-foreground mb-4">
            We're preparing comprehensive real estate courses and resources.
          </p>
          <Button className="btn-premium">
            Subscribe for Updates
          </Button>
        </div>
      </div>
    </div>
  );
}