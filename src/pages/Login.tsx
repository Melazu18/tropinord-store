/**
 * Login page
 * Supports:
 * - Google OAuth
 * - Email magic link
 * Redirects back to ?redirect=... after login
 *
 * ✅ FIX (prod-safe):
 * Redirect OAuth + magic link to /:lang/auth/callback?redirect=...
 * AuthCallback finalizes session and forwards to the intended page.
 */
import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  normalizeSupportedLang,
  getLocalizedPath,
} from "@/utils/getLocalizedPath";

/** --- Minimal inline brand SVG for Google button --- */
function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" {...props}>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.8 6.2 29.7 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.1-.1-2.3-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 15.2 19 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.8 6.2 29.7 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 10.1-2 13.7-5.2l-6.3-5.2C29.5 35.1 26.9 36 24 36c-5.3 0-9.8-3.4-11.4-8.1l-6.6 5.1C9.2 39.7 16 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.6l.0.0 6.3 5.2C39 37.4 44 33 44 24c0-1.1-.1-2.3-.4-3.5z"
      />
    </svg>
  );
}

/** Ensure redirect is always a safe in-app path (prevents open-redirect issues). */
function safeRedirectPath(input: string | null, fallback: string) {
  if (!input) return fallback;
  if (input.startsWith("/") && !input.startsWith("//")) return input;
  return fallback;
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { lang: langParam } = useParams<{ lang: string }>();
  const lang = normalizeSupportedLang(langParam);

  const fallbackAfterLogin = getLocalizedPath("home", lang);

  const redirect = useMemo(() => {
    const fromQuery = searchParams.get("redirect");
    return safeRedirectPath(fromQuery, fallbackAfterLogin);
  }, [searchParams, fallbackAfterLogin]);

  // ✅ Supabase should return here after OAuth / magic link:
  const callbackPath = useMemo(() => `/${lang}/auth/callback`, [lang]);

  const authReturnUrl = useMemo(() => {
    return (
      window.location.origin +
      `${callbackPath}?redirect=${encodeURIComponent(redirect)}`
    );
  }, [callbackPath, redirect]);

  // If user is already signed in and lands on login, forward them.
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate(redirect, { replace: true });
      }
    };
    void checkSession();
  }, [navigate, redirect]);

  const signInWithGoogle = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: authReturnUrl,
      },
    });
  };

  const signInWithEmail = async () => {
    if (!email) return;
    setLoading(true);

    await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: authReturnUrl,
      },
    });

    alert("Check your email for the login link.");
    setLoading(false);
  };

  return (
    <div className="container max-w-md py-16">
      <h1 className="text-2xl font-semibold mb-2">Login</h1>
      <p className="text-muted-foreground mb-8">
        Authenticate securely to complete your order.
      </p>

      <div className="space-y-4">
        <Button
          className="w-full gap-2"
          onClick={signInWithGoogle}
          disabled={loading}
        >
          <GoogleIcon className="h-5 w-5" />
          Continue with Google
        </Button>

        <div className="text-center text-sm text-muted-foreground">or</div>

        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button
          variant="outline"
          className="w-full"
          onClick={signInWithEmail}
          disabled={loading}
        >
          Send Magic Link
        </Button>
      </div>
    </div>
  );
}
