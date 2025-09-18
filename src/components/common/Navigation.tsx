import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';

interface NavigationProps {
  title: string;
  breadcrumbs?: Array<{ label: string; href: string }>;
  showBackButton?: boolean;
  backTo?: string;
  actions?: React.ReactNode;
}

export const Navigation = ({ 
  title, 
  breadcrumbs = [], 
  showBackButton = true, 
  backTo = '/',
  actions 
}: NavigationProps) => {
  const location = useLocation();

  return (
    <div className="mb-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
        <Link to="/" className="hover:text-primary flex items-center">
          <Home className="h-3 w-3 mr-1" />
          Home
        </Link>
        {breadcrumbs.map((crumb, index) => (
          <div key={index} className="flex items-center space-x-2">
            <span>/</span>
            <Link to={crumb.href} className="hover:text-primary">
              {crumb.label}
            </Link>
          </div>
        ))}
        <span>/</span>
        <span className="text-foreground">{title}</span>
      </nav>

      {/* Back Button */}
      {showBackButton && (
        <Link to={backTo} className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to {backTo === '/' ? 'Home' : 'Previous Page'}
        </Link>
      )}

      {/* Title and Actions */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{title}</h1>
        {actions && <div className="flex items-center space-x-4">{actions}</div>}
      </div>
    </div>
  );
};