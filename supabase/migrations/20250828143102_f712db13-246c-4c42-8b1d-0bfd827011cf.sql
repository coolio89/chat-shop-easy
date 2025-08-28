-- Enable full CRUD operations for products, categories, product_images, and product_details
-- Note: This is for a content management system without user authentication
-- In production, you would want to restrict these to admin users only

-- Products table policies
CREATE POLICY "Enable all operations on products for everyone"
ON public.products
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Categories table policies  
CREATE POLICY "Enable all operations on categories for everyone"
ON public.categories
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Product images table policies
CREATE POLICY "Enable all operations on product_images for everyone"
ON public.product_images
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Product details table policies
CREATE POLICY "Enable all operations on product_details for everyone"
ON public.product_details
FOR ALL
TO public
USING (true)
WITH CHECK (true);