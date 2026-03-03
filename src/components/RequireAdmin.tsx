import { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { normalizeSupportedLang } from "@/utils/getLocalizedPath";
import { supportedLanguages, type SupportedLanguage } from "@/i18n/resources";

type Props = {
  children: React.ReactNode;
};

function isSupportedLang(l?: string): l is SupportedLanguage {
  if (!l) return false;
  const set = new Set(supportedLanguages.map((x) => x.code));
  return set.has(l as SupportedLanguage);
}

function getLangFromPathname(pathname: string) {
  // pathname examples:
  //  "/en/..." -> "en"
  //  "/sv/..." -> "sv"
  //  "/admin/orders" -> no lang in url
  const seg = pathname.split("/").filter(Boolean)[0];
  if (isSupportedLang(seg)) return seg;
  // fallback (your normalizeSupportedLang will choose a safe default)
  return normalizeSupportedLang(seg);
}

export default function RequireAdmin({ children }: Props) {
  const location = useLocation();

  const lang = useMemo(
    () => getLangFromPathname(location.pathname),
    [location.pathname],
  );

  const [ready, setReady] = useState(false);
  const [hasUser, setHasUser] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;

    const check = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (!mounted) return;

      if (!user) {
        setHasUser(false);
        setIsAdmin(false);
        setReady(true);
        return;
      }

      setHasUser(true);

      const { data: roleRow, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!mounted) return;

      // If RLS blocks this table for the client, roleRow will be null.
      // That is correct behavior: treat as not admin.
      setIsAdmin(!error && !!roleRow);
      setReady(true);
    };

    void check();

    // React to login/logout instantly
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      setReady(false);
      void check();
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (!ready) return null;

  // 1) Not logged in -> go to localized login
  if (!hasUser) {
    return (
      <Navigate to={`/${lang}/login`} replace state={{ from: location }} />
    );
  }

  // 2) Logged in but not admin -> send them to localized home
  if (!isAdmin) {
    return (
      <Navigate
        to={`/${lang}`}
        replace
        state={{ deniedFrom: location.pathname }}
      />
    );
  }

  return <>{children}</>;
}
