import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Star, 
  Calendar,
  DollarSign,
  User,
  Tractor,
  Truck,
  Wrench,
  Sprout
} from "lucide-react";
import { toast } from "sonner";

interface EquipmentBrowserProps {
  currentUser: any;
  setCurrentView: (view: string) => void;
}

export const EquipmentBrowser = ({ currentUser, setCurrentView }: EquipmentBrowserProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [priceRange, setPriceRange] = useState('All');

  // Mock equipment data
  const equipment = [
    {
      id: 1,
      name: "John Deere 8370R Tractor",
      category: "Tractors",
      owner: "Mike's Farm Equipment",
      location: "Madurai",
      price: 450,
      priceUnit: "day",
      rating: 4.8,
      reviews: 23,
      image: "/api/placeholder/300/200",
      status: "available",
      description: "High-performance tractor perfect for large-scale farming operations",
      specifications: "370HP, 4WD, GPS Guided",
      availability: "Available now"
    },
    {
      id: 2,
      name: "Case IH Combine Harvester",
      category: "Harvesters",
      owner: "Valley Equipment Co.",
      location: "Virudhunagar",
      price: 800,
      priceUnit: "day",
      rating: 4.9,
      reviews: 15,
      image: "/api/placeholder/300/200",
      status: "booked",
      description: "Advanced combine harvester with latest technology",
      specifications: "540HP, 12-row corn head",
      availability: "Available from March 15"
    },
    {
      id: 3,
      name: "Kubota M7-172 Tractor",
      category: "Tractors",
      owner: "Green Fields Rental",
      location: "Tirunelveli",
      price: 320,
      priceUnit: "day",
      rating: 4.6,
      reviews: 31,
      image: "/api/placeholder/300/200",
      status: "available",
      description: "Versatile mid-size tractor for various farm operations",
      specifications: "172HP, CVT Transmission",
      availability: "Available now"
    },
    {
      id: 4,
      name: "Versatile 4WD Tractor",
      category: "Tractors",
      owner: "Prairie Equipment",
      location: "Namakkal",
      price: 650,
      priceUnit: "day",
      rating: 4.7,
      reviews: 18,
      image: "/api/placeholder/300/200",
      status: "cancelled",
      description: "Heavy-duty 4WD tractor for tough field conditions",
      specifications: "485HP, Articulated",
      availability: "Recently cancelled - Available"
    },
    {
      id: 5,
      name: "New Holland Plow System",
      category: "Plows",
      owner: "Midwest Farm Tools",
      location: "Madurai",
      price: 180,
      priceUnit: "day",
      rating: 4.5,
      reviews: 12,
      image: "/api/placeholder/300/200",
      status: "available",
      description: "Professional plow system for soil preparation",
      specifications: "12-bottom, auto-reset",
      availability: "Available now"
    },
    {
      id: 6,
      name: "Ford F-550 Farm Truck",
      category: "Trucks",
      owner: "Rural Transport LLC",
      location: "Chennai",
      price: 250,
      priceUnit: "day",
      rating: 4.4,
      reviews: 28,
      image: "/api/placeholder/300/200",
      status: "available",
      description: "Heavy-duty farm truck for hauling and transport",
      specifications: "Diesel, 19,500 GVWR",
      availability: "Available now"
    }
  ];

  const categories = ['All', 'Tractors', 'Harvesters', 'Plows', 'Trucks'];
  const locations = ['All', 'Iowa', 'Nebraska', 'Kansas', 'North Dakota', 'Illinois', 'Missouri'];
  const priceRanges = ['All', 'Under ₹200', '₹200-₹400', '₹400-₹600', 'Over ₹600'];

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesLocation = selectedLocation === 'All' || item.location === selectedLocation;
    
    let matchesPrice = true;
    if (priceRange !== 'All') {
      switch (priceRange) {
        case 'Under ₹200':
          matchesPrice = item.price < 200;
          break;
        case '₹200-₹400':
          matchesPrice = item.price >= 200 && item.price <= 400;
          break;
        case '₹400-₹600':
          matchesPrice = item.price >= 400 && item.price <= 600;
          break;
        case 'Over ₹600':
          matchesPrice = item.price > 600;
          break;
      }
    }
    
    return matchesSearch && matchesCategory && matchesLocation && matchesPrice;
  });

  const handleBookEquipment = (equipment: any) => {
    if (!currentUser) {
      toast.error('Please login to book equipment');
      setCurrentView('login');
      return;
    }
    
    if (currentUser.role === 'Admin') {
      toast.info('Admins cannot book equipment directly');
      return;
    }
    
    toast.success(`Booking request sent for ${equipment.name}`);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Tractors': return Tractor;
      case 'Harvesters': return Sprout;
      case 'Plows': return Wrench;
      case 'Trucks': return Truck;
      default: return Tractor;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'available':
        return 'rental-available text-white';
      case 'booked':
        return 'rental-booked text-white';
      case 'cancelled':
        return 'rental-cancelled text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'booked':
        return 'Booked';
      case 'cancelled':
        return 'Recently Cancelled';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-grass-primary to-grass-secondary py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Browse Farm Equipment
          </h1>
          <p className="text-white/90 text-lg">
            Find the perfect equipment for your farming needs
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search equipment..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  {priceRanges.map(range => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredEquipment.length} of {equipment.length} equipment
          </p>
        </div>

        {/* Equipment Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEquipment.map((item) => {
            const CategoryIcon = getCategoryIcon(item.category);
            
            return (
              <Card key={item.id} className={`equipment-card ${item.status === 'cancelled' ? 'grass-faded' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <CategoryIcon className="w-4 h-4 text-primary" />
                      </div>
                      <Badge className={getStatusClass(item.status)}>
                        {getStatusText(item.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{item.rating}</span>
                      <span className="text-sm text-muted-foreground">({item.reviews})</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Equipment Image Placeholder */}
                  <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                    <CategoryIcon className="w-16 h-16 text-muted-foreground" />
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>{item.owner}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{item.availability}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center space-x-1">
                    
                      <span className="text-lg font-bold text-primary">
                        ₹{item.price}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        / {item.priceUnit}
                      </span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex items-center space-x-1"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Details</span>
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleBookEquipment(item)}
                        disabled={item.status === 'booked'}
                        className="bg-primary hover:bg-primary-hover"
                      >
                        {item.status === 'booked' ? 'Booked' : 'Book Now'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredEquipment.length === 0 && (
          <div className="text-center py-12">
            <Tractor className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No equipment found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search filters to find more equipment
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setSelectedLocation('All');
                setPriceRange('All');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};