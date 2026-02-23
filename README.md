# Joyful Shop

A production-ready React + TypeScript + Vite storefront starter with a simple product catalog, cart, checkout flow, and order history pages.

## Tech stack

- React 18 + TypeScript
- Vite 5
- Tailwind CSS + shadcn/ui components
- TanStack Query
- React Router

## Local development

### 1) Install dependencies

```bash
npm ci
```

### 2) Start the dev server

```bash
npm run dev
```

Vite will print the local URL in your terminal.

### 3) Build for production

```bash
npm run build
npm run preview
```

## Deploy to Vercel

This project is configured as a static SPA build (Vite output is `dist/`) with a rewrite so client-side routes work on refresh.

1. Push the repository to GitHub/GitLab/Bitbucket.
2. Import it in Vercel.
3. Use the defaults (Vercel will detect Vite). If you configure manually:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm ci`

## Project structure

- `src/pages/` - Route pages (catalog, product detail, checkout, orders, admin)
- `src/components/` - Reusable UI components
- `src/contexts/` - App context providers (cart)
- `src/hooks/` - Data fetching and helper hooks
- `src/integrations/` - External integrations (e.g., Supabase types)

## Notes

- Environment variables belong in `.env` (do not commit secrets).
- For a custom domain, configure it in your Vercel project settings.
