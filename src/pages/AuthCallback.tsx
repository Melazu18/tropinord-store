import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  getLocalizedPath,
  normalizeSupportedLang,
} from "@/utils/getLocalizedPath";

function safeRedirectPath(input: string | null, fallback: string) {
  if (!input) return fallback;
  // Only allow internal absolute paths like "/en/checkout"
  if (input.startsWith("/") && !input.startsWith("//")) return input;
  return fallback;
}

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { lang: langParam } = useParams<{ lang: string }>();
  const lang = normalizeSupportedLang(langParam);

  const fallback = useMemo(() => getLocalizedPath("home", lang), [lang]);

  const redirect = useMemo(() => {
    const r = searchParams.get("redirect");
    return safeRedirectPath(r, fallback);
  }, [searchParams, fallback]);

  const [status, setStatus] = useState<"working" | "done" | "error">("working");

  useEffect(() => {
    let unsub: (() => void) | undefined;

    const run = async () => {
      try {
        /**
         * Important:
         * Supabase OAuth callback may arrive with a code in the URL.
         * In supabase-js v2, just calling getSession() is often enough,
         * but we also listen for auth changes to avoid timing issues.
         */

        // 1) Try immediately
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          setStatus("done");
          navigate(redirect, { replace: true });
          return;
        }

        // 2) Wait for auth state change (handles delayed session initialization)
        const { data: listener } = supabase.auth.onAuthStateChange(
          (_event, session) => {
            if (session) {
              setStatus("done");
              navigate(redirect, { replace: true });
            }
          },
        );

        unsub = () => listener.subscription.unsubscribe();

        // 3) As a final fallback, re-check after a short tick
        setTimeout(async () => {
          const { data: again } = await supabase.auth.getSession();
          if (again.session) {
            setStatus("done");
            navigate(redirect, { replace: true });
          } else {
            setStatus("error");
          }
        }, 800);
      } catch {
        setStatus("error");
      }
    };

    void run();
    return () => {
      if (unsub) unsub();
    };
  }, [navigate, redirect]);

  return (
    <div className="container max-w-md py-16">
      <h1 className="text-2xl font-semibold mb-2">Signing you in…</h1>
      <p className="text-muted-foreground">
        {status === "working" &&
          "Please wait while we complete authentication."}
        {status === "error" &&
          "We couldn’t complete sign-in. Please go back and try again."}
      </p>
    </div>
  );
}
