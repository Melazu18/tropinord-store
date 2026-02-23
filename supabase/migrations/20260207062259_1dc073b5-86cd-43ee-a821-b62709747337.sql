-- Force policy refresh by dropping and recreating
DROP POLICY IF EXISTS "Users and guests can create orders" ON public.orders;

-- Create simple permissive policy with explicit permissions
CREATE POLICY "Allow order creation"
ON public.orders
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Allow authenticated order creation"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (true);