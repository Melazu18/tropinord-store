/**
 * SiteHeader
 * Fixed top-level navigation across all pages.
 * Localized routes: /:lang/...
 *
 * ✅ Update requested:
 * - All navigations in a dropdown (Catalog/About/Story/Orders/Converter + Account)
 * - Logo stays centered
 * - Theme toggle + Cart stay visible (not inside dropdown)
 * - Keeps initial functionality (same routes/components)
 */
import { Link, NavLink, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, Wallet, ChevronDown } from "lucide-react";

import { CartButton } from "@/components/CartButton";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { AccountMenu } from "@/components/AccountMenu";

import {
  normalizeSupportedLang,
  getLocalizedPath,
} from "@/utils/getLocalizedPath";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function MenuLinkItem({
  to,
  label,
  onSelect,
}: {
  to: string;
  label: string;
  onSelect?: () => void;
}) {
  return (
    <DropdownMenuItem asChild onSelect={onSelect}>
      <NavLink
        to={to}
        className={({ isActive }) =>
          [
            "w-full cursor-pointer",
            isActive ? "font-semibold text-foreground" : "text-foreground",
          ].join(" ")
        }
        end
      >
        {label}
      </NavLink>
    </DropdownMenuItem>
  );
}

export function SiteHeader() {
  const { t, i18n } = useTranslation();
  const params = useParams();

  const lang = normalizeSupportedLang(params.lang || i18n.language);
  const path = (key: string) => getLocalizedPath(key, lang);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="container h-20 flex items-center relative px-3 md:px-4">
        {/* LEFT: Dropdown navigation */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="gap-2"
                aria-label="Open navigation menu"
              >
                <Menu className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {t("nav.menu", { defaultValue: "Menu" })}
                </span>
                <ChevronDown className="h-4 w-4 opacity-60" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-56">
              {/* Main nav */}
              <MenuLinkItem
                to={path("explore")}
                label={t("nav.catalog", { defaultValue: "Catalog" })}
              />
              <MenuLinkItem
                to={path("about")}
                label={t("nav.about", { defaultValue: "About" })}
              />
              <MenuLinkItem
                to={path("story")}
                label={t("nav.story", { defaultValue: "Our Story" })}
              />
              <MenuLinkItem
                to={path("orders")}
                label={t("nav.orders", { defaultValue: "Orders" })}
              />

              <DropdownMenuSeparator />

              {/* Tools */}
              <DropdownMenuItem asChild>
                <Link
                  to={path("converter")}
                  className="flex items-center gap-2"
                >
                  <Wallet className="h-4 w-4" />
                  {t("nav.converter", { defaultValue: "Currency converter" })}
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Keep AccountMenu functionality, but expose it here too.
                  We keep the original AccountMenu component (it can still be used outside),
                  but user asked: "all navigations are in a dropdown" — account fits here. */}
              <div className="px-2 py-2">
                <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                  {t("nav.account", { defaultValue: "Account" })}
                </div>
                <AccountMenu />
              </div>

              <DropdownMenuSeparator />

              {/* Language stays in menu so header stays clean */}
              <div className="px-2 py-2">
                <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                  {t("nav.language", { defaultValue: "Language" })}
                </div>
                <LanguageSwitcher />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* CENTER: Logo always centered */}
        <Link
          to={path("home")}
          className="absolute left-1/2 -translate-x-1/2 flex items-center group"
          aria-label="Home"
        >
          <img
            src="/tropiLogo004.png"
            alt="TropiNord"
            className="
      h-14 md:h-16 w-auto object-contain
      drop-shadow-[0_4px_12px_rgba(0,0,0,0.15)]
      group-hover:scale-105
      transition-all duration-300 ease-out
    "
            loading="eager"
          />
        </Link>

        {/* RIGHT: Keep only Theme + Cart visible */}
        <div className="ml-auto flex items-center gap-2 md:gap-3">
          <ThemeToggle />
          <CartButton />
        </div>
      </div>
    </header>
  );
}
