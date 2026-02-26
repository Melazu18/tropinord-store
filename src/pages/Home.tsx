// src/pages/Home.tsx
import { useMemo, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import {
  getLocalizedPath,
  normalizeSupportedLang,
} from "@/utils/getLocalizedPath";
import { API_BASE } from "@/utils/api";
import { ProductSearch } from "@/components/ProductSearch";

type RouteParams = {
  lang?: string;
};

export default function Home() {
  const { t, i18n } = useTranslation(["home", "common", "footer"]);
  const params = useParams<RouteParams>();

  const lang = useMemo(
    () => normalizeSupportedLang(params.lang || i18n.language || "en"),
    [i18n.language, params.lang],
  );

  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const path = (key: string) => getLocalizedPath(key, lang);

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    if (!API_BASE) return;

    try {
      const res = await fetch(`${API_BASE}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) setSubscribed(true);
    } catch (err) {
      console.error("Subscription failed:", err);
    }
  };

  useEffect(() => {
    const elements = document.querySelectorAll(".fade-in");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-6");
          }
        });
      },
      { threshold: 0.15 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="space-y-16 md:space-y-20">
      <style>{`
        .fade-in { transition: all 700ms ease; }
        .tn-nature-sep {
          background: linear-gradient(90deg, rgba(16,122,57,0.15), rgba(212,175,55,0.25), rgba(16,122,57,0.15));
        }
      `}</style>

      {/* HERO */}
      <section
        className="relative min-h-[85vh] md:min-h-[95vh] bg-no-repeat bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: "url('/images/homepage.png')" }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Subtle gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

        <div className="relative z-10 pt-24 pb-12 px-4 flex flex-col items-center text-center">
          {/* TAGLINE */}
          <span
            className="
              text-sm sm:text-base
              font-semibold
              text-[#f2c94c]
              tracking-wide
              drop-shadow-md
              animate-[fadeIn_1.2s_ease-out]
            "
          >
            {t("home:hero.tagline", {
              defaultValue: "Tropical Origins. Global Harmony.",
            })}
          </span>

          {/* FLOATING GLASS SEARCH */}
          <div
            className="
              mt-6 w-full max-w-2xl
              transition-all duration-500 ease-out
              hover:scale-[1.02]
              animate-[float_6s_ease-in-out_infinite]
            "
          >
            <div
              className="
                backdrop-blur-xl
                bg-white/15
                border border-white/25
                rounded-2xl
                p-3
                shadow-[0_20px_60px_rgba(0,0,0,0.35)]
                focus-within:ring-2
                focus-within:ring-[#f2c94c]
                focus-within:shadow-[0_0_40px_rgba(242,201,76,0.4)]
                transition-all
                duration-300
              "
            >
              <ProductSearch value={searchQuery} onChange={setSearchQuery} />
            </div>

            {searchQuery.trim().length > 0 && (
              <div className="mt-3 text-xs text-white/90">
                <Link
                  to={`${path("explore")}?q=${encodeURIComponent(searchQuery.trim())}`}
                  className="underline underline-offset-4 hover:text-white"
                >
                  {t("home:hero.explore", { defaultValue: "Explore" })} “
                  {searchQuery.trim()}”
                </Link>
              </div>
            )}
          </div>

          {/* HERO COPY */}
          <div className="mt-14 max-w-3xl text-white fade-in opacity-0 translate-y-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t("home:hero.headline", {
                defaultValue: "Teas, Oils & Superfoods from the Tropics",
              })}
            </h1>

            <p className="text-lg mb-6 text-white/90">
              {t("home:hero.subheadline", {
                defaultValue:
                  "Digitally traceable. Sustainably sourced. Premium tropical nourishment.",
              })}
            </p>

            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link
                to={path("explore")}
                className="px-6 py-3 bg-green-600 rounded-lg hover:bg-green-700 transition"
              >
                {t("home:hero.explore", { defaultValue: "Explore" })}
              </Link>

              <Link
                to={path("story")}
                className="px-6 py-3 bg-white/10 border border-white/30 rounded-lg hover:bg-white/15 transition"
              >
                {t("home:hero.ourStory", { defaultValue: "Our Story" })}
              </Link>
            </div>
          </div>
        </div>

        {/* ANIMATIONS */}
        <style>{`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-6px); }
            100% { transform: translateY(0px); }
          }

          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </section>

      <div className="tn-nature-sep h-8 mx-8 rounded-full" />

      {/* ================= TEA SECTION ================= */}
      <section className="px-4 md:px-8 fade-in opacity-0 translate-y-6">
        <div className="max-w-6xl mx-auto space-y-10">
          <Link
            to={`${path("explore")}?category=TEA`}
            aria-label={t("home:tea.ariaBrowse", {
              defaultValue: "Browse Teas",
            })}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              <img
                src="/images/teaCatalog.png"
                alt={t("home:tea.heroAlt", {
                  defaultValue: "TropiNord Tea Collection",
                })}
                className="w-full h-[400px] object-cover hover:scale-[1.02] transition duration-500"
              />
              <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/70 text-emerald-800 dark:text-emerald-200 text-xs font-semibold px-4 py-2 rounded-full shadow">
                {t("home:tea.badge", { defaultValue: "Traditionally Crafted" })}
              </div>
            </div>
          </Link>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <img
              src="/images/softHorizon.png"
              alt={t("home:tea.guideAlt", { defaultValue: "Tea guide" })}
              className="rounded-xl shadow-md"
            />
            <div>
              <h3 className="text-2xl font-bold mb-3">
                {t("home:tea.title", {
                  defaultValue: "Steep calm, sip clarity",
                })}
              </h3>
              <p className="text-muted-foreground mb-4">
                {t("home:tea.body", {
                  defaultValue:
                    "Whole-leaf character. Honest aroma. A ritual remembered.",
                })}
              </p>
              <Link
                to={`${path("explore")}?category=TEA`}
                className="inline-block px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
              >
                {t("home:tea.cta", { defaultValue: "Browse Teas" })}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="tn-nature-sep h-8 mx-8 rounded-full" />

      {/* ================= OIL SECTION ================= */}
      <section className="px-4 md:px-8 fade-in opacity-0 translate-y-6">
        <div className="max-w-6xl mx-auto space-y-10">
          <Link
            to={`${path("explore")}?category=OIL`}
            aria-label={t("home:oil.ariaBrowse", {
              defaultValue: "Browse Oils",
            })}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              <img
                src="/images/oilHero.png"
                alt={t("home:oil.heroAlt", {
                  defaultValue: "TropiNord Oil Collection",
                })}
                className="w-full h-[400px] object-cover hover:scale-[1.02] transition duration-500"
              />
              <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/70 text-amber-900 dark:text-amber-200 text-xs font-semibold px-4 py-2 rounded-full shadow">
                {t("home:oil.badge", { defaultValue: "Small Batch Sourced" })}
              </div>
            </div>
          </Link>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <img
              src="/images/teethColdPre.png"
              alt={t("home:oil.alt1", { defaultValue: "Cold pressed oils" })}
              className="rounded-xl shadow-md"
            />
            <img
              src="/images/PKOhair.png"
              alt={t("home:oil.alt2", {
                defaultValue: "Palm kernel oil hair care",
              })}
              className="rounded-xl shadow-md"
            />
          </div>

          <div className="max-w-4xl mx-auto text-center mt-10 space-y-4">
            <h3 className="text-2xl font-semibold text-emerald-800 dark:text-emerald-300">
              {t("home:oil.title", {
                defaultValue: "Authentic oils, sourced in small batches",
              })}
            </h3>
            <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
              {t("home:oil.p1", {
                defaultValue:
                  "TropiNord oils are sourced in small batches from local farmers across tropical regions of Africa. These are not mass-produced commodity oils. They are traditionally crafted oils pressed, prepared, and handled with care so they retain their natural character and authenticity.",
              })}
            </p>
            <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
              {t("home:oil.p2", {
                defaultValue:
                  "We prioritize direct relationships and traceability. Each batch reflects its origin: the soil, climate, and hands behind it. What you receive is 100% authentic, locally made oil, prepared the way it has been for generations.",
              })}
            </p>
          </div>
        </div>
      </section>

      <div className="tn-nature-sep h-8 mx-8 rounded-full" />

      {/* ================= SUPERFOODS ================= */}
      <section className="px-4 md:px-8 fade-in opacity-0 translate-y-6">
        <div className="max-w-6xl mx-auto space-y-10">
          <Link
            to={`${path("explore")}?category=SUPERFOOD`}
            aria-label={t("home:superfoods.ariaBrowse", {
              defaultValue: "Browse Superfoods",
            })}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              <img
                src="/images/moringaPowder01.jpg"
                alt={t("home:superfoods.heroAlt", {
                  defaultValue: "Superfoods",
                })}
                className="w-full h-[350px] object-cover hover:scale-[1.02] transition duration-500"
              />
              <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/70 text-purple-900 dark:text-purple-200 text-xs font-semibold px-4 py-2 rounded-full shadow">
                {t("home:superfoods.badge", {
                  defaultValue: "Harvested Traditionally",
                })}
              </div>
            </div>
          </Link>

          <div className="max-w-4xl mx-auto text-center space-y-4">
            <h3 className="text-2xl font-semibold text-emerald-800 dark:text-emerald-300">
              {t("home:superfoods.title", {
                defaultValue:
                  "Superfoods with real origin, not industrial powders",
              })}
            </h3>
            <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
              {t("home:superfoods.p1", {
                defaultValue:
                  "Our superfoods are sourced from their native environments across Africa, where they have been used for generations. From moringa leaves to baobab fruit and thick forest honey, we focus on small-quantity harvesting to preserve quality and integrity.",
              })}
            </p>
            <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
              {t("home:superfoods.p2", {
                defaultValue:
                  "These are minimally processed ingredients, naturally dried, carefully handled, and prepared to retain their authentic nutritional profile. We choose traditional methods over mass production, because authenticity matters.",
              })}
            </p>
          </div>
        </div>
      </section>

      <div className="tn-nature-sep h-8 mx-8 rounded-full" />

      {/* NEWSLETTER */}
      <section className="max-w-xl mx-auto px-4 text-center fade-in opacity-0 translate-y-6">
        <h3 className="text-2xl font-semibold mb-3">
          {t("home:newsletter.title", { defaultValue: "Stay in the loop" })}
        </h3>

        {subscribed ? (
          <p className="text-green-600 font-medium">
            {t("home:newsletter.success", {
              defaultValue: "Thanks! You're on the list.",
            })}
          </p>
        ) : (
          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row gap-2"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("home:newsletter.placeholder", {
                defaultValue: "Enter your email",
              })}
              className="flex-grow p-2 border rounded"
              required
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {t("home:newsletter.cta", { defaultValue: "Subscribe" })}
            </button>
          </form>
        )}
      </section>

      {/* HELP */}
      <section className="bg-green-50 dark:bg-gray-800 text-center py-8 px-4 mt-8 rounded-lg">
        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-200">
          <Trans
            i18nKey="footer:helpBody"
            components={{
              whatsapp: (
                <a
                  href="https://wa.me/+46700711713"
                  className="underline font-semibold mx-1"
                  target="_blank"
                  rel="noreferrer"
                />
              ),
              email: (
                <a
                  href="mailto:support@tropinord.com"
                  className="underline font-semibold mx-1"
                />
              ),
            }}
            defaults="Reach us on <whatsapp>WhatsApp</whatsapp> or email <email>support@tropinord.com</email>."
          />
        </p>
      </section>
    </div>
  );
}
