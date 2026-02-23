/**
 * Login page
 * Supports:
 * - Google OAuth
 * - Email magic link
 * Redirects back to ?redirect=... after login
 */
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  normalizeSupportedLang,
  getLocalizedPath,
} from "@/utils/getLocalizedPath";

export default function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { lang: langParam } = useParams<{ lang: string }>();
  const lang = normalizeSupportedLang(langParam);

  const redirect =
    searchParams.get("redirect") || getLocalizedPath("home", lang);

  // Handle OAuth return
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
        redirectTo: window.location.origin + redirect,
      },
    });
  };

  const signInWithEmail = async () => {
    if (!email) return;
    setLoading(true);

    await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + redirect,
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
          className="w-full"
          onClick={signInWithGoogle}
          disabled={loading}
        >
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
