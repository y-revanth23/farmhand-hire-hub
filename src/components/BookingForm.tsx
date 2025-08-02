import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  CreditCard, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  Tractor,
  Clock,
  IndianRupee,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

interface BookingFormProps {
  equipment: any;
  currentUser: any;
  onBack: () => void;
  onBookingComplete: () => void;
}

export const BookingForm = ({ equipment, currentUser, onBack, onBookingComplete }: BookingFormProps) => {
  const [formData, setFormData] = useState({
    fullName: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '',
    address: '',
    farmSize: '',
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    duration: '',
    purpose: '',
    specialRequirements: ''
  });

  const [paymentOption, setPaymentOption] = useState('advance');
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate pricing
  const dailyRate = equipment.price;
  const durationDays = parseInt(formData.duration) || 1;
  const totalAmount = dailyRate * durationDays;
  const advanceAmount = Math.round(totalAmount * 0.3); // 30% advance
  const paymentAmount = paymentOption === 'advance' ? advanceAmount : totalAmount;

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!formData.startDate || !formData.endDate || !formData.duration) {
      toast.error('Please select booking dates and duration');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const bookingData = {
        equipment: equipment,
        customer: formData,
        paymentOption: paymentOption,
        amount: paymentAmount,
        totalAmount: totalAmount,
        bookingId: `BK${Date.now()}`,
        status: 'confirmed',
        bookingDate: new Date().toISOString()
      };

      // Success notification
      toast.success(`Booking confirmed! Booking ID: ${bookingData.bookingId}`);
      
      // Simulate sending notifications to owner and admin
      setTimeout(() => {
        toast.info(`Notification sent to ${equipment.owner}`);
      }, 1000);

      setTimeout(() => {
        toast.info('Admin has been notified of the new booking');
      }, 1500);

      setIsProcessing(false);
      onBookingComplete();
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-grass-primary to-grass-secondary py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-4 mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Browse
            </Button>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Book Equipment
          </h1>
          <p className="text-white/90 text-lg">
            Complete your booking for {equipment.name}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Equipment Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Tractor className="w-5 h-5 text-primary" />
                  <span>Equipment Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                    <Tractor className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{equipment.name}</h3>
                    <p className="text-sm text-muted-foreground">{equipment.owner}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{equipment.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <IndianRupee className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">₹{equipment.price}/day</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-primary" />
                  <span>Customer Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+91 9876543210"
                    />
                  </div>
                  <div>
                    <Label htmlFor="farmSize">Farm Size (Acres)</Label>
                    <Input
                      id="farmSize"
                      value={formData.farmSize}
                      onChange={(e) => handleInputChange('farmSize', e.target.value)}
                      placeholder="e.g., 50 acres"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter your complete address"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Booking Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>Booking Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label>Start Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.startDate ? format(formData.startDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.startDate}
                          onSelect={(date) => handleInputChange('startDate', date)}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label>End Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.endDate ? format(formData.endDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.endDate}
                          onSelect={(date) => handleInputChange('endDate', date)}
                          disabled={(date) => date < (formData.startDate || new Date())}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration (Days) *</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      placeholder="Number of days"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="purpose">Purpose of Use</Label>
                  <Input
                    id="purpose"
                    value={formData.purpose}
                    onChange={(e) => handleInputChange('purpose', e.target.value)}
                    placeholder="e.g., Plowing, Harvesting, Transportation"
                  />
                </div>
                <div>
                  <Label htmlFor="specialRequirements">Special Requirements</Label>
                  <Textarea
                    id="specialRequirements"
                    value={formData.specialRequirements}
                    onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                    placeholder="Any special requirements or notes"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <span>Payment Options</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentOption} onValueChange={setPaymentOption}>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="advance" id="advance" />
                    <Label htmlFor="advance" className="flex-1 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Advance Payment (30%)</p>
                          <p className="text-sm text-muted-foreground">Pay ₹{advanceAmount} now, remaining on delivery</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">₹{advanceAmount}</p>
                          <p className="text-xs text-muted-foreground">Recommended</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="full" id="full" />
                    <Label htmlFor="full" className="flex-1 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Full Payment</p>
                          <p className="text-sm text-muted-foreground">Pay complete amount now</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">₹{totalAmount}</p>
                          <p className="text-xs text-green-600">5% Discount Applied</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Daily Rate</span>
                    <span className="text-sm">₹{dailyRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Duration</span>
                    <span className="text-sm">{durationDays} day{durationDays > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Subtotal</span>
                    <span className="text-sm">₹{totalAmount}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Amount to Pay</span>
                    <span className="text-primary">₹{paymentAmount}</span>
                  </div>
                  {paymentOption === 'advance' && (
                    <div className="text-xs text-muted-foreground">
                      Remaining ₹{totalAmount - advanceAmount} due on delivery
                    </div>
                  )}
                  {paymentOption === 'full' && (
                    <div className="text-xs text-green-600">
                      5% discount applied (₹{Math.round(totalAmount * 0.05)} saved)
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Free cancellation up to 24 hours</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Insurance coverage included</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>24/7 technical support</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                    <span>Security deposit may apply</span>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  size="lg" 
                  onClick={handleSubmit}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pay ₹{paymentAmount} & Book
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By booking, you agree to our terms and conditions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};