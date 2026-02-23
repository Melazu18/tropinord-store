/**
 * Header
 * Reusable page header with optional logo, title/subtitle, and optional right-side actions.
 *
 * NOTE:
 * - The SiteHeader already contains the main logo for the app.
 * - This Header is mainly for per-page titles.
 * - If you want the logo here, pass showLogo={true}.
 */
import { ReactNode } from "react";

type HeaderProps = {
  title: string;
  subtitle?: string;
  /** Optional element rendered on the right side (e.g., CTA button, status chip). */
  rightSlot?: ReactNode;
  /**
   * If true, renders the TropiNord logo next to the title.
   * Default is false to avoid duplicate logos and broken-image icons.
   */
  showLogo?: boolean;
};

export function Header({ title, subtitle, rightSlot, showLogo = false }: HeaderProps) {
  return (
    <header className="border-b bg-card">
      <div className="container py-6">
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            <div className="flex items-center gap-3 mb-2 min-w-0">
              {showLogo ? (
                <img
                  src="/tropiLogo004.png"
                  alt="TropiNord"
                  className="h-10 w-10 object-contain shrink-0"
                  loading="eager"
                />
              ) : null}

              <h1 className="text-3xl font-bold tracking-tight truncate">{title}</h1>
            </div>

            {subtitle ? <p className="text-muted-foreground">{subtitle}</p> : null}
          </div>

          {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
        </div>
      </div>
    </header>
  );
}
