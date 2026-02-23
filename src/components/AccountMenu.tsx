import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { User, LogOut } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { normalizeSupportedLang } from "@/utils/getLocalizedPath";

export function AccountMenu() {
  const [email, setEmail] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams<{ lang?: string }>();
  const lang = normalizeSupportedLang(params.lang);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setEmail(data.session?.user?.email ?? null);
    };

    void load();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();

    // If they were on a protected page, send them somewhere safe (localized)
    if (
      location.pathname.includes("/checkout") ||
      location.pathname.includes("/orders")
    ) {
      navigate(`/${lang}`, { replace: true });
    }
  };

  // ✅ Logged out: show nothing in header (checkout page will prompt via RequireAuth)
  if (!email) return null;

  // ✅ Logged in: show compact dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <User className="h-4 w-4" />
          <span className="hidden md:inline max-w-[140px] truncate">
            {email}
          </span>
          <span className="md:hidden">Account</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-xs text-muted-foreground truncate">
          {email}
        </div>
        <DropdownMenuItem onClick={signOut} className="gap-2">
          <LogOut className="h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
