import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  MapPin, 
  Star, 
  TrendingUp,
  Tractor,
  AlertCircle,
  CheckCircle,
  XCircle,
  History
} from "lucide-react";

interface FarmerDashboardProps {
  currentUser: any;
  setCurrentView: (view: string) => void;
}

export const FarmerDashboard = ({ currentUser, setCurrentView }: FarmerDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for farmer
  const stats = [
    {
      title: "Active Rentals",
      value: "3",
      icon: Tractor,
      color: "text-grass-primary",
      bgColor: "bg-grass-primary/10"
    },
    {
      title: "Total Spent",
      value: "₹2,450",
      icon: DollarSign,
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      title: "Completed Rentals",
      value: "12",
      icon: CheckCircle,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Avg Rating Given",
      value: "4.8",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    }
  ];

  const activeRentals = [
    {
      id: 1,
      equipment: "John Deere 8370R Tractor",
      owner: "Mike's Farm Equipment",
      startDate: "2024-01-15",
      endDate: "2024-01-20",
      dailyRate: 450,
      status: "active",
      location: "Iowa"
    },
    {
      id: 2,
      equipment: "Kubota M7-172 Tractor",
      owner: "Green Fields Rental",
      startDate: "2024-01-18",
      endDate: "2024-01-25",
      dailyRate: 320,
      status: "active",
      location: "Kansas"
    },
    {
      id: 3,
      equipment: "New Holland Plow System",
      owner: "Midwest Farm Tools",
      startDate: "2024-01-20",
      endDate: "2024-01-22",
      dailyRate: 180,
      status: "pending",
      location: "Illinois"
    }
  ];

  const recentHistory = [
    {
      id: 1,
      equipment: "Case IH Combine Harvester",
      owner: "Valley Equipment Co.",
      duration: "7 days",
      cost: 5600,
      status: "completed",
      rating: 5,
      date: "2024-01-08"
    },
    {
      id: 2,
      equipment: "Ford F-550 Farm Truck",
      owner: "Rural Transport LLC",
      duration: "3 days",
      cost: 750,
      status: "completed",
      rating: 4,
      date: "2023-12-28"
    },
    {
      id: 3,
      equipment: "Versatile 4WD Tractor",
      owner: "Prairie Equipment",
      duration: "5 days",
      cost: 3250,
      status: "cancelled",
      rating: null,
      date: "2023-12-15"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="rental-available text-white">Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 text-white">Pending</Badge>;
      case 'completed':
        return <Badge className="bg-primary text-primary-foreground">Completed</Badge>;
      case 'cancelled':
        return <Badge className="rental-cancelled">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="grass-field py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, {currentUser.name}!
              </h1>
              <p className="text-white/90">
                Manage your equipment rentals and track your farming operations
              </p>
            </div>
            <Button 
              onClick={() => setCurrentView('browse')}
              className="bg-white text-grass-primary hover:bg-white/90"
            >
              Browse Equipment
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="active">Active Rentals</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="farm-card">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            {stat.title}
                          </p>
                          <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                        <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                          <Icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => setCurrentView('browse')}
                    className="h-20 bg-grass-primary hover:bg-grass-primary/90"
                  >
                    <div className="text-center">
                      <Tractor className="w-6 h-6 mx-auto mb-2" />
                      <span>Browse Equipment</span>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20"
                  >
                    <div className="text-center">
                      <Calendar className="w-6 h-6 mx-auto mb-2" />
                      <span>Schedule Rental</span>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20"
                  >
                    <div className="text-center">
                      <History className="w-6 h-6 mx-auto mb-2" />
                      <span>View History</span>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentHistory.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Tractor className="w-8 h-8 text-primary" />
                        <div>
                          <p className="font-medium">{item.equipment}</p>
                          <p className="text-sm text-muted-foreground">{item.owner}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(item.status)}
                        <p className="text-sm text-muted-foreground mt-1">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Tractor className="w-5 h-5" />
                  <span>Active Rentals</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeRentals.map((rental) => (
                    <Card key={rental.id} className="equipment-card">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{rental.equipment}</h3>
                            <p className="text-muted-foreground">{rental.owner}</p>
                          </div>
                          {getStatusBadge(rental.status)}
                        </div>
                        
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm text-muted-foreground">Start Date</p>
                              <p className="font-medium">{rental.startDate}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm text-muted-foreground">End Date</p>
                              <p className="font-medium">{rental.endDate}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm text-muted-foreground">Daily Rate</p>
                              <p className="font-medium">₹{rental.dailyRate}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm text-muted-foreground">Location</p>
                              <p className="font-medium">{rental.location}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            Contact Owner
                          </Button>
                          <Button size="sm" variant="outline">
                            Extend Rental
                          </Button>
                          {rental.status === 'active' && (
                            <Button size="sm" variant="destructive">
                              Cancel Rental
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <History className="w-5 h-5" />
                  <span>Rental History</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentHistory.map((item) => (
                    <Card key={item.id} className="equipment-card">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold">{item.equipment}</h3>
                            <p className="text-muted-foreground">{item.owner}</p>
                          </div>
                          {getStatusBadge(item.status)}
                        </div>
                        
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Duration</p>
                            <p className="font-medium">{item.duration}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Total Cost</p>
                            <p className="font-medium">₹{item.cost}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Date</p>
                            <p className="font-medium">{item.date}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Rating</p>
                            <div className="flex items-center space-x-1">
                              {item.rating ? (
                                <>
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span className="font-medium">{item.rating}</span>
                                </>
                              ) : (
                                <span className="text-muted-foreground">N/A</span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                          {item.status === 'completed' && !item.rating && (
                            <Button size="sm" className="bg-primary hover:bg-primary-hover">
                              Leave Review
                            </Button>
                          )}
                          {item.status === 'completed' && (
                            <Button size="sm" variant="outline">
                              Rent Again
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{currentUser.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{currentUser.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{currentUser.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{currentUser.location || 'Not provided'}</p>
                  </div>
                </div>
                <Button className="bg-primary hover:bg-primary-hover">
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};