/**
 * Route page: NotFound (404).
 */
import { useEffect, useMemo } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { getLocalizedPath, normalizeSupportedLang } from "@/utils/getLocalizedPath";

export default function NotFound() {
  const location = useLocation();
  const { lang: langParam } = useParams<{ lang?: string }>();
  const { t } = useTranslation();

  const lang = useMemo(() => normalizeSupportedLang(langParam), [langParam]);
  const catalogPath = useMemo(() => getLocalizedPath("explore", lang), [lang]);

  useEffect(() => {
    console.error("404: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

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
