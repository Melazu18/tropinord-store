import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn, Mail } from "lucide-react";

type RequireAuthProps = {
  children: React.ReactNode;
  title?: string;
  description?: string;
};

export default function RequireAuth({
  children,
  title = "Login required",
  description = "To protect customers and prevent fraud, checkout requires authentication. After you sign in, you’ll return right back here.",
}: RequireAuthProps) {
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);

  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const redirectTo = useMemo(() => {
    // Supabase expects absolute URLs for redirect targets
    const origin = window.location.origin;
    return `${origin}${location.pathname}${location.search}`;
  }, [location.pathname, location.search]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setAuthed(!!data.session);
      setChecking(false);
    };

    void load();

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      setAuthed(!!session);
      setChecking(false);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // ✅ Clean up URL hash after Supabase redirects back (OAuth/magic link)
  useEffect(() => {
    if (!authed) return;

    if (window.location.hash) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    }
  }, [authed]);

  const signInGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
  };

  const sendMagicLink = async () => {
    const trimmed = email.trim();
    if (!trimmed) return;

    setSending(true);
    setSent(false);

    const { error } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: { emailRedirectTo: redirectTo },
    });

    setSending(false);
    if (!error) setSent(true);
  };

  if (checking) {
    return (
      <div className="container py-10">
        <div className="animate-pulse space-y-3">
          <div className="h-6 w-48 rounded bg-muted" />
          <div className="h-4 w-80 rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (authed) return <>{children}</>;

  return (
    <div className="container py-10">
      <div className="max-w-lg mx-auto rounded-xl border bg-background p-6 space-y-4">
        <h1 className="text-xl font-semibold">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>

        <div className="space-y-3">
          <Button onClick={signInGoogle} className="w-full gap-2">
            <LogIn className="h-4 w-4" />
            Continue with Google
          </Button>

          <div className="rounded-lg border p-3 space-y-2">
            <div className="text-sm font-medium">Email link</div>

            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <Button
                variant="outline"
                onClick={sendMagicLink}
                disabled={sending || !email.trim()}
                className="gap-2"
              >
                <Mail className="h-4 w-4" />
                {sending ? "Sending…" : "Send"}
              </Button>
            </div>

            {sent ? (
              <div className="text-xs text-muted-foreground">
                Magic link sent — check your inbox.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}