-- Remove the problematic security definer view
DROP VIEW IF EXISTS public.shops_public;

-- The RLS policies I created earlier are sufficient:
-- 1. "Public can view basic shop info" - limits public access
-- 2. "Shop owners can view their complete shop data" - allows owners full access

-- No additional views needed - the frontend will handle the restricted data properly