import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Package } from "lucide-react";

interface AddEquipmentDialogProps {
  onEquipmentAdded?: () => void;
}

export const AddEquipmentDialog = ({ onEquipmentAdded }: AddEquipmentDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    daily_rate: "",
    location: "",
    image_url: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to add equipment",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('equipment')
        .insert({
          owner_id: user.id,
          name: formData.name,
          category: formData.category,
          description: formData.description,
          daily_rate: parseFloat(formData.daily_rate),
          location: formData.location,
          image_url: formData.image_url || null,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Equipment added and submitted for admin approval",
      });

      setFormData({
        name: "",
        category: "",
        description: "",
        daily_rate: "",
        location: "",
        image_url: ""
      });
      
      setOpen(false);
      onEquipmentAdded?.();
      
    } catch (error: any) {
      console.error('Error adding equipment:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add equipment",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-grass-primary hover:bg-grass-primary/90">
          <Package className="w-4 h-4 mr-2" />
          Add Equipment
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Equipment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Equipment Name *</Label>
            <Input
              id="name"
              placeholder="John Deere 8370R Tractor"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select 
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tractor">Tractor</SelectItem>
                <SelectItem value="Harvester">Harvester</SelectItem>
                <SelectItem value="Plow">Plow</SelectItem>
                <SelectItem value="Seeder">Seeder</SelectItem>
                <SelectItem value="Sprayer">Sprayer</SelectItem>
                <SelectItem value="Truck">Truck</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="High-performance tractor perfect for large-scale farming operations"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="daily_rate">Daily Rate (₹) *</Label>
            <Input
              id="daily_rate"
              type="number"
              step="0.01"
              min="0"
              placeholder="450.00"
              value={formData.daily_rate}
              onChange={(e) => setFormData({ ...formData, daily_rate: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              placeholder="Madurai"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL (optional)</Label>
            <Input
              id="image_url"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Equipment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
