import { useState } from "react";
import { Header } from "@/components/Header";
import { Homepage } from "@/components/Homepage";
import { LoginForm } from "@/components/LoginForm";
import { EquipmentBrowser } from "@/components/EquipmentBrowser";
import { FarmerDashboard } from "@/components/FarmerDashboard";

const Index = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('home');

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
        return (
          <div className="min-h-screen bg-background p-8">
            <div className="container mx-auto text-center">
              <h1 className="text-3xl font-bold mb-4">Machine Owner Dashboard</h1>
              <p className="text-muted-foreground mb-8">Manage your equipment listings and rental requests</p>
              <div className="water-effect p-8 rounded-lg">
                <p className="text-white">Dashboard features: Equipment management, rental requests, earnings tracking</p>
              </div>
            </div>
          </div>
        );
      case 'admin-dashboard':
        return (
          <div className="min-h-screen bg-background p-8">
            <div className="container mx-auto text-center">
              <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
              <p className="text-muted-foreground mb-8">Monitor platform activity and manage users</p>
              <div className="grass-field p-8 rounded-lg">
                <p className="text-white">Admin features: User management, equipment approval, platform analytics</p>
              </div>
            </div>
          </div>
        );
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
