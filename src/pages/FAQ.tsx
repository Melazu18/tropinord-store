import { Header } from "@/components/Header";
import { PageShell } from "@/components/PageShell";

export default function FAQ() {
  return (
    <>
      <Header title="FAQ" subtitle="Answers to common questions." showLogo={false} />
      <main>
        <PageShell className="space-y-10">
          <section className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-2xl font-semibold tracking-wide">Frequently asked questions</h2>

            <div className="rounded-2xl border bg-card/70 backdrop-blur p-6 space-y-4">
              <div>
                <p className="font-medium tracking-wide">Where do you ship from</p>
                <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                  We ship from Sweden. Product availability and delivery times can vary by region.
                </p>
              </div>

              <div>
                <p className="font-medium tracking-wide">Are your products authentic</p>
                <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                  We prioritize traceability and sourcing clarity. Oils and superfoods are sourced from small producers
                  in tropical Africa. Teas are currently supplied through European partners who source from Africa.
                </p>
              </div>

              <div>
                <p className="font-medium tracking-wide">How can I contact you</p>
                <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                  Email admin@tropinord.com or reach us via WhatsApp from the footer icon.
                </p>
              </div>
            </div>
          </section>
        </PageShell>
      </main>
    </>
  );
}
