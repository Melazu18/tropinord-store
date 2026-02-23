-- Core schema for TropiNord
--
-- This migration creates the missing tables/enums that your Edge Functions and UI expect:
-- - products
-- - orders
-- - payment_events
-- - user_roles
--
-- If you already created these elsewhere, do NOT apply this migration.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =========================
-- Enums
-- =========================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
    CREATE TYPE public.payment_status AS ENUM (
      'CREATED',
      'AWAITING_PAYMENT',
      'PAID',
      'FAILED',
      'CANCELLED',
      'REFUNDED'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_method') THEN
    CREATE TYPE public.payment_method AS ENUM (
      'CARD',
      'SWISH',
      'PAYPAL'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_provider') THEN
    CREATE TYPE public.payment_provider AS ENUM (
      'STRIPE',
      'SWISH',
      'PAYPAL'
    );
  END IF;
END $$;

-- =========================
-- Tables
-- =========================

-- Products
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'OTHER',
  price_cents integer NOT NULL CHECK (price_cents >= 0),
  currency text NOT NULL DEFAULT 'SEK',
  inventory integer NOT NULL DEFAULT 0 CHECK (inventory >= 0),
  images text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT','PUBLISHED','ARCHIVED')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Orders
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE,
  user_id uuid NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  address jsonb NOT NULL,
  items jsonb NOT NULL,
  totals jsonb NOT NULL,
  currency text NOT NULL DEFAULT 'SEK',
  payment_method public.payment_method NOT NULL DEFAULT 'CARD',
  payment_provider public.payment_provider NOT NULL DEFAULT 'STRIPE',
  payment_status public.payment_status NOT NULL DEFAULT 'CREATED',
  provider_session_id text,
  provider_metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  paid_at timestamptz
);

CREATE UNIQUE INDEX IF NOT EXISTS orders_provider_session_id_uniq
  ON public.orders(provider_session_id)
  WHERE provider_session_id IS NOT NULL;

-- Payment events (optional, but used by your webhook)
CREATE TABLE IF NOT EXISTS public.payment_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  provider text NOT NULL,
  event_type text NOT NULL,
  raw jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- User roles (used by AdminOrders page)
CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, role)
);

-- =========================
-- RLS
-- =========================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Helper: check admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- -------------------------
-- Products policies
-- -------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='products' AND policyname='products_select_published'
  ) THEN
    CREATE POLICY products_select_published
      ON public.products
      FOR SELECT
      TO anon, authenticated
      USING (status = 'PUBLISHED');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='products' AND policyname='products_admin_write'
  ) THEN
    CREATE POLICY products_admin_write
      ON public.products
      FOR ALL
      TO authenticated
      USING (public.is_admin())
      WITH CHECK (public.is_admin());
  END IF;
END $$;

-- -------------------------
-- Orders policies
-- -------------------------
-- Default is deny. We explicitly allow:
-- - authenticated users to SELECT their own orders
-- - admins to SELECT all orders
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='orders' AND policyname='orders_select_own'
  ) THEN
    CREATE POLICY orders_select_own
      ON public.orders
      FOR SELECT
      TO authenticated
      USING (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='orders' AND policyname='orders_admin_select_all'
  ) THEN
    CREATE POLICY orders_admin_select_all
      ON public.orders
      FOR SELECT
      TO authenticated
      USING (public.is_admin());
  END IF;
END $$;

-- NOTE: We intentionally do NOT create an INSERT policy for orders.
-- Orders should be created by Edge Functions using service role.

-- -------------------------
-- user_roles policies
-- -------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_roles' AND policyname='user_roles_admin_read'
  ) THEN
    CREATE POLICY user_roles_admin_read
      ON public.user_roles
      FOR SELECT
      TO authenticated
      USING (public.is_admin());
  END IF;
END $$;

-- payment_events: admin read only
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='payment_events' AND policyname='payment_events_admin_read'
  ) THEN
    CREATE POLICY payment_events_admin_read
      ON public.payment_events
      FOR SELECT
      TO authenticated
      USING (public.is_admin());
  END IF;
END $$;

-- Make sure anon cannot read sensitive tables even if someone later grants privileges
REVOKE ALL ON public.orders FROM anon;
REVOKE ALL ON public.payment_events FROM anon;
REVOKE ALL ON public.user_roles FROM anon;

-- Authenticated also should not have blanket privileges; access is via RLS policies
REVOKE ALL ON public.payment_events FROM authenticated;

