-- Add whatsapp_number field to profiles
ALTER TABLE public.profiles 
ADD COLUMN whatsapp_number TEXT;

-- Create shops table for personal stores
CREATE TABLE public.shops (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  whatsapp_number TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on shops
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;

-- Create policies for shops
CREATE POLICY "Shops are publicly readable" 
ON public.shops 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Users can create their own shop" 
ON public.shops 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shop" 
ON public.shops 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shop" 
ON public.shops 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add shop_id to products table
ALTER TABLE public.products 
ADD COLUMN shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE;

-- Add user_id to categories table to make them user-specific
ALTER TABLE public.categories 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update categories RLS policies to be user-specific
DROP POLICY IF EXISTS "Categories are publicly readable" ON public.categories;
DROP POLICY IF EXISTS "Authenticated users can insert categories" ON public.categories;
DROP POLICY IF EXISTS "Authenticated users can update categories" ON public.categories;
DROP POLICY IF EXISTS "Authenticated users can delete categories" ON public.categories;

CREATE POLICY "Categories are publicly readable" 
ON public.categories 
FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own categories" 
ON public.categories 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories" 
ON public.categories 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories" 
ON public.categories 
FOR DELETE 
USING (auth.uid() = user_id);

-- Update products RLS policies to include shop ownership
DROP POLICY IF EXISTS "Products are publicly readable" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can insert products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON public.products;

CREATE POLICY "Products are publicly readable" 
ON public.products 
FOR SELECT 
USING (true);

CREATE POLICY "Shop owners can insert products" 
ON public.products 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.shops 
    WHERE shops.id = shop_id AND shops.user_id = auth.uid()
  )
);

CREATE POLICY "Shop owners can update their products" 
ON public.products 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.shops 
    WHERE shops.id = shop_id AND shops.user_id = auth.uid()
  )
);

CREATE POLICY "Shop owners can delete their products" 
ON public.products 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.shops 
    WHERE shops.id = shop_id AND shops.user_id = auth.uid()
  )
);

-- Create trigger for shops updated_at
CREATE TRIGGER update_shops_updated_at
BEFORE UPDATE ON public.shops
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();