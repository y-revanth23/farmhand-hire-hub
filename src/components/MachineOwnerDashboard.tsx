import { useState, useEffect } from "react";
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
  Package,
  Settings
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AddEquipmentDialog } from "@/components/AddEquipmentDialog";

interface MachineOwnerDashboardProps {
  currentUser: any;
  setCurrentView: (view: string) => void;
}

export const MachineOwnerDashboard = ({ currentUser, setCurrentView }: MachineOwnerDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [myEquipmentList, setMyEquipmentList] = useState<any[]>([]);

  useEffect(() => {
    fetchMyEquipment();
  }, []);

  const fetchMyEquipment = async () => {
    try {
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .eq('owner_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyEquipmentList(data || []);
    } catch (error: any) {
      console.error('Error fetching equipment:', error);
    }
  };

  // Mock data for machine owner
  const stats = [
    {
      title: "Total Equipment",
      value: "8",
      icon: Tractor,
      color: "text-grass-primary",
      bgColor: "bg-grass-primary/10"
    },
    {
      title: "Active Rentals",
      value: "5",
      icon: CheckCircle,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Monthly Earnings",
      value: "$12,450",
      icon: DollarSign,
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      title: "Avg Rating",
      value: "4.9",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    }
  ];

  const myEquipment = [
    {
      id: 1,
      name: "John Deere 8370R Tractor",
      category: "Tractor",
      dailyRate: 450,
      status: "rented",
      rentedTo: "Sarah Wilson",
      location: "Iowa Farm District",
      availability: "Returns Jan 20, 2024"
    },
    {
      id: 2,
      name: "Case IH Combine Harvester",
      category: "Harvester",
      dailyRate: 800,
      status: "available",
      rentedTo: null,
      location: "Iowa Farm District",
      availability: "Available Now"
    },
    {
      id: 3,
      name: "New Holland Plow System",
      category: "Plow",
      dailyRate: 180,
      status: "rented",
      rentedTo: "John Baker",
      location: "Iowa Farm District",
      availability: "Returns Jan 22, 2024"
    },
    {
      id: 4,
      name: "Kubota M7-172 Tractor",
      category: "Tractor",
      dailyRate: 380,
      status: "maintenance",
      rentedTo: null,
      location: "Iowa Farm District",
      availability: "Under Maintenance"
    }
  ];

  const rentalRequests = [
    {
      id: 1,
      equipment: "Case IH Combine Harvester",
      farmer: "Mike Johnson",
      requestDate: "2024-01-16",
      startDate: "2024-01-22",
      endDate: "2024-01-28",
      totalCost: 4800,
      status: "pending",
      message: "Need for harvest season"
    },
    {
      id: 2,
      equipment: "Kubota M7-172 Tractor",
      farmer: "Emma Davis",
      requestDate: "2024-01-15",
      startDate: "2024-01-25",
      endDate: "2024-01-30",
      totalCost: 1900,
      status: "pending",
      message: "Plowing for spring planting"
    }
  ];

  const recentEarnings = [
    {
      id: 1,
      equipment: "John Deere 8370R Tractor",
      farmer: "Sarah Wilson",
      duration: "5 days",
      amount: 2250,
      date: "2024-01-15",
      status: "completed"
    },
    {
      id: 2,
      equipment: "New Holland Plow System",
      farmer: "John Baker",
      duration: "3 days",
      amount: 540,
      date: "2024-01-12",
      status: "completed"
    },
    {
      id: 3,
      equipment: "Case IH Combine Harvester",
      farmer: "Tom Richards",
      duration: "7 days",
      amount: 5600,
      date: "2024-01-08",
      status: "completed"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'rented':
        return <Badge className="bg-primary text-primary-foreground">Rented</Badge>;
      case 'available':
        return <Badge className="rental-available text-white">Available</Badge>;
      case 'maintenance':
        return <Badge className="bg-yellow-500 text-white">Maintenance</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 text-white">Pending</Badge>;
      case 'completed':
        return <Badge className="bg-primary text-primary-foreground">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="water-effect py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, {currentUser.name}!
              </h1>
              <p className="text-white/90">
                Manage your equipment listings and rental requests
              </p>
            </div>
            <AddEquipmentDialog onEquipmentAdded={fetchMyEquipment} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="equipment">My Equipment</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
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
                    className="h-20 bg-grass-primary hover:bg-grass-primary/90"
                  >
                    <div className="text-center">
                      <Package className="w-6 h-6 mx-auto mb-2" />
                      <span>Add Equipment</span>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20"
                    onClick={() => setActiveTab('requests')}
                  >
                    <div className="text-center">
                      <AlertCircle className="w-6 h-6 mx-auto mb-2" />
                      <span>View Requests</span>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20"
                    onClick={() => setActiveTab('earnings')}
                  >
                    <div className="text-center">
                      <TrendingUp className="w-6 h-6 mx-auto mb-2" />
                      <span>View Earnings</span>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Pending Requests Alert */}
            {rentalRequests.length > 0 && (
              <Card className="border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-yellow-800 dark:text-yellow-200">
                    <AlertCircle className="w-5 h-5" />
                    <span>Pending Rental Requests</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-yellow-700 dark:text-yellow-300 mb-4">
                    You have {rentalRequests.length} pending rental request{rentalRequests.length > 1 ? 's' : ''} waiting for your response.
                  </p>
                  <Button 
                    onClick={() => setActiveTab('requests')}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  >
                    Review Requests
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentEarnings.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Tractor className="w-8 h-8 text-primary" />
                        <div>
                          <p className="font-medium">{item.equipment}</p>
                          <p className="text-sm text-muted-foreground">Rented by {item.farmer}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-accent">${item.amount}</p>
                        <p className="text-sm text-muted-foreground">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="equipment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Tractor className="w-5 h-5" />
                  <span>My Equipment</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myEquipmentList.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">No equipment added yet</p>
                      <AddEquipmentDialog onEquipmentAdded={fetchMyEquipment} />
                    </div>
                  ) : (
                    myEquipmentList.map((equipment) => (
                    <Card key={equipment.id} className="equipment-card">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{equipment.name}</h3>
                            <p className="text-muted-foreground">{equipment.category}</p>
                          </div>
                          {getStatusBadge(equipment.status)}
                        </div>
                        
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm text-muted-foreground">Daily Rate</p>
                              <p className="font-medium">${equipment.dailyRate}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm text-muted-foreground">Location</p>
                              <p className="font-medium">{equipment.location}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm text-muted-foreground">Availability</p>
                              <p className="font-medium">{equipment.availability}</p>
                            </div>
                          </div>
                          {equipment.rentedTo && (
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-muted-foreground" />
                              <div>
                                <p className="text-sm text-muted-foreground">Rented To</p>
                                <p className="font-medium">{equipment.rentedTo}</p>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Settings className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          {equipment.status === 'rented' && (
                            <Button size="sm" variant="outline">
                              Contact Renter
                            </Button>
                          )}
                          {equipment.status === 'available' && (
                            <Button size="sm" variant="outline">
                              Mark Unavailable
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5" />
                  <span>Rental Requests</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rentalRequests.map((request) => (
                    <Card key={request.id} className="equipment-card border-2">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{request.equipment}</h3>
                            <p className="text-muted-foreground">Requested by {request.farmer}</p>
                          </div>
                          {getStatusBadge(request.status)}
                        </div>
                        
                        <div className="bg-muted/50 p-3 rounded mb-4">
                          <p className="text-sm"><span className="font-medium">Message:</span> {request.message}</p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm text-muted-foreground">Start Date</p>
                              <p className="font-medium">{request.startDate}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm text-muted-foreground">End Date</p>
                              <p className="font-medium">{request.endDate}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm text-muted-foreground">Total Cost</p>
                              <p className="font-medium">${request.totalCost}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm text-muted-foreground">Request Date</p>
                              <p className="font-medium">{request.requestDate}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button size="sm" className="bg-grass-primary hover:bg-grass-primary/90">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Accept
                          </Button>
                          <Button size="sm" variant="destructive">
                            Decline
                          </Button>
                          <Button size="sm" variant="outline">
                            Contact Farmer
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Earnings History</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6 p-6 bg-gradient-to-r from-accent/20 to-primary/20 rounded-lg">
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">This Month</p>
                      <p className="text-2xl font-bold">$12,450</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Last Month</p>
                      <p className="text-2xl font-bold">$10,890</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Earnings</p>
                      <p className="text-2xl font-bold">$48,320</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {recentEarnings.map((item) => (
                    <Card key={item.id} className="equipment-card">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold">{item.equipment}</h3>
                            <p className="text-muted-foreground">Rented by {item.farmer}</p>
                          </div>
                          {getStatusBadge(item.status)}
                        </div>
                        
                        <div className="grid sm:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Duration</p>
                            <p className="font-medium">{item.duration}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Amount Earned</p>
                            <p className="font-medium text-accent">${item.amount}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Date</p>
                            <p className="font-medium">{item.date}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <p className="font-medium">Paid</p>
                          </div>
                        </div>
                        
                        <Button size="sm" variant="outline">
                          View Invoice
                        </Button>
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
