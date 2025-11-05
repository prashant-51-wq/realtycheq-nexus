import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RoleSelector } from '@/components/auth/RoleSelector';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { UserRole } from '@/types';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('buyer');
  const {
    signIn,
    signUp,
    user
  } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        toast({
          title: 'Sign In Failed',
          description: error.message || 'Failed to sign in. Please check your credentials.',
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Welcome back!',
          description: 'You have successfully signed in.'
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await signUp(email, password, name, role);
      if (error) {
        if (error.message.includes('User already registered')) {
          toast({
            title: 'Account exists',
            description: 'An account with this email already exists. Please sign in instead.',
            variant: 'destructive'
          });
        } else {
          toast({
            title: 'Sign Up Failed',
            description: error.message || 'Failed to create account. Please try again.',
            variant: 'destructive'
          });
        }
      } else {
        toast({
          title: 'Account created!',
          description: 'Please check your email to verify your account.'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link to="/" className="flex items-center gap-2 text-white/80 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-slate-950">Welcome to RealtyCheq</h1>
          <p className="text-slate-950">Your trusted real estate platform</p>
        </div>

        <Card className="card-premium">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Get Started</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="signin-email" 
                        type="email" 
                        placeholder="Enter your email" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        className="pl-10" 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="signin-password" 
                        type="password" 
                        placeholder="Enter your password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        className="pl-10" 
                        required 
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full btn-hero" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="signup-name" 
                        type="text" 
                        placeholder="Enter your full name" 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        className="pl-10" 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="signup-email" 
                        type="email" 
                        placeholder="Enter your email" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        className="pl-10" 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="signup-password" 
                        type="password" 
                        placeholder="Create a password (min 6 characters)" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        className="pl-10" 
                        minLength={6} 
                        required 
                      />
                    </div>
                  </div>
                  
                  <RoleSelector 
                    selectedRole={role}
                    onRoleChange={setRole}
                  />
                  
                  <Button type="submit" className="w-full btn-hero" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <p className="text-center text-white/60 text-sm mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};
export default Auth;