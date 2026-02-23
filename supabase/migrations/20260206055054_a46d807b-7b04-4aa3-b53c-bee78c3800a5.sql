-- Drop the restrictive policy
DROP POLICY IF EXISTS "Users and guests can create orders" ON public.orders;

-- Create a permissive INSERT policy that allows anyone with valid order data
CREATE POLICY "Users and guests can create orders"
ON public.orders
FOR INSERT
TO anon, authenticated
WITH CHECK (
  email IS NOT NULL AND 
  full_name IS NOT NULL AND 
  address IS NOT NULL AND 
  items IS NOT NULL AND
  order_number IS NOT NULL
);