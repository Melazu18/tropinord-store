# Supabase backend (Edge Functions + Migrations)

This folder is intended to live at `./supabase` in your project.

## Edge Functions
- `create-checkout` (protected): creates Stripe Checkout sessions using DB-truth pricing.
- `stripe-webhook`: verifies Stripe signatures, decrements inventory, marks orders paid.
- `send-notifications` (protected): internal dispatcher (logs + optional WhatsApp).
- `refresh-whatsapp-token` (protected): validates WhatsApp token.

### Required secrets
Set these in Supabase project secrets:
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `INTERNAL_FUNCTION_SECRET` (recommended; used to protect non-webhook functions)

Optional (WhatsApp):
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_ADMIN_PHONE`

## Deploy
- `supabase functions deploy create-checkout`
- `supabase functions deploy stripe-webhook`
- `supabase functions deploy send-notifications`
- `supabase functions deploy refresh-whatsapp-token`

## Migrations
Existing migrations are included plus a final hardening migration:
- `20260212000000_security_hardening_orders.sql`

That migration revokes anon/authenticated direct access to `orders` and restricts helper functions to `service_role`.
If your frontend currently inserts orders directly, update it to call Edge Functions instead.
