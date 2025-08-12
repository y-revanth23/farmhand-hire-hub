import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tractor, User, LogIn, Menu, X, Settings, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface HeaderProps {
  currentUser: any;
  setCurrentUser: (user: any) => void;
  currentView: string;
  setCurrentView: (view: string) => void;
}

export const Header = ({ currentUser, setCurrentUser, currentView, setCurrentView }: HeaderProps) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setCurrentView('home');
  };

  const navigation = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'browse', label: 'Browse Equipment', icon: Tractor },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => setCurrentView('home')}
          >
            <div className="w-8 h-8 grass-field rounded-lg flex items-center justify-center">
              <Tractor className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">FarmRent</span>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                    currentView === item.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-3">
                <Badge variant="secondary" className="hidden sm:flex">
                  {currentUser.role}
                </Badge>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium">
                    {currentUser.name}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentView(`${currentUser.role.toLowerCase()}-dashboard`)}
                  className="hidden sm:flex"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => setCurrentView('login')}
                className="bg-primary hover:bg-primary-hover"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id);
                      setShowMobileMenu(false);
                    }}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                      currentView === item.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              {currentUser && (
                <button
                  onClick={() => {
                    setCurrentView(`${currentUser.role.toLowerCase()}-dashboard`);
                    setShowMobileMenu(false);
                  }}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  <Settings className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};