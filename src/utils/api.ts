/**
 * Central API config.
 * Uses Vite env var if available; otherwise falls back to empty string.
 *
 * Set in .env:
 *   VITE_API_BASE=https://your-api-domain.com
 */
export const API_BASE: string = (import.meta.env.VITE_API_BASE as string) ?? "";
