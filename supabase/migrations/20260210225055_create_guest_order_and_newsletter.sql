-- Guest checkout order creator
--
-- Creates a SECURITY DEFINER function to insert into `public.orders`.
-- This allows guest checkouts while keeping RLS enabled.

CREATE OR REPLACE FUNCTION public.create_guest_order(
  p_full_name text,
  p_email text,
  p_phone text,
  p_address jsonb,
  p_items jsonb,
  p_totals jsonb,
  p_payment_method payment_method,
  p_payment_provider payment_provider,
  p_order_number text,
  p_user_id uuid DEFAULT NULL
)
RETURNS TABLE(id uuid, order_number text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
  v_order_number text;
BEGIN
  INSERT INTO public.orders (
    full_name,
    email,
    phone,
    address,
    items,
    totals,
    payment_method,
    payment_provider,
    order_number,
    user_id
  ) VALUES (
    p_full_name,
    p_email,
    NULLIF(p_phone, ''),
    p_address,
    p_items,
    p_totals,
    p_payment_method,
    p_payment_provider,
    p_order_number,
    p_user_id
  )
  RETURNING orders.id, orders.order_number INTO v_id, v_order_number;

  RETURN QUERY SELECT v_id, v_order_number;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_guest_order TO anon;
GRANT EXECUTE ON FUNCTION public.create_guest_order TO authenticated;


-- Newsletter subscribers
--
-- Stores emails for newsletter opt-ins.
-- Use your email tooling (or Supabase Edge Function) to notify admin@tropinord.com.

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (subscribe) but not read other subscribers.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'newsletter_subscribers'
      AND policyname = 'newsletter_subscribers_insert_anon'
  ) THEN
    CREATE POLICY newsletter_subscribers_insert_anon
      ON public.newsletter_subscribers
      FOR INSERT
      TO anon, authenticated
      WITH CHECK (true);
  END IF;
END $$;
