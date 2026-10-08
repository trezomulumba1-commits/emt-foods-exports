-- Enable Row Level Security on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.export_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.export_status_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_requests ENABLE ROW LEVEL SECURITY;

-- Products Policies
-- Anyone can view products
CREATE POLICY "Products are viewable by everyone" ON public.products
  FOR SELECT USING (true);
-- Only admins can modify products
CREATE POLICY "Only admins can modify products" ON public.products
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('super_admin', 'content_admin', 'operations_admin')
    )
  );

-- Quote Requests Policies
-- Anyone can insert a quote request
CREATE POLICY "Anyone can insert quote requests" ON public.quote_requests
  FOR INSERT WITH CHECK (true);
-- Only admins can view/edit quote requests
CREATE POLICY "Only admins can view quote requests" ON public.quote_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('super_admin', 'support_admin', 'operations_admin')
    )
  );

-- Profiles Policies
-- Users can read their own profile
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
-- Users can update their own profile
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'super_admin'
    )
  );

-- Purchase Requests Policies
-- Authenticated users can insert their own purchase requests
CREATE POLICY "Users can insert their own purchase requests" ON public.purchase_requests
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- Users can read their own purchase requests
CREATE POLICY "Users can view their own purchase requests" ON public.purchase_requests
  FOR SELECT USING (customer_email = auth.jwt() ->> 'email');
-- Admins can view and update all purchase requests
CREATE POLICY "Admins can manage all purchase requests" ON public.purchase_requests
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('super_admin', 'operations_admin', 'finance_admin')
    )
  );

-- Export Orders Policies
-- Admins can manage all export orders
CREATE POLICY "Admins can manage export orders" ON public.export_orders
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('super_admin', 'operations_admin')
    )
  );
-- Users can view their own export orders (if tracking by email or some relation)
CREATE POLICY "Users can view their own export orders" ON public.export_orders
  FOR SELECT USING (customer_email = auth.jwt() ->> 'email');

-- Export Status Updates Policies
-- Admins can manage status updates
CREATE POLICY "Admins can manage export status updates" ON public.export_status_updates
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('super_admin', 'operations_admin')
    )
  );
-- Users can view updates for their own orders
CREATE POLICY "Users can view updates for their orders" ON public.export_status_updates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.export_orders 
      WHERE export_orders.id = export_status_updates.export_order_id
      AND export_orders.customer_email = auth.jwt() ->> 'email'
    )
  );
