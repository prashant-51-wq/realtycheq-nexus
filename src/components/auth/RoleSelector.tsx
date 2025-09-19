import React from 'react';
import { UserRole } from '@/types';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface RoleSelectorProps {
  selectedRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const roleOptions = [
  {
    value: 'buyer' as UserRole,
    title: 'Buyer',
    description: 'Looking to purchase or rent properties, hire services'
  },
  {
    value: 'seller' as UserRole,
    title: 'Seller',
    description: 'Sell or rent properties, list your real estate'
  },
  {
    value: 'vendor' as UserRole,
    title: 'Vendor',
    description: 'Provide design, consultation, and professional services'
  },
  {
    value: 'contractor' as UserRole,
    title: 'Contractor',
    description: 'Construction, renovation, and building services'
  },
  {
    value: 'broker' as UserRole,
    title: 'Broker',
    description: 'Real estate agent, help buyers and sellers connect'
  }
];

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onRoleChange
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-medium">What best describes you?</Label>
        <p className="text-sm text-muted-foreground mt-1">
          Choose your primary role to get personalized features
        </p>
      </div>
      
      <RadioGroup
        value={selectedRole}
        onValueChange={(value) => onRoleChange(value as UserRole)}
        className="space-y-3"
      >
        {roleOptions.map((option) => (
          <Card 
            key={option.value}
            className={`cursor-pointer transition-colors ${
              selectedRole === option.value 
                ? 'border-primary bg-primary/5' 
                : 'hover:border-muted-foreground/50'
            }`}
            onClick={() => onRoleChange(option.value)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value={option.value} 
                  id={option.value}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <CardTitle className="text-base">{option.title}</CardTitle>
                  <CardDescription className="text-xs">
                    {option.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </RadioGroup>
    </div>
  );
};