import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

export function useUserRole() {
  const { profile } = useAuth();

  const isRole = (role: UserRole) => profile?.role === role;

  const isBuyer = () => isRole('buyer');
  const isSeller = () => isRole('seller');
  const isVendor = () => isRole('vendor');
  const isContractor = () => isRole('contractor');
  const isBroker = () => isRole('broker');
  const isSuperAdmin = () => isRole('super_admin');

  const isAdmin = () => isSuperAdmin();
  const isServiceProvider = () => isVendor() || isContractor();
  const canManageProperties = () => isSeller() || isBroker() || isSuperAdmin();
  const canManageServices = () => isVendor() || isContractor() || isSuperAdmin();
  const canViewAdminFeatures = () => isSuperAdmin();

  return {
    profile,
    role: profile?.role,
    isRole,
    isBuyer,
    isSeller,
    isVendor,
    isContractor,
    isBroker,
    isSuperAdmin,
    isAdmin,
    isServiceProvider,
    canManageProperties,
    canManageServices,
    canViewAdminFeatures,
  };
}