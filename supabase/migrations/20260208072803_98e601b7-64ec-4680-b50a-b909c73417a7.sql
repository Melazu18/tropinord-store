-- Re-enable RLS on orders with proper policies
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Allow order creation" ON public.orders;
DROP POLICY IF EXISTS "Allow authenticated order creation" ON public.orders;

-- Create a proper INSERT policy that allows guest checkout
-- The key insight: we need to allow INSERT without any restrictions on the data itself,
-- but we use the database-level not null constraints to ensure data integrity
CREATE POLICY "Allow order creation for guests and users"
ON public.orders
FOR INSERT
TO anon, authenticated
WITH CHECK (
  -- Must have required fields (enforced by not null constraints anyway)
  email IS NOT NULL AND 
  full_name IS NOT NULL
);