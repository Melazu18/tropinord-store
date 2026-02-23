import { Header } from "@/components/Header";
import { PageShell } from "@/components/PageShell";

export default function About() {
  return (
    <>
      <Header
        title="About"
        subtitle="Quiet European refinement, rooted in tropical authenticity."
        showLogo={false}
      />

      <main>
        <PageShell className="space-y-14 md:space-y-16">
          {/* Hero / Intro card */}
          <section className="relative overflow-hidden rounded-3xl border bg-card">
            <div
              className="absolute inset-0 opacity-25"
              style={{
                backgroundImage: "url('/tropiLogo004.png')",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "80% 40%",
                backgroundSize: "520px auto",
                filter: "grayscale(100%)",
              }}
            />
            <div className="relative p-7 md:p-12 max-w-4xl">
              <p className="text-[11px] tracking-[0.32em] uppercase text-muted-foreground">
                Premium wellness  Ethical trade  Heritage botanicals
              </p>

              <h2 className="mt-4 text-3xl md:text-5xl font-semibold tracking-tight leading-[1.08]">
                TropiNord is a Nordic-led botanical house with tropical depth.
              </h2>

              <p className="mt-5 text-base md:text-lg leading-relaxed text-slate-700 dark:text-slate-200">
                Based in Sweden, TropiNord curates oils, teas, and superfoods with an
                emphasis on traceability, careful handling, and calm design. We combine
                Nordic precision with the cultural depth of tropical ingredients, selecting
                products that feel pure, intentional, and worthy of daily ritual.
              </p>

            </div>
          </section>

          {/* Brand story */}
          <section className="max-w-5xl mx-auto space-y-6">
            <h3 className="text-xl md:text-2xl font-semibold tracking-wide">
              Brand story
            </h3>

            <p className="text-base md:text-lg leading-relaxed text-slate-700 dark:text-slate-200">
              Our story begins with a belief that wellness should connect people to nature,
              heritage, and the wisdom that sustains both. Born in Sweden, TropiNord blends
              Nordic precision with tropical innovation to create natural products that nurture,
              restore, and protect.
            </p>

            <p className="text-base md:text-lg leading-relaxed text-slate-700 dark:text-slate-200">
              We are building a premium niche brand with controlled growth, prioritizing
              craftsmanship and sourcing clarity. Every product is selected for purity,
              performance, and origin that can be explained without marketing noise.
            </p>
          </section>

          {/* Transparency */}
          <section className="max-w-5xl mx-auto rounded-3xl border bg-card/60 backdrop-blur p-7 md:p-10">
            <h3 className="text-xl md:text-2xl font-semibold tracking-wide">
              Sourcing transparency
            </h3>

            <p className="mt-3 text-base md:text-lg leading-relaxed text-slate-700 dark:text-slate-200">
              Oils and superfoods are sourced from small producers in tropical regions of Africa.
              Teas are currently supplied through European partners who source from Africa, selected
              for reliability and compliance while we build direct logistics. We will always state
              what we know, what we can verify, and how each category is sourced.
            </p>
          </section>

          {/* What we do */}
          <section className="max-w-5xl mx-auto space-y-7">
            <h3 className="text-xl md:text-2xl font-semibold tracking-wide">
              What we do
            </h3>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border bg-card/60 backdrop-blur p-7">
                <h4 className="text-base md:text-lg font-semibold tracking-wide">
                  Curated products of traceable origin
                </h4>
                <p className="mt-2 text-base leading-relaxed text-slate-700 dark:text-slate-200">
                  We curate oils, teas, and superfoods that can be explained through origin,
                  handling, and integrity.
                </p>
              </div>

              <div className="rounded-3xl border bg-card/60 backdrop-blur p-7">
                <h4 className="text-base md:text-lg font-semibold tracking-wide">
                  Ethical partnerships
                </h4>
                <p className="mt-2 text-base leading-relaxed text-slate-700 dark:text-slate-200">
                  We work with small producers and trusted partners with an emphasis on fair
                  value exchange and clarity.
                </p>
              </div>

              <div className="rounded-3xl border bg-card/60 backdrop-blur p-7">
                <h4 className="text-base md:text-lg font-semibold tracking-wide">
                  Quality control and calm design
                </h4>
                <p className="mt-2 text-base leading-relaxed text-slate-700 dark:text-slate-200">
                  Nordic design is restraint. We keep the brand quiet, structured, and premium,
                  so the product speaks.
                </p>
              </div>

              <div className="rounded-3xl border bg-card/60 backdrop-blur p-7">
                <h4 className="text-base md:text-lg font-semibold tracking-wide">
                  A platform built for trust
                </h4>
                <p className="mt-2 text-base leading-relaxed text-slate-700 dark:text-slate-200">
                  We build systems for transparency, product clarity, and a premium customer
                  experience.
                </p>
              </div>
            </div>
          </section>

          {/* Mission */}
          <section className="max-w-5xl mx-auto space-y-4">
            <h3 className="text-xl md:text-2xl font-semibold tracking-wide">
              Our mission
            </h3>

            <p className="text-base md:text-lg leading-relaxed text-slate-700 dark:text-slate-200">
              To refine natural wellness through integrity, responsible sourcing, and Nordic precision,
              creating products that feel as good ethically as they do physically.
            </p>

            <p className="text-base md:text-lg font-semibold tracking-wide">
              TropiNord. Where tradition meets technology for natural wellbeing.
            </p>
          </section>

          {/* Contact */}
          <section className="max-w-5xl mx-auto rounded-3xl border bg-card/60 backdrop-blur p-7 md:p-10">
            <h3 className="text-xl md:text-2xl font-semibold tracking-wide">
              Contact
            </h3>

            <p className="mt-3 text-base md:text-lg leading-relaxed text-slate-700 dark:text-slate-200">
              For partnerships, sourcing, or support, contact{" "}
              <a
                href="mailto:admin@tropinord.com"
                className="text-primary underline underline-offset-4 hover:opacity-80"
              >
                admin@tropinord.com
              </a>
              .
            </p>
          </section>
        </PageShell>
      </main>
    </>
  );
}
