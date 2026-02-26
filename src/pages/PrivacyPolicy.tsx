import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { PageShell } from "@/components/PageShell";

export default function PrivacyPolicy() {
  const { t } = useTranslation(["privacy"]);

  return (
    <>
      <Header
        title={t("privacy:header.title", { defaultValue: "Privacy Policy" })}
        subtitle={t("privacy:header.subtitle", {
          defaultValue: "How we handle your data.",
        })}
        showLogo={false}
      />

      <main>
        <PageShell className="space-y-10">
          <section className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-2xl font-semibold tracking-wide">
              {t("privacy:title", { defaultValue: "Privacy policy" })}
            </h2>

            <div className="rounded-2xl border bg-card/70 backdrop-blur p-6 space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                {t("privacy:body.p1", {
                  defaultValue:
                    "We collect only the information needed to provide our services, such as order fulfillment and customer support. We do not sell personal information.",
                })}
              </p>

              <p>
                {t("privacy:body.p2", {
                  defaultValue:
                    "Newsletter signups are used to send product updates and brand news. You can unsubscribe at any time.",
                })}
              </p>

              <p>
                {t("privacy:body.p3", {
                  defaultValue:
                    "For questions about privacy, contact admin@tropinord.com.",
                })}
              </p>
            </div>
          </section>
        </PageShell>
      </main>
    </>
  );
}
