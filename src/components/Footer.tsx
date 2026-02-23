/**
 * Footer
 * Minimal footer that avoids duplicating Header navigation.
 * Links: FAQ, Privacy Policy, WhatsApp, Facebook, YouTube, TikTok, Instagram
 * Localized routes: /:lang/...
 *
 * Updated:
 * - Better hierarchy + alignment
 * - Improved newsletter copy (uses support@ instead of admin@)
 * - Social icons wrapped with subtle buttons + accessible labels + title tooltips
 * - Adds a small “trust line” row (non-functional, purely UI)
 * - Improved mobile stacking (newsletter first on small screens)
 */
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NewsletterForm } from "@/components/NewsletterForm";
import {
  normalizeSupportedLang,
  getLocalizedPath,
} from "@/utils/getLocalizedPath";
import {
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

type RouteParams = { lang?: string };

function TikTokIcon(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={props.className ?? "h-5 w-5"}
      fill="currentColor"
    >
      <path d="M21 8.2c-1.8 0-3.4-.6-4.7-1.7v8.3c0 3.2-2.6 5.8-5.8 5.8S4.7 18 4.7 14.8c0-3.2 2.6-5.8 5.8-5.8.3 0 .7 0 1 .1v3.1c-.3-.1-.7-.2-1-.2-1.5 0-2.8 1.3-2.8 2.8 0 1.5 1.3 2.8 2.8 2.8 1.6 0 2.9-1.3 2.9-3V2h3c.3 2 1.9 3.6 3.9 3.9v2.3z" />
    </svg>
  );
}

function SocialIconLink(props: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={props.href}
      target="_blank"
      rel="noreferrer"
      aria-label={props.label}
      title={props.label}
      className={[
        "inline-flex h-10 w-10 items-center justify-center rounded-full",
        "border border-border/60 bg-background/30 backdrop-blur",
        "text-muted-foreground hover:text-foreground hover:bg-accent/40",
        "transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      ].join(" ")}
    >
      {props.children}
    </a>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  const { t, i18n } = useTranslation();
  const params = useParams<RouteParams>();
  const lang = normalizeSupportedLang(params.lang || i18n.language);

  const path = (key: string) => getLocalizedPath(key, lang);

  return (
    <footer className="border-t bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="container py-12">
        {/* Top grid */}
        <div className="grid gap-10 md:grid-cols-3 md:items-start">
          {/* Newsletter (mobile-first) */}
          <div className="order-1 md:order-2 space-y-3 max-w-md">
            <p className="text-sm font-semibold tracking-wide">
              {t("footer.newsletterTitle", { defaultValue: "Newsletter" })}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("footer.newsletterBody", {
                defaultValue:
                  "Subscribe for product drops and sourcing updates. Need help? Email support@tropinord.com.",
              })}
            </p>

            <NewsletterForm />

            {/* Trust line (pure UI) */}
            <div className="pt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4" />
              <span>
                {t("footer.trustLine", {
                  defaultValue: "Secure checkout • Stripe • Swish (manual)",
                })}
              </span>
            </div>
          </div>

          {/* Brand */}
          <div className="order-2 md:order-1 space-y-4">
            <Link
              to={path("home")}
              className="inline-flex items-center gap-3"
              aria-label="Home"
            >
              <img
                src="/tropiLogo004.png"
                alt="TropiNord"
                className="h-11 w-auto"
                loading="lazy"
              />
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              {t("footer.brandLine", {
                defaultValue:
                  "A botanical house shaped in Sweden, rooted in tropical authenticity.",
              })}
            </p>
          </div>

          {/* Links + Social */}
          <div className="order-3 space-y-5 md:justify-self-end">
            <div className="flex items-center gap-3 md:justify-end flex-wrap">
              <SocialIconLink
                href="https://wa.me/+46700711713"
                label="WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </SocialIconLink>

              <SocialIconLink href="https://www.facebook.com/" label="Facebook">
                <Facebook className="h-5 w-5" />
              </SocialIconLink>

              <SocialIconLink href="https://www.youtube.com/" label="YouTube">
                <Youtube className="h-5 w-5" />
              </SocialIconLink>

              <SocialIconLink href="https://www.tiktok.com/" label="TikTok">
                <TikTokIcon className="h-5 w-5" />
              </SocialIconLink>

              <SocialIconLink
                href="https://www.instagram.com/"
                label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </SocialIconLink>
            </div>

            <div className="flex flex-col gap-2 text-sm md:items-end">
              <Link
                className="text-muted-foreground hover:text-foreground transition"
                to={path("faq")}
              >
                {t("footer.faq", { defaultValue: "FAQ" })}
              </Link>

              <Link
                className="text-muted-foreground hover:text-foreground transition"
                to={path("privacy")}
              >
                {t("footer.privacy", { defaultValue: "Privacy Policy" })}
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-muted-foreground">
          <div>© {year} TropiNord. All rights reserved.</div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">•</span>
            <span>
              {t("footer.madeIn", {
                defaultValue: "Designed in Sweden • Rooted in the Tropics",
              })}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
