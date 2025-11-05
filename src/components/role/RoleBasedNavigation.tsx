import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useUserRole } from '@/hooks/useUserRole';
import { 
  Home, 
  Search, 
  Building2, 
  Users, 
  Settings, 
  PlusCircle,
  FileText,
  Star,
  MessageSquare,
  User
} from 'lucide-react';

export const RoleBasedNavigation = () => {
  const { 
    isBuyer, 
    isSeller, 
    isVendor, 
    isContractor, 
    isBroker, 
    isSuperAdmin,
    canManageProperties,
    canManageServices,
    canViewAdminFeatures
  } = useUserRole();

  const navigationItems = [
    // Common navigation for all users
    { href: '/', label: 'Home', icon: Home, show: true },
    { href: '/browse', label: 'Browse Properties', icon: Search, show: true },
    
    // Buyer specific
    { href: '/requirements-funnel', label: 'Submit Requirements', icon: FileText, show: isBuyer() },
    
    // Property management
    { href: '/properties/new', label: 'Add Property', icon: PlusCircle, show: canManageProperties() },
    { href: '/properties/manage', label: 'Manage Properties', icon: Building2, show: canManageProperties() },
    
    // Service management
    { href: '/services/new', label: 'Add Service', icon: PlusCircle, show: canManageServices() },
    { href: '/services/manage', label: 'Manage Services', icon: Star, show: canManageServices() },
    { href: '/service-requests', label: 'Service Requests', icon: MessageSquare, show: canManageServices() },
    
    // Vendor/Contractor specific
    { href: '/vendor/profile', label: 'My Profile', icon: User, show: isVendor() || isContractor() },
    { href: '/opportunities', label: 'Opportunities', icon: Search, show: isVendor() || isContractor() },
    
    // Admin features
    { href: '/admin/users', label: 'Manage Users', icon: Users, show: canViewAdminFeatures() },
    { href: '/admin/dashboard', label: 'Admin Dashboard', icon: Settings, show: canViewAdminFeatures() },
    
    // Common footer items
    { href: '/communities', label: 'Communities', icon: Users, show: true },
    { href: '/vendors', label: 'Find Vendors', icon: Search, show: isBuyer() || isSeller() },
    { href: '/settings', label: 'Settings', icon: Settings, show: true },
  ];

  const visibleItems = navigationItems.filter(item => item.show);

  return (
    <nav className="space-y-2">
      {visibleItems.map((item) => {
        const Icon = item.icon;
        return (
          <Button
            key={item.href}
            variant="ghost"
            className="w-full justify-start"
            asChild
          >
            <Link to={item.href}>
              <Icon className="mr-2 h-4 w-4" />
              {item.label}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
};