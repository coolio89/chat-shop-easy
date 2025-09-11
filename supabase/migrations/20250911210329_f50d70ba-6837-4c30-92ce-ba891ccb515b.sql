-- Fix RLS policies to ensure proper CRUD operations

-- Update products RLS policies to allow admin users to manage all products
DROP POLICY IF EXISTS "Shop owners can insert products" ON products;
DROP POLICY IF EXISTS "Shop owners can update their products" ON products;
DROP POLICY IF EXISTS "Shop owners can delete their products" ON products;

-- Create new policies for products that allow admin users to manage all products
CREATE POLICY "Authenticated users can insert products" ON products
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update products" ON products
FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete products" ON products
FOR DELETE 
USING (auth.role() = 'authenticated');

-- Update categories RLS policy to also allow reading for null user_id (global categories)
DROP POLICY IF EXISTS "Categories are publicly readable" ON categories;

CREATE POLICY "Categories are publicly readable" ON categories
FOR SELECT 
USING (true);

-- Allow authenticated users to manage all categories (for admin functionality)
CREATE POLICY "Authenticated users can manage all categories" ON categories
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');