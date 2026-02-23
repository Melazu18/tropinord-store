-- Drop and recreate the insert policy with simpler check
DROP POLICY IF EXISTS "Users and guests can create orders" ON public.orders;

CREATE POLICY "Users and guests can create orders"
ON public.orders
FOR INSERT
TO anon, authenticated
WITH CHECK (true);