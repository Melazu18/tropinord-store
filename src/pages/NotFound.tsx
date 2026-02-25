/**
 * Route page: NotFound (404).
 */
import { useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import {
  getLocalizedPath,
  normalizeSupportedLang,
} from "@/utils/getLocalizedPath";

export default function NotFound() {
  const location = useLocation();
  const navigate = useNavigate();
  const { lang: langParam } = useParams<{ lang?: string }>();
  const { t, i18n } = useTranslation();

  const lang = useMemo(
    () => normalizeSupportedLang(langParam || i18n.language),
    [langParam, i18n.language],
  );

  const catalogPath = useMemo(() => getLocalizedPath("explore", lang), [lang]);

  useEffect(() => {
    console.error(
      "404: User attempted to access non-existent route:",
      location.pathname,
    );

    // ✅ Safety: if Stripe (or old backend) sends user to non-localized success route,
    // recover automatically instead of showing 404.
    if (
      location.pathname === "/checkout/success" ||
      location.pathname.startsWith("/checkout/success/")
    ) {
      navigate(`/${lang}/checkout/success${location.search}`, {
        replace: true,
      });
    }
  }, [location.pathname, location.search, navigate, lang]);

  return (
    <>
      <Header
        title={t("notFound.title", { defaultValue: "Page not found" })}
        subtitle={t("notFound.subtitle", {
          defaultValue: "The page you are looking for does not exist.",
        })}
      />
      <main>
        <PageShell className="py-16">
          <div className="text-center space-y-6">
            <p className="text-muted-foreground">
              {t("notFound.routeLabel", { defaultValue: "Route" })}:{" "}
              <span className="font-mono">{location.pathname}</span>
            </p>

            <Button asChild>
              <Link to={catalogPath}>
                {t("notFound.cta", { defaultValue: "Go to catalog" })}
              </Link>
            </Button>
          </div>
        </PageShell>
      </main>
    </>
  );
}
