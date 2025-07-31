import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Tractor, 
  Users, 
  Shield, 
  Clock, 
  MapPin, 
  Star,
  ArrowRight,
  CheckCircle,
  Truck,
  Wrench,
  Sprout
} from "lucide-react";

interface HomepageProps {
  setCurrentView: (view: string) => void;
}

export const Homepage = ({ setCurrentView }: HomepageProps) => {
  const features = [
    {
      icon: Tractor,
      title: "Wide Equipment Range",
      description: "From tractors to harvesters, find all the farm equipment you need"
    },
    {
      icon: Clock,
      title: "Flexible Rentals",
      description: "Rent by day, week, or season based on your farming needs"
    },
    {
      icon: MapPin,
      title: "Local Network",
      description: "Connect with equipment owners in your area"
    },
    {
      icon: Shield,
      title: "Secure Bookings",
      description: "Protected transactions and verified equipment owners"
    }
  ];

  const stats = [
    { number: "500+", label: "Equipment Listed", icon: Tractor },
    { number: "1,200+", label: "Happy Farmers", icon: Users },
    { number: "98%", label: "Success Rate", icon: Star },
    { number: "24/7", label: "Support", icon: Clock }
  ];

  const equipmentTypes = [
    { name: "Tractors", count: "120+", icon: Tractor },
    { name: "Harvesters", count: "45+", icon: Sprout },
    { name: "Plows", count: "80+", icon: Wrench },
    { name: "Trucks", count: "65+", icon: Truck }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative grass-field py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-grass-primary/90 to-grass-secondary/80"></div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 text-shadow">
              Rent Farm Equipment
              <br />
              <span className="text-accent">When You Need It</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Connect with local equipment owners and access the tools you need to grow your farm business. 
              Flexible rentals, verified equipment, secure transactions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 text-lg px-8"
                onClick={() => setCurrentView('browse')}
              >
                Browse Equipment
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-primary text-lg px-8"
                onClick={() => setCurrentView('login')}
              >
                List Your Equipment
              </Button>
            </div>
          </div>
        </div>
        {/* Floating equipment cards */}
        <div className="absolute top-20 right-10 opacity-20">
          <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center animate-bounce">
            <Tractor className="w-8 h-8 text-white" />
          </div>
        </div>
        <div className="absolute bottom-20 left-10 opacity-20">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center animate-pulse">
            <Sprout className="w-6 h-6 text-white" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="text-center farm-card">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                    <div className="text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose FarmRent?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The most trusted platform for farm equipment rentals with features designed for modern farming
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="equipment-card">
                  <CardHeader>
                    <div className="w-12 h-12 bg-grass-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-grass-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Equipment Types */}
      <section className="py-20 water-effect">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Equipment Available
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Browse our extensive collection of farm equipment ready for rent
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {equipmentTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <Card key={index} className="bg-white/95 backdrop-blur equipment-card cursor-pointer" onClick={() => setCurrentView('browse')}>
                  <CardContent className="pt-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-water-primary/10 rounded-full flex items-center justify-center">
                      <Icon className="w-8 h-8 text-water-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{type.name}</h3>
                    <Badge variant="secondary">{type.count} Available</Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of farmers who trust FarmRent for their equipment needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary-hover text-lg px-8"
                onClick={() => setCurrentView('login')}
              >
                <CheckCircle className="mr-2 w-5 h-5" />
                Start Renting Today
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8"
                onClick={() => setCurrentView('browse')}
              >
                Explore Equipment
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};