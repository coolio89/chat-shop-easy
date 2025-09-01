-- Fix critical security vulnerability: Remove overly permissive "ALL" policies
-- and implement proper authentication-based restrictions

-- Remove dangerous "ALL" policies from categories
DROP POLICY IF EXISTS "Enable all operations on categories for everyone" ON public.categories;

-- Remove dangerous "ALL" policies from products  
DROP POLICY IF EXISTS "Enable all operations on products for everyone" ON public.products;

-- Remove dangerous "ALL" policies from product_images
DROP POLICY IF EXISTS "Enable all operations on product_images for everyone" ON public.product_images;

-- Remove dangerous "ALL" policies from product_details
DROP POLICY IF EXISTS "Enable all operations on product_details for everyone" ON public.product_details;

-- Create secure write policies that require authentication
-- Categories: Only authenticated users can modify
CREATE POLICY "Authenticated users can insert categories" 
ON public.categories 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update categories" 
ON public.categories 
FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete categories" 
ON public.categories 
FOR DELETE 
TO authenticated 
USING (true);

-- Products: Only authenticated users can modify
CREATE POLICY "Authenticated users can insert products" 
ON public.products 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update products" 
ON public.products 
FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete products" 
ON public.products 
FOR DELETE 
TO authenticated 
USING (true);

-- Product Images: Only authenticated users can modify
CREATE POLICY "Authenticated users can insert product_images" 
ON public.product_images 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update product_images" 
ON public.product_images 
FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete product_images" 
ON public.product_images 
FOR DELETE 
TO authenticated 
USING (true);

-- Product Details: Only authenticated users can modify
CREATE POLICY "Authenticated users can insert product_details" 
ON public.product_details 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update product_details" 
ON public.product_details 
FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete product_details" 
ON public.product_details 
FOR DELETE 
TO authenticated 
USING (true);