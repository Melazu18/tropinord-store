-- Security hardening for orders + checkout helpers
--
-- Goal:
-- - Keep RLS enabled on public.orders
-- - Prevent anonymous/authenticated direct INSERT/SELECT on orders (use Edge Functions / service role instead)
-- - Restrict SECURITY DEFINER helper functions to service_role
--
-- NOTE: This migration uses defensive checks to avoid failing if objects differ.

-- Ensure RLS is enabled on orders (if table exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'orders'
  ) THEN
    EXECUTE 'ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY';
  END IF;
END $$;

-- Revoke direct table privileges from anon/authenticated (if table exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'orders'
  ) THEN
    EXECUTE 'REVOKE INSERT ON TABLE public.orders FROM anon';
    EXECUTE 'REVOKE INSERT ON TABLE public.orders FROM authenticated';
    EXECUTE 'REVOKE SELECT ON TABLE public.orders FROM anon';
    EXECUTE 'REVOKE SELECT ON TABLE public.orders FROM authenticated';
    -- If you later need authenticated reads, create a tight RLS SELECT policy
    -- that scopes by user_id = auth.uid() and avoid exposing guest PII.
  END IF;
END $$;

-- Drop existing INSERT policies on orders that allowed guests/users to insert freely
DO $$
DECLARE
  pol record;
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relname = 'orders'
  ) THEN
    FOR pol IN
      SELECT policyname
      FROM pg_policies
      WHERE schemaname = 'public' AND tablename = 'orders'
    LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.orders', pol.policyname);
    END LOOP;
  END IF;
END $$;

-- IMPORTANT:
-- We intentionally do not recreate public INSERT/SELECT policies here.
-- Orders should be created/updated by Edge Functions using the service role key.

-- Restrict create_guest_order execution to service_role
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'create_guest_order'
  ) THEN
    -- Revoke from anon/authenticated (signature must match)
    EXECUTE 'REVOKE EXECUTE ON FUNCTION public.create_guest_order(text, text, text, jsonb, jsonb, jsonb, payment_method, payment_provider, text, uuid) FROM anon';
    EXECUTE 'REVOKE EXECUTE ON FUNCTION public.create_guest_order(text, text, text, jsonb, jsonb, jsonb, payment_method, payment_provider, text, uuid) FROM authenticated';
    EXECUTE 'GRANT EXECUTE ON FUNCTION public.create_guest_order(text, text, text, jsonb, jsonb, jsonb, payment_method, payment_provider, text, uuid) TO service_role';
  END IF;
END $$;

-- Restrict generate_order_number execution to service_role (optional but safer if order numbers are guessable)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'generate_order_number'
  ) THEN
    EXECUTE 'REVOKE EXECUTE ON FUNCTION public.generate_order_number() FROM anon';
    EXECUTE 'REVOKE EXECUTE ON FUNCTION public.generate_order_number() FROM authenticated';
    EXECUTE 'GRANT EXECUTE ON FUNCTION public.generate_order_number() TO service_role';
  END IF;
END $$;

-- Ensure decrement_inventory remains service_role only
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'decrement_inventory'
  ) THEN
    EXECUTE 'REVOKE EXECUTE ON FUNCTION public.decrement_inventory(uuid, integer) FROM anon';
    EXECUTE 'REVOKE EXECUTE ON FUNCTION public.decrement_inventory(uuid, integer) FROM authenticated';
    EXECUTE 'GRANT EXECUTE ON FUNCTION public.decrement_inventory(uuid, integer) TO service_role';
  END IF;
END $$;
