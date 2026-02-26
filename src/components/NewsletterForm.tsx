/**
 * NewsletterForm
 * Simple email subscription form.
 *
 * Backend: Supabase table `newsletter_subscribers`.
 * - See the Supabase migration in /supabase/migrations for table + RLS.
 */
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";

export function NewsletterForm() {
  const { toast } = useToast();
  const { t } = useTranslation(["newsletter"]);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;

    try {
      setIsSubmitting(true);

      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert([{ email: trimmed }]);

      if (error) throw error;

      setEmail("");
      toast({
        title: t("newsletter:subscribedTitle", { defaultValue: "Subscribed" }),
        description: t("newsletter:subscribedDescription", {
          defaultValue: "Thanks! You have been added to the newsletter.",
        }),
      });
    } catch {
      toast({
        title: t("newsletter:errorTitle", {
          defaultValue: "Could not subscribe",
        }),
        description: t("newsletter:errorDescription", {
          defaultValue:
            "Please try again later, or contact support@tropinord.com.",
        }),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-2">
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t("newsletter:emailPlaceholder", {
          defaultValue: "Email address",
        })}
        required
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? t("newsletter:signingUp", { defaultValue: "Signing up…" })
          : t("newsletter:subscribe", { defaultValue: "Subscribe" })}
      </Button>
    </form>
  );
}
