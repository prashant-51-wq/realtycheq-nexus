-- Add vendor and contractor roles to the user_role enum
ALTER TYPE user_role ADD VALUE 'vendor';
ALTER TYPE user_role ADD VALUE 'contractor';