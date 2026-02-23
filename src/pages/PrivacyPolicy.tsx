import { Header } from "@/components/Header";
import { PageShell } from "@/components/PageShell";

export default function PrivacyPolicy() {
  return (
    <>
      <Header title="Privacy Policy" subtitle="How we handle your data." showLogo={false} />
      <main>
        <PageShell className="space-y-10">
          <section className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-2xl font-semibold tracking-wide">Privacy policy</h2>

            <div className="rounded-2xl border bg-card/70 backdrop-blur p-6 space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                We collect only the information needed to provide our services, such as order fulfillment and customer
                support. We do not sell personal information.
              </p>
              <p>
                Newsletter signups are used to send product updates and brand news. You can unsubscribe at any time.
              </p>
              <p>
                For questions about privacy, contact admin@tropinord.com.
              </p>
            </div>
          </section>
        </PageShell>
      </main>
    </>
  );
}
