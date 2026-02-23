import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { PageShell } from "@/components/PageShell";
import { normalizeSupportedLang } from "@/utils/getLocalizedPath";

type RouteParams = { lang?: string };

function SourcingMap() {
  return (
    <section className="rounded-3xl border bg-card/60 backdrop-blur p-6 md:p-10">
      <div className="space-y-3">
        <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground">
          Sourcing transparency
        </p>

        <h3 className="text-xl md:text-2xl font-semibold tracking-wide">
          Sourcing map
        </h3>

        <p className="text-base md:text-lg leading-relaxed text-slate-700 dark:text-slate-200 max-w-3xl">
          A simplified view of origin and partnerships. Oils and superfoods are
          sourced through small producers in tropical Africa. Teas are currently
          supplied through European partners who source from Africa, selected
          for consistency and compliance while we build direct logistics.
        </p>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border bg-background">
        <svg viewBox="0 0 900 320" className="w-full h-auto">
          <rect x="0" y="0" width="900" height="320" fill="transparent" />

          <path
            d="M70,220 C210,90 310,110 430,130 C560,155 640,150 790,90"
            fill="none"
            stroke="currentColor"
            opacity="0.22"
            strokeWidth="2"
          />
          <path
            d="M430,130 C470,150 520,195 575,230 C630,265 710,260 820,250"
            fill="none"
            stroke="currentColor"
            opacity="0.16"
            strokeWidth="2"
          />

          <circle cx="140" cy="120" r="7" fill="currentColor" opacity="0.85" />
          <text
            x="160"
            y="125"
            fontSize="14"
            fill="currentColor"
            opacity="0.85"
          >
            Sweden
          </text>

          <circle cx="300" cy="140" r="7" fill="currentColor" opacity="0.6" />
          <text
            x="320"
            y="145"
            fontSize="14"
            fill="currentColor"
            opacity="0.75"
          >
            European partners
          </text>

          <circle cx="520" cy="210" r="7" fill="currentColor" opacity="0.85" />
          <text
            x="540"
            y="215"
            fontSize="14"
            fill="currentColor"
            opacity="0.85"
          >
            West Africa
          </text>

          <circle cx="565" cy="230" r="7" fill="currentColor" opacity="0.85" />
          <text
            x="585"
            y="235"
            fontSize="14"
            fill="currentColor"
            opacity="0.85"
          >
            Nigeria
          </text>

          <circle cx="760" cy="240" r="7" fill="currentColor" opacity="0.7" />
          <text
            x="780"
            y="245"
            fontSize="14"
            fill="currentColor"
            opacity="0.78"
          >
            East Africa
          </text>
        </svg>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <div className="rounded-2xl border bg-background p-5">
          <p className="text-sm font-semibold tracking-wide">Oils</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
            Small-batch sourcing with local producers, crafted with traditional
            methods and careful handling.
          </p>
        </div>

        <div className="rounded-2xl border bg-background p-5">
          <p className="text-sm font-semibold tracking-wide">Superfoods</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
            Harvested in small quantities and minimally processed for integrity
            and authenticity.
          </p>
        </div>

        <div className="rounded-2xl border bg-background p-5">
          <p className="text-sm font-semibold tracking-wide">Teas</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
            Sourced via European partners who source from Africa, chosen for
            quality control while we scale logistics.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function OurStory() {
  const params = useParams<RouteParams>();
  const lang = useMemo(
    () => normalizeSupportedLang(params.lang || "en"),
    [params.lang],
  );

  return (
    <>
      <Header
        title="Our Story"
        subtitle="A botanical house with Nordic restraint and tropical depth."
        showLogo={false}
      />

      <main>
        <PageShell className="space-y-14 md:space-y-16">
          {/* Hero */}
          <section className="relative overflow-hidden rounded-3xl border bg-card min-h-[460px] md:min-h-[620px]">
            {/* Background image */}
            <div
              className="absolute inset-0 scale-[1.15] will-change-transform translate-z-0"
              style={{
                backgroundImage: "url('/images/AfricanTeaFarmers02.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "saturate(1.12) contrast(1.06) brightness(1.02)",
              }}
            />

            {/* ONE strong directional gradient for readability (left side) */}
            <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/45 to-transparent" />

            {/* Optional: subtle vignette only (keep it light) */}
            <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.12)]" />

            {/* Content positioning */}
            <div className="relative z-10 flex min-h-[460px] md:min-h-[620px] items-center">
              <div className="w-full p-6 md:p-12">
                {/* Readability panel (this is the big win) */}
                <div className="max-w-3xl rounded-2xl bg-background/55 dark:bg-background/45 backdrop-blur-md p-6 md:p-10 border border-white/10">
                  <p className="text-[11px] md:text-xs tracking-[0.32em] uppercase text-foreground/75">
                    Botanical maison Ethical trade Heritage craft
                  </p>

                  <h2 className="mt-4 text-3xl md:text-5xl font-semibold tracking-tight leading-[1.08] text-foreground">
                    A living bridge between continents, built with restraint and
                    responsibility.
                  </h2>

                  <p className="mt-5 text-base md:text-lg leading-relaxed text-foreground/80">
                    TropiNord exists to protect origin. We choose traceable
                    sourcing, careful handling, and calm design, so what reaches
                    your shelf still carries the place it came from.
                  </p>

                  <p className="mt-5 text-sm md:text-base text-foreground/75">
                    Founded by Paul Abejegah.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Editorial body */}
          <section className="max-w-5xl mx-auto space-y-10">
            <blockquote className="text-xl md:text-3xl font-semibold tracking-tight leading-snug text-center">
              Authenticity is preserved when origin is respected.
            </blockquote>

            <div className="grid md:grid-cols-12 gap-10 items-start">
              {/* Left column */}
              <div className="md:col-span-7 space-y-7">
                <h3 className="text-xl md:text-2xl font-semibold tracking-wide">
                  Why TropiNord exists
                </h3>

                <p className="text-base md:text-lg leading-relaxed text-slate-700 dark:text-slate-200">
                  Our story begins with a belief that wellness should connect
                  people to nature, heritage, and the wisdom that sustains both.
                  Born in Sweden, TropiNord blends Nordic precision with
                  tropical innovation to create natural products that nurture,
                  restore, and protect.
                </p>

                <p className="text-base md:text-lg leading-relaxed text-slate-700 dark:text-slate-200">
                  The project is shaped by lived experience across continents
                  and climates. It is built with quiet European refinement, and
                  a deep respect for tropical craft and community knowledge.
                </p>

                <div className="rounded-2xl border bg-card/60 backdrop-blur p-6">
                  <h4 className="text-lg md:text-xl font-semibold tracking-wide">
                    Sourcing transparency statement
                  </h4>
                  <p className="mt-3 text-base md:text-lg leading-relaxed text-slate-700 dark:text-slate-200">
                    Oils and superfoods are sourced from small-scale producers
                    in tropical regions of Africa, with a focus on careful
                    handling, traceability, and fair value exchange. Teas are
                    currently supplied through European partners who source from
                    Africa, selected for quality control and compliance while we
                    build direct logistics. Each product page reflects what we
                    can verify, and how it was sourced.
                  </p>
                </div>

                <h4 className="text-lg md:text-xl font-semibold tracking-wide pt-2">
                  Our oils
                </h4>
                <p className="text-base md:text-lg leading-relaxed text-slate-700 dark:text-slate-200">
                  Our oils are not mass-produced commodities. They are crafted
                  in small batches using traditional methods, often cold-pressed
                  or gently refined. This preserves the natural character,
                  aroma, texture, and performance that industrial processing
                  often strips away.
                </p>

                <h4 className="text-lg md:text-xl font-semibold tracking-wide pt-2">
                  Our superfoods
                </h4>
                <p className="text-base md:text-lg leading-relaxed text-slate-700 dark:text-slate-200">
                  Our superfoods are harvested in small quantities and minimally
                  processed to retain integrity. From moringa and baobab to
                  thick forest honey, we prioritize authenticity, careful
                  handling, and respect for the communities that produce them.
                </p>
              </div>

              {/* Right column */}
              <div className="md:col-span-5 space-y-6">
                <div className="rounded-3xl border bg-card/60 backdrop-blur p-6 md:p-7">
                  <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground">
                    Founder
                  </p>
                  <h5 className="mt-2 text-lg md:text-xl font-semibold tracking-wide">
                    Paul Abejegah
                  </h5>
                  <div className="mt-4 overflow-hidden rounded-2xl border bg-background">
                    <img
                      src="/images/paul01.png"
                      alt="Paul Abejegah"
                      className="h-[360px] w-full object-contain bg-muted"
                      loading="lazy"
                    />
                  </div>
                </div>

                <div className="rounded-3xl border bg-card/60 backdrop-blur p-6 md:p-7">
                  <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground">
                    Principles
                  </p>

                  <ul className="mt-4 space-y-3 text-base leading-relaxed text-slate-700 dark:text-slate-200">
                    <li>Traceable origin and honest sourcing</li>
                    <li>Small-batch handling, not industrial anonymity</li>
                    <li>Design restraint with premium intent</li>
                    <li>Respect for craft, people, and place</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Sourcing map */}
          <SourcingMap />

          {/* Closing */}
          <section className="max-w-4xl mx-auto text-center space-y-3">
            <p className="text-lg md:text-xl font-semibold tracking-wide text-emerald-800 dark:text-emerald-300">
              Authenticity is not a trend. It is our standard.
            </p>

            <p className="text-xs text-muted-foreground">
              Current language: <span className="font-mono">{lang}</span>
            </p>
          </section>
        </PageShell>
      </main>
    </>
  );
}
