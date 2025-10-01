-- Create equipment table
CREATE TABLE public.equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  daily_rate DECIMAL(10,2) NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'available', 'rented', 'maintenance')),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;

-- Policies for equipment
CREATE POLICY "Anyone can view approved equipment"
ON public.equipment
FOR SELECT
USING (status = 'approved' OR status = 'available' OR status = 'rented' OR auth.uid() = owner_id);

CREATE POLICY "Owners can insert their own equipment"
ON public.equipment
FOR INSERT
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their own equipment"
ON public.equipment
FOR UPDATE
USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their own equipment"
ON public.equipment
FOR DELETE
USING (auth.uid() = owner_id);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('new_equipment', 'rental_request', 'approval', 'general')),
  related_id UUID,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policies for notifications
CREATE POLICY "Users can view their own notifications"
ON public.notifications
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
ON public.notifications
FOR UPDATE
USING (auth.uid() = user_id);

-- Trigger for updated_at on equipment
CREATE TRIGGER update_equipment_updated_at
BEFORE UPDATE ON public.equipment
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Function to notify admins when new equipment is added
CREATE OR REPLACE FUNCTION public.notify_admins_new_equipment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert notification for all admins
  INSERT INTO public.notifications (user_id, title, message, type, related_id)
  SELECT 
    ur.user_id,
    'New Equipment Added',
    'New equipment "' || NEW.name || '" has been submitted for approval.',
    'new_equipment',
    NEW.id
  FROM public.user_roles ur
  WHERE ur.role = 'admin';
  
  RETURN NEW;
END;
$$;

-- Trigger to notify admins when equipment is added
CREATE TRIGGER trigger_notify_admins_new_equipment
AFTER INSERT ON public.equipment
FOR EACH ROW
EXECUTE FUNCTION public.notify_admins_new_equipment();