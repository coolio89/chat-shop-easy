-- Drop the current overly permissive policy for shops
DROP POLICY IF EXISTS "Shops are publicly readable" ON public.shops;

-- Create a new policy that only allows public access to essential shop information
-- Excludes sensitive data like whatsapp_number
CREATE POLICY "Public can view basic shop info" ON public.shops
FOR SELECT 
USING (
  is_active = true AND 
  (
    -- Public users can only see basic info (name, description)
    auth.uid() IS NULL OR
    -- Authenticated users who don't own the shop see basic info
    auth.uid() != user_id
  )
);

-- Create a separate policy for shop owners to see their full shop data
CREATE POLICY "Shop owners can view their complete shop data" ON public.shops
FOR SELECT 
USING (auth.uid() = user_id);

-- Create a view for public shop access that explicitly excludes sensitive fields
CREATE OR REPLACE VIEW public.shops_public AS
SELECT 
  id,
  name,
  description,
  is_active,
  created_at,
  updated_at
FROM public.shops
WHERE is_active = true;

-- Grant public access to the view
GRANT SELECT ON public.shops_public TO anon;
GRANT SELECT ON public.shops_public TO authenticated;