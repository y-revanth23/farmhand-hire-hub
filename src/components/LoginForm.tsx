import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Mail, 
  Lock, 
  UserCheck, 
  Tractor, 
  Shield,
  Phone,
  MapPin
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface LoginFormProps {
  setCurrentUser: (user: any) => void;
  setCurrentView: (view: string) => void;
}

export const LoginForm = ({ setCurrentUser, setCurrentView }: LoginFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    location: '',
    role: 'Farmer'
  });

  // Mock users for demo
  const mockUsers = [
    { 
      id: 1, 
      email: 'admin@farmrent.com', 
      password: 'admin123', 
      name: 'Admin User', 
      role: 'Admin',
      phone: '+1234567890',
      location: 'Headquarters'
    },
    { 
      id: 2, 
      email: 'owner@farmrent.com', 
      password: 'owner123', 
      name: 'John Doe', 
      role: 'Machine Owner',
      phone: '+1234567891',
      location: 'Iowa Farm District'
    },
    { 
      id: 3, 
      email: 'farmer@farmrent.com', 
      password: 'farmer123', 
      name: 'Sarah Wilson', 
      role: 'Farmer',
      phone: '+1234567892',
      location: 'Nebraska Valley'
    }
  ];

  const fetchAndSetCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: rolesData, error: rolesError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);
    if (rolesError) console.error(rolesError);
    const roles = rolesData?.map(r => r.role) || [];
    const rolePriority = ['admin','owner','farmer','user'] as const;
    const topRole = (roles as string[]).sort((a,b)=>rolePriority.indexOf(a as any)-rolePriority.indexOf(b as any))[0] || 'user';
    const roleLabel = topRole === 'admin' ? 'Admin' : topRole === 'owner' ? 'Machine Owner' : topRole === 'farmer' ? 'Farmer' : 'User';
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name, phone, location')
      .eq('id', user.id)
      .maybeSingle();
    const name = profile?.display_name || (user.email ? user.email.split('@')[0] : 'User');
    const mapped = { id: user.id, email: user.email, name, role: roleLabel, phone: profile?.phone, location: profile?.location };
    setCurrentUser(mapped);
    toast.success(`Welcome, ${mapped.name}!`);
    const target = roleLabel === 'Admin' ? 'admin-dashboard' : roleLabel === 'Machine Owner' ? 'machine-owner-dashboard' : roleLabel === 'Farmer' ? 'farmer-dashboard' : 'home';
    setCurrentView(target);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      await fetchAndSetCurrentUser();
    } else {
      if (!(formData.email && formData.password && formData.name)) {
        toast.error('Please fill in all required fields.');
        return;
      }
      const redirectUrl = `${window.location.origin}/`;
      const roleMeta = formData.role === 'Machine Owner' ? 'owner' : formData.role === 'Farmer' ? 'farmer' : 'user';
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            display_name: formData.name,
            phone: formData.phone || null,
            location: formData.location || null,
            role: roleMeta
          }
        }
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success('Confirmation email sent. Please check your inbox.');
      setIsLogin(true);
    }
  };

  const roles = [
    {
      id: 'Farmer',
      title: 'Farmer',
      description: 'Rent equipment for your farm',
      icon: Tractor,
      color: 'bg-grass-primary'
    },
    {
      id: 'Machine Owner',
      title: 'Machine Owner',
      description: 'List your equipment for rent',
      icon: UserCheck,
      color: 'bg-water-primary'
    },
    {
      id: 'Admin',
      title: 'Admin',
      description: 'Manage platform and users',
      icon: Shield,
      color: 'bg-accent'
    }
  ];

  return (
    <div className="min-h-screen grass-field flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-farm backdrop-blur-sm bg-white/95">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">
              {isLogin ? 'Welcome Back' : 'Join FarmRent'}
            </CardTitle>
            <p className="text-muted-foreground">
              {isLogin 
                ? 'Sign in to access your account' 
                : 'Create your account to get started'
              }
            </p>
          </CardHeader>
          
          <CardContent>
            <Tabs value={isLogin ? 'login' : 'register'} className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger 
                  value="login" 
                  onClick={() => setIsLogin(true)}
                >
                  Login
                </TabsTrigger>
                <TabsTrigger 
                  value="register" 
                  onClick={() => setIsLogin(false)}
                >
                  Register
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        className="pl-10"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-primary hover:bg-primary-hover">
                    Sign In
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="John Doe"
                        className="pl-10"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="reg-email"
                        type="email"
                        placeholder="your@email.com"
                        className="pl-10"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        placeholder="+1 (555) 123-4567"
                        className="pl-10"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="location"
                        placeholder="City, State"
                        className="pl-10"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="reg-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Account Type</Label>
                    <div className="grid gap-2">
                      {roles.map((role) => {
                        const Icon = role.icon;
                        return (
                          <button
                            key={role.id}
                            type="button"
                            onClick={() => setFormData({...formData, role: role.id})}
                            className={`p-3 rounded-lg border-2 transition-all text-left ${
                              formData.role === role.id
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 ${role.color} rounded-full flex items-center justify-center`}>
                                <Icon className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <div className="font-medium">{role.title}</div>
                                <div className="text-sm text-muted-foreground">{role.description}</div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-primary hover:bg-primary-hover">
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Demo Accounts */}
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3 text-center">
                Try these demo accounts:
              </p>
              <div className="space-y-2">
                {mockUsers.map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm">
                    <div>
                      <Badge variant="outline" className="mr-2">{user.role}</Badge>
                      {user.email}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setFormData({...formData, email: user.email, password: user.password});
                        setIsLogin(true);
                      }}
                    >
                      Use
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};