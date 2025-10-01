import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell,
  CheckCircle,
  Users,
  Tractor,
  DollarSign,
  TrendingUp,
  AlertCircle,
  XCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface AdminDashboardProps {
  currentUser: any;
  setCurrentView: (view: string) => void;
}

export const AdminDashboard = ({ currentUser, setCurrentView }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [pendingEquipment, setPendingEquipment] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
    fetchPendingEquipment();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchPendingEquipment = async () => {
    try {
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Fetch owner profiles separately
      if (data && data.length > 0) {
        const ownerIds = [...new Set(data.map(item => item.owner_id))];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, display_name')
          .in('id', ownerIds);
        
        const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
        
        // Merge profiles into equipment data
        const enrichedData = data.map(item => ({
          ...item,
          profiles: profileMap.get(item.owner_id)
        }));
        
        setPendingEquipment(enrichedData);
      } else {
        setPendingEquipment([]);
      }
    } catch (error: any) {
      console.error('Error fetching pending equipment:', error);
    }
  };

  const handleApproveEquipment = async (equipmentId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('equipment')
        .update({ status: 'available' })
        .eq('id', equipmentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Equipment approved successfully",
      });

      fetchPendingEquipment();
    } catch (error: any) {
      console.error('Error approving equipment:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to approve equipment",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRejectEquipment = async (equipmentId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('equipment')
        .delete()
        .eq('id', equipmentId);

      if (error) throw error;

      toast({
        title: "Equipment Rejected",
        description: "Equipment has been removed",
      });

      fetchPendingEquipment();
    } catch (error: any) {
      console.error('Error rejecting equipment:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to reject equipment",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);
      
      fetchNotifications();
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="grass-field py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Admin Dashboard
              </h1>
              <p className="text-white/90">
                Monitor platform activity and manage equipment approvals
              </p>
            </div>
            <Button 
              variant="outline"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              <Bell className="w-4 h-4 mr-2" />
              Notifications {unreadCount > 0 && `(${unreadCount})`}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="approvals">
              Approvals {pendingEquipment.length > 0 && `(${pendingEquipment.length})`}
            </TabsTrigger>
            <TabsTrigger value="notifications">
              Notifications {unreadCount > 0 && `(${unreadCount})`}
            </TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="farm-card">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                      <p className="text-2xl font-bold">--</p>
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="farm-card">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Equipment</p>
                      <p className="text-2xl font-bold">--</p>
                    </div>
                    <div className="w-12 h-12 bg-grass-primary/10 rounded-full flex items-center justify-center">
                      <Tractor className="w-6 h-6 text-grass-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="farm-card">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pending Approvals</p>
                      <p className="text-2xl font-bold">{pendingEquipment.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="farm-card">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Platform Revenue</p>
                      <p className="text-2xl font-bold">--</p>
                    </div>
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-accent" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pending Approvals Alert */}
            {pendingEquipment.length > 0 && (
              <Card className="border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-yellow-800 dark:text-yellow-200">
                    <AlertCircle className="w-5 h-5" />
                    <span>Pending Equipment Approvals</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-yellow-700 dark:text-yellow-300 mb-4">
                    You have {pendingEquipment.length} equipment submission{pendingEquipment.length > 1 ? 's' : ''} waiting for approval.
                  </p>
                  <Button 
                    onClick={() => setActiveTab('approvals')}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  >
                    Review Submissions
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="approvals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5" />
                  <span>Pending Equipment Approvals</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pendingEquipment.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No pending approvals</p>
                ) : (
                  <div className="space-y-4">
                    {pendingEquipment.map((equipment) => (
                      <Card key={equipment.id} className="equipment-card border-2">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-lg">{equipment.name}</h3>
                              <p className="text-muted-foreground">
                                Owner: {equipment.profiles?.display_name || 'Unknown'}
                              </p>
                            </div>
                            <Badge className="bg-yellow-500 text-white">Pending</Badge>
                          </div>

                          {equipment.description && (
                            <div className="bg-muted/50 p-3 rounded mb-4">
                              <p className="text-sm">{equipment.description}</p>
                            </div>
                          )}

                          <div className="grid sm:grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Category</p>
                              <p className="font-medium">{equipment.category}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Daily Rate</p>
                              <p className="font-medium">${equipment.daily_rate}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Location</p>
                              <p className="font-medium">{equipment.location}</p>
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              className="bg-grass-primary hover:bg-grass-primary/90"
                              onClick={() => handleApproveEquipment(equipment.id)}
                              disabled={loading}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleRejectEquipment(equipment.id)}
                              disabled={loading}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Notifications</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {notifications.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No notifications</p>
                ) : (
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`p-4 rounded-lg border ${notification.is_read ? 'bg-muted/30' : 'bg-primary/5 border-primary/20'}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold">{notification.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(notification.created_at).toLocaleString()}
                            </p>
                          </div>
                          {!notification.is_read && (
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => markAsRead(notification.id)}
                            >
                              Mark as Read
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>User Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">User management features coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
