import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Homepage } from "@/components/Homepage";
import { LoginForm } from "@/components/LoginForm";
import { EquipmentBrowser } from "@/components/EquipmentBrowser";
import { FarmerDashboard } from "@/components/FarmerDashboard";
import { MachineOwnerDashboard } from "@/components/MachineOwnerDashboard";
import { AdminDashboard } from "@/components/AdminDashboard";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentView, setCurrentView] = useState('home');

  const fetchAndSetCurrentUser = async (uid?: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    const userId = uid || user?.id;
    if (!userId) return;
    const { data: rolesData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);
    const roles = rolesData?.map(r => r.role) || [];
    const rolePriority = ['admin','owner','farmer','user'] as const;
    const topRole = (roles as string[]).sort((a,b)=>rolePriority.indexOf(a as any)-rolePriority.indexOf(b as any))[0] || 'user';
    const roleLabel = topRole === 'admin' ? 'Admin' : topRole === 'owner' ? 'Machine Owner' : topRole === 'farmer' ? 'Farmer' : 'User';
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name, phone, location')
      .eq('id', userId)
      .maybeSingle();
    const name = profile?.display_name || (user?.email ? user.email.split('@')[0] : 'User');
    setCurrentUser({ id: userId, email: user?.email, name, role: roleLabel, phone: profile?.phone, location: profile?.location });
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) fetchAndSetCurrentUser(session.user.id);
      else setCurrentUser(null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) fetchAndSetCurrentUser(session.user.id);
    });
    return () => subscription.unsubscribe();
  }, []);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <Homepage setCurrentView={setCurrentView} />;
      case 'login':
        return <LoginForm setCurrentUser={setCurrentUser} setCurrentView={setCurrentView} />;
      case 'browse':
        return <EquipmentBrowser currentUser={currentUser} setCurrentView={setCurrentView} />;
      case 'farmer-dashboard':
        return <FarmerDashboard currentUser={currentUser} setCurrentView={setCurrentView} />;
      case 'machine-owner-dashboard':
        return <MachineOwnerDashboard currentUser={currentUser} setCurrentView={setCurrentView} />;
      case 'admin-dashboard':
        return <AdminDashboard currentUser={currentUser} setCurrentView={setCurrentView} />;
      default:
        return <Homepage setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        currentUser={currentUser} 
        setCurrentUser={setCurrentUser}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />
      {renderCurrentView()}
    </div>
  );
};

export default Index;
